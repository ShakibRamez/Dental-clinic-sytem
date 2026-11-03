const treatmentPlanModel = require('../models/treatmentPlanModel');

exports.getTreatments = async (req, res) => {
    const treatments = await treatmentPlanModel.getTreatments();
    res.json(treatments);
}

exports.getTreatmentById = async (req, res) => {
    const id = req.params.id;
    const treatment = await treatmentPlanModel.getTreatmentById(id);
    res.json(treatment);
}

exports.addTreatment = async (req, res) => {
    const { plan_id, treatment_id, quantity, price, discount, notes } = req.body;
    await treatmentPlanModel.addTreatment(plan_id, treatment_id, quantity, price, discount, notes);
    res.json({ message: "Treatment added successfully" });
}

exports.updateTreatment = async (req, res) => {
    const id = req.params.id;
    const { plan_id, treatment_id, quantity, price, discount, notes } = req.body;
    await treatmentPlanModel.updateTreatment(plan_id, treatment_id, quantity, price, discount, notes);
    res.json({ message: "Treatment updated successfully" });
}

exports.deleteTreatment = async (req, res) => {
    const id = req.params.id;
    await treatmentPlanModel.deleteTreatment(id);
    res.json({ message: "Treatment deleted successfully" });
}