"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "@/app/globals.css";

import CustomDialog from "@/app/components/CustomDialog";

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
import DeleteIcon from "@mui/icons-material/Delete";
// For time and date picking
import { Search } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import withAuthAdmin from "@/withAuthAdmin";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

interface Restaurant {
  restUUID: string;
  restName: string;
  address: string;
  openingHour: string;
  closingHour: string;
  isActive: number;
}
interface Reservation {
  reservationUUID: string;
  restUUID: string;
  benchUUID: string;
  reservationDateTime: string;
  startTime: number;
  email: string;
  confirmationCode: string;
  groupSize: number;
}

function Row({
  restaurant,
  deleteRestaurant,
  dateRangeStart,
  dateRangeEnd,
}: {
  restaurant: Restaurant;
  deleteRestaurant: (restUUID: string) => void;
  dateRangeStart: dayjs.Dayjs;
  dateRangeEnd: dayjs.Dayjs;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setIsActive(restaurant.isActive === 1);
  }, [restaurant.isActive]);

  // Fetch reservations for the restaurant
  const fetchReservations = async () => {
    try {
      const response = await instance.post("/listReservations", {
        restUUID: restaurant.restUUID,
      });
      const data = response.data.body ? JSON.parse(response.data.body) : [];
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchReservations();
    }
  }, [open]);

  const cancelReservation = async (email: string, confCode: string) => {
    try {
      const response = await instance.post("/cancelReservation", {
        email: email,
        confCode: confCode,
      });

      console.log("Reservation cancelled:", response);
      alert("Reservation cancelled successfully!");
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      alert("Failed to cancel reservation. Please try again later.");
    }
  };
  const generateAvailabilityReport = () => {
    router.push({
      pathname: "/availabilityReport",
      query: {
        restUUID: restaurant.restUUID,
        dateRangeStart: dateRangeStart.toISOString(),
        dateRangeEnd: dateRangeEnd.toISOString(),
      },
    });
  };

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
          {isActive ? "✅ " : "❌ "}
          {restaurant.restName}
        </TableCell>
        <TableCell>{restaurant.address}</TableCell>

        <button
          className="btn_primary"
          onClick={() => deleteRestaurant(restaurant.restUUID)}
        >
          <DeleteIcon className="icon-padding" />
        </button>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Typography variant="body2">
                Opening hours: {restaurant.openingHour}
                {":00"} - {restaurant.closingHour}
                {":00"}
                <br />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" component="div">
                    Reservations
                  </Typography>

                  <button
                    className="btn_secondary btn_small"
                    onClick={generateAvailabilityReport}
                  >
                    Generate Availability Report
                  </button>
                </Box>
                {reservations.filter((reservation) => {
                  const reservationDate = dayjs(
                    reservation.reservationDateTime
                  );
                  return (
                    reservationDate.isAfter(dateRangeStart) &&
                    reservationDate.isBefore(dateRangeEnd)
                  );
                }).length > 0 ? (
                  <ul>
                    {reservations
                      .filter((reservation) => {
                        const reservationDate = dayjs(
                          reservation.reservationDateTime
                        );
                        return (
                          reservationDate.isAfter(dateRangeStart) &&
                          reservationDate.isBefore(dateRangeEnd)
                        );
                      })
                      .map((reservation) => (
                        <li
                          key={reservation.reservationUUID}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            {dayjs(reservation.reservationDateTime).format(
                              "DD/MM/YYYY"
                            )}
                            {" - "}
                            {reservation.startTime}
                            {":00"}
                            {" - "}
                            {reservation.email}
                            {" - "}
                            {reservation.groupSize}{" "}
                            {reservation.groupSize > 1 ? "people" : "person"}
                          </span>
                          <button
                            className="btn_dark btn_small"
                            onClick={() => {
                              cancelReservation(
                                reservation.email,
                                reservation.confirmationCode
                              );
                            }}
                          >
                            Delete Reservation
                          </button>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <Typography>
                    No reservations found within the specified date range.
                  </Typography>
                )}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function RestaurantTable() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numberToList, setNumberToList] = useState(5);
  const [dateRangeStart, setDateRangeStart] = useState(
    dayjs().set("hour", 0).set("minute", 0).set("second", 0)
  );
  const [dateRangeEnd, setDateRangeEnd] = useState(
    dayjs().add(7, "day").set("hour", 23).set("minute", 59).set("second", 0)
  );

  const fetchRestaurants = (numToList: number) => {
    setLoading(true);
    instance
      .post("/listRestAdmin", { numberToList: numToList })
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

  const deleteRestaurant = (uuidToDelete: string) => {
    instance
      .post("/deleteRestAdmin", { rest_uuid: uuidToDelete })
      .then((response) => {
        try {
          const body = response.data.body;
          console.log(body);

          setRestaurants((prevRestaurants) =>
            prevRestaurants.filter(
              (restaurant) => restaurant.restUUID !== uuidToDelete
            )
          );
        } catch (error) {
          console.error("Failed to parse response body:", error);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch restaurant:", error);
      })
      .finally(() => {});
  };

  // Effect to load restaurants initially
  useEffect(() => {
    fetchRestaurants(numberToList);
  }, [numberToList]); // to not have an infinite loop of rendering

  // Handle Load More Button
  const handleLoadMore = () => {
    setNumberToList((prev) => prev + 5); // Increment by 5
  };

  const [openDialog, setOpenDialog] = useState(false);
  const audio = new Audio("/Rick-Roll-Sound-Effect.mp3");

  const handleEasterEgg = () => {
    audio.play();

    // and open the custom dialog
    setOpenDialog(true);

    // and close the dialog after 5 seconds
    setTimeout(() => {
      setOpenDialog(false);
    }, 9000);
  };

  const stopAudio = () => {
    audio.pause();
    console.log("Stopping audio");
    setOpenDialog(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex w-screen h-screen flex-col items-center p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <CustomDialog isOpen={openDialog} onClose={() => setOpenDialog(false)}>
        <div className="centering-div">
          <img src="rick_heineman.png" alt="Rick Roll" />
          <button className="btn_secondary" onClick={stopAudio}>
            Stop This!
          </button>
        </div>
      </CustomDialog>

      <div className="centering-div div-horiz">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Reservation Date"
            format="ddd DD/MM/YYYY"
            value={dateRangeStart}
            onChange={(newDate) => {
              setDateRangeStart(
                dayjs(newDate).set("hour", 0).set("minute", 0).set("second", 0)
              );
            }}
            maxDate={dateRangeEnd}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "white",
                opacity: 0.9,
              },
            }}
          />

          <DatePicker
            label="Reservation Date"
            format="ddd DD/MM/YYYY"
            value={dateRangeEnd}
            onChange={(newDate) => {
              setDateRangeEnd(
                dayjs(newDate)
                  .set("hour", 23)
                  .set("minute", 59)
                  .set("second", 0)
              );
            }}
            minDate={dateRangeStart}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "white",
                opacity: 0.9,
              },
            }}
          />
        </LocalizationProvider>

        <button className="btn_secondary" onClick={() => handleEasterEgg()}>
          <Search />
        </button>
      </div>

      <Box className="table mt-5">
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
                restaurants.map((restaurant) => (
                  <Row
                    key={restaurant.restUUID}
                    restaurant={restaurant}
                    deleteRestaurant={deleteRestaurant}
                    dateRangeStart={dateRangeStart}
                    dateRangeEnd={dateRangeEnd}
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
    </main>
  );
}
export default withAuthAdmin(RestaurantTable); // Wrap the component with the HOC
