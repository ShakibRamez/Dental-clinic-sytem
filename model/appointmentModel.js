const db = require('../config/dentlDBS')


exports.getAppointments = async() => {
    const appointments = db.query("SELECT * FROM appointments")
    return appointments;
}

exports.getAppointmentById = async(id) => {
    const appointment = db.query("SELECT * FROM appointments WHERE id = $1", [id])
    return appointment;
}

exports.addAppointment = async(patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by) => {
    await db.query("INSERT INTO appointments(patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by])
}

exports.updateAppointment = async(id, patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by) => {
    await db.query("UPDATE appointments SET patient_id = $1, doctor_id = $2, slot_id = $3, visit_id = $4, appointment_type = $5, status = $6, notes = $7, booked_by = $8 WHERE id = $9", [patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by, id])
}

exports.deleteAppointment = async(id) => {
    await db.query("DELETE FROM appointments WHERE id = $1", [id])
}