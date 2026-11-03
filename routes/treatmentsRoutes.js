const express = require('express');
const router = express.Router();

const treatmentsController = require('../controllers/treatmentsController');


router.get('/', treatmentsController.getTreatments);
router.get('/:id', treatmentsController.getTreatmentById);
router.post('/', treatmentsController.addTreatment);
router.put('/:id', treatmentsController.updateTreatment);
router.delete('/:id', treatmentsController.deleteTreatment);