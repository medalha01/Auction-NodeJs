import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProtectedPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // If not authenticated, redirect to login
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      {/* Protected content goes here */}
    </div>
  );
};

export default ProtectedPage;
