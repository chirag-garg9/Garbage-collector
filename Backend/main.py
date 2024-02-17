from threading import Thread
from stream import streaming
from Shortest_path import calculate_shoretest_path,path_upadtor,check_updates
import os
from flask import Flask, request, Response, jsonify
from flask_cors import cross_origin
import pymongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import secrets

query = {"id":0}
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['Test']
collection = db['location']
collection.insert_one(query)
# streamer = Flask(__name__) creates a Flask application instance called streamer. Flask is a web
# framework for Python that allows you to build web applications. __name__ is a special variable in
# Python that represents the name of the current module. By passing __name__ as an argument to
# Flask, it tells Flask to use the current module as the starting point for the application.
m=0
streamer = Flask(__name__)

def add_camera(video_url,long,lati,query):
    stream = streaming()
    stream.set_data(long,lati,video_url,query)
    stream.generate_frames(m,collection)
users_collection = db['user']
jwt_secret_key = secrets.token_urlsafe(32)
# Configuration for JWT
streamer.config['JWT_SECRET_KEY'] = jwt_secret_key
jwt = JWTManager(streamer)
# Configuration for Bcrypt
bcrypt = Bcrypt(streamer)

# User collection in MongoDB


@streamer.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    data = request.get_json()

    # Check if the user already exists
    if users_collection.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists'}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Create a new user
    new_user = {
        'email': data['email'],
        'password': hashed_password
    }

    # Insert the user into the database
    users_collection.insert_one(new_user)

    return jsonify({'message': 'User registered successfully'}), 201


@streamer.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    user = users_collection.find_one({'email': data['email']})

    if user and bcrypt.check_password_hash(user['password'], data['password']):
        # Generate an access token
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@streamer.route('/protected', methods=['GET'])
@cross_origin()
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@streamer.route('/uploadvideo',methods = ['POST','GET'])
@cross_origin()
def start_stream():
    if(request.method == 'POST'):
        video_url = request.form.get('video_url')
        long = request.form['logi']
        lati = request.form['lati']
        collection.insert_one(query)
        Thread(target=add_camera,args=[video_url,long,lati,query]).start()
        

@streamer.route('/locations', methods=['GET'])
@cross_origin()
def get_locations():
    try:
        locations = list(collection.find_one(query).keys())[2:]
        return locations
    except Exception as e:
        print(f"Error fetching locations: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
@streamer.route('/calculate-path', methods=['POST'])
@cross_origin()
def calculate_path():
    data = request.get_json()
    user_location = data.get('userLocation')
    endpoints = data.get('endpoints')
    locations = collection.find_one(query)
    locations = list(collection.find_one(query).keys())[2:]
    locations.append(user_location)
    locations.append(endpoints)
    # Fetch travel times between locations using the Distance Matrix Service
    path = calculate_shoretest_path(locations)
    print(path)
    return jsonify(path)

@streamer.route('/updates',methods=['Get'])
@cross_origin()
def updates():
    check_updates()
    if updates == None:
        return jsonify("No updates available")
    else: 
        return jsonify(updates)
    

def run_app():
    streamer.run(host='0.0.0.0',port=4000,threaded=True)
    
if __name__ == '__main__':
    # The code snippet is creating two threads, runner and upload, and starting them using the
    # start() method.
    path_updates = Thread(target=path_upadtor, args=[collection,query])
    Thread_stream = Thread(target=run_app)
    path_updates.start()
    Thread_stream.start()
    Thread_stream.join()
    path_updates.join()