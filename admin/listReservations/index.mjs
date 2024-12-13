import mysql from 'mysql';

export const handler = async (event) => {
    // Specify credentials
    const pool = mysql.createPool({
        host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "Netro7887",
        database: "tables4u"
    });

    const restUUID = event.restUUID; // Default to 5 records


    const GetReservations = (rest_uuid) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Reservations WHERE restUUID=?", [rest_uuid], (error, rows) => {
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
        const rows = await GetReservations(restUUID);
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