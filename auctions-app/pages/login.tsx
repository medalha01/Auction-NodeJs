import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useLogin } from './hooks/login'; // Custom hook for login logic
import styles from '../styles/LoginPage.module.css'; // Import CSS module

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { handleLogin, errorMessage, isLoading } = useLogin(username, password); // Using the custom hook

  const router = useRouter();

  return (
    <div className={styles['login-page-container']}>
      <form onSubmit={handleLogin} className={styles['login-form']}>
        <div className={styles['form-group']}>
          <label htmlFor="username" className={styles['form-group-label']}>E-Mail:</label>
          <input
            id="username"
            type="text"
            value={username}
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
            className={styles['form-group-input']}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password" className={styles['form-group-label']}>Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles['form-group-input']}
          />
        </div>
        {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}
        <button type="submit" disabled={isLoading} className={styles['login-button']}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        <button type="button" onClick={() => router.push('/register')} className={styles['register-button']}>
          Register
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
