import mysql from 'mysql';

export const handler = async (event) => {
    // Specify credentials
    const pool = mysql.createPool({
        host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "Netro7887",
        database: "tables4u"
    });

    const rest_uuid = event.rest_uuid;
    const group_size = event.group_size;
    const start_time = event.start_time;
    const reservationDateTime = event.reservationDateTime;

    const ReserveBench = (rest_uuid, group_size, start_time, reservationDateTime) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT b.benchUUID, b.benchName, b.numSeats
                FROM Benches b
                LEFT JOIN Reservations r 
                    ON b.benchUUID = r.benchUUID
                    AND r.reservationDateTime LIKE ?
                    AND r.startTime LIKE ?
                WHERE b.restUUID = ?
                    AND b.numSeats >= ?
                    AND r.benchUUID IS NULL
				ORDER BY b.numSeats
                LIMIT 1
            `;

            pool.query(query, [reservationDateTime.slice(0,10)+'%', start_time+'%', rest_uuid, group_size], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                return resolve(rows); // Return rows if successful
            });
        });
    };

    let response;

    try {
        // Wait for the query result
        const rows = await ReserveBench(rest_uuid, group_size, start_time, reservationDateTime);
        console.log('Query result:', rows);

        response = {
            statusCode: 200,
            body: JSON.stringify(rows)
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

console.log(await handler({
    rest_uuid: "123e4567-e89b-12d3-a456-426614174004",
    group_size: '4',
    start_time: '15',
    reservationDateTime: "2024-12-12",
}));