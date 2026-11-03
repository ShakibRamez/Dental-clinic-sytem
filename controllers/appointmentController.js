const appointmentModel = require('../models/appointmentModel');

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.getAppointments();
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

exports.getAppointmentById = async (req, res) => {
    const id = req.params.id;
    try {
        const appointment = await appointmentModel.getAppointmentById(id);
        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
};

exports.addAppointment = async (req, res) => {
    const { patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by } = req.body;
    try {
        await appointmentModel.addAppointment(patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by);
        res.status(201).json({ message: 'Appointment added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add appointment' });
    }
};

exports.updateAppointment = async (req, res) => {
    const id = req.params.id;
    const { patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by } = req.body;
    try {
        await appointmentModel.updateAppointment(id, patient_id, doctor_id, slot_id, visit_id, appointment_type, status, notes, booked_by);
        res.json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
};

exports.deleteAppointment = async (req, res) => {
    const id = req.params.id;
    try {
        await appointmentModel.deleteAppointment(id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
};