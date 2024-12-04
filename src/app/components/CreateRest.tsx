import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import "@/app/globals.css";

import CustomDialog from "./CustomDialog";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

export default function CreateRest() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [restUUID, setRestUUID] = useState("");

  const handleClick = () => {
    instance.get("/createRest").then((response) => {
      try {
        const body = response.data.body;
        const data = body ? JSON.parse(body) : ""; // Parse the response body if defined
        if (data.username !== "") {
          console.log("Successful creation");
          setCredentials({ username: data.username, password: data.password });
          setRestUUID(data.restUUID); // Store restUUID
          setOpenDialog(true);
        }
      } catch (error) {
        console.error("Restaurant Creation Failed", error);
      }
    });
  };

  const handleClose = () => {
    setOpenDialog(false);
    // Redirect after closing the dialog
    router.push(`/editRest?restUUID=${restUUID}`);
  };

  return (
    <>
      <button className="btn_dark" onClick={handleClick}>
        Create Restaurant
      </button>

      <CustomDialog isOpen={openDialog} onClose={() => setOpenDialog(false)}>
        <div className="centering-div">
        <h1>New Restaurant Created</h1>
        <p>Your new username: <strong>{credentials.username}</strong></p>
        <p>Your new password: <strong>{credentials.password}</strong></p>
        <button className="btn_secondary" onClick={handleClose}>Go see</button>
        </div>
      </CustomDialog>
    </>
  );
}
