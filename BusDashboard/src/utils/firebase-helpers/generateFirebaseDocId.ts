import { collection, doc } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';

export default function generateFirebaseDocId() {
  const newRef = doc(collection(db, 'documents'));
  return newRef.id;
}
