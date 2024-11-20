"use client";

import React from "react";
import Link from "next/link";
import "@/app/globals.css";
import RestaurantTable from "@/app/components/RestaurantTable";
import MenuIcon from "@mui/icons-material/Menu";

export default function Home() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <div className="table">
        <h1>Tables4u</h1>
        <RestaurantTable />
      </div>

      <div className="loginNav centering-div">
        <div className="centering-div div-horiz">
          <Link href="/login/admin">
            <img
              src="admin.png"
              alt="Admin Login Button"
              className="loginImg"
            />
            <div className="icon-center">
              <MenuIcon />
            </div>
          </Link>

          <Link href="/login/manager">
            <img
              src="manager.png"
              alt="Manager Login Button"
              className="loginImg"
            />
            <div className="icon-center">
              <MenuIcon />
            </div>
          </Link>
        </div>
        <Link href="/login/consumer">Find Reservation</Link>
        <Link href="/createRestaurant">
          <button className="btn_dark">Create Restaurant</button>
        </Link>
      </div>
    </main>
  );
}
