import React, { useState, useCallback, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { useTheme, Box, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Header from "../../components/Header";
import BusDialog from "../../components/BusDialog";
import { database } from '../../config/firebase';
import { ref, onValue, remove } from 'firebase/database'; // Import remove for delete functionality
import Swal from 'sweetalert2';


const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const closeSetupDialog = useCallback(() => {
    setShowAddDialog(false);
    setEditData(null);
    setDeleteData(null);
  }, []);

  useEffect(() => {
    const busesRef = ref(database, 'Buses/');
    onValue(busesRef, (snapshot) => {
      const data = snapshot.val();
      const busesArray = [];
      for (let id in data) {
        busesArray.push({ id, ...data[id] });
      }
      setBuses(busesArray);
    });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 150, align: "center", headerAlign: "center" },
    { field: "busNumber", headerName: "Bus Number", width: 150, align: "center", headerAlign: "center" },
    { field: "driver", headerName: "Driver", width: 250, align: "center", headerAlign: "center" },
    { field: "capacity", headerName: "Capacity", width: 190, align: "center", headerAlign: "center" },
    { field: "time", headerName: "Trip Time In Seconds", width: 190, align: "center", headerAlign: "center" },
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
              startIcon={<Edit />}
              onClick={() => handleEdit(params.row)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<Delete />}
              onClick={() => handleDelete(params.row)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleEdit = (row) => {
    setEditData(row);
    setShowAddDialog(true);
  };

  const handleDelete = (row) => {
    setDeleteData(row)
    setShowAddDialog(true);
  };

  const deleteBus = (id) => {
    // Ensure id is a string
    if (typeof id !== 'string') {
      console.error('Invalid ID:', id);
      return; // Handle the error appropriately
    }
  
    const busRef = ref(database, 'Buses/' + id);
    remove(busRef)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Bus deleted successfully!',
          confirmButtonText: 'Okay',
        });
        closeSetupDialog(); // Close the dialog after deletion
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error deleting bus: ' + error.message,
          confirmButtonText: 'Try Again',
        });
      });
  };

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Header title={"Buses"} subTitle={"Managing the Bus Information"} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAddDialog(true)}
          >
            Add New Bus
          </Button>
        </Box>

        <Box sx={{ height: 600, mx: "auto" }}>
          <DataGrid
            rows={buses}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Box>
      </Box>

          {showAddDialog && (
      <BusDialog
        visible
        onClose={closeSetupDialog}
        isEditing={!!editData}
        isDelete={!!deleteData}
        initialValues={editData || deleteData }
        onDelete={deleteBus} 
      />
    )}
    </>
  );
};

export default Buses;
