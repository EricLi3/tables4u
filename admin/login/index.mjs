import mysql from 'mysql';
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
    // Specify credentials
    const pool = mysql.createPool({
        host: "calculatordb1.c7woyy8ecbg9.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "Netro7887",
        database: "tables4u"
    });

    const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'; // Set in Lambda environment variables

    const username = event.username;
    const password = event.password;

    if (!username || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Username and password are required' }),
        };
    }

    const query = 'SELECT * FROM Administrators WHERE userName = ?';
    

    const queryPromise = (query, params) => {
        return new Promise((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    try {
        const rows = await queryPromise(query, [username]);

        if (rows.length === 0) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid username or password' }),
            };
        }

        const user = rows[0];

        if (user.pass !== password) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid username or password' }),
            };
        }

        const token = jwt.sign({ userUUID: user.adminUUID, userName: user.userName }, JWT_SECRET, {
            expiresIn: '1h',
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Login successful', token }),
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    } finally {
        pool.end();
    }
};
