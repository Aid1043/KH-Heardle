import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {

  apiKey: "AIzaSyC7XgyGS922CLIplLs6KBdnbor_xBlPUCI",

  authDomain: "kh-heardle.firebaseapp.com",

  projectId: "kh-heardle",

  storageBucket: "kh-heardle.firebasestorage.app",

  messagingSenderId: "607969840926",

  appId: "1:607969840926:web:7430c461b5720e2d98030f"

};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);