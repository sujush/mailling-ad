/**
 * List (mailing list) service layer
 * @module listService
 */
const db = require('../models/db');

/**
 * Get all mailing lists with recipient count.
 * @returns {object[]}
 */
function getAllLists() {
  return db.prepare(`
    SELECT l.*, COUNT(rl.recipient_id) as recipient_count
    FROM lists l
    LEFT JOIN recipient_lists rl ON rl.list_id = l.id
    GROUP BY l.id
    ORDER BY l.created_at DESC
  `).all();
}

/**
 * Create a new mailing list.
 * @param {{ name: string, description?: string }} body
 * @returns {{ id: number, name: string, description: string }}
 */
function createList({ name, description = '' }) {
  if (!name || !name.trim()) {
    const err = new Error('name is required');
    err.status = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const result = db.prepare(
    'INSERT INTO lists (name, description) VALUES (?, ?)'
  ).run(name.trim(), description.trim());
  return { id: result.lastInsertRowid, name, description };
}

/**
 * Update a mailing list.
 * @param {number} id
 * @param {{ name?: string, description?: string }} body
 * @returns {object} updated row
 */
function updateList(id, { name, description }) {
  const row = db.prepare('SELECT * FROM lists WHERE id = ?').get(id);
  if (!row) {
    const err = new Error('List not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
  const newName = name !== undefined ? name.trim() : row.name;
  const newDesc = description !== undefined ? description.trim() : row.description;
  db.prepare('UPDATE lists SET name=?, description=? WHERE id=?').run(newName, newDesc, id);
  return db.prepare('SELECT * FROM lists WHERE id = ?').get(id);
}

/**
 * Delete a mailing list.
 * @param {number} id
 */
function deleteList(id) {
  const result = db.prepare('DELETE FROM lists WHERE id = ?').run(id);
  if (result.changes === 0) {
    const err = new Error('List not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
}

/**
 * Add a recipient to a mailing list.
 * @param {number} listId
 * @param {number} recipientId
 * @returns {{ success: true }}
 */
function addRecipientToList(listId, recipientId) {
  const list = db.prepare('SELECT id FROM lists WHERE id = ?').get(listId);
  if (!list) {
    const err = new Error('List not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
  const recipient = db.prepare('SELECT id FROM recipients WHERE id = ?').get(recipientId);
  if (!recipient) {
    const err = new Error('Recipient not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
  try {
    db.prepare(
      'INSERT OR IGNORE INTO recipient_lists (recipient_id, list_id) VALUES (?, ?)'
    ).run(recipientId, listId);
  } catch (e) {
    throw e;
  }
  return { success: true };
}

module.exports = {
  getAllLists,
  createList,
  updateList,
  deleteList,
  addRecipientToList,
};
