/**
 * Lists (mailing list) router
 * Base path: /api/lists
 */
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/listController');

// GET    /api/lists              — all lists with recipient count
router.get('/', ctrl.getAll);

// POST   /api/lists              — create list
router.post('/', ctrl.create);

// PUT    /api/lists/:id          — update list
router.put('/:id', ctrl.update);

// DELETE /api/lists/:id          — delete list
router.delete('/:id', ctrl.remove);

// POST   /api/lists/:id/add-recipient — add recipient to list
router.post('/:id/add-recipient', ctrl.addRecipient);

module.exports = router;
