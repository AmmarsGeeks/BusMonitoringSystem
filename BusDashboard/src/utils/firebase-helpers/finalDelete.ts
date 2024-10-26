import { collectionReferences } from '../../config/firebase/collections';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';

export type FinalDeleteArgs = {
  collectionName: keyof typeof collectionReferences;
  id: string;
};

export default async function finalDelete(args: FinalDeleteArgs) {
  const { collectionName, id } = args;

  // Permanently delete the document
  await deleteDoc(doc(db, collectionName, id));
}