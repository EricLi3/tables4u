import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

// For date picking
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import withAuthManager from "@/withAuthManager";

import "@/app/globals.css";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

//this is going to be a dashboard with a couple of buttons: activate, open-restaurant, close-restaurant, edit, delete, and a date search field with a search button

function dashboardRest() {
  const router = useRouter();
  const restUUID = router.query.restUUID as string;

  const [restaurantData, setRestaurantData] = useState<{
    name: string;
    address: string;
    openingTime: dayjs.Dayjs;
    closingTime: dayjs.Dayjs;
    tablesAndSeats: { benchName: string; numSeats: number }[];
    newPassword: string;
  }>({
    name: "",
    address: "",
    openingTime: dayjs().set("hour", 8).set("minute", 0),
    closingTime: dayjs().set("hour", 17).set("minute", 0),
    tablesAndSeats: [],
    newPassword: "",
  });

  // Fetch existing data on component mount
  const fetchRestaurantData = async () => {
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
          name: restaurant.restName || "",
          address: restaurant.address || "",
          openingTime:
            dayjs().set("hour", restaurant.openingHour).set("minute", 0) ||
            dayjs().set("hour", 8).set("minute", 0),
          closingTime:
            dayjs().set("hour", restaurant.closingHour).set("minute", 0) ||
            dayjs().set("hour", 17).set("minute", 0),
          tablesAndSeats: data.benches || [],
          newPassword: "",
        });

        console.log("Restaurant Name:", restaurant.restName);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [restUUID]);

  // --------------------------------

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>
      
      
    </main>
  );
}

export default withAuthManager(dashboardRest);
