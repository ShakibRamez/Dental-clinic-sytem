const visitModel = require('../models/visitModel');

exports.getVisits = async (req, res) => {
    const visits = await visitModel.getAllVisits();
    res.json(visits);
};

exports.getVisitById = async (req, res) => {
    const visitId = req.params.id;
    const visit = await visitModel.getVisitById(visitId);
    res.json(visit);
};

exports.createVisit = async (req, res) => {
    const visitData = req.body;
    await visitModel.createVisit(visitData);
    res.json({ message: 'Visit created successfully' });
}

exports.updateVisit = async (req, res) => {
    const visitId = req.params.id;
    const visitData = req.body;
    await visitModel.updateVisit(visitId, visitData);
    res.json({ message: 'Visit updated successfully' });
}

exports.deleteVisit = async (req, res) => {
    const visitId = req.params.id;
    await visitModel.deleteVisit(visitId);
    res.json({ message: 'Visit deleted successfully' });
}
