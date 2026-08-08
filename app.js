const express = require('express')
const session = require('express-session')

const checkAuth = require('./Middleware/authMiddleware')
const userRoutes = require("./routes/userRoutes")


const app = express()



// Middleware
app.use(express.json());    

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60, // 1 hour
    }
}));




// Static files
app.use(express.static('Front'))






// Page Routes
app.get('/', (req, res) => {
    res.sendFile('./Front/login.html', {root: __dirname})
})

app.get('/appointments', (req, res) => {
    res.sendFile('./Front/appointments.html', {root: __dirname})
})

app.get('/backups', (req, res) => {
    res.sendFile('./Front/backups.html', {root: __dirname})
})

app.get('/dashboard', (req, res) => {
    res.sendFile('./Front/dashboard.html', {root: __dirname})
})

app.get('/doctors2', (req, res) => {
    res.sendFile('./Front/doctors2.html', {root: __dirname})
})

app.get('/index', (req, res) => {
    res.sendFile('./Front/index.html', {root: __dirname})
})

app.get('/inventory', (req, res) => {
    res.sendFile('./Front/inventory.html', {root: __dirname})
})

app.get('/invoices', (req, res) => {
    res.sendFile('./Front/invoices.html', {root: __dirname})
})

app.get('/loading', (req, res) => {
    res.sendFile('./Front/loading.html', {root: __dirname})
})

app.get('/patient-history', (req, res) => {
    res.sendFile('./Front/patient-history.html', {root: __dirname})
})

app.get('/patients2', (req, res) => {
    res.sendFile('./Front/patients2.html', {root: __dirname})
})

app.get('/prescriptions', (req, res) => {
    res.sendFile('./Front/prescriptions.html', {root: __dirname})
})

app.get('/reports', (req, res) => {
    res.sendFile('./Front/reports.html', {root: __dirname})
})

app.get('/settings', (req, res) => {
    res.sendFile('./Front/settings.html', {root: __dirname})
})

app.get('/treatment-plans', (req, res) => {
    res.sendFile('./Front/treatment-plans.html', {root: __dirname})
})

app.get('/users', async (req, res) => {
    res.sendFile('./Front/users.html', {root: __dirname})
})

app.get('/visits', (req, res) => {
    res.sendFile('./Front/visits.html', {root: __dirname})
})



// API Routes
app.use("/api/users", userRoutes);





// 404 Page
app.use((req, res) => {
    res.sendFile('./Front/404.html', {root: __dirname})
})



// Start the server
app.listen(3000, ()=> {
    console.log("Server running on https://localhost:3000");
})