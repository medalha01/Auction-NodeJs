import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Custom hook for encapsulating the login logic
export const useLogin = (email: string, password: string) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT_AUTH}/login`,
        {
          email,
          password,
        }
      );

      const { payload } = response.data;

      localStorage.setItem("userPayload", payload);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, errorMessage, isLoading };
};
