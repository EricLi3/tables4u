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


    const GetRest = (rest_uuid) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants WHERE restUUID=?", [rest_uuid], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                return resolve(rows); // Return rows if successful
            });
        });
    };

    const GetBenches = (rest_uuid) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Benches WHERE restUUID=?", [rest_uuid], (error, rows) => {
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
        const restaurantRows = await GetRest(rest_uuid);
        const benchesRows = await GetBenches(rest_uuid);

        console.log('Restaurant query result:', restaurantRows);
        console.log('Benches query result:', benchesRows);

        response = {
            statusCode: 200,
            body: JSON.stringify({
                restaurant: restaurantRows,
                benches: benchesRows
            })
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