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
    const dateTime = event.dateTime;
    const numSeats = parseInt(event.numSeats);
    
    const dateTimeModClosed = dateTime.slice(0,10); //Test this to make sure it works, might have to make it into the year-month-day object
    const dateTimeModRes = dayjs(dataTime).set("hour", 12).set("minute", 0);
    const dateTimeHour = dateTime.slice(11,12);

    const query1="SELECT * FROM Restaurants AND isActive = 1 AND openingHour <= ? AND closingHour >= ?"; 
    const query2="SELECT * FROM ClosedDays WHERE closedDate = ?";
    const query3="SELECT * FROM Reservations WHERE reservationDateTime = ?";
    const query4="SELECT * FROM Benches WHERE restUUID=?"


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



    try {

        const restaurants = await queryPromise(query1,[dateTimeHour]);
        const closedDays = await queryPromise(query2,[dateTimeModClosed]);
        let filterList1 = [];
        let filterList2 = [];
        
        for(var i = 0; i < restaurants.length; i++){
            for(var j = 0; j < closedDays.length; j++){
                if(restaurants[i].restUUID != closedDays[j].restUUID){
                    filterList1.push(restaurants[i])
                }
            }
        }

        const closedByReservation = await queryPromise(query3, [dateTimeModRes]); 
        const checkingTables = await queryPromise(query4, [filterList1.restUUID])

        for(var i = 0; i < filterList1.length; i++){
            for(var j = 0; j < closedByReservation.length; j++){
                if(filterList1[i].restUUID != closedByReservation[j].restUUID){
                    filterList2.push(filterList1[i]);
                    break;
                }
                for(var k = 0; k < checkingTables.length; k++){
                    if(filterList1[i].restUUID == checkingTables[k].restUUID){
                        if(checkingTables[k].benchUUID != closedByReservation[j].benchUUID && checkingTables[k].numSeats >= numSeats){
                            filterList2.push(filterList1[i]);
                            break;
                        }
                    }
                }
            }
        }
        


        response = {
            statusCode: 200,
            body:JSON.stringify({dateTime: dateTime, numSeats: numSeats, Restaurants: filterList2.slice(0,numberToList)})
            
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




};
