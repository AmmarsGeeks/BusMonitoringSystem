import { collectionReferences } from '../../config/firebase/collections';

import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';
import update from './update';

export type DeleteArgs = {
  collectionName: keyof typeof collectionReferences;
  id: string;
  archive?: boolean;
};

export default async function deleteById(args: DeleteArgs) {
  const { collectionName, id } = args;

  if (args.archive) {
    await update({ collectionName, id, newValues: { archived: true }, merge: true });
    return;
  }

  await deleteDoc(doc(db, collectionName, id));
}
