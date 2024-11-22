import axios from "axios";
import React from "react";
import { useRouter  } from "next/router";

const instance = axios.create({
    baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

export default function CreateRest(){
  const router = useRouter();

  const handleClick = () =>{
    instance
      .get("/createRest")
      .then((response)=>{
        try {
          const body = response.data.body;
          const data = body ? JSON.parse(body) : ""; // Parse the response body if defined
          if (data.username != "") {
            console.log("Successful creation")
            router.push(`/editRest?restUUID=${data.restUUID}`);
          }
          
        } catch (error) {
          console.error("Restaurant Creation Failed", error);
        }
      })
  }

  return(
    <button className="btn_dark" onClick={handleClick}>Create Restaurant</button>
  )
}