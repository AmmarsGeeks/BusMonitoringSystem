import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.resolve(__dirname, '../credentials/service-account-file.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "buspassengermonitoring",
  databaseURL: "https://buspassengermonitoring-default-rtdb.firebaseio.com"
});

const delay = (ms : number) => new Promise((resolve) => setTimeout(resolve, ms));




// export const onInsertNewPassenger = functions
// .runWith({ timeoutSeconds: 300 }) // Set timeout to 5 minutes
// .region('us-central1')
// .database.ref('/Passengers/{id}')
// .onCreate(async (snapshot, context) => {
//   const passengerData = snapshot.val();
//   const passengerId = context.params.id;
//   const initialStatus = passengerData.status;
//   const busNumber = parseInt(passengerData.related_bus, 10); // Convert busNumber to an integer

//   if (isNaN(busNumber)) {
//     console.error(`Invalid bus number: ${passengerData.related_bus}`);
//     return;
//   }

//   try {
//     // Fetch bus data from Realtime Database
//     const busSnapshot = await admin.database().ref(`/Buses`).orderByChild('busNumber').equalTo(busNumber).once('value');
//     const busData = busSnapshot.val();

//     // if (!busData) {
//     //   console.error(`Bus with number ${busNumber} not found.`);
//     //   return;
//     // }

//     // Get the first matching bus (if multiple entries exist, we only use the first one)
//     const busKey = Object.keys(busData)[0];
//     const busTime = busData[busKey]?.time;

//     // if (!busTime) {
//     //   console.error(`Bus with number ${busNumber} does not have a time property.`);
//     //   return;
//     // }

//     // Log or use the busTime as needed
//     console.log(`Bus time for bus number ${busNumber}: ${busTime}`);

//     // Delay for 20 seconds
//     await delay(20000);

//     // Re-fetch the passenger data from Realtime Database
//     const updatedSnapshot = await admin.database().ref(`/Passengers/${passengerId}`).once('value');
//     const updatedPassengerData = updatedSnapshot.val();

//     if (!updatedPassengerData) {
//       console.error(`Passenger data for ${passengerId} could not be found after delay.`);
//       return;
//     }

//     const updatedStatus = updatedPassengerData.status;

//     // Create a notification based on the status check
//     const notificationMessage = (initialStatus === updatedStatus)
//       ? `Passenger With ID ${passengerId} status unchanged: ${initialStatus}.`
//       : `Passenger ${passengerId} status updated from ${initialStatus} to ${updatedStatus}.`;

//     // Save the notification to the "notifications" path in the Realtime Database
//     const newNotification = {
//       time: admin.firestore.Timestamp.now().toDate().toISOString(),
//       title: 'Passenger Still Inside The Bus',
//       body: `${notificationMessage}. Bus delay time: ${busTime} minutes.`,
//       passengerID: passengerId,
//     };

//     await admin.database().ref('/Notification').push(newNotification);
//   } catch (error) {
//     console.error(`Error processing passenger ${passengerId}:`, error);
//   }
// });

export const onInsertNewPassenger = functions
  .runWith({ timeoutSeconds: 300 }) // Set timeout to 5 minutes
  .region('us-central1')
  .database.ref('/Passengers/{id}')
  .onCreate(async (snapshot, context) => {
    const passengerData = snapshot.val();
    const passengerId = context.params.id;
    const initialStatus = passengerData.status;

    // Delay for 20 seconds
    await delay(20000);

    // Re-fetch the passenger data from Realtime Database
    const updatedSnapshot = await admin.database().ref(`/Passengers/${passengerId}`).once('value');
    const updatedPassengerData = updatedSnapshot.val();

    if (!updatedPassengerData) {
      console.error(`Passenger data for ${passengerId} could not be found after delay.`);
      return;
    }

    const updatedStatus = updatedPassengerData.status;

    // Create a notification based on the status check
    const notificationMessage = (initialStatus === updatedStatus)
      ? `Passenger With ID ${passengerId} status unchanged: ${initialStatus}.`
      : `Passenger ${passengerId} status updated from ${initialStatus} to ${updatedStatus}.`;

    // Save the notification to the "notifications" path in the Realtime Database
    const newNotification = {
      time: admin.firestore.Timestamp.now().toDate().toISOString(), // Get the current server time in ISO string format
      title: 'Passenger Still Inside The Bus',
      body: notificationMessage,
      passengerID: passengerId,
    };

    await admin.database().ref('/Notification').push(newNotification);
  });

  
  // Cloud function to insert a new passenger
export const insertPassenger = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return; // Ensure it returns void
  }

  // Get data from request body
  const { id, image } = req.body;

  if (!id || !image) {
    res.status(400).send("Missing required fields: id, image");
    return; // Ensure it returns void
  }

  // Set passenger data
  const passengerData = {
    id,
    image,
    entering_time: admin.firestore.Timestamp.now().toDate().toISOString(), // Get the current server time in ISO string format,
    related_bus: 15,
    status: "inside the bus", // Initial status
  };

  try {
    // Insert new passenger into Realtime Database under the "passengers" path
    await admin.database().ref(`/Passengers/${id}`).set(passengerData);
    res.status(200).send({ message: "Passenger added successfully", data: passengerData });
  } catch (error) {
    console.error("Error inserting passenger:", error);
    res.status(500).send("Error inserting passenger");
  }
});

export const insertNotification = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return; // Ensure it returns void
  }

  // Get data from request body
  const { title, body } = req.body;

  if (!title || !body) {
    res.status(400).send("Missing required fields: title, body");
    return; // Ensure it returns void
  }

  // Set notification data
  const notificationData = {
    time: admin.firestore.Timestamp.now().toDate().toISOString(), 
    title,
    body,
  };

  try {
    // Insert new notification into Realtime Database under the "notifications" path
    await admin.database().ref('/Notification').push(notificationData);
    res.status(200).send({ message: "Notification added successfully", data: notificationData });
  } catch (error) {
    console.error("Error inserting notification:", error);
    res.status(500).send("Error inserting notification");
  }
});