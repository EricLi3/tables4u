import mysql from 'mysql';

export const handler = async (event) => {
    // Specify credentials
    const pool = mysql.createPool({
        host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "Netro7887",
        database: "tables4u"
    });

    const e_mail = event.email;
    const confirmation_code = event.confirmation_code;



    const deleteReservation = (e_mail, confirmation_code) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM Reservations WHERE email=? AND confirmationCode=?";
            pool.query(query, [e_mail, confirmation_code], (error, result) => {
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
        await deleteReservation(e_mail, confirmation_code);

        response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Deletion Succesfull' })
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