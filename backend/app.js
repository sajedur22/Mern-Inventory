const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const router = require('./src/routes/api');
const path = require('path');
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
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb'}));

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



// Export
module.exports = app;
