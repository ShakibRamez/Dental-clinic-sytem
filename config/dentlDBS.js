const {Pool} = require('pg');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "FAHB_6814",
    database: "DentalClinicSystemDBS"
})

module.exports = pool;