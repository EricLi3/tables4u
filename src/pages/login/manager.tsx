import React, { useState } from "react";
import Link from "next/link";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router"; // For redirection after login

import "@/app/globals.css";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

function ManagerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input fields
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Send login request to the backend API
      const response = await instance.post("/authManager", { username, password });

      // Parse the 'body' string to convert it into an object
      const body = JSON.parse(response.data.body);

      // Check if the response contains a valid token
      if (body && body.token && body.restUUID) {
        const { token, restUUID } = body;
        console.log(token); // Log the token to check
        console.log("restUUID:", restUUID); // Log the restUUID to check

        // Store the JWT token in localStorage
        sessionStorage.setItem("jwtToken", token);

        // Redirect to the admin dashboard page with restUUID as a query parameter
        router.push({
          pathname: "/editRest",
          query: { restUUID },
        });
      } else {
        setError("Invalid login credentials");
      }
    } catch (error) {
      console.error("Failed to fetch JWT:", error);
      setError("Failed to fetch JWT. Please try again later.");
    }
  };

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <div className="centering-div login-fields">
        <img src="../manager.png" alt="Manager Icon" className="loginImg" />

        <form onSubmit={handleLogin} className="flex flex-col items-center">
          <TextField
            required
            id="username"
            color="secondary"
            label="Manager Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />

          <TextField
            required
            id="password"
            type="password"
            color="secondary"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />

          {error && (
            <Typography color="error" className="mb-4">
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" color="secondary">
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}

export default ManagerLogin;
