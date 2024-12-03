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


    const ReserveBench = (rest_uuid, group_size) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Benches WHERE restUUID = ? AND isReserved = 0 AND numSeats <= ? LIMIT 1", [rest_uuid, group_size], (error, rows) => {
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
        const rows = await ReserveBench(rest_uuid, group_size);
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