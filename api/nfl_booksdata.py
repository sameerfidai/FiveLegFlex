from datetime import datetime, timezone, timedelta
import requests
from cachetools import TTLCache, cached
import pytz
from nba_booksdata import (
    calculate_implied_probability,
    format_game_time_to_est,
    build_prizepicks_index,
    API_KEY,
)

SPORT = "americanfootball_nfl"
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

    URL = "https://partner-api.prizepicks.com/projections?league_id=9"

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
        players_lines = {
            player["id"]: player["attributes"]
            for player in prizepicks_data["included"]
            if player["type"] == "new_player"
        }

        for player_id in players_lines:
            players_lines[player_id]["lines"] = {}

        for line in lines:
            attributes = line["attributes"]
            odds_type = attributes.get("odds_type")

            if odds_type in ["demon", "goblin"]:
                continue

            player_id = line["relationships"]["new_player"]["data"]["id"]
            stat_type = attributes["stat_type"]
            stat_line = attributes["line_score"]

            if player_id in players_lines:
                players_lines[player_id]["lines"][stat_type] = stat_line

        return players_lines

    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return {}


@cached(games_cache)
def getGames():
    """
    Fetches a list of event details for NCAAF games occurring within the next 7 days in Eastern Time (ET).

    Returns:
        list: A list containing the details of NFL games scheduled for the next 7 days in ET. Returns an empty list if no games are found or an error occurs.
    """

    events_url = f"https://api.the-odds-api.com/v4/sports/{SPORT}/events"
    params = {"apiKey": API_KEY}
    games = []

    # Define the Eastern Time timezone
    eastern_tz = pytz.timezone("America/New_York")

    # Get the current time in Eastern Time
    current_time_et = datetime.now(timezone.utc).astimezone(eastern_tz)

    # Calculate the date 7 days from now
    seven_days_from_now = current_time_et.replace(hour=23, minute=59, second=59)
    seven_days_from_now += timedelta(days=7)

    try:
        response = requests.get(events_url, params=params)
        response.raise_for_status()
        events_data = response.json()
        print(events_data)

        if events_data:
            print(f"Retrieved {len(events_data)} events for {SPORT}.")
            for event in events_data:
                # Convert the commence_time to Eastern Time
                commence_time = datetime.fromisoformat(
                    event["commence_time"].replace("Z", "+00:00")
                ).astimezone(eastern_tz)

                # Check if the event occurs within the next 7 days in Eastern Time
                if current_time_et <= commence_time <= seven_days_from_now:
                    games.append(
                        {
                            "id": event["id"],
                            "commence_time": commence_time,
                            "home_team": event["home_team"],
                            "away_team": event["away_team"],
                        }
                    )
            print(f"Found {len(games)} games in the next 7 days.")
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
        prop_type (str): The type of player prop to retrieve odds for (e.g., "player_points", "player_assists", "player_rebounds").

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
                        price = outcome["price"]

                        if player_name not in players_odds_all_books:
                            players_odds_all_books[player_name] = {
                                "home_team": home_team,
                                "away_team": away_team,
                            }

                        if bookmaker_name not in players_odds_all_books[player_name]:
                            players_odds_all_books[player_name][bookmaker_name] = {
                                "points": outcome.get(
                                    "point", None
                                ),  # Use None if 'point' is not present
                                "overOdds": None,
                                "underOdds": None,
                            }

                        if MARKETS == "player_anytime_td":
                            # For anytime TD, we set the price directly
                            players_odds_all_books[player_name][bookmaker_name][
                                "overOdds"
                            ] = price
                        elif "over" in outcome["name"].lower():
                            players_odds_all_books[player_name][bookmaker_name][
                                "overOdds"
                            ] = price
                        elif "under" in outcome["name"].lower():
                            players_odds_all_books[player_name][bookmaker_name][
                                "underOdds"
                            ] = price
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
    }

    for key, value in name_replacements.items():
        name = name.replace(key, value)
    return name.replace(".", "")


