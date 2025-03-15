import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

client_id=os.getenv('CLIENTID') 
client_secret=os.getenv('CLIENTSECRET')
app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/searchgame")
def return_game():
    game = request.args.get('game')
    response = requests.post(f'https://id.twitch.tv/oauth2/token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials')
    access_token = response.json()['access_token']
    response = requests.post(
        'https://api.igdb.com/v4/games',
        headers={
            'Client-ID': client_id,
            'Authorization': f'Bearer {access_token}'
        },
        data=f'fields *; limit 1; search "{game}";'
    )
    return response.json()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)