import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useRegister } from './hooks/register'; // Custom hook for registration logic
import styles from '../styles/RegisterPage.module.css'; // Import the CSS module

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { handleRegister, errorMessage, isLoading } = useRegister(username, password);
  const router = useRouter();

  return (
    <div className={styles['register-page-container']}>
      <button onClick={() => router.back()} className={styles['back-button']}>
        ← Back to Login
      </button>
      <form onSubmit={handleRegister} className={styles['register-form']}>
        <div className={styles['form-group']}>
          <label htmlFor="username">E-mail:</label>
          <input
            id="username"
            type="text"
            value={username}
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
            className={styles['input']} // If you have specific styles for inputs
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles['input']} // If you have specific styles for inputs
          />
        </div>
        {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}
        <button type="submit" disabled={isLoading} className={styles['submit-button']}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
