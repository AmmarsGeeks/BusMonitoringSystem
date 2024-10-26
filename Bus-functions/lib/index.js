"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertNotification = exports.insertPassenger = exports.onInsertNewPassenger = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require(path.resolve(__dirname, '../credentials/service-account-file.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "buspassengermonitoring",
    databaseURL: "https://buspassengermonitoring-default-rtdb.firebaseio.com"
});
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.onInsertNewPassenger = functions
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
        time: admin.firestore.Timestamp.now().toDate().toISOString(),
        title: 'Passenger Still Inside The Bus',
        body: notificationMessage
    };
    await admin.database().ref('/Notification').push(newNotification);
});
// Cloud function to insert a new passenger
exports.insertPassenger = functions.https.onRequest(async (req, res) => {
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
        entering_time: admin.firestore.Timestamp.now().toDate().toISOString(),
        related_bus: 10,
        status: "inside the bus", // Initial status
    };
    try {
        // Insert new passenger into Realtime Database under the "passengers" path
        await admin.database().ref(`/Passengers/${id}`).set(passengerData);
        res.status(200).send({ message: "Passenger added successfully", data: passengerData });
    }
    catch (error) {
        console.error("Error inserting passenger:", error);
        res.status(500).send("Error inserting passenger");
    }
});
exports.insertNotification = functions.https.onRequest(async (req, res) => {
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
    }
    catch (error) {
        console.error("Error inserting notification:", error);
        res.status(500).send("Error inserting notification");
    }
});
//# sourceMappingURL=index.js.map