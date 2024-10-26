// import * as admin from 'firebase-admin';

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(), 
//   });
// }

// export async function deleteAuthUser(userId: string): Promise<void> {
//     try {
//       await admin.auth().deleteUser(userId);
//       console.log(`Successfully deleted user with UID: ${userId}`);
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   }