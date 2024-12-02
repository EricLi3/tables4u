"use client";

import React from "react";
import Link from "next/link";
import "@/app/globals.css";

// Custom components
import RestaurantTable from "@/app/components/RestaurantTable";
import CreateRest from "@/app/components/CreateRest";

// Material UI components
import MenuIcon from "@mui/icons-material/Menu";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";

// For time and date picking
import { Search } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// For global state management
import { useReservation } from "@/app/context/ReservationContext";


export default function Home() {
  // const [dateTime, setDateTime] = useState(dayjs());

  const {
    numberOfPeople,
    reservationDate,
    reservationTime,
    setNumberOfPeople,
    setReservationDate,
    setReservationTime,
  } = useReservation();


  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <div className="table">
        <h1>Tables4u</h1>
        <br />
        <div>
          <label>Number of People</label>
          <Slider
            className="slider"
            value={numberOfPeople}
            aria-label="Number of People"
            valueLabelDisplay="on"
            step={1}
            marks
            min={1}
            max={8}
            onChange={(e, value) => setNumberOfPeople(value as number)}
          />
        </div>
        {/* Search navigation */}
        <div className="centering-div">
          <div className="centering-div div-horiz">
            <TextField
              id="outlined-required"
              color="secondary"
              label="Restaurant Name"
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Reservation Date"
                format="ddd DD/MM/YYYY"
                value={reservationDate ? dayjs(reservationDate) : null}
                onChange={(newDate) => {
                  if (newDate) {
                    setReservationDate(newDate.format("YYYY-MM-DD"));
                  }
                }}
              />

              <MobileTimePicker
                label="Reservation Time"
                format="HH:mm"
                value={reservationTime ? dayjs(reservationTime, "HH:mm") : null}
                views={["hours"]}
                ampm={false}
                defaultValue={dayjs().set("minute", 0)}

                onChange={(newTime) => {
                  if (newTime) {
                    setReservationTime(newTime.format("HH:mm"))
                  }
                }}
                minTime={dayjs().set("hour", 0).set("minute", 0)}
                maxTime={dayjs().set("hour", 23).set("minute", 0)}
              />
            </LocalizationProvider>
          </div>
          <div className="centering-div div-horiz">
            <button className="btn_secondary">
              Name & Day
              <Search className="icon-padding" />
            </button>
            <button className="btn_secondary">
              Date & Time
              <Search className="icon-padding" />
            </button>
          </div>
        </div>

        <RestaurantTable
          dateTime={`${reservationDate} ${reservationTime}`}
        />
      </div>

      <div className="loginNav centering-div">
        <div className="centering-div div-horiz">
          <Link href="/login/manager">
            <img
              src="manager.png"
              alt="Manager Login Button"
              className="loginImg"
            />
            <div className="icon-center">
              <MenuIcon />
            </div>
          </Link>
          <Link href="/login/admin">
            <img
              src="admin.png"
              alt="Admin Login Button"
              className="loginImg"
            />
            <div className="icon-center">
              <MenuIcon />
            </div>
          </Link>
        </div>
        <CreateRest />
      </div>

      <div className="findAndCancel centering-div">
        <Link href="/login/consumer">
          <button className="btn_secondary">Find Reservation</button>
        </Link>
        <Link href="/login/consumer">
          <button className="btn_primary">Cancel Reservation</button>
        </Link>
      </div>
    </main>
  );
}
