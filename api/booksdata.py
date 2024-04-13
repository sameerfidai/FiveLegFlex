import requests

API_KEY = "567aaf51d6342223fcb773f075ceaf6d"
SPORT = "basketball_nba"
REGIONS = "us"
ODDS_FORMAT = "american"


def getEvents():
    """
    Fetches a list of event IDs for today's NBA games using The Odds API.

    Returns:
        list: A list containing the IDs of today's NBA games. Returns an empty list if no games are found or an error occurs.
    """

    events_url = f"https://api.the-odds-api.com/v4/sports/{SPORT}/events"
    params = {"apiKey": API_KEY}
    event_ids = []

    try:
        response = requests.get(events_url, params=params)
        response.raise_for_status()
        events_data = response.json()

        if events_data:
            print(f"Retrieved {len(events_data)} events for {SPORT}.")
            event_ids = [event["id"] for event in events_data]
        else:
            print(f"No events found for {SPORT}.")

    except requests.RequestException as e:
        print(f"An error occurred while fetching events: {e}")

    return event_ids


def getPlayersPropsOddsForGame(event_id, prop_type):
    """
    Retrieves betting odds for specified player propositions (e.g., points, assists, rebounds) from different bookmakers for a specific game.

    Parameters:
        event_id (str): The unique ID for the game.
        prop_type (str): The type of player prop to retrieve odds for (e.g., "player_points", "player_assists", "player_rebounds").

    Returns:
        dict: A dictionary mapping player names to their odds information from different bookmakers.
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

    # Initialize a dictionary to hold player odds from all bookmakers
    players_odds_all_books = {}

    if response.status_code == 200:
        odds_data = response.json()

        # Extract home and away team names
        home_team = odds_data.get("home_team")
        away_team = odds_data.get("away_team")

        # Iterate over all bookmakers in the response
        for bookmaker in odds_data["bookmakers"]:
            bookmaker_name = bookmaker["key"]
            # Skip these 2 books (weird odds)
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

                        # assign overOdds and underOdds
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

    # Print the remaining and used request counts
    # print("Remaining requests:", response.headers.get("x-requests-remaining"))
    # print("Used requests:", response.headers.get("x-requests-used"))
    # print("getPlayersPropsOddsForGame():\n\n\n")
    # print(players_odds_all_books)

    return players_odds_all_books


def getPrizePicksData():
    """
    Gets props data currently live on PrizePicks.
    """

    # PrizePicks props data API
    URL = "https://partner-api.prizepicks.com/projections?league_id=7"

    try:
        response = requests.get(URL)
        if response.status_code != 200:
            # if the status code is not 200, return an empty dictionary
            print(f"Failed to retrieve data: {response.status_code}, {response.text}")
            return {}

        try:
            prizepicks_data = response.json()
        except ValueError as e:
            # handle cases where the response is not in valid JSON format
            print(f"Error parsing JSON response: {e}")
            return {}

        if not prizepicks_data.get("data"):
            # check if the 'data' key is present and not empty
            print("No PrizePicks Data...")
            return {}

        # process the PrizePicks data
        lines = prizepicks_data["data"]
        players_lines = {
            player["id"]: player["attributes"]
            for player in prizepicks_data["included"]
            if player["type"] == "new_player"
        }

        # initialize lines for each player
        for player_id in players_lines:
            players_lines[player_id]["lines"] = {}

        for line in lines:
            attributes = line["attributes"]
            odds_type = attributes.get("odds_type")

            # skip demon and goblin props
            if odds_type in ["demon", "goblin"]:
                continue

            player_id = line["relationships"]["new_player"]["data"]["id"]
            stat_type = attributes["stat_type"]
            stat_line = attributes["line_score"]

            if player_id in players_lines:
                players_lines[player_id]["lines"][stat_type] = stat_line

        print("getPrizePicksData():\n\n\n")
        print(players_lines)
        print("\n\n\n")
        return players_lines

    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return {}


def calculate_implied_probability(odds):
    """
    Converts American odds to an implied probability percentage.

    Parameters:
        odds (int): The American odds to convert.

    Returns:
        float: The implied probability as a decimal. For example, 0.5 represents a 50% chance.
    """

    if odds < 0:
        return -odds / (-odds + 100)
    else:
        return 100 / (odds + 100)


"""
def find_best_props(
    players_data, prop_type, prizepicks_data=None, include_prizepicks=False
):

    prizepicks_index = {pp["name"]: pp for pp in prizepicks_data.values()}

    print("players_data: \n\n")
    print(players_data)
    print("players_data: \n\n")

    prop_type_mapping = {
        "player_points": "Points",
        "player_assists": "Assists",
        "player_rebounds": "Rebounds",
        "player_threes": "3-PT Made",
        "player_points_rebounds_assists": "Pts+Rebs+Asts",
        "player_points_rebounds": "Pts+Rebs",
        "player_points_assists": "Pts+Asts",
        "player_rebounds_assists": "Rebs+Asts",
    }

    readable_prop_type = prop_type_mapping.get(prop_type, prop_type)

    all_props_dict = {}

    for player, data in players_data.items():
        home_team = data["home_team"]
        away_team = data["away_team"]
        player_props = []

        for book, odds in data.items():
            if book in ["home_team", "away_team"]:
                continue
            if odds.get("overOdds") and odds.get("underOdds"):
                over_prob = calculate_implied_probability(odds["overOdds"])
                under_prob = calculate_implied_probability(odds["underOdds"])
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

        # process for PrizePicks data
        if include_prizepicks and prizepicks_data:
            for pp_player in prizepicks_data.values():
                print("pp_player: " + str(pp_player))
                print("pp_player['name]: " + pp_player["name"])
                print("readable_prop_type: " + readable_prop_type)
                print("pp_player['lines]: " + str(pp_player["lines"]))
                print("pp_player: " + player)
                print(pp_player["name"] == player)
                print(readable_prop_type in pp_player["lines"])
                if (
                    pp_player["name"] == player
                    and readable_prop_type in pp_player["lines"]
                ):
                    prizepicks_line = pp_player["lines"][readable_prop_type]
                    img_url = pp_player["image_url"]
                    matching_props = [
                        prop for prop in player_props if prop["line"] == prizepicks_line
                    ]
                    if matching_props:
                        best_bet = max(
                            matching_props,
                            key=lambda x: max(
                                x["overProbability"], x["underProbability"]
                            ),
                        )
                        composite_key = f"{player}_{readable_prop_type}"
                        all_props_dict[composite_key] = {
                            "player": player,
                            "prop_type": readable_prop_type,
                            "home_team": home_team,
                            "away_team": away_team,
                            "line": prizepicks_line,
                            "img_url": img_url,
                            "bestBet": (
                                "over"
                                if best_bet["overProbability"]
                                > best_bet["underProbability"]
                                else "under"
                            ),
                            "bestBetOdds": (
                                best_bet["overOdds"]
                                if best_bet["overProbability"]
                                > best_bet["underProbability"]
                                else best_bet["underOdds"]
                            ),
                            "bestBook": best_bet["book"],
                            "bestBetProbability": max(
                                best_bet["overProbability"],
                                best_bet["underProbability"],
                            ),
                        }
                        # stop after finding the first matching prop
                        break
        else:
            # if not including PrizePicks data
            if player_props:
                best_bet = max(
                    player_props,
                    key=lambda x: max(x["overProbability"], x["underProbability"]),
                )
                composite_key = f"{player}_{readable_prop_type}"
                all_props_dict[composite_key] = {
                    "player": player,
                    "prop_type": readable_prop_type,
                    "home_team": home_team,
                    "away_team": away_team,
                    "line": best_bet["line"],
                    "bestBet": (
                        "over"
                        if best_bet["overProbability"] > best_bet["underProbability"]
                        else "under"
                    ),
                    "bestBetOdds": (
                        best_bet["overOdds"]
                        if best_bet["overProbability"] > best_bet["underProbability"]
                        else best_bet["underOdds"]
                    ),
                    "bestBook": best_bet["book"],
                    "bestBetProbability": max(
                        best_bet["overProbability"], best_bet["underProbability"]
                    ),
                }

    # print("find_best_props():\n\n\n")
    # print(all_props_dict)
    return all_props_dict
