
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// SUBSTITUA OS DADOS ABAIXO PELOS QUE VOCÊ COPIOU DO CONSOLE DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAk3bwFb7ROhsR5Cu3YXdo3e_n6KHI9xmA",
  authDomain: "bssm---app.firebaseapp.com",
  databaseURL: "https://bssm---app-default-rtdb.firebaseio.com",
  projectId: "bssm---app",
  storageBucket: "bssm---app.firebasestorage.app",
  messagingSenderId: "875637451285",
  appId: "1:875637451285:web:132da6ecd7f3f7343c7c1c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue, push };
