/**
 * List controller — HTTP request handlers delegating to list service layer
 * @module listController
 */
const svc = require('../services/listService');

/**
 * GET /api/lists
 * Response: array of lists with recipient_count
 */
async function getAll(req, res, next) {
  try {
    res.json(svc.getAllLists());
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/lists
 * Body: { name, description? }
 * Response: 201 + { id, name, description }
 */
async function create(req, res, next) {
  try {
    const data = svc.createList(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/lists/:id
 * Body: { name?, description? }
 * Response: 200 + updated row
 */
async function update(req, res, next) {
  try {
    const data = svc.updateList(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/lists/:id
 * Response: 204
 */
async function remove(req, res, next) {
  try {
    svc.deleteList(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/lists/:id/add-recipient
 * Body: { recipientId }
 * Response: 200 + { success: true }
 */
async function addRecipient(req, res, next) {
  try {
    const { recipientId } = req.body;
    if (!recipientId) {
      const err = new Error('recipientId is required');
      err.status = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    const data = svc.addRecipientToList(req.params.id, recipientId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, update, remove, addRecipient };
