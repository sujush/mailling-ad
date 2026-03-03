/**
 * Recipients router
 * Base path: /api/recipients
 */
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recipientController');

// GET  /api/recipients          — paginated list with optional search
router.get('/', ctrl.getAll);

// POST /api/recipients          — create new recipient
router.post('/', ctrl.create);

// PUT  /api/recipients/:id      — update recipient
router.put('/:id', ctrl.update);

// DELETE /api/recipients/:id    — delete recipient
router.delete('/:id', ctrl.remove);

// POST /api/recipients/:id/unsubscribe — mark as unsubscribed
router.post('/:id/unsubscribe', ctrl.unsubscribe);

module.exports = router;
