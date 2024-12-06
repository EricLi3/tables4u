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
    const end_time = event.end_time;

    const ReserveBench = (rest_uuid, group_size, start_time, end_time) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT b.benchUUID, b.benchName, b.numSeats
                FROM Benches b
                LEFT JOIN Reservations r 
                    ON b.benchUUID = r.benchUUID 
                    AND r.startTime >= ? 
                    AND r.startTime <= ?
                WHERE b.restUUID = ?
                    AND b.numSeats >= ?
                    AND r.reservationUUID IS NULL
                    LIMIT 1;
            `;

            pool.query(query, [start_time, end_time, rest_uuid, group_size], (error, rows) => {
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
        const rows = await ReserveBench(rest_uuid, group_size, start_time, end_time);
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