const express = require('express');
const router = express.Router();

const visitController = require('../controllers/visitController');

router.get('/', visitController.getVisits);
router.get('/:id', visitController.getVisitById);
router.post('/', visitController.createVisit);
router.put('/:id', visitController.updateVisit);
router.delete('/:id', visitController.deleteVisit);