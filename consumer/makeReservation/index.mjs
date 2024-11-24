import mysql from 'mysql';

export const handler = async (event) => {
    // Specify credentials
    const pool = mysql.createPool({
        host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "Netro7887",
        database: "tables4u"
    });

    const reservation_uuid = event.resev_uuid;
    const rest_uuid = event.rest_uuid;
    const bench_uuid = event.bench_uuid;
    const reservation_date_time = event.reservation_date_time;
    const start_time = event.start_time;
    const e_mail = event.email;
    const confirmation_code = event.confirmation_code;
    const group_size = event.group_size;

    const newReservation = (reservationUUID, restUUID, benchUUID, reservationDateTime, startTime, email, confirmationCode, groupSize) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO Reservations VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
            pool.query(query, [reservationUUID, restUUID, benchUUID, reservationDateTime, startTime, email, confirmationCode, groupSize],
                (error, result) => {
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
        await newReservation(reservation_uuid, rest_uuid, bench_uuid, reservation_date_time, start_time, e_mail, confirmation_code, group_size);

        response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Reservation Succesfull' })
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
