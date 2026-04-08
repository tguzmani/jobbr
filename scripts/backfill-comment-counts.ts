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

const { getFirestore, collection, getDocs, updateDoc, doc, getCountFromServer } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js');

// Get the existing Firestore instance from AngularFire
const db = getFirestore();

// Get current user UID from Firebase Auth
const { getAuth } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');
const auth = getAuth();
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
