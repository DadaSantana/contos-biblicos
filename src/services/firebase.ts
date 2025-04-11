import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuJ5oCmZUw0zg0d5sTr4rlNMfqZ0UrkNM",
  authDomain: "contos-celestiais.firebaseapp.com",
  projectId: "contos-celestiais",
  storageBucket: "contos-celestiais.appspot.com",
  messagingSenderId: "31739000027",
  appId: "1:31739000027:web:4ad9fd0341dff5e63348fe",
  measurementId: "G-00CQMP2KD7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage }; 