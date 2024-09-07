from datetime import datetime, timezone
import requests
from cachetools import TTLCache, cached
from nba_booksdata import (
    calculate_implied_probability,
    format_game_time_to_est,
    build_prizepicks_index,
    API_KEY,
)

SPORT = "soccer_epl"
REGIONS = "us"
ODDS_FORMAT = "american"

# create caches with a time-to-live (TTL) of 10 minutes (600 seconds)
prizepicks_cache = TTLCache(maxsize=100, ttl=600)
odds_cache = TTLCache(maxsize=100, ttl=600)
games_cache = TTLCache(maxsize=100, ttl=600)
best_props_cache = TTLCache(maxsize=100, ttl=600)


@cached(prizepicks_cache)
def getPrizePicksData():
    """
    Gets props data currently live on PrizePicks.

    Returns:
        dict: A dictionary mapping player ID to player data (name, lines, team, etc).
    """

    epl_teams = {
        "Arsenal FC",
        "Aston Villa FC",
        "AFC Bournemouth",
        "Brentford FC",
        "Brighton & Hove Albion FC",
        "Chelsea FC",
        "Crystal Palace FC",
        "Everton FC",
        "Fulham FC",
        "Ipswich Town FC",
        "Leicester City FC",
        "Liverpool FC",
        "Manchester City FC",
        "Manchester United FC",
        "Newcastle United FC",
        "Nottingham Forest FC",
        "Southampton FC",
        "Tottenham Hotspur FC",
        "West Ham United FC",
        "Wolverhampton Wanderers FC",
    }

    URL = "https://partner-api.prizepicks.com/projections?league_id=82"

    try:
        response = requests.get(URL)
        if response.status_code != 200:
            print(f"Failed to retrieve data: {response.status_code}, {response.text}")
            return {}

        try:
            prizepicks_data = response.json()
        except ValueError as e:
            print(f"Error parsing JSON response: {e}")
            return {}

        if not prizepicks_data.get("data"):
            print("No PrizePicks Data...")
            return {}

        lines = prizepicks_data["data"]
        players_lines = {}

        # Process lines and player data in one pass
        for line in lines:
            attributes = line["attributes"]
            odds_type = attributes.get("odds_type")
            if odds_type in ["demon", "goblin"]:
                continue

            player_data = line["relationships"]["new_player"]["data"]
            player_id = player_data["id"]
            player_info = next(
                (p for p in prizepicks_data["included"] if p["id"] == player_id), None
            )

            if not player_info:
                continue

            player_attributes = player_info["attributes"]
            team = player_attributes["market"]

            if team not in epl_teams:
                print(f"{team} not in teams dict")
                continue

            if player_id not in players_lines:
                players_lines[player_id] = player_attributes
                players_lines[player_id]["lines"] = {}

            stat_type = attributes["stat_type"]
            stat_line = attributes["line_score"]
            players_lines[player_id]["lines"][stat_type] = stat_line

        return players_lines

    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return {}


@cached(games_cache)
def getGames():
    """
    Fetches a list of event details for upcoming EPL games.

    Returns:
        list: A list containing the details of upcoming EPL games. Returns an empty list if no games are found or an error occurs.
    """

    events_url = f"https://api.the-odds-api.com/v4/sports/{SPORT}/events"
    params = {"apiKey": API_KEY}
    games = []
    current_time = datetime.now(timezone.utc)

    try:
        response = requests.get(events_url, params=params)
        response.raise_for_status()
        events_data = response.json()
        print(events_data)

        if events_data:
            print(f"Retrieved {len(events_data)} events for {SPORT}.")
            for event in events_data:
                commence_time = datetime.fromisoformat(
                    event["commence_time"].replace("Z", "+00:00")
                )
                if commence_time > current_time:
                    games.append(
                        {
                            "id": event["id"],
                            "commence_time": commence_time,
                            "home_team": event["home_team"],
                            "away_team": event["away_team"],
                        }
                    )
        else:
            print(f"No events found for {SPORT}.")

    except requests.RequestException as e:
        print(f"An error occurred while fetching events: {e}")

    return games


@cached(odds_cache)
def getPlayersPropsOddsForGame(event_id, prop_type):
    """
    Retrieves betting odds for specified player propositions from different bookmakers for a specific game.

    Parameters:
        event_id (str): The unique ID for the game.
        prop_type (str): The type of player prop to retrieve odds for (e.g., "player_shots").

    Returns:
        dict: A dictionary mapping player names to their odds information from different bookmakers for one game.
    """

    EVENT_ID = event_id
    MARKETS = prop_type

    request_url = (
        f"https://api.the-odds-api.com/v4/sports/{SPORT}/events/{EVENT_ID}/odds"
    )

    params = {
        "apiKey": API_KEY,
        "regions": REGIONS,
        "markets": MARKETS,
        "oddsFormat": ODDS_FORMAT,
    }

    response = requests.get(request_url, params=params)

    players_odds_all_books = {}

    if response.status_code == 200:
        odds_data = response.json()

        if not odds_data.get("bookmakers"):
            return {}

        home_team = odds_data.get("home_team")
        away_team = odds_data.get("away_team")

        for bookmaker in odds_data["bookmakers"]:
            bookmaker_name = bookmaker["key"]
            if bookmaker_name in ["betrivers", "unibet_us"]:
                continue

            for market in bookmaker["markets"]:
                if market["key"] == MARKETS:
                    for outcome in market["outcomes"]:
                        player_name = outcome["description"]
                        point = outcome["point"]
                        price = outcome["price"]

                        if player_name not in players_odds_all_books:
                            players_odds_all_books[player_name] = {
                                "home_team": home_team,
                                "away_team": away_team,
                            }

                        if bookmaker_name not in players_odds_all_books[player_name]:
                            players_odds_all_books[player_name][bookmaker_name] = []

                        players_odds_all_books[player_name][bookmaker_name].append(
                            {"points": point, "odds": price}
                        )
    else:
        print(f"Failed to retrieve data: {response.status_code}, {response.text}")

    return players_odds_all_books


