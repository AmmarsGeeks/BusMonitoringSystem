import { Stack, useTheme } from "@mui/material";
import Card from "./Card";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"; // Icon for buses
import PersonIcon from "@mui/icons-material/Person"; // Icon for entrances
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database"; // Firebase imports
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventSeatIcon from '@mui/icons-material/EventSeat';


const Row1 = () => {
  const theme = useTheme();
  const [busesCount, setBusesCount] = useState(0);
  const [entrancesCount, setEntrancesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const database = getDatabase();

    // Fetching Buses Count
    const busesRef = ref(database, 'Buses'); // Modify path as needed
    onValue(busesRef, (snapshot) => {
      const busesData = snapshot.val();
      setBusesCount(busesData ? Object.keys(busesData).length : 0);
    });

    // Fetching Entrances Count
    const entrancesRef = ref(database, 'Passengers'); // Modify path as needed
    onValue(entrancesRef, (snapshot) => {
      const entrancesData = snapshot.val();
      setEntrancesCount(entrancesData ? Object.keys(entrancesData).length : 0);
    });

    // Fetching Notifications Count
    const notificationsRef = ref(database, 'notifications'); // Modify path as needed
    onValue(notificationsRef, (snapshot) => {
      const notificationsData = snapshot.val();
      setNotificationsCount(notificationsData ? Object.keys(notificationsData).length : 0);
    });

  }, []); // Empty dependency array to fetch once on mount

  // Data variables dynamically populated based on counts
  const data1 = [ // Data for Total Buses
    {
      id: "buses",
      label: "Buses",
      value: busesCount, // Use dynamic count
      color: "hsl(120, 90%, 50%)", // Green color for buses
    },
    {
      id: "total",
      label: "Total",
      value: busesCount + 80, // Example total value for context (modify as necessary)
      color: "hsl(120, 90%, 90%)", // Light green for overall total
    },
  ];

  const data2 = [ // Data for Total Entrances
    {
      id: "entrances",
      label: "Entrances",
      value: entrancesCount, // Use dynamic count
      color: "hsl(240, 90%, 50%)", // Blue color for entrances
    },
    {
      id: "total",
      label: "Total",
      value: entrancesCount + 250, // Example total value for context (modify as necessary)
      color: "hsl(240, 90%, 90%)", // Light blue for overall total
    },
  ];

  const data3 = [ // Data for Notifications Sent
    {
      id: "notifications",
      label: "Notifications",
      value: notificationsCount, // Use dynamic count
      color: "hsl(60, 90%, 50%)", // Yellow color for notifications
    },
    {
      id: "total",
      label: "Total",
      value: notificationsCount + 1000, // Example total value for context (modify as necessary)
      color: "hsl(60, 90%, 90%)", // Light yellow for overall total
    },
  ];

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={1}
      justifyContent={{ xs: "center", sm: "space-between" }}
    >
      <Card
        icon={
          <DirectionsBusIcon
            sx={{ fontSize: "23px", color: theme.palette.info.light }} 
          />
        }
        title={busesCount.toString()} // Dynamic total buses count
        subTitle={"Total Buses"}
        // increase={"+5%"} // Change this to reflect actual increase
        data={data1} 
        scheme={"nivo"} 
      />

      <Card
        icon={
          <EventSeatIcon
            sx={{ fontSize: "23px", color: theme.palette.info.light }} 
          />
        }
        title={entrancesCount.toString()} // Dynamic total entrances count
        subTitle={"Total Entrances"}
        // increase={"+10%"} // Change this to reflect actual increase
        data={data2} 
        scheme={"category10"} 
      />

      <Card
        icon={
          <NotificationsIcon
            sx={{ fontSize: "23px", color: theme.palette.info.light }} 
          />
        }
        title={notificationsCount.toString()} // Dynamic total notifications count
        subTitle={"Notifications Sent"}
        // increase={"+20%"} // Change this to reflect actual increase
        data={data3} 
        scheme={"accent"} 
      />
    </Stack>
  );
};

export default Row1;
