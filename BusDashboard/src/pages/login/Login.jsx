import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import this if you're using Firebase for authentication
import { auth } from "../../config/firebase"; 


const Login = () => {
  const [loading, setLoading] = useState(false);

  // Validation Schema
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required'),
  });

  // Formik Hook
  const form = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async () => {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, form.values.email, form.values.password);
        setLoading(false);
        navigate('/');
      } catch (e) {
        setLoading(false);
        form.setFieldError('email', 'Invalid email or password');
        console.log(e);
      }
    },
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "80vh", gap: 2 }}
    >
      {/* Logo */}
      {/* <Box sx={{ mb: 2 }}>
        <img
          src="/path/to/logo.png"
          alt="Logo"
          style={{ width: "100px", height: "100px" }}
        />
      </Box> */}

      {/* Headline */}
      <h1>Login</h1>

      {/* Login Form */}
      <Box
        component="form"
        onSubmit={form.handleSubmit}
        sx={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 3 }}
      >
        <TextField
          label="Email"
          variant="filled"
          name="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.email && Boolean(form.errors.email)}
          helperText={form.touched.email && form.errors.email}
        />

        <TextField
          label="Password"
          variant="filled"
          name="password"
          type="password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.password && Boolean(form.errors.password)}
          helperText={form.touched.password && form.errors.password}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          sx={{ textTransform: "capitalize" }}
          disabled={loading} // Disable button during loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
