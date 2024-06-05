from datetime import datetime, timezone
from cachetools import TTLCache, cached
from nba_booksdata import calculate_implied_probability
import requests
from typing import Optional

API_KEY = "bffd73c98de47120e33b38c184be08fc"
SPORT = "soccer_usa_mls"
REGIONS = "us"
ODDS_FORMAT = "american"


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

    # TO DO:
    # change this URL to MLS props
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
    print(response.json())

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
                        if player_name not in players_odds_all_books:
                            players_odds_all_books[player_name] = {
                                "home_team": home_team,
                                "away_team": away_team,
                            }

                        if bookmaker_name not in players_odds_all_books[player_name]:
                            players_odds_all_books[player_name][bookmaker_name] = {
                                "points": outcome["point"],
                                "overOdds": None,
                                "underOdds": None,
                            }

                        if "over" in outcome["name"].lower():
                            players_odds_all_books[player_name][bookmaker_name][
                                "overOdds"
                            ] = outcome["price"]
                        elif "under" in outcome["name"].lower():
                            players_odds_all_books[player_name][bookmaker_name][
                                "underOdds"
                            ] = outcome["price"]
    else:
        print(f"Failed to retrieve data: {response.status_code}, {response.text}")

    return players_odds_all_books


# games = getGames()
# for game_id in games[:2]:
#     player_props_odds_for_game = getPlayersPropsOddsForGame(game_id, "player_shots")
#     print("props:", player_props_odds_for_game)

print(getPrizePicksData())
