import firebase_admin
from firebase_admin import credentials
import os

def initialize_firebase():
    try:
        cred = credentials.Certificate("serviceAccountKey.json")  # Ubah path
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully")  # Debug print
    except Exception as e:
        print(f"Error initializing Firebase: {e}")  # Debug print