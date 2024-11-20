"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import "@/app/globals.css";
import RestaurantTable from "@/app/components/RestaurantTable";

export default function Home() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between p-24">

      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <div className="table">
        <h1>Tables4u</h1>
        <br></br>
        <RestaurantTable />
      </div>

      <div className="loginNav">
        <nav>
          <ul>
            <li>
              <Link href="/login/admin">Admin Login</Link>
            </li>
            <li>
              <Link href="/login/manager">Manager Login</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="createRest">
        <Link href="/createRest/manager" passHref>
          <Button
            variant="contained"
            color="warning">
            Create Restaurant
          </Button>
        </Link>
      </div>


      <div className="findAndCancel">
        <Button
          variant="contained"
          color="secondary">
          Find Reservation
        </Button>
        <br></br>
        <Button
          variant="contained"
          color="error">
          Cancel Reservation
        </Button>
      </div>
    </main>
  );
}
