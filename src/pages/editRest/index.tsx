import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { Add, Save } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";


// For time and date picking
// import { Search } from "@mui/icons-material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
// import dayjs from "dayjs";
import withAuthManager from "@/withAuthManager";

import "@/app/globals.css";
import "./editRest.css";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

function EditRest() {
  const router = useRouter();

  const [tablesAndSeats, setTablesAndSeats] = useState<
    { table: string; seats: number }[]
  >([]);

  const { restUUID } = router.query;


  interface TableAndSeats {
    benchName: string;
    numSeats: number;
  }

  const [restaurantData, setRestaurantData] = useState<{
    name: string;
    address: string;
    openingTime: number;
    closingTime: number;
    tablesAndSeats: TableAndSeats[];
  }>({
    name: "",
    address: "",
    openingTime: 8,
    closingTime: 17,
    tablesAndSeats: [],
  });

  const [newTable, setNewTable] = useState("");
  const [newSeats, setNewSeats] = useState("1");

  const handleAddTable = () => {
    if (newTable && newSeats) {
      setTablesAndSeats([
        ...tablesAndSeats,
        { table: newTable, seats: parseInt(newSeats) },
      ]);
      setNewTable("");
      setNewSeats("1");
    }
  };

  // Fetch existing data on component mount
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!restUUID) return; // Wait for restUUID to be available

      try {
        const response = await instance.post("/rest", { rest_uuid: restUUID });
        const data = response.data.body ? JSON.parse(response.data.body) : {}; // Parse the response body as JSON if defined

        if (data && data.restaurant && Array.isArray(data.restaurant) && data.restaurant.length > 0) {
          const restaurant = data.restaurant[0]; // Assuming you want the first restaurant in the array

          setRestaurantData({
            name: restaurant.restName || "",
            address: restaurant.address || "",
            openingTime: restaurant.openingHour || 8,
            closingTime: restaurant.closingHour || 17,
            tablesAndSeats: data.benches || [], // Assuming benches represent tables and seats
          });

          console.log("Restaurant Name:", restaurant.restName);
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, [restUUID]);

  const handleOpeningTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (newValue >= 0 && newValue <= 23) {
      setRestaurantData((prevData) => ({
        ...prevData,
        openingTime: newValue,
      }));
    }
  };

  const handleClosingTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (newValue >= 0 && newValue <= 23) {
      setRestaurantData((prevData) => ({
        ...prevData,
        closingTime: newValue,
      }));
    }
  };
  const handleDeleteTable = (index: number) => {
    setRestaurantData((prevData) => ({
      ...prevData,
      tablesAndSeats: prevData.tablesAndSeats.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (field: string, value: string) => {
    setRestaurantData((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="../logo.png" alt="Home Button" className="logo" />
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

        <div className="centering-div div-horiz" style={{ width: "100%" }}>
          <TextField
            label="Opening Time"
            type="number"
            value={restaurantData.openingTime}
            onChange={handleOpeningTimeChange}
            slotProps={{ htmlInput: { min: 0, max: 23 } }}
            sx={{ width: "70%" }} // Adjust the width

          />
          <TextField
            label="Closing Time"
            type="number"
            value={restaurantData.closingTime}
            onChange={handleClosingTimeChange}
            slotProps={{ htmlInput: { min: 0, max: 23 } }}
            sx={{ marginRight: 2, width: "70%" }} // Adjust the width and margin

          />
          
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

          <IconButton onClick={handleAddTable} color="primary">
            <Add />
          </IconButton>
        </div>

        <div
          className="TablesAndSeats"
          style={{ height: "auto", minHeight: "50px" }}
        >
          {restaurantData.tablesAndSeats.map((item, index) => (
            <div key={index} className="table-item">
              <span>{item.benchName}</span>
              <span>{item.numSeats} seats</span>
              <Button
                variant="contained"
                color="primary"
                className="button"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteTable(index)}
              />
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
        />

        <div className="saveAndDelete">
          <button className="btn_secondary">
            Save
            <Save className="icon-padding" />
          </button>
          <button className="btn_secondary">
            Delete
            <DeleteIcon className="icon-padding" />
          </button>
        </div>
      </Box>
    </main>
  );
}

export default withAuthManager(EditRest);
