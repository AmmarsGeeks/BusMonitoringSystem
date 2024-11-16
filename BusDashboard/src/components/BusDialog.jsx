import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { database } from '../config/firebase';
import { ref, set } from 'firebase/database';
import Swal from 'sweetalert2';

const BusDialog = ({ visible, onClose, isEditing, initialValues,  isDelete , onDelete }) => {

  const form = useFormik({
    initialValues: initialValues || { busNumber: '', driver: '', capacity: '', time: '' },
    validationSchema: Yup.object({
      busNumber: Yup.string().required('Bus number is required'),
      driver: Yup.string().required('Driver name is required'),
      capacity: Yup.number()
        .required('Capacity is required')
        .positive('Capacity must be a positive number')
        .integer('Capacity must be an integer'),
      time: Yup.number()
        .required('Time is required')
        .positive('Time must be a positive number')
        .integer('Time must be an integer')
        .max(300, 'Time cannot exceed 300'),
    }),
    onSubmit: (values) => {
      const uniqueId = isEditing ? initialValues.id : generateUniqueId(); // Use existing ID for editing
      const busData = {
        busNumber: values.busNumber,
        driver: values.driver,
        capacity: values.capacity,
        time: values.time,
      };
  
      // Push data to Firebase Realtime Database
      set(ref(database, 'Buses/' + uniqueId), busData)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: isEditing ? 'Bus updated successfully!' : 'Bus added successfully!',
            confirmButtonText: 'Okay',
          });
          onClose(); // Close dialog after submission
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error saving bus: ' + error.message,
            confirmButtonText: 'Try Again',
          });
        });
    },
  });

  const generateUniqueId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 8; // Length of the unique ID
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  return (
    <Dialog scroll="body" open={visible} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Bus' : 'Add Bus'}
      </DialogTitle>
      <DialogContent>
      <TextField
  id="busNumber"
  label="Bus Number"
  fullWidth
  variant="outlined"
  onChange={form.handleChange}
  required
  inputProps={{ readOnly: isDelete }} // Set readOnly based on isDelete
  value={form.values.busNumber}
  error={form.touched.busNumber && !!form.errors.busNumber}
  onBlur={form.handleBlur}
  helperText={form.touched.busNumber ? form.errors.busNumber : ''}
  style={{ marginBottom: '16px' }}
/>
<TextField
  id="driver"
  label="Driver Name"
  fullWidth
  variant="outlined"
  onChange={form.handleChange}
  required
  inputProps={{ readOnly: isDelete }} // Set readOnly based on isDelete
  value={form.values.driver}
  error={form.touched.driver && !!form.errors.driver}
  onBlur={form.handleBlur}
  helperText={form.touched.driver ? form.errors.driver : ''}
  style={{ marginBottom: '16px' }}
/>
<TextField
  id="capacity"
  label="Capacity"
  fullWidth
  variant="outlined"
  onChange={form.handleChange}
  required
  inputProps={{ readOnly: isDelete }} // Set readOnly based on isDelete
  value={form.values.capacity}
  error={form.touched.capacity && !!form.errors.capacity}
  onBlur={form.handleBlur}
  helperText={form.touched.capacity ? form.errors.capacity : ''}
  style={{ marginBottom: '16px' }}
/>
  <TextField
    id="time"
    label="Trip Time In Seconds"
    fullWidth
    variant="outlined"
    onChange={form.handleChange}
    required
    inputProps={{ readOnly: isDelete }} 
    value={form.values.time}
    error={form.touched.time && !!form.errors.time}
    onBlur={form.handleBlur}
    helperText={form.touched.time ? form.errors.time : ''}
    style={{ marginBottom: '16px' }}
  />
      </DialogContent>
      <DialogActions>
  <Button variant="outlined" onClick={onClose}>
    Cancel
  </Button>

  {isDelete && (
  <Button variant="outlined" color="error" onClick={() => onDelete(initialValues.id)}>
      Delete
    </Button>
  )}

  {!isDelete && (
 <Button
 disabled={!form.isValid}
 variant="outlined"
 onClick={form.submitForm}>
 {isEditing ? 'Update' : 'Create'}
</Button>
  )}
 
</DialogActions>
    </Dialog>
  );
};

export default BusDialog;
