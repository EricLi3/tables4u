import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import axios from "axios";
import ReservationListBenches from "../../app/components/ReservationListBenches"

// For date picking
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import withAuthManager from "@/withAuthManager";

//reservation table for the restaurant

import "@/app/globals.css";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

//this is going to be a dashboard with a couple of buttons: activate, open-restaurant, close-restaurant, edit, delete, and a date search field with a search button

function DashboardRest() {
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
  
  const [isActive, setIsActive] = useState(false);


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
          name: restaurant.restName || "Tables4u",
          address: restaurant.address || "Buy me a hot cocoa",
          openingTime:
            dayjs().set("hour", restaurant.openingHour).set("minute", 0) ||
            dayjs().set("hour", 0).set("minute", 0),
          closingTime:
            dayjs().set("hour", restaurant.closingHour).set("minute", 0) ||
            dayjs().set("hour", 0).set("minute", 0),
          tablesAndSeats: data.benches || [],
          newPassword: "",
        });

        setIsActive(restaurant.isActive === 1);

        console.log("Restaurant Name:", restaurant.restName);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [restUUID]);

  const activateRestaurant = async () => {
    try {
      const response = await instance.post("/activateRest", { rest_uuid: restUUID });
      console.log("Activated restaurant:", response);
      alert("Restaurant activated successfully!");
    } catch (error) {
      console.error("Failed to activate restaurant:", error);
      alert("Failed to activate restaurant. Please try again later.");
    }
  }

  // --------------------------------

  const handleEdit = () => {
    router.push({
      pathname: "/editRest",
      query: { restUUID },
    });
  };

  const handleActivate = () => {
    // Activate the restaurant
    activateRestaurant();
  };

  const handleOpenClose = () => {
    // Open or close the restaurant
  };

  const handleDelete = () => {
    //include confirmation dialog
    if (!confirm("Are you sure you want to delete this restaurant?")) return;

    //delete the restaurant
    instance
      .post("/deleteRest", { restUUID })
      .then((response) => {
        console.log("Deleted restaurant:", response);
        router.push("/"); // Redirect to the home page
      })
      .catch((error) => {
        console.error("Failed to delete restaurant:", error);
      });
  };

  // --------------------------------

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <div className="centering-div div-horiz">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Reservations at"
            format="ddd DD/MM/YYYY"
          />
        </LocalizationProvider>

        <button className="btn_secondary">
          <Search className="icon-padding" />
        </button>
      </div>

      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          bgcolor: "grey.300",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: "grid",
          gridTemplateColumns: "6fr 1fr",
          gridTemplateRows: "auto auto",
          gap: 2,
          alignItems: "center",
        }}
      >
        <div
          style={{
            gridColumn: "1 / span 1",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>{restaurantData.name} </h1>
          <h2>{restaurantData.address}</h2>
          <h2>Opening time: {restaurantData.openingTime.format("HH:mm")}</h2>
          <h2>Closing time: {restaurantData.closingTime.format("HH:mm")}</h2>
          {/*<ReservationListBenches openingHour={Number(restaurantData.openingTime)} closingHour={Number(restaurantData.closingTime)} restUUID={restUUID} dateTime={dateTime}/>*/}
        </div>

        <div style={{ gridColumn: "1 / span 1", gridRow: "2 / span 1" }}>
          {/*ReservationTableThingy */}
        </div>
        <div
          style={{
            gridColumn: "2 / span 1",
            gridRow: "2 / span 1",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <button className="btn_secondary" onClick={handleOpenClose}>
            Re-open
          </button>
          <br></br>
          <button className="btn_secondary" onClick={handleOpenClose}>
            Close
          </button>
        </div>
        <div
          style={{
            gridColumn: "1 / span 2",
            gridRow: "3 / span 1",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {!isActive && (
            <button className="btn_dark" onClick={handleActivate}>
              Activate
            </button>
          )}
          <button className="btn_secondary" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn_primary icon-center" onClick={handleDelete}>
            <DeleteIcon />
          </button>
        </div>
      </Box>
    </main>
  );
}

export default withAuthManager(DashboardRest);
