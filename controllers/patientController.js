const patientModel = require("../models/patientModel");
exports.getPatients = async (req, res) => {
  const patients = await patientModel.getPatients();
  res.json(patients);
};

exports.getPatientById = async (req, res) => {
  const id = req.params.id;
  const patient = await patientModel.getPatientById(id);
  res.json(patient);
};

exports.addPatient = async (req, res) => {
  const {
    patient_code,
    first_name,
    last_name,
    age,
    gender,
    phone,
    address,
    national_id,
    blood_group,
    allergies,
    notes,
  } = req.body;
  const newPatient = await patientModel.addPatient({
    patient_code,
    first_name,
    last_name,
    age,
    gender,
    phone,
    address,
    national_id,
    blood_group,
    allergies,
    notes,
  });
  res.status(201).json(newPatient);
};

exports.updatePatient = async (req, res) => {
  const {
    id,
    patient_code,
    first_name,
    last_name,
    age,
    gender,
    phone,
    address,
    national_id,
    blood_group,
    allergies,
    notes,
  } = req.body;
  const updatedPatient = await patientModel.updatePatient({
    id,
    patient_code,
    first_name,
    last_name,
    age,
    gender,
    phone,
    address,
    national_id,
    blood_group,
    allergies,
    notes,
  });
  res.json(updatedPatient);
};

exports.deletePatient = async (req, res) => {
  const id = req.params.id;
  await patientModel.deletePatient(id);
  res.json({ message: "Patient deleted successfully" });
};
