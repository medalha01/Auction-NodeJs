// Importing necessary React hooks and other utilities
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

// Import CSS module for component-specific styling
import styles from './Register.module.css';

// Utilizing the environment variable for the API base URL in a secure manner
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Defining the Register functional component
const Register = () => {
  // State hook for form data management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State hook for managing form submission status and error messages
  const [formStatus, setFormStatus] = useState({
    isLoading: false,
    errorMessage: '',
  });

  // Next.js Router hook for programmatically navigating to other pages
  const router = useRouter();

  // Handler for input changes to update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setFormStatus({ isLoading: true, errorMessage: '' }); // Resetting form status before API call

    try {
      // Attempt to register the user with the provided form data
      await axios.post(`${API_BASE_URL}/auth/register`, formData);
      alert('Registration successful'); // Inform user of successful registration
      router.push('/login'); // Redirect user to login page
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error)
      setFormStatus({ isLoading: false, errorMessage: 'Registration failed. Please try again.' });
    }
  };

  // Rendering the registration form
  return (
    <div className={styles.container}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Input group for name */}
        <div className={styles.inputGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        {/* Input group for email */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* Input group for password */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {/* Display error message if any */}
        {formStatus.errorMessage && <p className={styles.error}>{formStatus.errorMessage}</p>}
        {/* Submit button */}
        <button type="submit" className={styles.button} disabled={formStatus.isLoading}>
          {formStatus.isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

// Prop Types validation for the Register component
Register.propTypes = {
  apiUrl: PropTypes.string.isRequired,
};

export default Register;
