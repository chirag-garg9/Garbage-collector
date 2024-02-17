from flask import Flask, request, jsonify
from flask_cors import CORS
import googlemaps
from datetime import datetime
import networkx as nx
import openrouteservice
#coordinates = [[81.770754, 21.128681], [81.792538,21.125523], [ 81.774578,21.139912]] 
app = Flask(__name__)
CORS(app)

@app.route('/calculate-path', methods=['POST'])
def calculate_path():
    data = request.get_json()
    user_location = data.get('userLocation')
    locations = data.get('locations')
    endpoints = data.get('endpoints')
    # Fetch travel times between locations using the Distance Matrix Service
    travel_times = calculate_travel_times(user_location, locations,endpoints,'5b3ce3597851110001cf6248c14032d634d540ff9c53296d8dab6539')

    # Create a graph with locations as nodes and travel times as edge weights
    graph = create_graph(locations, travel_times)

    # Calculate the shortest path based on time
    shortest_path = calculate_shortest_path(graph)

    return jsonify({'path': shortest_path})

def calculate_travel_times(user_location, locations,endpoint,api_key):
    client = openrouteservice.Client(key=api_key)
    coordinates = locations + [user_location,endpoint]
    num_locations = len(coordinates)
    duration_matrix = [[0] * num_locations for _ in range(num_locations)]
    # Calculate the travel time between each pair of locations
    for i in range(num_locations):
        for j in range(num_locations):
            if i != j:
                coords = [coordinates[i], coordinates[j]]
                try:
                    result = client.directions(coordinates=coords, profile='driving-car')
                    print(result)
                    travel_time = result['routes'][0]['summary']['duration']
                    print(travel_time)
                    duration_matrix[i][j] = travel_time / 3600  # Convert seconds to hours
                except openrouteservice.exceptions.ApiError as e:
                    print(f"Error calculating travel time between {coords[0]} and {coords[1]}: {e}")

    return duration_matrix

def create_graph(locations, travel_times):
    graph = nx.Graph()

    # Add nodes (locations)
    for i, location in enumerate(locations):
        graph.add_node(i, latitude=location['latitude'], longitude=location['longitude'])

    # Add edges with travel times as weights
    for i in range(len(locations)):
        for j in range(len(locations)):
            if i != j:
                graph.add_edge(i, j, time=travel_times[j])

    return graph

def calculate_shortest_path(graph):
    # Use Dijkstra's algorithm to find the shortest path based on time
    shortest_path = nx.shortest_path(graph, source=0, weight='time')
    return shortest_path

if __name__ == '__main__':
    app.run(debug=True)