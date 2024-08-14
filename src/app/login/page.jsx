"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handlerSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const res = await signIn("credentials", {
        username,password,redirect: false
      })
      if (res.error) {
        setError("Invalid credentials");
        return
      }

      router.replace("dashboard");

    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Navbar />
      <div className="flex items-center justify-center flex-1 px-4 py-8">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handlerSubmit}>
            {error && (
              <div className="bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
             
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
