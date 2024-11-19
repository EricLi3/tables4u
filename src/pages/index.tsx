"use client";

import React from "react";
import Link from "next/link";
import '@/app/globals.css';
import RestaurantTable from "@/app/components/RestaurantTable";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="top-left-container">
        <Link href="/">
          <button className="top-left-button">
            <img src="logo.png" alt="Home Button" className="logo" />
          </button>
        </Link>
        <div className="loginNav">
          <nav>
            <ul>
              <li><Link href="/login/admin">Admin Login</Link></li>
              <li><Link href="/login/manager">Manager Login</Link></li>
              <li><Link href="/login/consumer">Consumer Login</Link></li>
            </ul>
          </nav>
        </div>

        <h1>Tables4u</h1>
        <RestaurantTable />
      </div>
    </main>
  );
}