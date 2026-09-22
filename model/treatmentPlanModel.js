const db = require('../config/dentlDBS')

exports.getTreatments = async() => {
    const treatments = db.query("SELECT * FROM treatment_plans")
    return treatments;
}

exports.getTreatmentById = async(id) => {
    const treatment = db.query("SELECT * FROM treatment_plans WHERE id = $1", [id])
}

exports.addTreatment = async(plan_id, treatment_id, quantity, price, discount, notes) => {
    await db.query("INSERT INTO treatment_plans(plan_id, treatment_id, quantity, price, discount, notes) VALUES ($1, $2, $3, $4, $5, $6)"), [plan_id, treatment_id, quantity, price, discount, notes]
}

exports.updateTreatment = async(plan_id, treatment_id, quantity, price, discount, notes) => {
    await db.query("UPDATE treatment_plans SET plan_id, treatment_id, quantity, price, discount, notes) VALUES ", [plan_id, treatment_id, quantity, price, discount, notes])
}

exports.deleteTreatment = async(id) => {
    await db.query("DELETE FROM treatment_plans WHERE id = $1", [id])
}

