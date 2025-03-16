import requests
import json
import time
from typing import Dict, Optional

def get_game_details(appid: int) -> Optional[Dict]:
    """
    Fetches game details from the Steam Store API for a given appid.

    Args:
        appid (int): The Steam application ID.

    Returns:
        Optional[Dict]: A dictionary with game details if successful, None otherwise.
    """
    url = f"https://store.steampowered.com/api/appdetails?appids={appid}"
    
    try:
        response = requests.get(url, timeout=10)  # Add timeout to avoid hanging
        response.raise_for_status()  # Raise an exception for bad status codes (e.g., 429, 403)
        data = response.json()

        if data is None or str(appid) not in data or not data[str(appid)].get("success"):
            print(f"Failed to fetch details for appid {appid}: Invalid response or app not found")
            return None

        game_data = data[str(appid)]["data"]
        return {
            "appid": appid,
            "name": game_data.get("name", "Unknown"),
            "description": game_data.get("short_description", "No description available."),
            "release_date": game_data.get("release_date", {}).get("date", "Unknown"),
            "genres": [genre["description"] for genre in game_data.get("genres", [])],
            "price": game_data.get("price_overview", {}).get("final_formatted", "Free")
        }

    except requests.exceptions.RequestException as e:
        print(f"Error fetching details for appid {appid}: {e}")
        return None
    except ValueError as e:
        print(f"Error decoding JSON for appid {appid}: {e}")
        return None

# Steam API URL for app list
STEAM_APP_LIST_URL = "http://api.steampowered.com/ISteamApps/GetAppList/v2/"

# Fetch the list of all Steam apps
try:
    response = requests.get(STEAM_APP_LIST_URL, timeout=10)
    response.raise_for_status()
    games = response.json()["applist"]["apps"]
except requests.exceptions.RequestException as e:
    print(f"Error fetching Steam app list: {e}")
    games = []
except ValueError as e:
    print(f"Error decoding JSON for app list: {e}")
    games = []

# Process games and save to file
output_file = "steam_games.json"
processed_games = []

# Limit the number of games to process (e.g., first 100 for testing)
MAX_GAMES = len(games)  # Adjust this number as needed
for i, game in enumerate(games[:MAX_GAMES]):
    appid = game['appid']
    game_details = get_game_details(appid)
    
    if game_details:
        processed_games.append(game_details)
        print(json.dumps(game_details, indent=4))
    
    # Add a delay to respect rate limits (e.g., 1 request per second)
    time.sleep(1)  # Adjust delay as needed (e.g., 0.5 for 2 requests/sec)

# Save to JSON file
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(processed_games, f, indent=4)

print(f"Total games found: {len(games)}")
print(f"Games processed and saved: {len(processed_games)}")