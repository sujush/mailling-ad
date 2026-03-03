const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /api/templates — 목록
router.get('/', (req, res) => {
  const templates = db.prepare('SELECT * FROM templates ORDER BY created_at DESC').all();
  res.json(templates);
});

// GET /api/templates/:id — 상세
router.get('/:id', (req, res) => {
  const t = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  res.json(t);
});

// POST /api/templates — 생성
router.post('/', (req, res) => {
  const { name, subject, html_content, variables } = req.body;
  const vars = JSON.stringify(variables || extractVariables(html_content));
  const result = db.prepare(
    'INSERT INTO templates (name, subject, html_content, variables) VALUES (?, ?, ?, ?)'
  ).run(name, subject, html_content, vars);
  res.status(201).json({ id: result.lastInsertRowid, name, subject });
});

// PUT /api/templates/:id — 수정
router.put('/:id', (req, res) => {
  const { name, subject, html_content, variables } = req.body;
  const vars = JSON.stringify(variables || extractVariables(html_content));
  db.prepare(
    "UPDATE templates SET name=?, subject=?, html_content=?, variables=?, updated_at=datetime('now') WHERE id=?"
  ).run(name, subject, html_content, vars, req.params.id);
  res.json({ id: req.params.id, name, subject });
});

// DELETE /api/templates/:id — 삭제
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM templates WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

// POST /api/templates/:id/preview — 변수 치환 미리보기
router.post('/:id/preview', (req, res) => {
  const t = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  const vars = req.body.variables || {};
  const html = t.html_content.replace(/\{\{(\w+)\}\}/g, (m, k) => vars[k] || `[${k}]`);
  const subject = t.subject.replace(/\{\{(\w+)\}\}/g, (m, k) => vars[k] || `[${k}]`);
  res.json({ html, subject });
});

function extractVariables(html) {
  const matches = html.match(/\{\{(\w+)\}\}/g) || [];
  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
}

// 시드 데이터 (테이블이 비어있을 때 자동 삽입)
const count = db.prepare('SELECT COUNT(*) as c FROM templates').get();
if (count.c === 0) {
  db.prepare('INSERT INTO templates (name, subject, html_content, variables) VALUES (?, ?, ?, ?)')
    .run(
      '기본 광고 템플릿',
      '안녕하세요, {{name}}님! 특별 혜택을 확인하세요',
      '<h2>안녕하세요, {{name}}님</h2><p>저희 서비스의 특별 혜택을 소개합니다.</p><p><a href="{{cta_url}}">지금 확인하기</a></p><p style="font-size:12px;">수신 거부: <a href="{{unsubscribe_url}}">여기를 클릭</a></p>',
      JSON.stringify(['name', 'cta_url', 'unsubscribe_url'])
    );
}

module.exports = router;
