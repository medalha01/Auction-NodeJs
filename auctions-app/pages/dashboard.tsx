import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
  const [activeContent, setActiveContent] = useState('Content 1');
  const router = useRouter();

  const contentButtons = Array.from({ length: 10 }, (_, i) => `Button ${i + 1}`);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Assuming you're storing the token in localStorage
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: '1', background: '#f0f0f0' }}>
        {contentButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => setActiveContent(`Content ${index + 1}`)}
            style={{ display: 'block', width: '100%', padding: '10px' }}
          >
            {button}
          </button>
        ))}
        <button onClick={handleLogout} style={{ position: 'absolute', bottom: '20px', left: '0', width: '100%', padding: '10px' }}>
          Logout
        </button>
      </div>
      <div style={{ flex: '3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <h2>Main Interface</h2>
          <p>{activeContent}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
