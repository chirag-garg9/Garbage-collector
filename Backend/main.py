from threading import Thread
from stream import streaming
import os
from flask import Flask, request, Response, jsonify
import pymongo
query = {"id":0}
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['Test']
collection = db['location']
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

@streamer.route('/uploadvideo',methods = ['POST','GET'])
def start_stream():
    if(request.method == 'POST'):
        video_url = request.form.get('video_url')
        long = request.form['logi']
        lati = request.form['lati']
        collection.insert_one(query)
        Thread(target=add_camera,args=[video_url,long,lati,query]).start()
        

@streamer.route('/locations', methods=['GET'])
def get_locations():
    try:
        locations = list(collection.find_one(query).keys())[2:]
        return jsonify(locations)
    except Exception as e:
        print(f"Error fetching locations: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
def run_app():
    streamer.run(host='0.0.0.0',port=4000)
    
if __name__ == '__main__':
    # The code snippet is creating two threads, runner and upload, and starting them using the
    # start() method.
    Thread_stream = Thread(target=run_app)
    Thread_stream.start()
    Thread_stream.join()