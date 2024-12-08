import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import "@/app/globals.css";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

function ConsumerLogin() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [confCode, setConfCode] = React.useState("");
  const [showBox, setShowBox] = React.useState(false);

  const [reservationData, setReservationData] = React.useState({
    restUUID: "",
    reservationUUID: "",
    restName: "Alice's Restaurant",
    restAddr: "Buy me a hot cocoa",
    reservationDateTime: dayjs(),
    reservationStartTime: 12,
    groupSize: 1,
  });

  const handleClick = () => {
    if (email === "" || confCode === "") {
      alert("Please fill in all fields");
      return;
    }

    fetchReservationData();

    if (reservationData.restName === "") {
      alert("No reservation found with the provided details");
      return;
    } else {
      setShowBox(true);
    }
  };

  const handleDelete = () => {
    cancelReservation();
  };

  // Fetch existing data on component mount
  const fetchReservationData = async () => {
    try {
      const response = await instance.post("/findReservation", {
        email: email,
        confCode: confCode,
      });
      const data = response.data.body ? JSON.parse(response.data.body) : {}; // Parse the response body as JSON if defined
      console.log("Data:", data);
      {
        const reservation = data.result[0]; // Assuming you want the first restaurant in the array
        const restInfo = data.restInfo[0];
        setReservationData({
          restUUID: reservation.restUUID,
          reservationUUID: reservation.reservationUUID,
          restName: restInfo.restName,
          restAddr: restInfo.address,
          reservationDateTime: dayjs(reservation.reservationDateTime),
          reservationStartTime: reservation.startTime,
          groupSize: reservation.groupSize,
        });
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  const cancelReservation = async () => {
    try {
      const response = await instance.post("/cancelReservation", {
        email: email,
        confCode: confCode,
      });

      console.log("Reservation cancelled:", response);
      alert("Reservation cancelled successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      alert("Failed to cancel reservation. Please try again later.");
    }
  };

  // --------------------------------

  return (
    <main className="flex min-h-screen flex-col items-center gap-24 p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>
      <h1>Find/Cancel Reservation</h1>
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

      {showBox && (
        <div className="centering-div div-horiz login-fields">
          <div className="m-4 p-2">
            <h2>{reservationData.restName}</h2>
            <p>{reservationData.restAddr}</p>
          </div>
          <div className="m-4 p-2">
            <h2>
              {reservationData.reservationDateTime.format("ddd DD/MM/YYYY")}
            </h2>
            <p>Time: {reservationData.reservationStartTime}:00 </p>
            <p>Group Size: {reservationData.groupSize}</p>
          </div>
          <button
            className="btn_primary m-4 p-1"
            onClick={() => handleDelete()}
          >
            <DeleteIcon />
          </button>
        </div>
      )}
    </main>
  );
}

export default ConsumerLogin;
