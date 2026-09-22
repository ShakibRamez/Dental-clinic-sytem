const db = require('../config/dentlDBS')

exports.getDoctors = async() => {
    const doctors = await db.query("SELECT * FROM doctors AS d JOIN users AS u ON d.employment_id = u.id");
    return doctors;
}

exports.getDoctorById = async(id) => {
    const doctor = await db.query("SELECT * FROM doctors AS d JOIN users AS u ON d.employment_id = u.id WHERE u.id = $1", [id])
    return doctor;
}

exports.deleteDoctor = async(id) => {
    await db.query('DELETE FROM doctors WHERE id = $1', [id])
}

exports.updateDoctor = async(id, doctor) => {
    const { employment_id, specialization, email, start_time, end_time, full_name, phone, role } = doctor;
    
    await db.query('UPDATE doctors SET email = $1, specialization = $2, end_time = $3, start_time = $4  WHERE id = $5', [email, specialization, end_time, start_time, id])

    await db.query('UPDATE users SET full_name = $1, phone = $2, role = $3 WHERE id = $4', [full_name, phone, role, employment_id])

}

exports.addDoctor = async(doctor) => {
    const { employment_id, specialization, email, start_time, end_time, full_name, phone, role, username, password_hash } = doctor;
    await db.query('INSERT INTO doctors (employment_id, specialization, email, start_time, end_time, full_name, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)', [employment_id, specialization, email, start_time, end_time])

    await db.query("INSERT INTO users (full_name, phone, role, username, password_hash) VALUES ($1, $2, $3, $4, $5)", [full_name, phone, role, username, password_hash])
}