// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/database'

var firebaseConfig = {
  apiKey: 'AIzaSyCQiBRdLZUKNYpE7GtXXtM60NwHSL0JxEU',
  authDomain: 'smackchat-3a498.firebaseapp.com',
  projectId: 'smackchat-3a498',
  storageBucket: 'smackchat-3a498.appspot.com',
  messagingSenderId: '413535027516',
  appId: '1:413535027516:web:6c219bac68be96b82ede39'
}
const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseDB = firebaseApp.database()

export { firebaseAuth, firebaseDB }
