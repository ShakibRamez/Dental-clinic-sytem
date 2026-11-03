const express = require('express');
const router = express.Router();

const treatmentPlanController = require('../controllers/treatmentPlanController');

router.get('/', treatmentPlanController.getTreatments);
router.get('/:id', treatmentPlanController.getTreatmentById);
router.post('/', treatmentPlanController.addTreatment);
router.put('/:id', treatmentPlanController.updateTreatment);
router.delete('/:id', treatmentPlanController.deleteTreatment);