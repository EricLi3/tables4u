import React from "react";
import Link from "next/link";

import "@/app/globals.css";
import TextField from "@mui/material/TextField";

function AdminLogin() {
  return (
    <main className="flex  w-screen h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>
      
      <div className="centering-div login-fields">
        <img src="../admin.png" alt="Admin Icon" className="loginImg" />

        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Admin Username"
        />

        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Password"
        />

        <Link href="/admin">
          <button className="btn_secondary">Login</button>
        </Link>
      </div>
    </main>
  );
}

export default AdminLogin;
