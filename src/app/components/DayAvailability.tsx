import React, { use } from "react";
import "@/app/globals.css";
import "./DayAvailability.css"; // Import the CSS file

import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { Box } from "@mui/material";

// a component that will receive a date, status open/closed, opening and closing time, a list of benches (name, seats), and a list of times it has been reserved that day (time, numOfPeople)

// --JJ

export default function DayAvailability({
  date,
  state,
  openingTime,
  closingTime,
  benchesAndReservations,
}: {
  date: string;
  state: boolean;
  openingTime: number;
  closingTime: number;
  benchesAndReservations: {
    benchName: string;
    numSeats: number;
    reservations: { time: number; numOfPeople: number }[];
  }[];
}) {
  const [numTables, setNumTables] = useState(0);

  useEffect(() => {
    setNumTables(benchesAndReservations.length);
  }, [benchesAndReservations]);

  const makeHeaders = () => {
    return benchesAndReservations.map((bench) => (
      <th key={bench.benchName}>
        {/* make sure to only grab the first couple letters so the table does not explode */}
        {bench.benchName.slice(0, 7)} ({bench.numSeats})
      </th>
    ));
  };

  const makeRow = (hour: number) => {
    const totalPeople = benchesAndReservations.reduce((acc, bench) => {
      const reservation = bench.reservations.find((res) => res.time === hour);
      return acc + (reservation ? reservation.numOfPeople : 0);
    }, 0);

    const totalSeats = benchesAndReservations.reduce(
      (acc, bench) => acc + bench.numSeats,
      0
    );

    const tablesReserved = benchesAndReservations.reduce((acc, bench) => {
      const reservation = bench.reservations.find((res) => res.time === hour);
      return acc + (reservation ? 1 : 0);
    }, 0);

    return (
      <tr key={hour}>
        <td>{hour}</td>
        <td></td>
        {benchesAndReservations.map((bench) => {
          const reservation = bench.reservations.find(
            (res) => res.time === hour
          );
          return (
            <td key={bench.benchName}>
              {reservation ? reservation.numOfPeople : 0}
            </td>
          );
        })}
        <td></td>
        <td>{totalSeats - totalPeople}</td>
        <td>{Math.round((totalPeople / totalSeats) * 100)}%</td>
        <td>
          {Math.round((tablesReserved / benchesAndReservations.length) * 100)}%
        </td>
      </tr>
    );
  };

  const makeRows = () => {
    const rows = [];
    for (let i = openingTime; i < closingTime; i++) {
      rows.push(makeRow(i));
    }
    return rows;
  };

  //it will display every hour as a row
  // in each row the columns will be: every table (with maximum number of seats in brackets), then the sum of people reserved for that hour, then the sum of available seats for that hour
  //  then the percentage utilization of the tables based on people for that hour, last the availability in terms of percentage of tables free (zero people reserved for that hour) over total tables
  return (
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
      <h2>{dayjs(date).format("ddd DD/MM/YYYY")}</h2>
      <h3>Status: {state ? "✅" : "❌"}</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          border: "1px solid black", // Add grid to the table
        }}
      >
        <thead>
          <tr>
            <th>Hour</th>
            <th></th>
            {makeHeaders()}
            <th></th>
            <th>Available Seats</th>
            <th>Utilization</th>
            <th>Availability</th>
          </tr>
        </thead>
        {state && <tbody>{makeRows()}</tbody>}
      </table>
    </Box>
  );
}
