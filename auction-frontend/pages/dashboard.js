import React from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();

  // Simulate checking for authentication (e.g., checking for a token)
  // This is a simplistic approach; you may want to use a more robust method.
React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/');
    }
}, [router]);

return (
    <div>
        <h1>Welcome to the Dashboard</h1>
        <p>This is a protected area of the app. You&apos;re logged in!</p>
    </div>
);
};

export default Dashboard;
