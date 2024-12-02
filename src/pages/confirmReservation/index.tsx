import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import "@/app/globals.css";
import TextField from "@mui/material/TextField";

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
const getRestaurantInfo = async (rest_uuid: string) => {
  try {
    const response = await instance.post("/rest", { rest_uuid });
    console.log("Restaurant info:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get restaurant info:", error);
  }
};

function ConfirmReservation() {
  const router = useRouter();
  const restUUID = router.query.restUUID as string;

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      if (!restUUID) return;

      try {
        const response = await getRestaurantInfo(restUUID);
        const body = response.body;
        const data = body ? JSON.parse(body) : {};

        if (data.restaurant && Array.isArray(data.restaurant) && data.restaurant.length > 0) {
          const restaurant = data.restaurant[0];
          setRestaurantInfo({
            name: restaurant.restName || "",
            address: restaurant.address || "",
          });
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching restaurant info:", error);
      }
    };

    fetchRestaurantInfo();
  }, [restUUID]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <div className="centering-div login-fields">
        <h1>{restaurantInfo.name}</h1>
        <p>{restaurantInfo.address}</p>
        <p>Day: {router.query.reservationDate}</p>
        <p>Time: {router.query.reservationTime}</p>
        <p>Table Size <b>(TO CHANGE)</b>: {router.query.tableSize}</p>
        <p>Group Size: {router.query.numberOfPeople}</p>

        <br></br>

        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Your Email"
        />


        <br></br>

        <div className="cancelAndConfirmButtons">
          <button className="btn_secondary"
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
            Reserve
          </button>
          <span style={{ margin: "0 10px" }}></span>
          <button className="btn_primary"
            onClick={() => {

            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}

export default ConfirmReservation;
