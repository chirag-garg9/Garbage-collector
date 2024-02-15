from threading import Thread
from stream import streaming
import os
from upload_images import upload_images
from flask import Flask, request, Response
import firebase_admin
from firebase_admin import credentials, storage, firestore

# streamer = Flask(__name__) creates a Flask application instance called streamer. Flask is a web
# framework for Python that allows you to build web applications. __name__ is a special variable in
# Python that represents the name of the current module. By passing __name__ as an argument to
# Flask, it tells Flask to use the current module as the starting point for the application.
db = firestore.client()
bucket = storage.bucket()
streamer = Flask(__name__)
initial = os.getcwd()
if not os.path.exists(f"{initial}/location"):
    os.mkdir(f"{initial}/location")
    
stream = streaming()

@streamer.route('/uploadvideo',methods = ['POST','GET'])
def start_stream():
    if(request.method == 'POST'):
        video_data = request.files.get('video')
        video_url = request.form.get('video_url')
        print(video_url)
        if(video_data):
            video_data = request.files['video'].read()
        long = request.form['logi']
        lati = request.form['lati']
        stream.set_data(long,lati,video_data=video_data,video_url=video_url)
    if(stream.cap!= None and stream.cap.isOpened()):
        return Response(stream.generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    else: return Response("<h1>Error opening video stream", status=500)
    
@streamer.route('/stop_stream')
def stop_stream():
    os.remove(stream.path_video)
    stream.cap.release()
    stream.cap = None
    stream.lati = None
    stream.long = None
    return Response("Stream Ended", status=200)
    
def run_app():
    streamer.run(host='0.0.0.0',port=4000)
    
if __name__ == '__main__':
    # The code snippet is creating two threads, runner and upload, and starting them using the
    # start() method.
    upload = Thread(target=upload_images,args=(db,bucket))
    Thread_stream = Thread(target=run_app)
    Thread_stream.start()
    upload.start()
    Thread_stream.join()
    upload.join()