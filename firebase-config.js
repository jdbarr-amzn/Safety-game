// ── Firebase Configuration ──
// Replace these values with your Firebase project config.
// Get them from: https://console.firebase.google.com → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSyBMsJzYHlq1AayYNk82ZtK4cnQu3XN7pro",
  authDomain: "safety-game-leaderboard.firebaseapp.com",
  databaseURL: "https://safety-game-leaderboard-default-rtdb.firebaseio.com",
  projectId: "safety-game-leaderboard",
  storageBucket: "safety-game-leaderboard.firebasestorage.app",
  messagingSenderId: "188633623461",
  appId: "1:188633623461:web:f209d180d81e7256ca164c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
