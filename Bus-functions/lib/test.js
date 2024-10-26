"use strict";
// function sendFcmMessage(fcmMessage) {
//     getAccessToken().then(function(accessToken) {
//       const options = {
//         hostname: HOST,
//         path: PATH,
//         method: 'POST',
//         // [START use_access_token]
//         headers: {
//           'Authorization': 'Bearer ' + accessToken
//         }
//         // [END use_access_token]
//       };
//       const request = https.request(options, function(resp) {
//         resp.setEncoding('utf8');
//         resp.on('data', function(data) {
//           console.log('Message sent to Firebase for delivery, response:');
//           console.log(data);
//         });
//       });
//       request.on('error', function(err) {
//         console.log('Unable to send message to Firebase');
//         console.log(err);
//       });
//       request.write(JSON.stringify(fcmMessage));
//       request.end();
//     });
//   }
//   /**
//    * Construct a JSON object that will be used to customize
//    * the messages sent to iOS and Android devices.
//    */
//   function buildOverrideMessage() {
//     const fcmMessage = buildCommonMessage();
//     const apnsOverride = {
//       'payload': {
//         'aps': {
//           'badge': 1
//         }
//       },
//       'headers': {
//         'apns-priority': '10'
//       }
//     };
//     const androidOverride = {
//       'notification': {
//         'click_action': 'android.intent.action.MAIN'
//       }
//     };
//     fcmMessage['message']['android'] = androidOverride;
//     fcmMessage['message']['apns'] = apnsOverride;
//     return fcmMessage;
//   }
//   /**
//    * Construct a JSON object that will be used to define the
//    * common parts of a notification message that will be sent
//    * to any app instance subscribed to the news topic.
//    */
//   function buildCommonMessage() {
//     return {
//       'message': {
//         'topic': 'news',
//         'notification': {
//           'title': 'FCM Notification',
//           'body': 'Notification from FCM'
//         }
//       }
//     };
//   }
//   const message = process.argv[2];
//   if (message && message == 'common-message') {
//     const commonMessage = buildCommonMessage();
//     console.log('FCM request body for message using common notification object:');
//     console.log(JSON.stringify(commonMessage, null, 2));
//     sendFcmMessage(buildCommonMessage());
//   } else if (message && message == 'override-message') {
//     const overrideMessage = buildOverrideMessage();
//     console.log('FCM request body for override message:');
//     console.log(JSON.stringify(overrideMessage, null, 2));
//     sendFcmMessage(buildOverrideMessage());
//   } else {
//     console.log('Invalid command. Please use one of the following:\n'
//         + 'node index.js common-message\n'
//         + 'node index.js override-message');
//   }
//# sourceMappingURL=test.js.map