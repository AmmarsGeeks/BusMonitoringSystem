import { doc, setDoc } from 'firebase/firestore';
import { collectionReferences } from '../../config/firebase/collections';
import { db } from '../../config/firebase/firebase';

type Args = {
  collectionName: keyof typeof collectionReferences;
  newValues: Record<string, any>;
  id: string;
  merge?: boolean;
};
export default async function update(args: Args) {
  const { collectionName, id, newValues, merge } = args;

  await setDoc(
    doc(db, collectionName, id!),
    {
      ...newValues,
      updatedAt: new Date()
    },
    { merge: merge || true }
  );
}
