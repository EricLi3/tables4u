import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "@/app/globals.css";
import "./availabilityReport.css";
import { Box } from "@mui/material";

import axios from "axios";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

import withAuthAdmin from "@/withAuthAdmin";
import DayAvailability from "../../app/components/DayAvailability";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

function AvailabilityReport() {
  const router = useRouter();
  const restUUID = router.query.restUUID as string;

  // parse the date range from the query string
  const dateRangeStart = dayjs(
    router.query.dateRangeStart?.toString()
  ) as dayjs.Dayjs;
  const dateRangeEnd = dayjs(
    router.query.dateRangeEnd?.toString()
  ) as dayjs.Dayjs;

  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState<{
    name: string;
    address: string;
    openingTime: dayjs.Dayjs;
    closingTime: dayjs.Dayjs;
    tablesAndSeats: { benchName: string; numSeats: number }[];
  }>({
    name: "",
    address: "",
    openingTime: dayjs().set("hour", 8).set("minute", 0),
    closingTime: dayjs().set("hour", 17).set("minute", 0),
    tablesAndSeats: [],
  });

  const [isActive, setIsActive] = useState(true);

  // Fetch existing data on component mount
  const fetchRestaurantData = async () => {
    try {
      const response = await instance.post("/rest", { rest_uuid: restUUID });
      const data = response.data.body ? JSON.parse(response.data.body) : {}; // Parse the response body as JSON if defined
      console.log("Data:", data);
      if (
        data &&
        data.restaurant &&
        Array.isArray(data.restaurant) &&
        data.restaurant.length > 0
      ) {
        const restaurant = data.restaurant[0]; // Assuming you want the first restaurant in the array

        setRestaurantData({
          name: restaurant.restName || "Tables4u",
          address: restaurant.address || "Buy me a hot cocoa",
          openingTime:
            dayjs().set("hour", restaurant.openingHour).set("minute", 0) ||
            dayjs().set("hour", 0).set("minute", 0),
          closingTime:
            dayjs().set("hour", restaurant.closingHour).set("minute", 0) ||
            dayjs().set("hour", 0).set("minute", 0),
          tablesAndSeats: data.benches || [],
        });

        setIsActive(restaurant.isActive === 1);

        console.log("Restaurant Name:", restaurant.restName);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  const [availabilityData, setAvailabilityData] = useState<{
    startTime: number;
    endTime: number;
    usage: {
      day: string;
      state: boolean;
      tables: {
        name: string;
        seats: string;
        times: { time: string; people: string }[];
      }[];
    }[];
  }>({
    startTime: 8,
    endTime: 17,
    usage: [],
  });

  const fetchAvailabilityData = async () => {
    try {
      const response = await instance.post("/generateReportAdmin", {
        restUUID: restUUID,
        dateRangeStart: dateRangeStart.toISOString(),
        dateRangeEnd: dateRangeEnd.toISOString(),
      });
      const data = response.data ? response.data : {}; // Directly access the response data
      console.log("Data:", data);
      if (
        data &&
        data.availability &&
        data.availability.usage &&
        Array.isArray(data.availability.usage)
      ) {
        setAvailabilityData({
          startTime: data.availability.startTime || 8,
          endTime: data.availability.endTime || 17,
          usage: data.availability.usage || [],
        });

        console.log("Availability Data:", data.availability);
      }
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchRestaurantData();
      await fetchAvailabilityData();
      setLoading(false);
    };

    if (loading) {
      fetchData();
    }
  }, [loading, restUUID, dateRangeStart, dateRangeEnd]);

  const makeDays = () => {
    return availabilityData.usage.map((day) => (
      <div key={day.day}>
        <DayAvailability
          date={day.day}
          state={day.state}
          openingTime={availabilityData.startTime}
          closingTime={availabilityData.endTime}
          benchesAndReservations={day.tables.map((table) => ({
            benchName: table.name,
            numSeats: parseInt(table.seats),
            reservations: table.times.map((time) => ({
              time: parseInt(time.time),
              numOfPeople: parseInt(time.people),
            })),
          }))}
        />
      </div>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex w-screen h-screen flex-col items-center p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="logo.png" alt="Home Button" className="logo" />
        </Link>
        <br />
        <Link href="/admin">
          <button className="btn_dark">Back to Dashboard</button>
        </Link>
      </div>
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          bgcolor: "grey.300",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <h1>
          Availability Report: {dateRangeStart.format("DD/MM/YYYY")}
          {" - "}
          {dateRangeEnd.format("DD/MM/YYYY")}
        </h1>
        <h2>{restaurantData.name}</h2>
        <h3>{restaurantData.address}</h3>
        <h4>
          {restaurantData.openingTime.format("HH:mm")} -{" "}
          {restaurantData.closingTime.format("HH:mm")}
        </h4>
        <h4>Active: {isActive ? "✅" : "❌"}</h4>
        <div
          className="TablesAndSeats"
          style={{ height: "auto", minHeight: "50px" }}
        >
          <h4>Tables and Seats:</h4>
          {restaurantData.tablesAndSeats.map((item, index) => (
            <div key={index} className="tableItem">
              <span className="spanWidth">{item.benchName}</span>
              <span className="spanWidth">
                {item.numSeats} {item.numSeats === 1 ? "seat" : "seats"}
              </span>
            </div>
          ))}
        </div>
      </Box>

      <div className="centering-div">
        {makeDays()}
      </div>
    </main>
  );
}

export default withAuthAdmin(AvailabilityReport);
