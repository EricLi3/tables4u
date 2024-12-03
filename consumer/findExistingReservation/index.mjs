import mysql from "mysql";

export const handler = async (event) => {
  // Specify credentials
  const pool = mysql.createPool({
    host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Netro7887",
    database: "tables4u",
  });

  const e_mail = event.email;
  const confirmation_code = event.confCode;

  const findResevation = (e_mail, confirmation_code) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM Reservations WHERE email = ? AND confirmationCode = ? ";
      pool.query(query, [e_mail, confirmation_code], (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  };

  const getRestaurantInfo = (restUUID) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT restName, address FROM Restaurants WHERE restUUID = ?";
      pool.query(query, [restUUID], (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  };

  let response;

  try {
    // Execute delete queries sequentially
    const result = await findResevation(e_mail, confirmation_code);
    if (result.length === 0) {
      throw new Error("Reservation not found");
    }
    const restUUID = result[0].restUUID;
    const restInfo = await getRestaurantInfo(restUUID);
    if (restInfo.length === 0) {
      throw new Error("Restaurant not found");
    }

    response = {
      statusCode: 200,
      body: JSON.stringify({
        result, restInfo,
      }),
    };
  } catch (error) {
    console.error("ERROR:", error);
    response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    // Close the pool after all operations are done
    pool.end();
  }

  return response;
};
