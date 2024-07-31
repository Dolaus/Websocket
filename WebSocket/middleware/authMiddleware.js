import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ message: "No authorization header" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "Token not provided" });
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;

        next();
    } catch (e) {
        console.error(e);
        return res.status(403).json({ message: "Not authorized" });
    }
}
