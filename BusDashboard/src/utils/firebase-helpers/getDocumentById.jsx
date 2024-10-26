import { doc, getDoc} from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';

export default async function getDocumentById({
  collectionName,
  docId
}) {
  const loadedDoc = await getDoc(doc(db, collectionName, docId));
  return loadedDoc.data();
}
