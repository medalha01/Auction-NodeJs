import { useState } from "react";
import axios from "axios";

// useRegister custom hook for encapsulating the registration logic
export const useRegister = (username: string, password: string) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT_AUTH}/register`,
        {
          username,
          password,
        }
      );

      const { userData } = response.data;
      // Consider secure storage options for the token
      localStorage.setItem("userData", userData);
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Registration failed. Please try again."); // Customize based on the error response
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, errorMessage, isLoading };
};
