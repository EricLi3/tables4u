import React from "react";
import { useState, useEffect } from "react";

import axios from "axios";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

import "@/app/globals.css";
import { Grid2 } from "@mui/material";
import { Box } from "@mui/system";

export default function ReservationListBenches({
  openingHour,
  closingHour,
  restUUID,
  dateTime,
  sendDataToParent,
}: {
  openingHour: number;
  closingHour: number;
  restUUID: string;
  dateTime: string;
  sendDataToParent: (arg0: boolean)=>void
}) {
  const [blockedTimes, setBlockedTimes] = useState({open: true,body: [{name: "", time: [""]}]})

  useEffect(() => {
    const fetchRestaurantInfo = async (restUUID: string, dateTime: string) => {
      try {
        const response = await instance.post("/seeDayBlocked", { restUUID, dateTime });
        const body = response.data.body;
        const data = body ? JSON.parse(body) : [];
        setBlockedTimes(data);
        console.log(data);

      } catch (error) {
        console.log("Error fetching reservation info \n");
        console.log(error)
      }
    };

    fetchRestaurantInfo(restUUID, dateTime);
  }, [restUUID, dateTime]);

  useEffect(()=>(
    sendDataToParent(blockedTimes.open)
  ),[blockedTimes]);

  const setBoxColor = (hour: number, times: {name: string, time: Array<string>}) => {
    for (let i = 0; i < times.time.length; i++) {
      if (times.time[i] == String(hour)) {
        return "#0F0F0F";
      }
    } 
    return "#FFFFFF";
  };

  const list = [];
  for (let j = 0; j < blockedTimes.body.length; j++) {
    list.push(
      <Grid2 key = {25*(j+1)-1} size={1}>
        <Box key = {25*(j+1)-1}>{blockedTimes.body[j].name}</Box>
      </Grid2>
    )
    for (let i = 0; i < closingHour - openingHour; i++) {
      list.push(
        <Grid2 key={i+25*j} size={1}>
          <Box key={i+25*j}
            sx={{
              border: 1,
              borderRadius: 1,
              bgcolor: setBoxColor(openingHour + i, blockedTimes.body[j]),
            }}
          >
            &nbsp;
          </Box>
        </Grid2>
      );
    }
  }

  return (
    <div className="centering-div div-horiz">
      <Grid2 container columns={closingHour - openingHour+1} width={1}>
        {list.slice(0, closingHour - openingHour+1).map((key) => (
          <Grid2 key={key.key} size={1}>
            <Box>{key.key != '24' ? openingHour + Number(key.key) : dateTime.slice(5,10)}</Box>
          </Grid2>
        ))}
        {list}
      </Grid2>
    </div>
  );
}
