import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // check the Authorization header for the "Bearer <token>" format
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the decoded payload to the request
        next(); // Pass control to the next function
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};