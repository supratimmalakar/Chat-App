import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBsGvXVeRUhczvSSY6r3kcEL56LPs8DIfw",
  authDomain: "chatapp-c0404.firebaseapp.com",
  projectId: "chatapp-c0404",
  storageBucket: "chatapp-c0404.appspot.com",
  messagingSenderId: "1093010658295",
  appId: "1:1093010658295:web:8d96b0beb3bb15ecc094f2"
})

const db = firebaseApp.firestore();

const auth = firebaseApp.auth();

export { db, auth }
