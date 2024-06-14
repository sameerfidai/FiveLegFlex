from datetime import datetime, timezone
from cachetools import TTLCache, cached
from nba_booksdata import build_prizepicks_index
from mls_booksdata import calculate_implied_probability
import requests
from typing import Optional

API_KEY = "be53e27a6ba44ce7e11e93beaef07a06"
SPORT = "soccer_uefa_european_championship"
REGIONS = "us"
ODDS_FORMAT = "american"

# create caches with a time-to-live (TTL) of 10 minutes (600 seconds)
prizepicks_cache = TTLCache(maxsize=100, ttl=600)
odds_cache = TTLCache(maxsize=100, ttl=600)
games_cache = TTLCache(maxsize=100, ttl=600)


@cached(prizepicks_cache)
def getPrizePicksData():
    """
    Gets props data currently live on PrizePicks.

    Returns:
        dict: A dictionary mapping player ID to player data (name, lines, team, etc).
    """

    euro_teams = {
        "Germany",
        "Spain",
        "Scotland",
        "Hungary",
        "Switzerland",
        "Croatia",
        "Italy",
        "Albania",
        "Slovenia",
        "Denmark",
        "Serbia",
        "England",
        "Netherlands",
        "Austria",
        "France",
        "Belgium",
        "Slovakia",
        "Romania",
        "Turkey",
        "Portugal",
        "Poland",
        "Georgia",
        "Ukraine",
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

            if team not in euro_teams:
                continue

            if player_id not in players_lines:
                players_lines[player_id] = {
                    "name": player_attributes["name"],
                    "market": player_attributes["market"],
                    "lines": {},
                }

            stat_type = attributes["stat_type"]
            stat_line = attributes["line_score"]
            players_lines[player_id]["lines"][stat_type] = stat_line

        # Filter out players with only demon and goblin lines
        players_lines = {
            player_id: data
            for player_id, data in players_lines.items()
            if data["lines"]
        }

        return players_lines

    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return {}


@cached(games_cache)
def getGames():
    """
    Fetches a list of event IDs for upcoming MLS games.

    Returns:
        list: A list containing the IDs of upcoming MLS games. Returns an empty list if no games are found or an error occurs.
    """

    events_url = f"https://api.the-odds-api.com/v4/sports/{SPORT}/events"
    params = {"apiKey": API_KEY}
    event_ids = []
    current_time = datetime.now(timezone.utc)

    try:
        response = requests.get(events_url, params=params)
        response.raise_for_status()
        events_data = response.json()
        # print(events_data)

        if events_data:
            print(f"Retrieved {len(events_data)} events for {SPORT}.")
            event_ids = [
                event["id"]
                for event in events_data
                if datetime.fromisoformat(event["commence_time"].replace("Z", "+00:00"))
                > current_time
            ]
        else:
            print(f"No events found for {SPORT}.")

    except requests.RequestException as e:
        print(f"An error occurred while fetching events: {e}")

    return event_ids


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
    # print(prop_type)
    # print("Response: \n", response.json())
    # print("\n\n\n\n")

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

    # print(players_odds_all_books)
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
    }

    for key, value in name_replacements.items():
        name = name.replace(key, value)
    return name.replace(".", "")


def find_best_props(players_data, prop_type, prizepicks_index):
    """
    Determines the best betting props for players based on bookmaker and PrizePicks data.

    Parameters:
        players_data (dict): Player names with odds data from bookmakers.
        prop_type (str): Type of player prop (e.g., "player_shots").
        prizepicks_index (dict): Indexed PrizePicks data with normalized player names.

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

                # Filter odds to only include those that match the PrizePicks line
                for book, odds_list in data.items():
                    if book in ["home_team", "away_team"]:
                        continue

                    for odds in odds_list:
                        if odds["points"] == prizepicks_line:
                            over_prob = calculate_implied_probability(odds["odds"])
                            if over_prob is not None:
                                player_props.append(
                                    {
                                        "book": book,
                                        "line": odds["points"],
                                        "odds": odds["odds"],
                                        "probability": over_prob,
                                    }
                                )

                if player_props:
                    best_bet = max(
                        player_props,
                        key=lambda x: x["probability"],
                    )

                    best_bet_probability = best_bet["probability"]

                    composite_key = f"{player}_{readable_prop_type}"
                    all_props_dict[composite_key] = {
                        "player": player,
                        "prop_type": readable_prop_type,
                        "home_team": home_team,
                        "away_team": away_team,
                        "line": prizepicks_line,
                        "img_url": img_url,
                        "bestBet": "over",
                        "bestBetOdds": best_bet["odds"],
                        "bestBook": best_bet["book"],
                        "bestBetProbability": best_bet_probability,
                        "allBookOdds": player_props,
                    }

    return all_props_dict


def getBestPropsEuros():
    prop_types = [
        "player_shots",
        "player_shots_on_target",
    ]

    prizepicks_data = getPrizePicksData()
    prizepicks_index = build_prizepicks_index(prizepicks_data)

    if not prizepicks_data or not prizepicks_index:
        return {"message": "No MLS Props Data.", "data": []}

    games_today = getGames()
    if not games_today:
        return {"message": "No MLS games.", "data": []}

    all_best_props = []

    for game_id in games_today:
        for prop_type in prop_types:
            player_props_odds_for_game = getPlayersPropsOddsForGame(game_id, prop_type)
            best_props = find_best_props(
                player_props_odds_for_game,
                prop_type,
                prizepicks_index,
            )
            all_best_props.extend(best_props.values())

    sorted_best_props = sorted(
        all_best_props, key=lambda x: x["bestBetProbability"], reverse=True
    )

    return {"message": "Success", "data": sorted_best_props}