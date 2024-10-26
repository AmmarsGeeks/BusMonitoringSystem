import { collectionReferences } from '../../config/firebase/collections';

export default function getDocPath(collectionName: keyof typeof collectionReferences, id: string) {
    return `${collectionName}/${id}`;
}
