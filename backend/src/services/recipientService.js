/**
 * Recipient service layer — all business logic for recipients
 * @module recipientService
 */
const db = require('../models/db');

/**
 * List recipients with pagination and optional search.
 * @param {number} page - 1-based page number
 * @param {number} limit - records per page
 * @param {string} search - optional email/name search term
 * @returns {{ data: object[], total: number, page: number }}
 */
function listRecipients(page = 1, limit = 20, search = '') {
  const offset = (page - 1) * limit;
  const like = `%${search}%`;

  const total = search
    ? db.prepare('SELECT COUNT(*) as c FROM recipients WHERE email LIKE ? OR name LIKE ?').get(like, like).c
    : db.prepare('SELECT COUNT(*) as c FROM recipients').get().c;

  const data = search
    ? db.prepare('SELECT * FROM recipients WHERE email LIKE ? OR name LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?').all(like, like, limit, offset)
    : db.prepare('SELECT * FROM recipients ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);

  return { data, total, page };
}

/**
 * Create a new recipient.
 * @param {{ email: string, name?: string, tags?: string[] }} body
 * @returns {{ id: number, email: string, name: string }}
 */
function createRecipient({ email, name = '', tags = [] }) {
  if (!email) {
    const err = new Error('email is required');
    err.status = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);
  try {
    const result = db.prepare(
      'INSERT INTO recipients (email, name, tags) VALUES (?, ?, ?)'
    ).run(email.trim().toLowerCase(), name.trim(), tagsJson);
    return { id: result.lastInsertRowid, email, name };
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      const err = new Error('Email already exists');
      err.status = 409;
      err.code = 'DUPLICATE_EMAIL';
      throw err;
    }
    throw e;
  }
}

/**
 * Update a recipient by ID.
 * @param {number} id
 * @param {{ email?: string, name?: string, tags?: string[] }} body
 * @returns {object} updated row
 */
function updateRecipient(id, { email, name, tags }) {
  const row = db.prepare('SELECT * FROM recipients WHERE id = ?').get(id);
  if (!row) {
    const err = new Error('Recipient not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const newEmail = email ? email.trim().toLowerCase() : row.email;
  const newName = name !== undefined ? name.trim() : row.name;
  const newTags = tags !== undefined ? JSON.stringify(Array.isArray(tags) ? tags : []) : row.tags;

  try {
    db.prepare(
      'UPDATE recipients SET email=?, name=?, tags=? WHERE id=?'
    ).run(newEmail, newName, newTags, id);
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      const err = new Error('Email already exists');
      err.status = 409;
      err.code = 'DUPLICATE_EMAIL';
      throw err;
    }
    throw e;
  }

  return db.prepare('SELECT * FROM recipients WHERE id = ?').get(id);
}

/**
 * Delete a recipient by ID.
 * @param {number} id
 */
function deleteRecipient(id) {
  const result = db.prepare('DELETE FROM recipients WHERE id = ?').run(id);
  if (result.changes === 0) {
    const err = new Error('Recipient not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
}

/**
 * Mark a recipient as unsubscribed.
 * @param {number} id
 * @returns {{ unsubscribed: true }}
 */
function unsubscribeRecipient(id) {
  const result = db.prepare('UPDATE recipients SET unsubscribed=1 WHERE id=?').run(id);
  if (result.changes === 0) {
    const err = new Error('Recipient not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
  return { unsubscribed: true };
}

module.exports = {
  listRecipients,
  createRecipient,
  updateRecipient,
  deleteRecipient,
  unsubscribeRecipient,
};
