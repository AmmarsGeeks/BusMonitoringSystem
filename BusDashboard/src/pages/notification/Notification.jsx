import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database'; // Firebase imports
import './Notification.css';
import { useCurrentUser } from '../../containers/UserAuthProvider';
import PassengerDialog from './PassengerDialog';

const Notification = () => {
  const [notification, setNotification] = useState({ 
    title: '', body: '', passengerID: '' , visible: false
   });
  const [lastNotificationTime, setLastNotificationTime] = useState(0); // Keep track of the last notification time
  const [modalVisible , setModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedId, setSelectedID] = useState(null);

  const handleCloseDialog = () => {
    setDialogVisible(false);
    setSelectedID(null);
  };



  const getCurrentDateTime = () => {
    const now = new Date();
    // Format the date and time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  let dateTimeNow = getCurrentDateTime();

  useEffect(() => {
    const db = getDatabase();
    const notificationsRef = ref(db, '/Notification');

    // Set up a listener for new notifications
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const notifications = snapshot.val();
      if (notifications) {
        const currentTimeString = getCurrentDateTime(); // Get the current time string
        const currentTime = new Date(currentTimeString).getTime(); // Convert to milliseconds

        const newNotifications = Object.keys(notifications)
          .map(key => notifications[key])
          .filter(notification => {
            const notificationTimeString = notification.time; // Get the notification time string
            const notificationTime = new Date(notificationTimeString).getTime(); // Convert to milliseconds
            const timeDifference = currentTime - notificationTime; // Calculate the difference in milliseconds
            const threeMinutesInMillis = 3 * 60 * 1000; // 3 minutes in milliseconds

            // Only keep notifications that are less than 3 minutes old
            return timeDifference < threeMinutesInMillis;
          });

        // If there are new notifications, update state
        if (newNotifications.length > 0) {
          const { title, body , passengerID  } = newNotifications[newNotifications.length - 1]; // Get the latest valid notification
          setNotification({
            title,
            body,
            passengerID,
            visible: true,
          });
        }
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []); // No dependency needed since we want this to run once when the component mounts

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };
  const { user } = useCurrentUser();

  const viewPassenger = (id) => {
    console.log("passed ID" , id)
    setNotification((prev) => ({ ...prev, visible: false }));
    setSelectedID(id);
    setDialogVisible(true);
  }

  return (
    <div>
    {user && (
      notification.visible && (
        <div className="notification-overlay">
          <div className="notification-container-danger">
            <div className="notification-content">
              <img
                src="https://img.icons8.com/color/96/error--v1.png" // Example danger icon
                alt="Danger Icon"
                className="notification-icon"
              />
              <p className="notification-title"><strong>{notification.title}</strong></p>
              <p className="notification-body">{notification.body}</p>
              <button onClick={() => {
                viewPassenger(notification.passengerID)
              }} className='btn_notification' > View Passenger </button>
              <button className="notification-close-button" onClick={closeNotification}>
                &times;
              </button>
            </div>
          </div>
        </div>
      )
    )}

     {/* Dialog to show full image */}
     <PassengerDialog
        visible={dialogVisible}
        onClose={handleCloseDialog}
        passengerID={selectedId}
      />
  </div>
  );
}

export default Notification;