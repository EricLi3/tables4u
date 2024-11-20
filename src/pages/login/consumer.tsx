import React from "react";
import Link from "next/link";

import "@/app/globals.css";
import TextField from "@mui/material/TextField";

function ConsumerLogin() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <div className="centering-div login-fields">
        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Your Email"
        />

        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Confirmation Code"
        />

        <Link href="/findReservation">
          <button className="btn_secondary">Find Reservation</button>
        </Link>
      </div>
    </main>
  );
}

export default ConsumerLogin;
