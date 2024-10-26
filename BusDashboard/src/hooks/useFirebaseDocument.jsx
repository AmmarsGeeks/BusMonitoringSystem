import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { collectionReferences } from '../config/firebase/collections';
import { db } from '../config/firebase/firebase';

export default function useFirebaseDocument(collectionName, docId) {
  const [document, setDocument] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const func = async () => {
      try {
        const loadedDoc = await getDoc(doc(db, collectionName, docId));
        setDocument(loadedDoc.data());
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };
    func();
  }, [collectionName, docId]);

  return { document, loading, error };
}
