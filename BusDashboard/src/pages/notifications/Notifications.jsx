import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database"; // If using Firebase

// Define columns for the data grid
const columns = [
  { field: "id", headerName: "ID", flex: 0.5 }, // Reduced flex for a smaller ID column
  { field: "title", headerName: "Title", flex: 1 },
  // { field: "body", headerName: "Description", flex: 2 }, // Added description column
  { field: "time", headerName: "Time", flex: 2 }, // Added description column
];

const Notifications = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const database = getDatabase();
    const notificationsRef = ref(database, 'Notification'); // Modify 'notifications' to your actual database path

    // Firebase listener to fetch notifications
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedRows = Object.keys(data).map((key) => ({
          id: key, // Assuming each notification has a unique key
          title: data[key].title,
          // description: data[key].body || "No description", // Fallback if no description
          time: data[key].timestamp || data[key].time, // Ensure timestamp is formatted
        }));
        setRows(formattedRows);
      }
    });
  }, []); // Fetch once on mount

  return (
    <Box>
      <Header title="Notifications" subTitle="List of Notifications" />
      <Box sx={{ height: 650, mx: "auto" }}>
        <DataGrid
          checkboxSelection
          slots={{ toolbar: GridToolbar }}
          rows={rows}
          columns={columns}
          autoHeight
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Notifications;
