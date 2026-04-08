/**
 * Backfill comment counts.
 *
 * This script can't run standalone because Firestore security rules
 * require an authenticated user. Instead, run the backfill from the
 * browser console while logged into the app:
 *
 * 1. Open the app in your browser and log in
 * 2. Open browser DevTools > Console
 * 3. Paste and run the code below
 */

/*
// Paste this in browser console:

const { initializeApp, getApps, getApp } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js');
const { getFirestore, collection, getDocs, updateDoc, doc, getCountFromServer } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js');
const { getAuth, signInWithPopup, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');

// Initialize a secondary Firebase app (the bundled one isn't accessible from the CDN SDK)
const firebaseConfig = {
  apiKey: 'AIzaSyAC63maQlQ033G5c5O6Qx38b3kVhb0lxYA',
  authDomain: 'jobbr-81620.firebaseapp.com',
  projectId: 'jobbr-81620',
  storageBucket: 'jobbr-81620.firebasestorage.app',
  messagingSenderId: '120811018688',
  appId: '1:120811018688:web:c1d15c2100b96c126d9025'
};
const app = getApps().find(a => a.name === '_backfill') ?? initializeApp(firebaseConfig, '_backfill');
const db = getFirestore(app);
const auth = getAuth(app);

// Authenticate — will reuse existing Google session so it's just a popup click
if (!auth.currentUser) {
  await signInWithPopup(auth, new GoogleAuthProvider());
}
const userId = auth.currentUser.uid;
console.log('User:', userId);

const appsSnap = await getDocs(collection(db, `users/${userId}/applications`));
console.log(`Found ${appsSnap.size} applications`);

for (const appDoc of appsSnap.docs) {
  const commentsCol = collection(db, `users/${userId}/applications/${appDoc.id}/comments`);
  const countSnap = await getCountFromServer(commentsCol);
  const count = countSnap.data().count;
  await updateDoc(doc(db, `users/${userId}/applications/${appDoc.id}`), { commentCount: count });
  console.log(`${appDoc.data().company}: ${count} comments`);
}

console.log('Done!');
*/
