import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";

import axios from "axios";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

import "@/app/globals.css";
import { Grid2, Paper } from "@mui/material";
import { Box, Container } from "@mui/system";

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
  const [blockedTimes, setBlockedTimes] = useState<String[]>([]);

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
        console.log("Error fetching reservation info");
      }
    };

    fetchRestaurantInfo(restUUID, dateTime);
    console.log("fetching");
  }, [restUUID, dateTime]);

  const setBoxColor = (hour: number, blockedTimes: Array<String>) => {
    for (let i = 0; i < blockedTimes.length; i++) {
      if (blockedTimes[i].includes(String(hour))) {
        return "#000000";
      }
    }
    return "#FFFFFF";
  };

  let list = [];
  for (let i = 0; i < closingHour - openingHour; i++) {
    list.push(
      <Grid2 key={i} size={1}>
        <Box key={i}
          sx={{
            border: 1,
            borderRadius: 1,
            bgcolor: setBoxColor(openingHour + i, blockedTimes),
          }}
        >
          &nbsp;
        </Box>
      </Grid2>
    );
  }

  return (
    <div className="div-horiz">
      <Box>{dateTime.slice(0,10)}</Box>
      <Grid2 container columns={closingHour - openingHour}>
        {list.map((key) => (
          <Grid2 size={1}>
            <Box>{openingHour + Number(key.key)}</Box>
          </Grid2>
        ))}
        {list}
      </Grid2>
    </div>
  );
}
