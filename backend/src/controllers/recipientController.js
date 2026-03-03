/**
 * Recipient controller — HTTP request handlers delegating to service layer
 * @module recipientController
 */
const svc = require('../services/recipientService');

/**
 * GET /api/recipients
 * Query: ?page=1&limit=20&search=
 * Response: { data: [], total, page }
 */
async function getAll(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const search = req.query.search || '';
    const result = svc.listRecipients(page, limit, search);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/recipients
 * Body: { email, name?, tags? }
 * Response: 201 + { id, email, name }
 */
async function create(req, res, next) {
  try {
    const data = svc.createRecipient(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/recipients/:id
 * Body: { email?, name?, tags? }
 * Response: 200 + updated row
 */
async function update(req, res, next) {
  try {
    const data = svc.updateRecipient(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/recipients/:id
 * Response: 204
 */
async function remove(req, res, next) {
  try {
    svc.deleteRecipient(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/recipients/:id/unsubscribe
 * Response: 200 + { unsubscribed: true }
 */
async function unsubscribe(req, res, next) {
  try {
    const data = svc.unsubscribeRecipient(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, update, remove, unsubscribe };
