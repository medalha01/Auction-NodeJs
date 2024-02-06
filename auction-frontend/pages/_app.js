// pages/_app.js

import '../styles/global.css';
import { AuthProvider } from '../utils/authContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
