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
    const deleted_reservation_uuid = event.reservation_uuid;


    const deleteReservation = (restID) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM Reservations WHERE reservationUUID=?`;
            
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
        await deleteReservation('Reservations', deleted_reservation_uuid);

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