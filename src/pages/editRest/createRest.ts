import axios from "axios";

const instance = axios.create({
    baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

function createRest(){
    instance
      .get("/createRest")
      .then((response)=>{
        try {
          const body = response.data.body;
          const data = body ? JSON.parse(body) : ""; // Parse the response body if defined
          if (data.username != "") {
            console.log("Successful creation")
          }
        } catch (error) {
          console.error("Restaurant Creation Failed", error);
        }
      })
}

export default createRest;