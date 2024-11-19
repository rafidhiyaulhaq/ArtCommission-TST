import firebase_admin
from firebase_admin import credentials
import os

def initialize_firebase():
    cred = credentials.Certificate("./serviceAccountKey.json")
    firebase_admin.initialize_app(cred)