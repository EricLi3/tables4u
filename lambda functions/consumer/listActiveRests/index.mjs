import mysql from 'mysql';

export const handler = async (event) => {
    // Specify credentials
    const pool = mysql.createPool({
        host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "Netro7887",
        database: "tables4u"
    });

    const numberToList = parseInt(event.numberToList) || 5; // Default to 5 records


    const GetActiveRests = (limit) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants WHERE isActive = 1 LIMIT ?", [limit], (error, rows) => {
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
        const rows = await GetActiveRests(numberToList);
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
