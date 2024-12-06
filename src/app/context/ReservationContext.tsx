// src/context/ReservationContext.tsx
"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

type ReservationContextType = {
  numberOfPeople: number;
  reservationDate: string;
  reservationTime: string;
  setNumberOfPeople: (num: number) => void;
  setReservationDate: (date: string) => void;
  setReservationTime: (time: string) => void;
};

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [numberOfPeople, setNumberOfPeople] = useState(4);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");


  // Log the context values to ensure they are being passed
  // console.log("ReservationProvider State:", {
  //   numberOfPeople,
  //   reservationDate,
  //   reservationTime,
  // });

  return (
    <ReservationContext.Provider
      value={{
        numberOfPeople,
        reservationDate,
        reservationTime,
        setNumberOfPeople,
        setReservationDate,
        setReservationTime,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
};
