const db = require('../config/db');

exports.createVisit = async (visitData) => {
  const { patient_id, doctor_id, visit_date, visit_time, reason, diagnosis, notes, status } = visitData;
    await db.query(
      'INSERT INTO visits (patient_id, doctor_id, visit_date, visit_time, reason, diagnosis, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [patient_id, doctor_id, visit_date, visit_time, reason, diagnosis, notes, status]
    );
}

exports.getAllVisits = async () => {
  const result = await db.query('SELECT * FROM visits');
  return result.rows;
}

exports.getVisitById = async (visitId) => {
  const result = await db.query('SELECT * FROM visits WHERE id = $1', [visitId]);
  return result.rows[0];
}

exports.updateVisit = async (visitId, visitData) => {
  const { patient_id, doctor_id, visit_date, visit_time, reason, diagnosis, notes, status } = visitData;
  await db.query(
    'UPDATE visits SET patient_id = $1, doctor_id = $2, visit_date = $3, visit_time = $4, reason = $5, diagnosis = $6, notes = $7, status = $8 WHERE id = $9',
    [patient_id, doctor_id, visit_date, visit_time, reason, diagnosis, notes, status, visitId]
  );
}

exports.deleteVisit = async (visitId) => {
  await db.query('DELETE FROM visits WHERE id = $1', [visitId]);
}