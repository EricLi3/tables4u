"use client";

import React from "react";
import Link from "next/link";
import "@/app/globals.css";

// Custom components
import RestaurantTable from "@/app/components/RestaurantTable";

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

export default function Home() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between p-24">
      <div className="top-left-button">
        <Link href="/">
          <img src="logo.png" alt="Home Button" className="logo" />
        </Link>
      </div>

      <div className="table">
        <h1>Tables4u</h1>
        <br></br>
        <div>
          <label>Number of People</label>
          <Slider
            className="slider" /* Apply custom slider class */
            defaultValue={4}
            aria-label="Always visible"
            valueLabelDisplay="on"
            step={1}
            marks
            min={1}
            max={8}
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
                value={dayjs()} 
                format="ddd DD/MM/YYYY"
              />

              <MobileTimePicker
                label="Reservation Time"
                format="HH:mm"
                views={["hours"]}
                ampm={false}
                defaultValue={dayjs().set("minute", 0)}
                minTime={dayjs().set("hour", 0)} //TODO: Set minTime to restaurant opening hour
                maxTime={dayjs().set("hour", 23)} //TODO: Set maxTime to restaurant closing hour
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

        <RestaurantTable />
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

        <Link href="/createRest">
          <button className="btn_dark">Create Restaurant</button>
        </Link>
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
