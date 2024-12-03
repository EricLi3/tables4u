import mysql from "mysql";
import { v4 as uuidv4 } from "uuid";

export const handler = async (event) => {
  const pool = mysql.createPool({
    host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Netro7887",
    database: "tables4u",
  });

  const {
    restUUID,
    restName,
    restAddress,
    openingTime,
    closingTime,
    tables: tablesAndSeats,
    newPassword: password = "",
  } = event;

  // validation of inputs
  if (
    !restUUID ||
    !restName ||
    !restAddress ||
    !tablesAndSeats ||
    !Array.isArray(tablesAndSeats)
  ) {
    return {
      statusCode: 400,
      error: "Invalid input parameters.",
    };
  }

  // check if tablesAndSeats contains at least one table
  if (tablesAndSeats.length < 1) {
    return {
      statusCode: 400,
      error: "A restaurant must have at least one table.",
    };
  }

  const queryPromise = (query, params) =>
    new Promise((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

  try {
    // verify restaurant exists and is isActive = 0
    const rows = await queryPromise(
      "SELECT * FROM Restaurants WHERE restUUID = ?",
      [restUUID]
    );
    if (rows.length === 0) {
      return {
        statusCode: 400,
        error: "Restaurant does not exist.",
      };
    }
    if (rows[0].isActive === 1) {
      return {
        statusCode: 400,
        error: "Restaurant is currently active, cannot edit.",
      };
    }

    // update restaurant
    const updateQuery = password
      ? "UPDATE Restaurants SET restName = ?, address = ?, openingHour = ?, closingHour = ?, pass = ? WHERE restUUID = ?"
      : "UPDATE Restaurants SET restName = ?, address = ?, openingHour = ?, closingHour = ? WHERE restUUID = ?";
    const updateParams = password
      ? [restName, restAddress, openingTime, closingTime, password, restUUID]
      : [restName, restAddress, openingTime, closingTime, restUUID];
    await queryPromise(updateQuery, updateParams);

    // delete existing tables
    await queryPromise("DELETE FROM Benches WHERE restUUID = ?", [restUUID]);

    // put in new tables with a single SQL query
    const values = tablesAndSeats.map((table) => {
      const benchUUID = table.benchUUID || uuidv4();
      const { benchName, numSeats } = table;

      // validate the two parameters that had to be provided
      if (!benchName || !numSeats) {
      throw new Error("Each table must have a valid benchName and numSeats.");
      }
      return `('${benchUUID}', '${benchName}', ${numSeats}, '${restUUID}')`;
    }).join(", ");

    const insertQuery = `
      INSERT INTO Benches (benchUUID, benchName, numSeats, restUUID) 
      VALUES ${values}
    `;
    await queryPromise(insertQuery);

    return {
      statusCode: 200,
      status: "Changes saved successfully.",
    };
  } catch (error) {
    console.error("ERROR:", error);
    return {
      statusCode: 500,
      error: error.message || "Internal server error.",
    };
  } finally {
    pool.end();
  }
};
