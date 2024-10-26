import { doc, getDoc, setDoc } from 'firebase/firestore';
import { collectionReferences } from '../../config/firebase/collections';
import { db } from '../../config/firebase/firebase';
import generateFirebaseDocId from './generateFirebaseDocId';

export default async function insert<T = Record<string, any>>({
  collectionName,
  fields,
  customId,
  companyId
}: {
  collectionName: keyof typeof collectionReferences;
  fields: T;
  customId?: string;
  companyId?: string;
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log({ fields });
  }

  let id = customId;

  if (!customId) {
    id = generateFirebaseDocId();
  }

  await setDoc(
    doc(db, collectionName, id!),
    {
      ...fields,
      ...(companyId ? { companyId } : {}),
      ...((fields as any)['id'] === undefined && { id }),
      ...((fields as any)['archived'] === undefined && { archived: false }),
      ...((fields as any)['createdAt'] === undefined && { createdAt: new Date() }),
      ...((fields as any)['date'] === undefined && { date: new Date() })
    },
    { merge: true }
  );

  const createdDoc = await getDoc(doc(db, collectionName, id!));
  const createdDocData = { ...createdDoc.data(), id: createdDoc.id } as T;

  return createdDocData;
}
