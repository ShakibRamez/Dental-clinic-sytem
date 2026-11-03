const db = require('../config/dentlDBS')

exports.getTreatments = async() => {
    const treatments = db.query("SELECT * FROM treatments")
    return treatments;
}

exports.getTreatmentById = async(id) => {
    const treatment = db.query("SELECT * FROM treatments WHERE id = $1", [id])
    return treatment;
}

exports.addTreatment = async(code, name, name_persian, price, duration_minutes, description, is_active) => {
    await db.query("INSERT INTO treatments(code, name, name_persian, price, duration_minutes, description, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)", [code, name, name_persian, price, duration_minutes, description, is_active])
}

exports.updateTreatment = async(id, code, name, name_persian, price, duration_minutes, description, is_active) => {
    await db.query("UPDATE treatments SET code = $1, name = $2, name_persian = $3, price = $4, duration_minutes = $5, description = $6, is_active = $7 WHERE id = $8", [code, name, name_persian, price, duration_minutes, description, is_active, id])
}

exports.deleteTreatment = async(id) => {
    await db.query("DELETE FROM treatments WHERE id = $1", [id])
}