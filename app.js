const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

app.use('/', require('./routes/index'));

// Route placeholders (we will uncomment these as we create them)
// app.use('/', require('./routes/indexRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;
