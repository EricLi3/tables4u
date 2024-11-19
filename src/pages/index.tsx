"use client";

import React from "react";
import Link from "next/link";
import "@/app/globals.css";
import RestaurantTable from "@/app/components/RestaurantTable";

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

      <div className="loginNav">
        <nav>

              <Link href="/login/admin">Admin Login
              <img src="admin.png" alt="Admin Login Button" className="loginImg" /></Link>

              <Link href="/login/manager">Manager Login
              <img src="manager.png" alt="Manager Login Button" className="loginImg" />
              </Link>

              <Link href="/login/consumer">Find Reservation</Link>

        </nav>

        <Link href="/createRestaurant">
          <button className="btn_dark inline-block">Create Restaurant</button>
        </Link>
      </div>
    </main>
  );
}
