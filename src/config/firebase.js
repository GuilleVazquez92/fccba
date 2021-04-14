import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ENV } from '../enviroments/enviroment';

const firebaseConfig = {
    apiKey: ENV.FIREBASE_API_KEY,
    authDomain: ENV.FIREBASE_AUTH_DOMAIN,
    databaseURL: ENV.FIREBASE_DATABASE_URL,
    projectId: ENV.FIREBASE_PROJECT_ID,
    storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
    appId: ENV.FIREBASE_APP_ID,
    measurementId: ENV.FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return true;

  // Generate user document.
  const userRef = db.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, uid } = user;
    try {
      await userRef.set({
        email,
        uid,
        role: 'customer'
      });
    } catch (error) {
      console.error("Error al crear usuario.", error);
    }
  };

  // Generate Profile document.
  const profileRef = db.doc(`profile/${user.uid}`);
  const snapshotProfile = await profileRef.get();

  if (!snapshotProfile.exists) {
    try {
      await profileRef.set({
        ...additionalData
      });
    } catch (error) {
      console.error("Error al crear perfil.", error);
    }
  };
  return true;
};

export const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await db.doc(`users/${uid}`).get();
    const profileDocument = await db.doc(`profile/${uid}`).get();

    return {
      cards: [],
      ...userDocument.data(),
      ...profileDocument.data()
    };
  } catch (error) {
    console.error("Error al obtener documento.", error);
  }
};