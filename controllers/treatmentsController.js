const treatmentsModel = require("../models/treatmentsModel");

exports.getTreatments = async (req, res) => {
  try {
    const treatments = await treatmentsModel.getTreatments();
    res.json(treatments);
  } catch (error) {
    console.error("Error fetching treatments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTreatmentById = async (req, res) => {
  try {
    const treatment = await treatmentsModel.getTreatmentById(req.params.id);
    res.json(treatment);
  } catch (error) {
    console.error("Error fetching treatment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addTreatment = async (req, res) => {
  const {
    code,
    name,
    name_persian,
    price,
    duration_minutes,
    description,
    is_active,
  } = req.body;
  try {
    await treatmentsModel.addTreatment(
      code,
      name,
      name_persian,
      price,
      duration_minutes,
      description,
      is_active,
    );
    res.status(201).json({ message: "Treatment added successfully" });
  } catch (error) {
    console.error("Error adding treatment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateTreatment = async (req, res) => {
  const {
    code,
    name,
    name_persian,
    price,
    duration_minutes,
    description,
    is_active,
  } = req.body;
  try {
    await treatmentsModel.updateTreatment(
      req.params.id,
      code,
      name,
      name_persian,
      price,
      duration_minutes,
      description,
      is_active,
    );
    res.json({ message: "Treatment updated successfully" });
  } catch (error) {
    console.error("Error updating treatment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTreatment = async (req, res) => {
  try {
    await treatmentsModel.deleteTreatment(req.params.id);
    res.json({ message: "Treatment deleted successfully" });
  } catch (error) {
    console.error("Error deleting treatment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
