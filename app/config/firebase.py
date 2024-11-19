import os
import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    try:
        cred = credentials.Certificate(os.getenv("FIREBASE_CREDENTIALS"))
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Firebase and Firestore initialized successfully")
        return db
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        raise e