def find_best_props(
    players_data, prop_type, prizepicks_index, include_prizepicks, game_info
):
    """
    Determines the best betting props for players based on bookmaker and optionally PrizePicks data.

    Parameters:
        players_data (dict): Player names with odds data from bookmakers.
        prop_type (str): Type of player prop (e.g., "player_points").
        prizepicks_index (dict): Indexed PrizePicks data with normalized player names.
        include_prizepicks (bool): Flag to decide if PrizePicks data should be matched.
        game_info (dict): Information about the game including commence time.

    Returns:
        dict: Compiled best bets with details on odds, line, probability, etc.
    """

    all_props_dict = {}
    prop_type_mapping = {
        "player_pass_tds": "Pass TDs",
        "player_pass_yds": "Pass Yards",
        "player_pass_completions": "Pass Completions",
        "player_pass_attempts": "Pass Attempts",
        "player_pass_interceptions": "INT",
        # "player_pass_longest_completion": "Pass Longest Completion",
        "player_rush_yds": "Rush Yards",
        "player_rush_attempts": "Rush Attempts",
        # "player_rush_longest": "Longest Rush",
        "player_receptions": "Receptions",
        "player_reception_yds": "Receiving Yards",
        # "player_reception_longest": "Longest Reception",
        "player_kicking_points": "Kicking Points",
        "player_field_goals": "FG Made",
        # "player_tackles_assists": "Tackles + Assists",
        # "player_1st_td": "1st Touchdown Scorer",
        # "player_last_td": "Last Touchdown Scorer",
        "player_anytime_td": "Rush+Rec TDs",
    }

    readable_prop_type = prop_type_mapping.get(prop_type, prop_type)

    for player, data in players_data.items():
        normalized_player = normalize_name(player)
        home_team = data.get("home_team", "N/A")
        away_team = data.get("away_team", "N/A")
        player_props = []

        for book, odds in data.items():
            if book in ["home_team", "away_team"]:
                continue
            over_prob = calculate_implied_probability(odds["overOdds"])
            under_prob = calculate_implied_probability(odds["underOdds"])
            if over_prob is not None and under_prob is not None:
                total_prob = over_prob + under_prob
                over_prob_vig_adjusted = over_prob / total_prob
                under_prob_vig_adjusted = under_prob / total_prob
                player_props.append(
                    {
                        "book": book,
                        "line": odds["points"],
                        "overOdds": odds["overOdds"],
                        "underOdds": odds["underOdds"],
                        "overProbability": over_prob_vig_adjusted,
                        "underProbability": under_prob_vig_adjusted,
                    }
                )

        if include_prizepicks and normalized_player in prizepicks_index:
            pp_player = prizepicks_index[normalized_player]
            if readable_prop_type in pp_player["lines"]:
                prizepicks_line = pp_player["lines"][readable_prop_type]
                img_url = pp_player.get(
                    "image_url",
                    "https://cdn-icons-png.flaticon.com/512/1499/1499891.png",
                )
                matching_props = [
                    prop for prop in player_props if prop["line"] == prizepicks_line
                ]
                if matching_props:
                    best_bet = max(
                        matching_props,
                        key=lambda x: max(x["overProbability"], x["underProbability"]),
                    )
                    best_bet["bestBet"] = (
                        "over"
                        if best_bet["overProbability"] > best_bet["underProbability"]
                        else "under"
                    )

                    weighted_sum = 0
                    total_weight = 0
                    for book_odds in matching_props:
                        if best_bet["bestBet"] == "over":
                            weighted_sum += book_odds["overProbability"] * (
                                1 / abs(book_odds["overOdds"])
                            )
                            total_weight += 1 / abs(book_odds["overOdds"])
                        else:
                            weighted_sum += book_odds["underProbability"] * (
                                1 / abs(book_odds["underOdds"])
                            )
                            total_weight += 1 / abs(book_odds["underOdds"])
                    best_bet_probability = (
                        weighted_sum / total_weight if total_weight != 0 else None
                    )

                    composite_key = f"{player}_{readable_prop_type}"
                    all_props_dict[composite_key] = {
                        "player": player,
                        "prop_type": readable_prop_type,
                        "home_team": home_team,
                        "away_team": away_team,
                        "player_team": pp_player["team_name"],
                        "player_position": pp_player["position"],
                        "line": prizepicks_line,
                        "img_url": img_url,
                        "bestBet": best_bet["bestBet"],
                        "bestBetOdds": (
                            best_bet["overOdds"]
                            if best_bet["bestBet"] == "over"
                            else best_bet["underOdds"]
                        ),
                        "bestBook": best_bet["book"],
                        "bestBetProbability": best_bet_probability,
                        "allBookOdds": player_props,
                        "game_time": format_game_time_to_est(
                            game_info["commence_time"].isoformat()
                        ),
                    }
        elif not include_prizepicks:
            if player_props:
                best_bet = max(
                    player_props,
                    key=lambda x: max(
                        x["overProbability"] if x["overProbability"] is not None else 0,
                        (
                            x["underProbability"]
                            if x["underProbability"] is not None
                            else 0
                        ),
                    ),
                )
                best_bet["bestBet"] = (
                    "over"
                    if best_bet["overProbability"] > best_bet["underProbability"]
                    else "under"
                )

                weighted_sum = 0
                total_weight = 0
                for book_odds in player_props:
                    if best_bet["bestBet"] == "over":
                        weighted_sum += book_odds["overProbability"] * (
                            1 / abs(book_odds["overOdds"])
                        )
                        total_weight += 1 / abs(book_odds["overOdds"])
                    else:
                        weighted_sum += book_odds["underProbability"] * (
                            1 / abs(book_odds["underOdds"])
                        )
                        total_weight += 1 / abs(book_odds["underOdds"])

                best_bet_probability = (
                    (weighted_sum / total_weight) if total_weight != 0 else None
                )

                composite_key = f"{player}_{readable_prop_type}"
                img_url = prizepicks_index.get(normalized_player, {}).get(
                    "image_url",
                    "https://pbs.twimg.com/profile_images/1263811030/LeBron_Crying_400x400.jpg",
                )
                player_team = prizepicks_index.get(normalized_player, {}).get(
                    "team_name", "N/A"
                )
                player_position = prizepicks_index.get(normalized_player, {}).get(
                    "position", "N/A"
                )
                all_props_dict[composite_key] = {
                    "player": player,
                    "prop_type": readable_prop_type,
                    "home_team": home_team,
                    "away_team": away_team,
                    "player_team": player_team,
                    "player_position": player_position,
                    "line": best_bet["line"],
                    "bestBet": best_bet["bestBet"],
                    "img_url": img_url,
                    "bestBetOdds": (
                        best_bet["overOdds"]
                        if best_bet["bestBet"] == "over"
                        else best_bet["underOdds"]
                    ),
                    "bestBook": best_bet["book"],
                    "bestBetProbability": best_bet_probability,
                    "allBookOdds": player_props,
                    "game_time": format_game_time_to_est(
                        game_info["commence_time"].isoformat()
                    ),
                }

    return all_props_dict


