import jwt from 'jsonwebtoken';

export const handler = async (event) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'; // Set in Lambda environment variables

    // Parse the event body to extract username, password, or the token if it's passed in the request body
    const body = JSON.parse(event.body);
    const token = body.token;  // Assuming the token is sent in the body as { token: <JWT_TOKEN> }

    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Token is required' }),
        };
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Token is valid', decoded }),
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid token' }),
        };
    }
};
