import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';



dotenv.config();
import router from './src/routes/api.js'; // .js extension দিতে হবে
import path from 'path';

const app = express();

// Security Middleware

const CLIENT_URLS = [
    process.env.DEV_CLIENT_URL,
    process.env.PROD_CLIENT_URL,
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || CLIENT_URLS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(hpp());

// Custom Mongo Sanitize Middleware
function sanitizeMongo(req, res, next) {
    const sanitize = (obj) => {
        for (let key in obj) {
            if (/^\$/.test(key) || /\./.test(key)) {
                delete obj[key];
            } else if (typeof obj[key] === 'object') {
                sanitize(obj[key]);
            }
        }
    };
    sanitize(req.body);
    sanitize(req.query);
    sanitize(req.params);
    next();
}
app.use(sanitizeMongo);

// JSON Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3000,
    message: {
        status: "fail",
        message: "Too many requests from this IP, please try again later."
    }
});
app.use(limiter);
app.use(cookieParser());

// MongoDB Connection
const uri = process.env.MONGO_URI;
const options = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    autoIndex: process.env.MONGO_AUTO_INDEX === 'true',
};

mongoose.connect(uri, options)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// API Routing
app.use("/api/v1", router);

export default app;
