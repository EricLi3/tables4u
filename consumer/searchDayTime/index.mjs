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
    const numberPeople = parseInt(event.groupSize);
    const dateTime = event.reservation_date_time;
    
    const dateTimeModClosed = dateTime.slice(0,10); //Test this to make sure it works, might have to make it into the year-month-day object
    const dateTimeModRes = dayjs(dataTime).set("hour", 12).set("minute", 0);
    const dateTimeHour = dateTime.slice(11,12);

    const query1="SELECT * FROM Restaurants AND isActive = 1 AND openingHour <= ? AND closingHour >= ?"; 
    const query2="SELECT * FROM ClosedDays WHERE closedDate = ?";
    const query3="SELECT * FROM Reservations WHERE reservationDateTime = ? AND restUUID=?";
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

        let dict = {};
        let body = [];

        const restaurants = await queryPromise(query1,[dateTimeHour]);
        const closedDays = await queryPromise(query2,[dateTimeModClosed]);
        let filterList1 = [];
        let filterList2 = [];
        
        for(var i = 0; i < restaurants.lenght; i++){
            for(var j = 0; j < closedDays.lenght; j++){
                if(Restaurant[i].restUUID != ClosedDay[j].restUUID){
                    filterList1.push(restaurant[i])
                }
            }
        }


        const closedByReservation = await queryPromise(query3, [dateTimeModRes, filterList1.restUUID]); // Need to make an arry and then map out the atribute
        const checkingTables = await queryPromise(query4, [filterList1.restUUID])

        for(var i = 0; i < filterList1.lenght; i++){
            for(var j = 0; j < closedByReservation.lenght; j++){
                if(Restruant[i].restUUID != Reservation.restUUID[j]){
                    filterList2.push(restaurant[i]);
                    break;
                }
                for(var k = 0; k < checkingTables.lenght; k++){
                    if(Restaurant[i].restUUID == Benches[k].restUUID){
                        if(Benches[k].benchUUID != Reservation.benchUUID[j]){
                            filterList2.push(restaurant[i]);
                            break;
                        }
                    }
                }
            }
        }

    } catch (error) {
        
    }




};
