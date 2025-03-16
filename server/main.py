import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

from astrapy import DataAPIClient
from astrapy.constants import VectorMetric
from astrapy.ids import UUID
from astrapy.info import CollectionVectorServiceOptions

load_dotenv()

client_id=os.getenv('CLIENTID') 
client_secret=os.getenv('CLIENTSECRET')
app = Flask(__name__)
CORS(app)

ASTRA_DB_APPLICATION_TOKEN = os.getenv('ASTRA_DB_APPLICATION_TOKEN')
ASTRA_DB_API_ENDPOINT = os.getenv('ASTRA_DB_API_ENDPOINT')

my_client = DataAPIClient()
my_database = my_client.get_database(
    ASTRA_DB_API_ENDPOINT,
    token=ASTRA_DB_APPLICATION_TOKEN,
)

collection = my_database.get_collection("games_data")

@app.route("/")
def home():
    return "<p>Hello, World!</p>"

@app.route("/search-game")
def searchGame():
    game = request.args.get('game')

    game_data = collection.find({}, sort={"$vectorize": game}, limit=10)
    res = []

    if game_data:
        i = 0
        for doc in game_data:
            i += 1
            if i > 10:
                break
            res.append(doc)
        return jsonify(res)

    else:
        response = requests.post(f'https://id.twitch.tv/oauth2/token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials')
        access_token = response.json()['access_token']
        response = requests.post(
            'https://api.igdb.com/v4/games',
            headers={
                'Client-ID': client_id,
                'Authorization': f'Bearer {access_token}'
            },
            data=f'fields id, name; limit 10; search "{game}";'
        )
        return response.json()
        

@app.route("/search-by-id")
def searchId():
    gameId = request.args.get('gameId')
    response = requests.post(f'https://id.twitch.tv/oauth2/token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials')
    access_token = response.json()['access_token']
    response = requests.post(
        'https://api.igdb.com/v4/games',
        headers={
            'Client-ID': client_id,
            'Authorization': f'Bearer {access_token}'
        },
        data=f'fields *; limit 1; where id = {gameId};'
    )

    '''
    if response.json():
        gameName = response.json()[0]['name']
        game_data = collection.find({}, sort={"$vectorize": gameName}, limit=10)
        res = None

        if game_data:
            for doc in game_data:
                if doc['name'] == gameName:
                    res = doc
                    break
        if not res:
            print("asd")
            steam_res = requests.get(f'https://api.steampowered.com/api/appdetails?appids={gameId}')
            print(steam_res)
            if steam_res.json()[gameId]['success']:
                res = steam_res.json()[gameId]['data']
                print(res)

        if res:
            combined_result = response.json()[0]
            combined_result.update({"database_result": res})
            return jsonify(combined_result)
        else:
            return response.json()
        
    '''
    return response.json()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)