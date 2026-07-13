import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9sT9xvn2H4zSfRvuo1GJ9li-8yOMprGo",
  authDomain: "agrogestao-1ca98.firebaseapp.com",
  projectId: "agrogestao-1ca98",
  storageBucket: "agrogestao-1ca98.firebasestorage.app",
  messagingSenderId: "693273655732",
  appId: "1:693273655732:web:cba72b9bace923eaa09ae1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
