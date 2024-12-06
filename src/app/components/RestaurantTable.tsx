import React from "react";
// import Link from "next/link";
import "@/app/globals.css";

import axios from "axios";
import ReservationList from "./ReservationList";
// import ReservationListBenches from "./ReservationListBenches";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

interface Restaurant {
  restUUID: string;
  userName: string;
  pass: string;
  restName: string;
  address: string;
  openingHour: string;
  closingHour: string;
  isActive: number;
}

function Row({
  restaurant,
  dateTime,
}: {
  restaurant: Restaurant;
  dateTime: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {restaurant.restName}
        </TableCell>
        <TableCell>{restaurant.address}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <ReservationList
                openingHour={Number(restaurant.openingHour)}
                closingHour={Number(restaurant.closingHour)}
                restUUID={restaurant.restUUID}
                dateTime={dateTime}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function RestaurantTable({
  dateTime = "2024-11-24T21:00:00.000-0500",
  searchNameDayTrigger=false,
  searchDateTimeTrigger=false,
  name="",
}) {
  const searchState ={
    searchDefault: 0,
    searchNameDay: 1,
    searchDateTime: 2
  };
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numberToList, setNumberToList] = useState(5);
  const [state,setState] = useState(searchState.searchDefault);


const fetchRestaurants = (numToList: number) => {
  setLoading(true);
  instance
    .post("/listActiveRests", { numberToList: numToList })
    .then((response) => {
      try {
        const body = response.data.body;
        const data = body ? JSON.parse(body) : []; // Parse the response body if defined
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          console.error("Unexpected data format:", data);
          setRestaurants([]);
        }
      } catch (error) {
        console.error("Failed to parse response body:", error);
        setRestaurants([]);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch restaurants:", error);
      setError("Failed to fetch restaurants. Please try again later.");
    })
    .finally(() => {
      setLoading(false);
    });
};

const searchNameDate=(name:string,dateTime:string,numberToList:number)=>{
  setLoading(true);
  instance
    .post("/searchNameDate", {restName:name,dateTime:dateTime,numberToList:numberToList})
    .then((response) => {
      try {
        const body = response.data.body;
        const data = body ? JSON.parse(body) : [];
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          console.error("Unexpected data format:", data);
          setRestaurants([]);
        }
      } catch (error) {
        console.error("Failed to parse response body:", error);
        setRestaurants([]);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch restaurants:", error);
    })
    .finally(()=>{
      setLoading(false);
    })
}

//FOR CARLOS :)
const searchDateTime=(dateTime:string,chosenHour:number,numSeats:number,numberToList:number)=>{
  setLoading(true);
  instance
    //might need to adjust the api call name and variables passed in
    .post("/searchDateTime", {dateTime:dateTime,chosenHour:chosenHour,numSeats:numSeats,numberToList:numberToList})
    .then((response) => {
      try {
        const body = response.data.body;
        const data = body ? JSON.parse(body) : [];
        //might need to modify the data parsing
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          console.error("Unexpected data format:", data);
          setRestaurants([]);
        }
      } catch (error) {
        console.error("Failed to parse response body:", error);
        setRestaurants([]);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch restaurants:", error);
    })
    .finally(()=>{
      setLoading(false);
    })
}

  // Effect to load restaurants initially
  useEffect(() => {
    console.log("loading");
    switch (state) {
      case searchState.searchDefault:
        fetchRestaurants(numberToList);
        break;
      case searchState.searchNameDay:
        searchNameDate(name,dateTime,numberToList);
        break;
      case searchState.searchDateTime:
        //need to grab information for selected hour and number of seats, or possibly modify arguments
        searchDateTime(dateTime,9,4,numberToList); 
        break;
    }
  }, [numberToList,state,name,dateTime]); //refresh on selected hour and number of seats

  useEffect(() => {
    setState(searchState.searchNameDay),
    setNumberToList(5);
  },[searchNameDayTrigger]);

  useEffect(() => {
    setState(searchState.searchDateTime),
    setNumberToList(5);
  },[searchDateTimeTrigger]);
  
  useEffect(() =>{
    name=="" ? setState(searchState.searchDefault) : {},
    setNumberToList(5);
  },[name]);

  // Handle Load More Button
  const handleLoadMore = () => {
    setNumberToList((prev) => prev + 5); // Increment by 5
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <h2>Restaurant Name</h2>
              </TableCell>
              <TableCell>
                <h2>Address</h2>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants?.length > 0 ? (
              restaurants
                .sort((a, b) => a.restUUID.localeCompare(b.restUUID)) // Sort by restUUID
                .map((restaurant) => (
                  <Row
                    key={restaurant.restUUID}
                    restaurant={restaurant}
                    dateTime={dateTime}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No restaurants available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" marginTop={2}>
        <button
          className="btn_primary"
          onClick={handleLoadMore}
          disabled={loading}
        >
          Load More
        </button>
      </Box>
    </Box>
  );
}
