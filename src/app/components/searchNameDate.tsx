import axios from "axios";

const instance = axios.create({
    baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

export const searchNameDate=(name:string,dateTime:string)=>{
    let restaurants=[];
    instance
      .post("/searchNameDate", {restName:name,dateTime:dateTime,numSeats:0})
      .then((response) => {
        try {
          const body = response.data.body;
          const data = body ? JSON.parse(body) : [];
          if (Array.isArray(data)) {
            restaurants=data;
          } else {
            console.error("Unexpected data format:", data);
          }
        } catch (error) {
          console.error("Failed to parse response body:", error);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch restaurants:", error);
      })
}