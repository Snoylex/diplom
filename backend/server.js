require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Разрешаем запросы с фронтенда
app.use(cors());
app.use(express.json());

// Подключение к базе
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           
  password: 'root',        
  database: 'burekas_menu'
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err);
    return;
  }
  console.log('✅ Подключено к базе');
});

// === API: Все категории ===
app.get('/api/categories', (req, res) => {
  const sql = 'SELECT * FROM kategorii ORDER BY nazvanie_kategorii';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// === API: Все активные блюда с категорией ===
app.get('/api/dishes', (req, res) => {
  const sql = `
    SELECT b.*, k.nazvanie_kategorii 
    FROM blyuda b
    LEFT JOIN kategorii k ON b.ID_kategorii = k.ID
    WHERE b.aktiv = 1
    ORDER BY k.nazvanie_kategorii, b.name_blyuda
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Бэкенд запущен на http://localhost:${PORT}`);
});