from datetime import datetime, timezone
from cachetools import TTLCache, cached
from nba_booksdata import build_prizepicks_index
import requests
from typing import Optional

API_KEY = "34f2e7d96ea18ac8893c0338b5870fc0"
SPORT = "soccer_usa_mls"
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

    mls_teams = [
        "Atlanta United FC",
        "Austin FC",
        "CF Montréal",
        "Charlotte FC",
        "Chicago Fire FC",
        "FC Cincinnati",
        "Colorado Rapids",
        "Columbus Crew",
        "D.C. United",
        "FC Dallas",
        "Houston Dynamo FC",
        "Inter Miami CF",
        "LA Galaxy",
        "Los Angeles FC",
        "Minnesota United FC",
        "Nashville SC",
        "New England Revolution",
        "New York City FC",
        "New York Red Bulls",
        "Orlando City SC",
        "Philadelphia Union",
        "Portland Timbers",
        "Real Salt Lake",
        "San Jose Earthquakes",
        "Seattle Sounders FC",
        "Sporting Kansas City",
        "St. Louis City SC",
        "Toronto FC",
        "Vancouver Whitecaps FC",
    ]

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
        players_lines = {
            player["id"]: player["attributes"]
            for player in prizepicks_data["included"]
            if player["type"] == "new_player"
            and player["attributes"]["market"] in mls_teams
        }

        # for player in prizepicks_data["included"]:
        #     if player["type"] == "new_player":
        #         team = player["attributes"]["market"]
        #         player_name = player["attributes"]["name"]
        #         is_in_mls_teams = team in mls_teams
        #         print(
        #             f"Team: {team}, In MLS Teams: {is_in_mls_teams}, Player Name: {player_name}"
        #         )

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


def calculate_implied_probability(odds):
    """
    Calculate the implied probability from American odds.

    Parameters:
        odds (int): The American odds.

    Returns:
        float: The implied probability.
    """
    if odds > 0:
        probability = 100 / (odds + 100)
    elif odds < 0:
        probability = abs(odds) / (abs(odds) + 100)
    else:
        return None

    return probability


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

        for book, odds_list in data.items():
            if book in ["home_team", "away_team"]:
                continue

            for odds in odds_list:
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

        if normalized_player in prizepicks_index:
            pp_player = prizepicks_index[normalized_player]
            if readable_prop_type in pp_player["lines"]:
                prizepicks_line = pp_player["lines"][readable_prop_type]
                img_url = pp_player.get(
                    "image_url",
                    "https://cdn-icons-png.flaticon.com/512/2748/2748558.png",
                )
                matching_props = [
                    prop for prop in player_props if prop["line"] == prizepicks_line
                ]
                if matching_props:
                    best_bet = max(
                        matching_props,
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


def getBestPropsMLS():
    prop_types = [
        "player_shots",
        "player_shots_on_target",
    ]

    games_today = getGames()
    if not games_today:
        return {"message": "No MLS games.", "data": []}

    prizepicks_data = getPrizePicksData()
    prizepicks_index = build_prizepicks_index(prizepicks_data)

    if not prizepicks_data or not prizepicks_index:
        return {"message": "No MLS Data.", "data": []}

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
