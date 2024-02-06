import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
 
// Import other pages

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Define other routes */}
    </Routes>
  );
}

export default App;
