// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCMzIhuKv2MtyKUw06dxhahf8YhhtzlGWM",
  authDomain: "buspassengermonitoring.firebaseapp.com",
  projectId: "buspassengermonitoring",
  storageBucket: "buspassengermonitoring.appspot.com",
  messagingSenderId: "463068539519",
  appId: "1:463068539519:web:44b70dd13efbb65ef7ad4a",
  measurementId: "G-3X83ZE0GZ5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
