import jwt from "jsonwebtoken";

const Auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ status: "unauthorized", message: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: "unauthorized", message: "Invalid token" });
        }
        req.email = decoded.data;
        next();
    });
};

export default Auth;