def normalize_name(name):
    """
    Normalizes player names to ensure consistency across data sources.

    Parameters:
        name (str): The player name to normalize.

    Returns:
        str: The normalized player name.
    """

    name_replacements = {
        "CJ": "C.J.",
        "Herbert": "Herb",
        "Derrick Jones Jr": "Derrick Jones",
        "PJ Washington": "P.J. Washington",
        "Denis Bouanga": "Dénis Bouanga",
        "Martin Ojeda": "Martín Ojeda",
    }

    for key, value in name_replacements.items():
        name = name.replace(key, value)
    return name.replace(".", "")


def find_best_props(players_data, prop_type, prizepicks_index, game_info):
    """
    Determines the best betting props for players based on bookmaker and PrizePicks data.

    Parameters:
        players_data (dict): Player names with odds data from bookmakers.
        prop_type (str): Type of player prop (e.g., "player_shots").
        prizepicks_index (dict): Indexed PrizePicks data with normalized player names.
        game_info (dict): Information about the game including commence time.

    Returns:
        dict: Compiled best bets with details on odds, line, probability, etc.
    """

    all_props_dict = {}
    prop_type_mapping = {
        "player_shots": "Shots",
        "player_shots_on_target": "Shots On Target",
    }

    readable_prop_type = prop_type_mapping.get(prop_type, prop_type)

    for player, data in players_data.items():
        normalized_player = normalize_name(player)
        home_team = data.get("home_team", "N/A")
        away_team = data.get("away_team", "N/A")
        player_props = []

        if normalized_player in prizepicks_index:
            pp_player = prizepicks_index[normalized_player]
            if readable_prop_type in pp_player["lines"]:
                prizepicks_line = pp_player["lines"][readable_prop_type]
                img_url = pp_player.get(
                    "image_url",
                    "https://cdn-icons-png.flaticon.com/512/166/166344.png",
                )

                for book, odds_list in data.items():
                    if book in ["home_team", "away_team"]:
                        continue

                    for odds in odds_list:
                        # Handle whole numbers and non-whole numbers differently
                        if prizepicks_line == int(prizepicks_line):
                            # For whole numbers, include the exact line and 0.5 below
                            include_line = (
                                prizepicks_line - 0.5
                                <= odds["points"]
                                <= prizepicks_line
                            )
                        else:
                            # For non-whole numbers, include the exact line and 0.5 above
                            include_line = (
                                prizepicks_line
                                <= odds["points"]
                                <= prizepicks_line + 0.5
                            )

                        if include_line:
                            over_prob = calculate_implied_probability(odds["odds"])
                            under_prob = (
                                1 - over_prob if over_prob is not None else None
                            )
                            if over_prob is not None:
                                player_props.append(
                                    {
                                        "book": book,
                                        "line": odds["points"],
                                        "odds": odds["odds"],
                                        "over_probability": over_prob,
                                        "under_probability": under_prob,
                                        "difference_from_prizepicks": odds["points"]
                                        - prizepicks_line,
                                    }
                                )

                if player_props:
                    # Select the best bet (highest probability of either over or under)
                    best_bet = max(
                        player_props,
                        key=lambda x: max(
                            x["over_probability"], x["under_probability"]
                        ),
                    )

                    best_bet_over = (
                        best_bet["over_probability"] > best_bet["under_probability"]
                    )
                    best_bet_probability = max(
                        best_bet["over_probability"], best_bet["under_probability"]
                    )

                    composite_key = f"{player}_{readable_prop_type}"
                    all_props_dict[composite_key] = {
                        "player": normalize_name(player),
                        "prop_type": readable_prop_type,
                        "home_team": home_team,
                        "away_team": away_team,
                        "player_team": pp_player["team_name"],
                        "player_position": pp_player["position"],
                        "line": prizepicks_line,
                        "img_url": img_url,
                        "bestBet": "over" if best_bet_over else "under",
                        "bestBetOdds": best_bet["odds"],
                        "bestBook": best_bet["book"],
                        "bestBetLine": best_bet["line"],
                        "bestBetProbability": best_bet_probability,
                        "allBookOdds": player_props,
                        "game_time": format_game_time_to_est(
                            game_info["commence_time"].isoformat()
                        ),
                    }

    return all_props_dict


@cached(best_props_cache)
def getBestPropsEPL():
    prop_types = [
        "player_shots",
        "player_shots_on_target",
    ]

    prizepicks_data = getPrizePicksData()
    prizepicks_index = build_prizepicks_index(prizepicks_data)

    if not prizepicks_data or not prizepicks_index:
        return {"message": "No EPL Props Data.", "data": []}

    games_today = getGames()
    if not games_today:
        return {"message": "No EPL games.", "data": []}

    all_best_props = []

    for game in games_today:
        for prop_type in prop_types:
            player_props_odds_for_game = getPlayersPropsOddsForGame(
                game["id"], prop_type
            )

            # print(game)
            # print(player_props_odds_for_game)
            best_props = find_best_props(
                player_props_odds_for_game,
                prop_type,
                prizepicks_index,
                game,
            )
            all_best_props.extend(best_props.values())

    sorted_best_props = sorted(
        all_best_props, key=lambda x: x["bestBetProbability"], reverse=True
    )

    print(sorted_best_props)

    return {"message": "Success", "data": sorted_best_props}
