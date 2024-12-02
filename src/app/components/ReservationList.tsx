import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import "@/app/globals.css";
import { Grid2 } from "@mui/material";
import { Box } from "@mui/system";
// ascess global state. 
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
  const [clickedBoxes, setClickedBoxes] = useState<number[]>([]);

  const { numberOfPeople, reservationDate, reservationTime } = useReservation();


  useEffect(() => {
    const fetchRestaurantInfo = async (restUUID: string, dateTime: string) => {
      try {
        const response = await instance.post("/restaurantInfo", { restUUID, dateTime });
        const body = response.data.body;
        const data = body ? JSON.parse(body) : [];
        if (Array.isArray(data)) {
          setBlockedTimes(data);
        }
      } catch (error) {
        console.log("Error fetching reservation info \n");
        console.log(error)
      }
    };

    fetchRestaurantInfo(restUUID, dateTime);
  }, [restUUID, dateTime]);

  const setBoxColor = (hour: number, blockedTimes: Array<number>, clickedBoxes: Array<number>) => {
    if (clickedBoxes.includes(hour)) {
      return "#000000"; // Black color for clicked boxes
    }
    return blockedTimes.includes(hour) ? "#0F0F0F" : "#FFFFFF";
  };

  // Initialized Reservation proccess. Ports with neccessary data to the confirmationReservatin page
  const handleBoxClick = (hour: number) => {
    setClickedBoxes((prev) => [...prev, hour]);
    router.push({
      pathname: "/confirmReservation",
      query: {
        restUUID,
        tableSize: 4, // Replace with actual table size as needed
        numberOfPeople,
        reservationDate,
        reservationTime,
      },
    });
  };

  const list = [];
  for (let i = 0; i < closingHour - openingHour; i++) {
    list.push(
      <Grid2 key={i} size={1}>
        {/* use useRouter book to pass the data to the next page */}
        <Box key={i}
          sx={{
            border: 1,
            borderRadius: 1,
            bgcolor: setBoxColor(openingHour + i, blockedTimes, clickedBoxes),
            cursor: "pointer", // Add cursor pointer to indicate clickable
          }}
          onClick={() => handleBoxClick(openingHour + i)} // Call handleBoxClick on click
        >
          &nbsp;
        </Box>

      </Grid2>
    );
  }

  return (
    <div className="centering-div div-horiz">
      <Box>{dateTime.slice(5, 10)}</Box>
      <Grid2 container columns={closingHour - openingHour} width={1}>
        {list.slice(0, closingHour - openingHour).map((key) => (
          <Grid2 key={key.key} size={1}>
            <Box>{openingHour + Number(key.key)}</Box>
          </Grid2>
        ))}
        {list}
      </Grid2>
    </div>
  );
}
