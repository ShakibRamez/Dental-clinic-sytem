const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patientController');

router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.addPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);