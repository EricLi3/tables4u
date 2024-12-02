import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import "@/app/globals.css";
import TextField from "@mui/material/TextField";

function ConsumerLogin() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [confCode, setConfCode] = React.useState("");

  const handleClick = () => {
    if (email === "" || confCode === "") {
      alert("Please fill in all fields");
      return;
    }
    router.push("/findReservation?email=" + email + "&confCode=" + confCode);
  };

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Confirmation Code"
          value={confCode}
          onChange={(e) => setConfCode(e.target.value)}
        />

        <button className="btn_secondary" onClick={() => handleClick()}>
          Find Reservation
        </button>
      </div>
    </main>
  );
}

export default ConsumerLogin;
