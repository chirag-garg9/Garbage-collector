import cv2
from ultralytics import YOLO
import torch
import os
class streaming():
    def __init__(self):
        # The code snippet initializes several instance variables for the `streaming` class. Here's a
        # breakdown of each variable:
        self.cap = None
        self.long = None
        self.lati = None
        self.url = None
        self.query = {}
    def set_data(self,longi,lati,video_url=None,query=None):
        if(video_url is not None):
            self.cap = cv2.VideoCapture(video_url)
            print(video_url)
        self.long = longi
        self.lati = lati
        
    def generate_frames(self,m,collection):
        """
        The function `generate_frames` captures frames from a video stream, performs object detection using
        YOLO model, and yields the processed frames as JPEG images.
        """
        model = YOLO('best.pt')
        m = 0
        is_saved = False
        cnt = 0
        while True:
            if(self.cap!=None):
                ret, frame = self.cap.read()
                if ret:
                    frame = cv2.resize(frame, (int(1920 / 1.38), int(1080 / 1.38)))
                    result = model.track(frame,persist=True)
                    cnt = 0
                    for det in result.xyxy[0]:
                        if det[-1]>=0.75: cnt += 1
                    database = collection.find_one(self.query)
                    if cnt>0:
                        database[f"{self.long}, {self.lati}"] = cnt
                        collection.update_one(self.query, {"$set": database}, upsert=True)
                    else:
                        if f"{self.long}, {self.lati}" in database:
                            collection.update_one(self.query, {"$unset": {f"{self.long}, {self.lati}": ""}}, upsert=True)
                    for res in result:
                        boxes = res.boxes
                        for i, r in enumerate(boxes.xyxy):
                            r = r.cpu().tolist()
                            c = boxes.conf[i].tolist()
                            x1, y1, x2, y2 = r[0], r[1], r[2], r[3]
                            if c>=0.75:
                                frame = cv2.line(frame, (frame.shape[1] // 2, frame.shape[0] // 2),
                                                (int(x1 + x2) // 2, int(y1 + y2) // 2), (255, 0, 255), 2)
                                font = cv2.FONT_HERSHEY_SIMPLEX
                                frame = cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
                                frame = cv2.putText(frame, f'Garbage  {c:.2f}', (int(x1), int(y1) - 5), font, .75,
                                                    (0, 255, 255), 2)
                    cv2.imshow(f'Phone Camera', frame)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        self.cap.release()
                        self.cap = None
                        self.lati = None
                        self.long = None
                        break
                    # _, buffer = cv2.imencode('.jpg', frame)
                    # frame_bytes = buffer.tobytes()
                    # yield (b'--frame\r\n'
                    # b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                else:
                    self.cap.release()
                    self.cap = None
                    self.lati = None
                    self.long = None
            else:
                return "Failed"

