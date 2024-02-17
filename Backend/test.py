from flask import Flask, request, jsonify
import pymongo
from flask_bcrypt import Bcrypt
from flask_cors import cross_origin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import secrets


app = Flask(__name__)
# Configuration for MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['Test']



if __name__ == '__main__':
    app.run(debug=True)
