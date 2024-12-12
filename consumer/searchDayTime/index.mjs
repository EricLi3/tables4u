import mysql from 'mysql';
import dayjs from "dayjs";

export const handler = async (event) => {
    // Specify credentials
    const pool = mysql.createPool({
        host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "Netro7887",
        database: "tables4u"
    });

    const numberToList = parseInt(event.numberToList) || 5; // Default to 5 records
    const dateTime = dayjs(event.dateTime).set("minute", 0).set("second", 0);
    const numSeats = parseInt(event.numSeats);

    const dateTimeModClosed = dateTime.format("YYYY-MM-DD").toString();
    const dateTimeModRes = dateTime.format("YYYY-MM-DD HH:00:00").toString();
    const dateTimeHour = dateTime.hour().toString();

    console.log(dateTimeModClosed)
    console.log(dateTimeModRes)
    console.log(dateTimeHour)

    // there is no good way to do SQL select * except the userName and pass for SOME GOD DAMN REASON
    // intsert a meme quote: "I'm sorry, I can't do that Dave" - SQL
    const query1 = "SELECT restUUID, restName, address, openingHour, closingHour FROM Restaurants WHERE isActive = 1 AND openingHour <= ? AND closingHour >= ?";
    const query2 = "SELECT * FROM ClosedDays WHERE closedDate = ?";
    const query3 = "SELECT * FROM Reservations WHERE reservationDateTime = ?";
    const query4 = "SELECT * FROM Benches WHERE restUUID = ?"


    const queryPromise = (query, params) => {
        return new Promise((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    console.log("Searching for restaurants with available tables on", dateTime);

    let response;

    try {

        const restaurants = await queryPromise(query1, [dateTimeHour, dateTimeHour]);
        const closedDays = await queryPromise(query2, [dateTimeModClosed]);
        let filterList1 = [];
        let filterList2 = [];

        for (var i = 0; i < restaurants.length; i++) {
            for (var j = 0; j < closedDays.length; j++) {
                if (restaurants[i].restUUID != closedDays[j].restUUID) {
                    filterList1.push(restaurants[i])
                }
            }
        }

        console.log("Restaurants found:", filterList1.length);

        const closedByReservation = await queryPromise(query3, [dateTimeModRes]);
        console.log(closedByReservation);

        const filterList1UUIDs = filterList1.map(rest => rest.restUUID).join(", ");
        const checkingTables = await queryPromise(query4, [filterList1UUIDs]);

        console.log(checkingTables);

        for (var i = 0; i < filterList1.length; i++) {
            if (closedByReservation.lenght == 0)
                filterList2 = filterList1;

            for (var j = 0; j < closedByReservation.length; j++) {
                // Checking if any reservation has the same UUID as any of the resturants filtered befor. 
                // Effectivly: We are checking for any resturants have no reservations on that day, and adding them to the list. 
                if (filterList1[i].restUUID != closedByReservation[j].restUUID) {
                    console.log("Found Res with no reservations");
                    filterList2.push(filterList1[i]);
                    break;
                }

                for (var k = 0; k < checkingTables.length; k++) {
                    if (filterList1[i].restUUID == checkingTables[k].restUUID) {
                        // Checking if bench[k] (which we know belongs to resturant[i]) doesn't have the same benchUUID as any of the active reservations we are searching
                        // We also check if the number of seats the in an avialbe bench are larger than our group search size
                        // Effectivly: We check if any benches[k] from resturant[i] have been reserved, and if the number of tables benches[k] has is larger than or equal your party size 
                        if (checkingTables[k].benchUUID != closedByReservation[j].benchUUID && checkingTables[k].numSeats >= numSeats) {
                            console.log("Found Res with no reservations");
                            filterList2.push(filterList1[i]);
                            break;
                        }
                    }
                }
            }
        }

        console.log("Restaurants with available tables found:", filterList2.length);
        console.log("Resturant return list " + filterList2);

        response = {
            statusCode: 200,
            body: JSON.stringify({ dateTime: dateTime, numSeats: numSeats, Restaurants: filterList2.slice(0, numberToList) })

        };


    } catch (error) {
        console.error("ERROR:", error);
        response = {
            statusCode: 400,
            body: JSON.stringify({ error: error.message })
        };

    } finally {
        // Close the pool after all operations are done
        pool.end();
    }
    return response;
};