@cached(best_props_cache)
def getBestPropsNFL(include_prizepicks=True):
    prop_types = [
        "player_pass_tds",
        "player_pass_yds",
        "player_pass_completions",
        "player_pass_attempts",
        "player_pass_interceptions",
        # "player_pass_longest_completion",
        "player_rush_yds",
        "player_rush_attempts",
        # "player_rush_longest",
        "player_receptions",
        "player_reception_yds",
        # "player_reception_longest",
        "player_kicking_points",
        "player_field_goals",
        # "player_tackles_assists",
        # "player_1st_td",
        # "player_last_td",
        "player_anytime_td",
    ]

    prizepicks_data = getPrizePicksData()
    prizepicks_index = build_prizepicks_index(prizepicks_data)

    if not prizepicks_data or not prizepicks_index:
        return {"message": "No NFL Props Data.", "data": []}

    games_today = getGames()
    if not games_today:
        return {"message": "No NFL games.", "data": []}

    all_best_props = []

    for game in games_today:
        for prop_type in prop_types:
            player_props_odds_for_game = getPlayersPropsOddsForGame(
                game["id"], prop_type
            )
            best_props = find_best_props(
                player_props_odds_for_game,
                prop_type,
                prizepicks_index,
                include_prizepicks,
                game,
            )
            all_best_props.extend(best_props.values())

    sorted_best_props = sorted(
        all_best_props, key=lambda x: x["bestBetProbability"], reverse=True
    )

    return {"message": "Success", "data": sorted_best_props[:100]}


print(getBestPropsNFL())
