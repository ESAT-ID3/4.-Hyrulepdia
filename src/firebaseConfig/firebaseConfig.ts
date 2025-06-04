import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: 'AIzaSyAICIq1XUz3IrZTOwteLXnKypG0xBcMhz0',
  authDomain: 'hyrulepedia.firebaseapp.com',
  projectId: 'hyrulepedia',
  storageBucket: 'hyrulepedia.appspot.com',
  messagingSenderId: '180755373122',
  appId: '1:180755373122:web:95f8d828025dacac8161db',
  measurementId: 'G-REFF7KEJCW',
};

// Inicializar la app
export const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
