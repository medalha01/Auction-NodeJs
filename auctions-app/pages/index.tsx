import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect users to the login page
    router.push('/login');
  }, [router]);

  return null; // Or a loading indicator while redirecting
};

export default Home;
