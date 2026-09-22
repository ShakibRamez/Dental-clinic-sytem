const db = require("../config/dentlDBS")

exports.getPatients = async() => {
    const patients = await db.query("SELECT * FROM patients")
    return patients;
}

exports.getPatientById = async(id) => {
    const patient = await db.query("SELECT * FROM patients WHERE id = $1", [id])
}

exports.addPatient = async(patient_code, first_name, last_name, age, gender, phone, address, national_id, blood_group, allergies, notes) => {
    await db.query("INSERT INTO patients(patient_code, first_name, last_name, age, gender, phone, address, national_id, blood_group, allergies, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
        [patient_code, first_name, last_name, age, gender, phone, address, national_id, blood_group, allergies, notes])
}

exports.deletePatient = async(id) => {
    await db.query("DELETE FROM patients WHERE id = $1", [id])
}

exports.updatePatient = async(id, patient_code, first_name, last_name, age, gender, phone, address, national_id, blood_group, allergies, notes) => {
    await db.query("UPDATE patients SET patient_code = $2, first_name = $3, last_name = $4, age = $5, gender = $6, phone = $7, address = $8, national_id = $9, blood_group = $10, allergies = $11, notes = $12 WHERE id = $1",
        [id, patient_code, first_name, last_name, age, gender, phone, address, national_id, blood_group, allergies, notes]
    )
}



