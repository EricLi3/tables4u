import React from "react";
// import Link from "next/link";
import "@/app/globals.css";

import axios from "axios";

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

function Row({ restaurant }: { restaurant: Restaurant }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
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
              <Typography variant="body2">
                Opening Hours: {restaurant.openingHour} -{" "}
                {restaurant.closingHour}
              </Typography>
              {/* Button to reserve here */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function RestaurantTable() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numberToList, setNumberToList] = useState(5);

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

  // Effect to load restaurants initially
  useEffect(() => {
    fetchRestaurants(numberToList);
  }, [numberToList]); // to not have an infinite loop of rendering

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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell><b>Restaurant Name</b></TableCell>
              <TableCell><b>Address</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants?.length > 0 ? (
              restaurants.map((restaurant) => (
                <Row key={restaurant.restUUID} restaurant={restaurant} />
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
