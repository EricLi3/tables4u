import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { Add, Save } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

// For time and date picking
// import { Search } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import withAuthManager from "@/withAuthManager";

import "@/app/globals.css";
import "./editRest.css";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

function EditRest() {
  const router = useRouter();
  const restUUID = router.query.restUUID as string;

  const [newTable, setNewTable] = useState("");
  const [newSeats, setNewSeats] = useState("1");
  const [error, setError] = useState("");

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

  const handleChange = (field: string, value: any) => {
    setRestaurantData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleAddTable = () => {
    if (newTable && newSeats) {
      setRestaurantData((prevData) => ({
        ...prevData,
        tablesAndSeats: [
          ...prevData.tablesAndSeats,
          { benchName: newTable, numSeats: parseInt(newSeats) },
        ],
      }));
      setNewTable("");
      setNewSeats("1");
    }
  };

  const handleDeleteTable = (index: number) => {
    setRestaurantData((prevData) => {
      const newTablesAndSeats = [...prevData.tablesAndSeats];
      newTablesAndSeats.splice(index, 1);
      return { ...prevData, tablesAndSeats: newTablesAndSeats };
    });
  };

  // --------------------------------

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

  const handleSaveChanges = () => {
    if (!restUUID || !restaurantData.name || !restaurantData.address) return;

    if (restaurantData.tablesAndSeats.length < 1) {
      alert("A restaurant must have at least one table");
      return;
    }

    //slightly different approach to the original code
    instance
      .post("/editRest", {
        restUUID: restUUID,
        restName: restaurantData.name,
        restAddress: restaurantData.address,
        openingTime: restaurantData.openingTime.hour(),
        closingTime: restaurantData.closingTime.hour(),
        tables: restaurantData.tablesAndSeats,
        newPassword: restaurantData.newPassword,
      })
      .then((response) => {
        console.log(response);
        //print a success message to the user
        console.log("Changes saved successfully");
        alert("Changes saved successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ---------------------------------------

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
        </Link>
        <br />
        <Link href="/dashboardRest">
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
          alignItems: "center",
        }}
      >
        <h1>Edit Restaurant</h1>
        <TextField
          label="Restaurant Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={restaurantData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextField
          label="Restaurant Address"
          type="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={restaurantData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <div className="centering-div div-horiz">
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              label="Opening Time"
              format="HH:mm"
              views={["hours"]}
              ampm={false}
              minTime={dayjs().set("hour", 0).set("minute", 0)}
              maxTime={restaurantData.closingTime}
              value={restaurantData.openingTime}
              onAccept={(date) => handleChange("openingTime", date)}
            />

            <MobileTimePicker
              label="Close Time"
              format="HH:mm"
              views={["hours"]}
              ampm={false}
              defaultValue={dayjs().set("hour", 17).set("minute", 0)}
              minTime={restaurantData.openingTime}
              maxTime={dayjs().set("hour", 23).set("minute", 0)}
              value={restaurantData.closingTime}
              onAccept={(date) => handleChange("closingTime", date)}
            />
          </LocalizationProvider>
        </div>

        <div className="InputTablesAndSeats">
          <TextField
            label="Table Name"
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Box sx={{ width: "30%", height: 16 }} />
          <TextField
            label="Seats"
            type="number"
            inputProps={{ min: 1, max: 8 }}
            value={newSeats}
            onChange={(e) => setNewSeats(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />

          <IconButton onClick={handleAddTable} color="primary" className="pt-4">
            <Add />
          </IconButton>
        </div>

        <div
          className="TablesAndSeats"
          style={{ height: "auto", minHeight: "50px" }}
        >
          {restaurantData.tablesAndSeats.map((item, index) => (
            <div key={index} className="tableItem">
              <span className="spanWidth">{item.benchName}</span>
              <span className="spanWidth">
                {item.numSeats} {item.numSeats === 1 ? "seat" : "seats"}
              </span>
              <Button
                variant="contained"
                color="primary"
                className="button"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteTable(index)}
              ></Button>
            </div>
          ))}
        </div>
        <br></br>
      </Box>
      <br></br>
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <TextField
          label="New Password"
          type="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={restaurantData.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          className="mb-4"
        />

        <div className="saveAndDelete">
          <button className="btn_secondary" onClick={() => handleSaveChanges()}>
            Save
            <Save className="icon-padding" />
          </button>
          <button
            className="btn_secondary"
            onClick={() => fetchRestaurantData()}
          >
            Discard
            <DeleteIcon className="icon-padding" />
          </button>
        </div>
      </Box>
    </main>
  );
}

export default withAuthManager(EditRest);
