import { Box, Button, TextField, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ViewAgenda } from "@mui/icons-material";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database"; // If using Firebase
import EnteranceDialog from "./EnteranceDialog";

const Enterance = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [busStatusFilter, setBusStatusFilter] = useState(""); // "inside" or "outside"
  const [busNumberFilter, setBusNumberFilter] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetching data from Firebase
  useEffect(() => {
    const database = getDatabase();
    const entranceRef = ref(database, "Passengers");

    onValue(entranceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedRows = Object.keys(data).map((key) => ({
          id: key,
          related_bus: data[key].related_bus,
          entering_time: data[key].entering_time,
          status: data[key].status, // "inside" or "outside"
          leaving_time: data[key].leaving_time || "N/A",
          image: data[key].image,
        }));
        setRows(formattedRows);
        setFilteredRows(formattedRows); // Initialize filteredRows
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

  // Filter rows based on bus status and number
  useEffect(() => {
    const filtered = rows.filter((row) => {
      const matchesStatus = busStatusFilter
        ? row.status === busStatusFilter
        : true;
      const matchesBusNumber = busNumberFilter
        ? row.related_bus === busNumberFilter
        : true;
      return matchesStatus && matchesBusNumber;
    });
    setFilteredRows(filtered);
  }, [busStatusFilter, busNumberFilter, rows]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "related_bus", headerName: "Related Bus", flex: 1 },
    { field: "entering_time", headerName: "Entering Time", flex: 1 },
    { field: "leaving_time", headerName: "Leaving Time", flex: 1 },
    { field: "status", headerName: "Entrance Status", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <img src={params.value} alt="Passenger" style={{ width: "40px", height: "40px" }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ViewAgenda />}
            onClick={() => handleView(params.row)}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Header title="Entrance" subTitle="List of Entrance" />
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Entrance Status"
          select
          value={busStatusFilter}
          onChange={(e) => setBusStatusFilter(e.target.value)}
          fullWidth
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="inside the bus">Inside</MenuItem>
          <MenuItem value="outside the bus">Outside</MenuItem>
        </TextField>

        <TextField
          label="Bus Number"
          value={busNumberFilter}
          onChange={(e) => setBusNumberFilter(e.target.value)}
          fullWidth
        />
      </Box>
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          rows={filteredRows}
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
