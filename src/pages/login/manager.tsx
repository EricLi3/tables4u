import React from "react";
import Link from "next/link";
import { Box, Button } from "@mui/material";

import '@/app/globals.css';
import TextField from "@mui/material/TextField";

function ManagerLogin() {

  return (
    <main className="flex  w-screen h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>
      
      <div className="centering-div login-fields">
        <img src="../manager.png" alt="Manager Icon" className="loginImg" />

        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Manager Username"
        />

        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Password"
        />

        <Link href="/manager">
          <button className="btn_secondary">Login</button>
        </Link>
      </div>
    </main>
  );

}

export default ManagerLogin;