"""


def find_best_props(
    players_data, prop_type, prizepicks_data=None, include_prizepicks=False
):
    prizepicks_index = {}
    if include_prizepicks:
        prizepicks_index = {pp["name"]: pp for pp in prizepicks_data.values()}

    all_props_dict = {}
    prop_type_mapping = {
        "player_points": "Points",
        "player_assists": "Assists",
        "player_rebounds": "Rebounds",
        "player_threes": "3-PT Made",
        "player_points_rebounds_assists": "Pts+Rebs+Asts",
        "player_points_rebounds": "Pts+Rebs",
        "player_points_assists": "Pts+Asts",
        "player_rebounds_assists": "Rebs+Asts",
    }
    readable_prop_type = prop_type_mapping.get(prop_type, prop_type)

    for player, data in players_data.items():
        home_team = data.get("home_team", "N/A")
        away_team = data.get("away_team", "N/A")
        player_props = []

        # Collect all bookmaker odds for the player
        for book, odds in data.items():
            if book in ["home_team", "away_team"]:
                continue
            over_prob = calculate_implied_probability(odds["overOdds"])
            under_prob = calculate_implied_probability(odds["underOdds"])
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

        # process for PrizePicks data if included and matching data is available
        if (
            include_prizepicks
            and player in prizepicks_index
            and readable_prop_type in prizepicks_index[player]["lines"]
        ):
            pp_player = prizepicks_index[player]
            prizepicks_line = pp_player["lines"][readable_prop_type]
            img_url = pp_player["image_url"]
            matching_props = [
                prop for prop in player_props if prop["line"] == prizepicks_line
            ]

            if matching_props:
                best_bet = max(
                    matching_props,
                    key=lambda x: max(x["overProbability"], x["underProbability"]),
                )
                composite_key = f"{player}_{readable_prop_type}"
                all_props_dict[composite_key] = {
                    "player": player,
                    "prop_type": readable_prop_type,
                    "home_team": home_team,
                    "away_team": away_team,
                    "line": prizepicks_line,
                    "img_url": img_url,
                    "bestBet": (
                        "over"
                        if best_bet["overProbability"] > best_bet["underProbability"]
                        else "under"
                    ),
                    "bestBetOdds": (
                        best_bet["overOdds"]
                        if best_bet["overProbability"] > best_bet["underProbability"]
                        else best_bet["underOdds"]
                    ),
                    "bestBook": best_bet["book"],
                    "bestBetProbability": max(
                        best_bet["overProbability"], best_bet["underProbability"]
                    ),
                }
        elif not include_prizepicks:
            # Choose the best bets based solely on bookmaker data
            if player_props:
                best_bet = max(
                    player_props,
                    key=lambda x: max(x["overProbability"], x["underProbability"]),
                )
                composite_key = f"{player}_{readable_prop_type}"
                all_props_dict[composite_key] = {
                    "player": player,
                    "prop_type": readable_prop_type,
                    "home_team": home_team,
                    "away_team": away_team,
                    "line": best_bet["line"],
                    "bestBet": (
                        "over"
                        if best_bet["overProbability"] > best_bet["underProbability"]
                        else "under"
                    ),
                    "bestBetOdds": (
                        best_bet["overOdds"]
                        if best_bet["overProbability"] > best_bet["underProbability"]
                        else best_bet["underOdds"]
                    ),
                    "bestBook": best_bet["book"],
                    "bestBetProbability": max(
                        best_bet["overProbability"], best_bet["underProbability"]
                    ),
                }

    return all_props_dict


def getBestProps():
    prop_types = [
        "player_points",
        "player_rebounds",
        "player_assists",
        "player_threes",
        "player_points_rebounds_assists",
        "player_points_rebounds",
        "player_points_assists",
        "player_rebounds_assists",
    ]

    """
    # one prop for testing
    prop_types = ["player_threes"]
    """

    # prizepicks_data = [] # empty list for testing
    prizepicks_data = getPrizePicksData()
    if not prizepicks_data:
        return {"message": "No Props available at the moment.", "data": []}

    # get todays game
    games_today = getEvents()
    all_best_props = []

    # """
    for game_id in games_today:
        # test for specific game
        # if game_id == "866d2f5245ad5ad4ba3293827607df0e":
        for prop_type in prop_types:
            player_props_odds_for_game = getPlayersPropsOddsForGame(game_id, prop_type)
            best_props = find_best_props(
                player_props_odds_for_game,
                prop_type,
                prizepicks_data,
                include_prizepicks=True,
            )
            all_best_props.extend(best_props.values())
    # """

    # sort the all_best_props list by bestBetProbability in descending order (best bet on top)
    sorted_best_props = sorted(
        all_best_props, key=lambda x: x["bestBetProbability"], reverse=True
    )

    # return best 21 props
    return {"message": "Success", "data": sorted_best_props[:21]}


if __name__ == "__main__":
    pass
