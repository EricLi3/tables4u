import React from "react";
import Link from "next/link";

import '@/app/globals.css';

function AdminLogin() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/">
        <button className="top-left-button">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </button>
      </Link>

      <h1>Tables4u - Admin Login Page</h1>
      <nav>
        <ul>
          {/* <li><Link href="/login/admin">Admin Login</Link></li>
          <li><Link href="/login/manager">Manager Login</Link></li>
          <li><Link href="/login/consumer">Consumer Login</Link></li> */}
        </ul>
      </nav>
    </main>
  );
}

export default AdminLogin;
