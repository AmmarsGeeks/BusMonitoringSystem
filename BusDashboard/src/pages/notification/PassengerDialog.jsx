import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getDatabase, ref, onValue } from 'firebase/database';

const PassengerDialog = ({ visible, onClose, passengerID }) => {
  const [passengerData, setPassengerData] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(passengerID)

  useEffect(() => {
    if (visible && passengerID) {
      setLoading(true);
      const database = getDatabase();
      const passengerRef = ref(database, `Passengers/${passengerID}`);

      onValue(
        passengerRef,
        (snapshot) => {
          setPassengerData(snapshot.val());
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching passenger data:', error);
          setLoading(false);
        }
      );
    } else {
      setPassengerData(null); // Clear data when dialog is closed
    }
  }, [visible, passengerID]);

  return (
    <Dialog scroll="body" open={visible} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Passenger Details
        <IconButton aria-label="close" onClick={onClose} sx={{ color: 'gray' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : passengerData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Passenger ID"
              value={passengerData.ID || passengerID}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Entering Time"
              value={passengerData.entering_time || 'N/A'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Leaving Time"
              value={passengerData.leaving_time || 'N/A'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Related Bus"
              value={passengerData.related_bus || 'N/A'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Status"
              value={passengerData.status || 'N/A'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            {passengerData.image && (
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={passengerData.image}
                  alt="Passenger"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <p>No passenger data available.</p>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PassengerDialog;
