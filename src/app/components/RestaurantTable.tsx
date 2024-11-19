import React from "react";
// import Link from "next/link";
import '@/app/globals.css';

import { useState } from "react";
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

interface Restaurant {
  name: string;
  address: string;
}
// we can get the info later from API
const restaurants: Restaurant[] = [
  { name: "Restaurant A", address: "123 Main St" },
  { name: "Restaurant B", address: "456 Elm St" },
  { name: "Restaurant C", address: "789 Oak St" },
];

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
          {restaurant.name}
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
                Additional details about {restaurant.name} can go here.
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function RestaurantTable() {
    return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Restaurant Name</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurants.map((restaurant) => (
            <Row key={restaurant.name} restaurant={restaurant} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
