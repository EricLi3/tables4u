import mysql from 'mysql';

export const handler = async (event) => {
    // Specify credentials
    const pool = mysql.createPool({
        host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "Netro7887",
        database: "tables4u"
    });
    // TODO: Change me.
    const deleted_rest_uuid = event.rest_uuid;


    const deleteFromTable = (table, restID) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM ${table} WHERE restUUID=?`;
            pool.query(query, [restID], (error, result) => {
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
        await deleteFromTable('Restaurants', deleted_rest_uuid);
        await deleteFromTable('Benches', deleted_rest_uuid);
        await deleteFromTable('Reservations', deleted_rest_uuid);

        response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Deletion successful' })
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