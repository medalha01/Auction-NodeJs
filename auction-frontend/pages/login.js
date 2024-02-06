import React, { useState } from 'react';
import styles from './Login.module.css'; // Import CSS module for styling
import { apiClient } from '../utils/api'; // Import the API client
import { useRouter } from 'next/router'; // Import the router

export default function Login() {
  // State hooks for form inputs and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useRouter(); // Hook for programmatic navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });
      const { token } = response.data;

      localStorage.setItem('token', token); // Store token in localStorage
      navigate('/dashboard'); // Navigate to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['login-container']}>
      <form onSubmit={handleLogin} className={styles['login-form']}>
        <div className={styles['form-group']}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className={styles['form-control']}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className={styles['form-control']}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className={styles['error-message']}>{error}</div>}
        <button type="submit" className={styles['login-button']} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <button type="button" onClick={() => navigate('/register')} className={styles['register-button']}>
          Register
        </button>
      </form>
    </div>
  );
}
