import { collectionReferences } from '../../config/firebase/collections';
import update from './update';

export type DeleteArgs = {
  collectionName: keyof typeof collectionReferences;
  id: string;
  archive?: boolean;
};

export default async function enableById(args: DeleteArgs) {
  const { collectionName, id } = args;
    await update({ collectionName, id, newValues: { archived: false }, merge: true });
    return;
}
