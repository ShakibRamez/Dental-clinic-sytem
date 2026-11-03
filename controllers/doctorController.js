const doctorModel = require('../model/doctorModel');
exports.getDoctors = async (req, res) => {
  const doctors = await doctorModel.getDoctors();
  res.json(doctors);
};

exports.getDoctorById = async (req, res) => {
  const id = req.params.id;
  const doctor = await doctorModel.getDoctorById(id);
  res.json(doctor);
}

exports.addDoctor = async (req, res) => {
  const { employment_id, specialization, email, start_time, end_time, full_name, phone, role, username, password_hash } = req.body;
  const newDoctor = await doctorModel.addDoctor({
    employment_id,
    specialization,
    email,
    start_time,
    end_time,
    full_name,
    phone,
    role,
    username,
    password_hash
  });
  res.status(201).json(newDoctor);
};

exports.updateDoctor = async (req, res) => {
  const id = req.params.id;
  const { employment_id, specialization, email, start_time, end_time, full_name, phone, role } = req.body;
  const updatedDoctor = await doctorModel.updateDoctor(id, {
    employment_id,
    specialization,
    email,
    start_time,
    end_time,
    full_name,
    phone,
    role
  });
  res.json(updatedDoctor);
};

exports.deleteDoctor = async (req, res) => {
  const id = req.params.id;
  await doctorModel.deleteDoctor(id);
  res.json({ message: "Doctor deleted successfully" });
};
