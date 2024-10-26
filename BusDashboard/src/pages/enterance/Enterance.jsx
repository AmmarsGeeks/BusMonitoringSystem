import {  Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit, ViewAgenda } from "@mui/icons-material";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database"; // If using Firebase
import EnteranceDialog from "./EnteranceDialog";

// const columns = [
//   { field: "id", headerName: "ID", flex: 1 },
//   { field: "related_bus", headerName: "Related Bus", flex: 1 },
//   { field: "entering_time", headerName: "Entering Time", flex: 1 },
//   { field: "leaving_time", headerName: "Leaving Time", flex: 1 },
//   {
//     field: "image",
//     headerName: "Image",
//     flex: 1,
//     renderCell: (params) => (
//       <img src={params.value} alt="Passenger" style={{ width: '40px', height: '40px' }} />
//     ),
//   },
//   {
//     field: "actions",
//     headerName: "Actions",
//     width: 250,
//     align: "center",
//     headerAlign: "center",
//     renderCell: (params) => {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//           <Button
//             variant="contained"
//             color="primary"
//             size="small"
//             startIcon={<ViewAgenda />}
//             onClick={() => handleView(params.row)}
//           >
//             View
//           </Button>
//         </Box>
//       );
//     },
//   },
// ];



const Enterance = () => {
  const [rows, setRows] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetching data from Firebase (already in your code)
  useEffect(() => {
    const database = getDatabase();
    const entranceRef = ref(database, 'Passengers'); 

    onValue(entranceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedRows = Object.keys(data).map((key, index) => ({
          id: key,
          related_bus: data[key].related_bus,
          entering_time: data[key].entering_time,
          leaving_time: data[key].leaving_time || "N/A",
          image: data[key].image,
        }));
        setRows(formattedRows);
      }
    });
  }, []);

  // Function to handle "View" button click
  const handleView = (row) => {
    setSelectedImage(row.image);
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    setSelectedImage(null);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "related_bus", headerName: "Related Bus", flex: 1 },
    { field: "entering_time", headerName: "Entering Time", flex: 1 },
    { field: "leaving_time", headerName: "Leaving Time", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <img src={params.value} alt="Passenger" style={{ width: '40px', height: '40px' }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ViewAgenda />}
              onClick={() => handleView(params.row)} // Pass the selected row's data
            >
              View
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Header title="Entrance" subTitle="List of Entrance" />
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{ toolbar: GridToolbar }}
          rows={rows}
          columns={columns}
          autoHeight
          disableSelectionOnClick
        />
      </Box>

      {/* Dialog to show full image */}
      <EnteranceDialog
        visible={dialogVisible}
        onClose={handleCloseDialog}
        imageUrl={selectedImage}
      />
    </Box>
  );
};

export default Enterance;