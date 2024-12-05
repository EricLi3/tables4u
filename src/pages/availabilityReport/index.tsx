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
  const [isDayOpen, setIsDayOpen] = useState(true);

  // Fetch existing data on component mount
  const fetchRestaurantData = async () => {
    setLoading(true);
    if (!restUUID) return; // Wait for restUUID to be available
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [restUUID]);

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
        <h1>Availability Report</h1>
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
        <DayAvailability
          date={dayjs().toISOString()}
          state={true}
          openingTime={8}
          closingTime={17}
          benchesAndReservations={[
            {
              benchName: "Table 1",
              numSeats: 4,
              reservations: [
                { time: 10, numOfPeople: 2 },
                { time: 12, numOfPeople: 4 },
              ],
            },
            {
              benchName: "Table 2",
              numSeats: 2,
              reservations: [
                { time: 9, numOfPeople: 2 },
                { time: 14, numOfPeople: 2 },
              ],
            },
            {
              benchName: "Table 3",
              numSeats: 6,
              reservations: [
                { time: 11, numOfPeople: 6 },
                { time: 15, numOfPeople: 3 },
              ],
            },
          ]}
        />
      </div>
    </main>
  );
}

export default withAuthAdmin(AvailabilityReport);
