import React from "react";
import Link from "next/link";

import "@/app/globals.css";
import TextField from "@mui/material/TextField";
import { Label } from "@mui/icons-material";

import axios from "axios";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});
// Function to create a reservation(reservationUUID, restUUID, benchUUID, reservationDateTime, startTime, email, confirmationCode, groupSize)
const createReservation = async (reservation_uuid: string, rest_uuid: string,
  bench_uuid: string, reservation_date_time: string, start_time: number,
  e_mail: string, confirmation_code: string, group_size: number) => {

  try {
    const response = await instance.post("/makeReservation", {
      // Add any necessary data for the reservation here
      reservation_uuid, rest_uuid, bench_uuid, reservation_date_time, start_time, e_mail, confirmation_code, group_size
    });
    console.log("Reservation created:", response.data);
    // alert("Reservation created successfully! \nConfirmation code: ");
  } catch (error) {
    console.error("Failed to create reservation:", error);
    alert("Failed to create reservation. Please try again later.");
  }
};
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


        
        <button
          onClick={() => {
            const reservationUUID = "example-reservation-uuid";
            const restUUID = "example-rest-uuid";
            const benchUUID = "example-bench-uuid";
            const reservationDateTime = "2023-10-10T18:00:00Z";
            const startTime = 18;
            const email = "example@example.com";
            const confirmationCode = "example-confirmation-code";
            const groupSize = 4;

            createReservation(
              reservationUUID,
              restUUID,
              benchUUID,
              reservationDateTime,
              startTime,
              email,
              confirmationCode,
              groupSize
            );
          }}
        >
          Confirm Reservation
        </button>
      </div>
    </main>
  );
}

export default ConsumerLogin;
