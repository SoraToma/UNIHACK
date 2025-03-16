from database.quickstart_connect import connect_to_database
database = connect_to_database()
collection = database.get_collection("game_data")
query = "shoot em up game"
results = collection.vector_search(query=query, limit=5)
for doc in results:
    print(doc["name"], doc["score"])