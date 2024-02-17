from datetime import datetime
import networkx as nx
import openrouteservice
import numpy as np
from itertools import permutations

locations_data = []
path_data = []
curr_path = []
#coordinates = [[81.770754, 21.128681], [81.792538,21.125523], [ 81.774578,21.139912]] 
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
                    duration_matrix[i][j] = travel_time  # Convert seconds to hours
                except openrouteservice.exceptions.ApiError as e:
                    print(f"Error calculating travel time between {coords[0]} and {coords[1]}: {e}")

    return duration_matrix

def create_graph(locations, travel_times):
    graph = nx.Graph()

    # Add nodes (locations)
    for i, location in enumerate(locations):
        graph.add_node(i+1)

    # Add edges with travel times as weights
    for i in range(len(locations)):
        for j in range(len(locations)):
            if i != j:
                graph.add_edge(i+1, j+1, time=travel_times[i][j])

    return graph

def tsp_with_fixed_start_end(graph, start_node, end_node):
    # Generate all possible permutations of nodes
    all_permutations = permutations(graph.nodes)

    min_cost = float('inf')
    optimal_path = None

    for perm in all_permutations:
        # Check if the permutation starts and ends at the specified nodes
        if perm[0] == start_node and perm[-1] == end_node:
            # Calculate the cost of the current permutation
            current_cost = sum(graph[perm[i]][perm[i+1]]['time'] for i in range(len(perm)-1))
            
            # Update the minimum cost and optimal path if the current permutation is better
            if current_cost < min_cost:
                min_cost = current_cost
                optimal_path = perm

    return [list(optimal_path), min_cost]

def check_updates():
    global locations_data,path_data,curr_path
    if len(path_data)!= len(curr_path):
        path_data = curr_path
        return path_data
    else:
        k = False
        for path in range(len(path_data)):
            if path_data[path] != curr_path[path]:
                k = True
                break
        if k:
            path_data = curr_path
            return path_data

def calculate_shoretest_path(locations):
    times = calculate_travel_times(locations[-1],locations[:-2],locations[-2],'5b3ce3597851110001cf6248c14032d634d540ff9c53296d8dab6539')
    graph = create_graph(locations,times)
    path = tsp_with_fixed_start_end(graph,len(locations)-1,len(locations))
    path_data = path[0]
    return path_data

def path_upadtor(collection,query):
    while True:
        global locations_data,path_data,curr_path
        locations = list(collection.find_one(query).keys())[2:]
        if len(locations) != len(locations_data):
            locations_data = locations
            path_data = []
            for j,location in enumerate(locations_data):
                location = location.split(',')
                for k,i in enumerate(location):
                    i = eval(i)
                    location[k] = i
                locations_data[j] = location
            times = calculate_travel_times(locations[-1],locations[:-2],locations[-2],'5b3ce3597851110001cf6248c14032d634d540ff9c53296d8dab6539')
            graph = create_graph(locations,times)
            path = tsp_with_fixed_start_end(graph,len(locations)-1,len(locations))
            path_data = path[0]
            
        else:
            k = False
            for i in range(len(locations)):
                if locations[i] != locations_data[i]:
                    k = True
                    break
            if k: 
                locations_data = locations
                path_data = []
                for j,location in enumerate(locations_data):
                    location = location.split(',')
                    for k,i in enumerate(location):
                        i = eval(i)
                        location[k] = i
                    locations_data[j] = location
                times = calculate_travel_times(locations[-1],locations[:-2],locations[-2],'5b3ce3597851110001cf6248c14032d634d540ff9c53296d8dab6539')
                graph = create_graph(locations,times)
                path = tsp_with_fixed_start_end(graph,len(locations)-1,len(locations))
                path_data = path[0]
