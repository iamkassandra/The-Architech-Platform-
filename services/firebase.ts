import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, query, where, getDocs, addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, OrderByDirection, orderBy, limit, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Authentication node failure:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// Test Connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Connection: SYNCED");
  } catch (error) {
    if(error instanceof Error && error.message.includes('permission-denied')) {
        console.warn("Firebase Security Rules: ACTIVE (Expected)");
    } else {
        console.error("Firebase connection synchronization failed:", error);
    }
  }
}

testConnection();

export { 
  onAuthStateChanged,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  doc,
  onSnapshot
};

export type { User };
