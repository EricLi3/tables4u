import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import "@/app/globals.css";
import { Grid2 } from "@mui/material";
import { Box } from "@mui/system";
// access global state.
import { useReservation } from "@/app/context/ReservationContext";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

export default function ReservationList({
  openingHour,
  closingHour,
  restUUID,
  dateTime,
}: {
  openingHour: number;
  closingHour: number;
  restUUID: string;
  dateTime: string;
}) {
  const router = useRouter();
  const [blockedTimes, setBlockedTimes] = useState<number[]>([]);
  const [clickedBox, setClickedBox] = useState<number | null>(null);

  const { numberOfPeople, reservationDate, reservationTime } = useReservation();

  useEffect(() => {
    const fetchRestaurantInfo = async (restUUID: string, dateTime: string) => {
      try {
        const response = await instance.post("/restaurantInfo", {
          restUUID,
          dateTime,
        });
        const body = response.data.body;
        const data = body ? JSON.parse(body) : [];
        if (Array.isArray(data)) {
          setBlockedTimes(data);
        }
      } catch (error) {
        console.log("Error fetching reservation info \n");
        console.log(error);
      }
    };

    fetchRestaurantInfo(restUUID, dateTime);
  }, [restUUID, dateTime]);

  const setBoxColor = (
    hour: number,
    blockedTimes: Array<number>,
    clickedBox: number | null
  ) => {
    if (clickedBox === hour) {
      return "var(--color2)"; // Black color for clicked box
    }
    return blockedTimes.includes(hour) ? "var(--foreground)" : "#var(--background)";
  };

  const handleBoxClick = (hour: number) => {
    setClickedBox(hour);
  };

  const confirmReservation = () => {
    router.push({
      pathname: "/confirmReservation",
      query: {
        restUUID,
        numberOfPeople,
        reservationDate,
        reservationTime,
        selectedTime: clickedBox, // Pass the selected time
      },
    });
  };

  const list = [];
  for (let i = 0; i < closingHour - openingHour; i++) {
    list.push(
      <Grid2 key={i} size={1}>
        <Box
          key={i}
          sx={{
            border: 1,
            borderRadius: 1,
            bgcolor: setBoxColor(openingHour + i, blockedTimes, clickedBox),
            cursor: "pointer",
          }}
          onClick={() => handleBoxClick(openingHour + i)}
        >
          &nbsp;
        </Box>
      </Grid2>
    );
  }

  return (

    <div>
      <div className="centering-div div-horiz">
        {dateTime.slice(8,10) + '/' + dateTime.slice(5,7)}
        <Grid2 container columns={closingHour - openingHour} width={1}>
          {list.slice(0, closingHour - openingHour).map((key) => (
            <Grid2 key={key.key} size={1}>
              <Box>{openingHour + Number(key.key)}</Box>
            </Grid2>
          ))}
          {list}
        </Grid2>
      </div>
        {clickedBox !== null && (
          <Box>
            <br />
            <button className="btn_secondary btn_small" onClick={confirmReservation}>
            Confirm Reservation at {clickedBox}:00
            </button>
          </Box>
        )}
    </div>
  );
}
