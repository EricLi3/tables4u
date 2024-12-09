import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

import "@/app/globals.css";
import TextField from "@mui/material/TextField";
import CustomDialog from "@/app/components/CustomDialog";

import axios from "axios";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

const findOpenTable = async (rest_uuid: string, group_size: string, start_time: number, end_time: number) => {
  try {
    const response = await instance.post("/findTable", { rest_uuid, group_size, start_time, end_time });
    console.log("Open table found:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to find open table:", error);
  }
};


const generateConfirmationCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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
  // Function to create a reservation (reservationUUID, restUUID, benchUUID, reservationDateTime, startTime, email, confirmationCode, groupSize)
  const createReservation = async (
    resev_uuid: string,
    rest_uuid: string,
    bench_uuid: string,
    reservation_date_time: string,
    start_time: number,
    email: string,
    confirmation_code: string,
    group_size: number
  ) => {
    try {
      const response = await instance.post("/makeReservation", {
        resev_uuid,
        rest_uuid,
        bench_uuid,
        reservation_date_time,
        start_time,
        email,
        confirmation_code,
        group_size,
      });
      console.log("Reservation created:", response.data);
      setConfirmationCode(confirmation_code);
      setOpenDialog(true);
    } catch (error) {
      console.error("Failed to create reservation:", error);
      alert("Failed to create reservation. Please try again later.");
    }
  };

  const router = useRouter();
  const restUUID = router.query.restUUID as string;

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmation_code, setConfirmationCode] = useState("");

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    address: "",
  });

  const [email, setEmail] = useState("");
  const [reservationDateTime, setReservationDateTime] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      if (!restUUID) return;

      try {
        const response = await getRestaurantInfo(restUUID);
        const body = response.body;
        const data = body ? JSON.parse(body) : {};

        if (
          data.restaurant &&
          Array.isArray(data.restaurant) &&
          data.restaurant.length > 0
        ) {
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

  useEffect(() => {
    // const reservationDate = router.query.reservationDate as string;
    // const reservationTime = router.query.reservationTime as string;
    const urlParams = new URLSearchParams(window.location.search);
    const reservationDate = urlParams.get('reservationDate');
    console.log("reservationDate: ", reservationDate);
    const selectedTime = urlParams.get('selectedTime');
    console.log("selectedTime: ", selectedTime);

    if (reservationDate && selectedTime) {
      const formattedReservationDate = dayjs(reservationDate).format("DD-MM-YYYY");
      setReservationDateTime(`${formattedReservationDate}`);
      setStartTime(parseInt(selectedTime, 10));
    }
  }, [router.query.reservationDate, router.query.reservationTime]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <CustomDialog isOpen={openDialog} onClose={() => { setOpenDialog(false); router.push("/"); }}>
        <div className="centering-div">
          <h1>Reservation created successfully!</h1>
          <h2>Confirmation code: <strong>{confirmation_code}</strong></h2>
          <button
            className="btn_secondary"
            onClick={() => { setOpenDialog(false); router.push("/"); }}
          >
            Okay
          </button>
        </div>
      </CustomDialog>

      <div className="centering-div login-fields">
        <h1>{restaurantInfo.name}</h1>
        <p>{restaurantInfo.address}</p>
        <p>Day: {reservationDateTime}</p>
        <p>Time: {startTime !== null ? `${startTime}:00` : ""}</p>
        <p>Group Size: {router.query.numberOfPeople}</p>

        <br />

        <TextField
          required
          id="outlined-required"
          color="secondary"
          label="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <div className="cancelAndConfirmButtons">
          <button
            className="btn_secondary"
            onClick={() => {
              const reservationUUID = uuidv4();
              const restUUID = router.query.restUUID as string;
              const fetchAndCreateReservation = async () => {
                if (startTime === null) {
                  alert("Invalid start time");
                  router.push("/");
                  return;
                }
                const data = await findOpenTable(
                  restUUID,
                  router.query.numberOfPeople as string,
                  startTime,
                  startTime + 1
                ); // modify to get benchUUID of a bench that can be reserved.
                if (!data || !data.body) {
                  alert("No table available");
                  router.push("/");
                  return;
                }

                let benchUUID: string | undefined;
                try {
                  const parsedData = JSON.parse(data.body);
                  if (Array.isArray(parsedData) && parsedData.length > 0) {
                    benchUUID = parsedData[0].benchUUID as string;
                  } else {
                    alert("NO table available");
                    router.push("/");
                    return;
                  }
                } catch (error) {
                  console.error("Failed to get benchUUID:", error);
                  alert("NO table available");
                  router.push("/");
                  return;
                }

                if (!benchUUID) {
                  alert("No table available");
                  router.push("/");
                  return;
                }

                const e_mail = email; // Replace with actual email input
                const confirmationCode = generateConfirmationCode(); // Example, generate dynamically if needed
                const groupSize = parseInt(
                  router.query.numberOfPeople as string
                ); // Convert to number

                createReservation(
                  reservationUUID,
                  restUUID,
                  benchUUID,
                  reservationDateTime,
                  startTime!,
                  e_mail,
                  confirmationCode,
                  groupSize
                );
              };

              fetchAndCreateReservation();
            }}
          >
            Reserve
          </button>
          <span style={{ margin: "0 10px" }}></span>
          <button className="btn_primary" onClick={() => { router.push("/"); }}>
          Cancel
        </button>
      </div>
    </div>
    </main >
  );
}

export default ConfirmReservation;

