require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cron = require('node-cron');
const ENV_PATH = path.join(__dirname, '.env');

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

const resetCodes = {};

app.use(
  '/images/promotions',
  express.static(
    path.join(__dirname, '../public/images/promotions')
  )
);

// Раздача фото блюд
app.use(
  '/images/dishes',
  express.static(
    path.join(__dirname, '../public/images/dishes')
  )
);

// Раздача фото отзывов
app.use(
  '/images/reviews',
  express.static(
    path.join(__dirname, '../public/images/reviews')
  )
);

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/dishes'));
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const reviewStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/reviews'));
  },

  filename: (req, file, cb) => {
    const unique =
      Date.now() + '-' + file.originalname;

    cb(null, unique);
  },
});

const uploadReview = multer({
  storage: reviewStorage,
});


// =======================
// 📸 ЗАГРУЗКА ФОТО ОТЗЫВА
// =======================

app.post(
  '/api/upload-review-photo',
  uploadReview.single('photo'),
  (req, res) => {

    res.json({
      success: true,
      filename: req.file.filename,
    });

  }
);

// =======================
// ⭐ СРЕДНЯЯ ОЦЕНКА
// =======================

app.get('/api/reviews-rating', async (req, res) => {
  try {

    const [rows] = await db.promise().execute(`
      SELECT
        ROUND(AVG(Grade), 1) as avgRating,
        COUNT(*) as total
      FROM otzyvy
      WHERE ver = 1
    `);

    res.json(rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Ошибка рейтинга',
    });
  }
});

app.put('/api/reviews/:id', async (req, res) => {
  const { text, grade, photo, userId } = req.body;

  try {
    // проверяем владельца
    const [rows] = await db.promise().execute(
      'SELECT * FROM otzyvy WHERE ID = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Отзыв не найден',
      });
    }

    const review = rows[0];

    if (review.id_user !== userId) {
      return res.status(403).json({
        error: 'Нет доступа',
      });
    }

    await db.promise().execute(
      `
      UPDATE otzyvy
      SET Otzyv = ?, Grade = ?, Photo = ?, ver = 0
      WHERE ID = ?
      `,
      [
        text,
        grade,
        photo || null,
        req.params.id,
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Ошибка редактирования',
    });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  const { userId } = req.body;

  try {
    const [rows] = await db.promise().execute(
      'SELECT * FROM otzyvy WHERE ID = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Отзыв не найден',
      });
    }

    const review = rows[0];

    if (review.id_user !== userId) {
      return res.status(403).json({
        error: 'Нет доступа',
      });
    }

    await db.promise().execute(
      'DELETE FROM otzyvy WHERE ID = ?',
      [req.params.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Ошибка удаления',
    });
  }
});

app.patch('/api/admin/reviews/moderate/:id', async (req, res) => {
  try {
    await db.promise().execute(
      `
      UPDATE otzyvy
      SET ver = NOT ver
      WHERE ID = ?
      `,
      [req.params.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Ошибка модерации',
    });
  }
});

app.delete('/api/admin/reviews/:id', async (req, res) => {
  try {
    await db.promise().execute(
      'DELETE FROM otzyvy WHERE ID = ?',
      [req.params.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Ошибка удаления',
    });
  }
});

app.get('/api/reviews/all', async (req, res) => {
  try {
    const [rows] = await db.promise().execute(`
      SELECT
        o.*,
        p.FIO
      FROM otzyvy o
      LEFT JOIN personal_info p
      ON o.id_user = p.id_user
      ORDER BY o.ID DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Ошибка загрузки',
    });
  }
});

const upload = multer({ storage });
app.post('/api/admin/upload', upload.single('image'), (req, res) => {
  try {
    res.json({
      success: true,
      filename: req.file.filename,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Ошибка загрузки файла',
    });
  }
});



function getAllFiles(dir, baseDir = dir) {
  let results = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, baseDir));
    } else {
      // относительный путь
      results.push(path.relative(baseDir, filePath).replace(/\\/g, '/'));
    }
  }

  return results;
}

app.get('/api/admin/images', async (req, res) => {
  try {
    const dir = path.join(__dirname, '../public/images');

    const files = getAllFiles(dir);

    res.json(files);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Ошибка получения изображений',
    });
  }
});

app.delete(/^\/api\/admin\/images\/(.+)/, async (req, res) => {
  try {

    const relativePath =
      decodeURIComponent(req.params[0]);

    const baseDir = path.join(
      __dirname,
      '../public/images'
    );

    const filePath = path.normalize(
      path.join(baseDir, relativePath)
    );

    // защита
    if (!filePath.startsWith(baseDir)) {
      return res.status(400).json({
        error: 'Некорректный путь',
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Файл не найден',
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка удаления файла',
    });
  }
});


// подключение к БД
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

// =======================
// 🔐 РЕГИСТРАЦИЯ
// =======================
app.post('/api/register', async (req, res) => {
  const { login, pass, fio, phone, address } = req.body;

  if (!login || !pass || !fio || !phone) {
    return res.status(400).json({ error: 'Не все поля заполнены' });
  }

  try {
    const [existing] = await db.promise().execute(
      'SELECT ID FROM avtorizaciya WHERE Login = ?', [login]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Логин уже занят' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt);

    const [userResult] = await db.promise().execute(
      'INSERT INTO avtorizaciya (Login, Pass, admin) VALUES (?, ?, 0)',
      [login, hashedPass]
    );

    const userId = userResult.insertId;

    await db.promise().execute(
      'INSERT INTO personal_info (id_user, FIO, Phone, Adres) VALUES (?, ?, ?, ?)',
      [userId, fio, phone, address || null]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// =======================
// 🔑 ЛОГИН
// =======================
app.post('/api/login', async (req, res) => {
  const { login, pass } = req.body;

  try {
    const [users] = await db.promise().execute(
      `SELECT a.ID, a.Pass, a.admin, p.FIO, p.Phone, p.Adres
       FROM avtorizaciya a
       LEFT JOIN personal_info p ON a.ID = p.id_user
       WHERE a.Login = ?`,
      [login]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(pass, user.Pass);

    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    res.json({
      success: true,
      user: {
        id: user.ID,
        fio: user.FIO,
        phone: user.Phone,
        address: user.Adres,
        isAdmin: user.admin === 1
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// =====================================
// ВОССТАНОВЛЕНИЕ ПАРОЛЯ
// =====================================

// отправка кода
app.post('/api/password/send-code', async (req, res) => {

  const { phone } = req.body;

  try {

    const [users] = await db.promise().execute(`
      SELECT *
      FROM personal_info
      WHERE Phone = ?
    `, [phone]);

    if (users.length === 0) {

      return res.status(404).json({
        error: 'Пользователь не найден',
      });

    }

    // ТЕСТОВЫЙ КОД
    const code = '1111';

    // сохраняем
    resetCodes[phone] = code;

    console.log('КОД:', code);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка отправки кода',
    });
  }

});

app.post('/api/password/reset', async (req, res) => {

  const {
    phone,
    code,
    newPassword,
  } = req.body;

  try {

    // проверка кода
    if (resetCodes[phone] !== code) {

      return res.status(400).json({
        error: 'Неверный код',
      });

    }

    // ищем пользователя
    const [users] = await db.promise().execute(`
      SELECT id_user
      FROM personal_info
      WHERE Phone = ?
    `, [phone]);

    if (users.length === 0) {

      return res.status(404).json({
        error: 'Пользователь не найден',
      });

    }

    const userId = users[0].id_user;

    // хешируем пароль
    const salt = await bcrypt.genSalt(10);

    const hashedPass =
      await bcrypt.hash(newPassword, salt);

    // обновляем пароль
    await db.promise().execute(`
      UPDATE avtorizaciya
      SET Pass = ?
      WHERE ID = ?
    `, [
      hashedPass,
      userId,
    ]);

    // удаляем код
    delete resetCodes[phone];

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка смены пароля',
    });
  }

});

// === API: Все категории ===
app.get('/api/categories', (req, res) => {
  const sql = `
  SELECT 
	k.*,
	COUNT(m.ID) as dishesCount
	FROM kategorii k
	LEFT JOIN menu m ON m.ID_kategorii = k.ID
	GROUP BY k.ID
	ORDER BY k.nazvanie_kategorii`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// === API: Все активные блюда с категорией ===
app.get('/api/dishes', (req, res) => {
  const sql = `
    SELECT
    m.ID,
    m.ID_kategorii,
    m.Name_blyuda,
    m.Opisanie,
    m.Foto,
    m.Price AS original_price,

    MAX(
      CASE
        WHEN a.procent_skidki IS NOT NULL
        THEN ROUND(
          m.Price - (m.Price * a.procent_skidki / 100),
          2
        )
        ELSE m.Price
      END
    ) AS Price,

    MAX(a.procent_skidki) AS procent_skidki,

    m.aktiv,
    k.nazvanie_kategorii

FROM menu m

LEFT JOIN kategorii k
  ON m.ID_kategorii = k.ID

LEFT JOIN aktsiya a
  ON (
      a.id_tovara = m.ID
      OR a.id_kategorii = m.ID_kategorii
     )
  AND a.aktiv = 1

WHERE m.aktiv = 1

GROUP BY m.ID

ORDER BY
  k.nazvanie_kategorii,
  m.Name_blyuda
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Ошибка запроса блюд:', err.sqlMessage || err);
      return res.status(500).json({ 
        error: err.sqlMessage || 'Ошибка при получении блюд',
        details: err.message 
      });
    }
    console.log(`Загружено ${result.length} блюд`);
    res.json(result);
  });
});



// =======================
// 🧾 СОЗДАНИЕ ЗАКАЗА
// =======================
app.post('/api/orders', async (req, res) => {
  const { fio, phone, address, items, personal_id } = req.body;

  console.log("📥 ПРИШЛО:", req.body);

  if (!phone || !items || items.length === 0) {
    return res.status(400).json({ error: 'Не хватает данных (телефон и блюда обязательны)' });
  }

  try {
    // чистим неправильные товары
    const validItems = items.filter(item => {
      if (!item.id) {
        console.error("❌ НЕТ ID:", item);
        return false;
      }
      return true;
    });

    if (validItems.length === 0) {
      return res.status(400).json({ error: 'Нет валидных товаров' });
    }

    // считаем сумму
    const totalSum = validItems.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
	const totalSumFormatted = Number(totalSum.toFixed(2));


    // создаём заказ
    const [orderResult] = await db.promise().execute(
      `INSERT INTO zakaz (Status, Data, personal_id, Summa_zakaza) 
       VALUES ('Новый', NOW(), ?, ?)`,
      [personal_id || null, totalSum]
    );

    const orderId = orderResult.insertId;

    // создаём позиции
    for (const item of validItems) {
      await db.promise().execute(
        `INSERT INTO poziciya_v_zakaze 
         (ID_zakaza, ID_blyuda, Kolichestvo, Price, Summa) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id,
          item.quantity || 1,
          item.price || 0,
          (item.price || 0) * (item.quantity || 1)
        ]
      );
    }

    console.log("✅ Заказ создан:", orderId);

    res.json({
      success: true,
      orderId
    });

  } catch (err) {
    console.error('🔥 ОШИБКА:', err);
    res.status(500).json({ error: 'Ошибка при создании заказа в базе' });
  }
});


app.get('/api/admin/dishes', async (req, res) => {
  try {
    const [rows] = await db.promise().execute(`
      SELECT 
        m.ID,
        m.Name_blyuda,
        m.Opisanie,
        m.Price,
        m.Foto,
        m.aktiv,
        m.ID_kategorii,
        k.nazvanie_kategorii
      FROM menu m
      LEFT JOIN kategorii k ON m.ID_kategorii = k.ID
      ORDER BY m.ID DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки блюд' });
  }
});


// =======================
// CREATE DISH
// =======================
app.post('/api/admin/dishes', async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      categoryId,
      foto,
    } = req.body;

    // защита от undefined
    name = name || null;
    description = description || null;
    price = price ? Number(price) : null;
    categoryId = categoryId ? Number(categoryId) : null;
    foto = foto || null;

    await db.promise().execute(
      `
      INSERT INTO menu
      (Name_blyuda, Opisanie, Price, ID_kategorii, Foto, aktiv)
      VALUES (?, ?, ?, ?, ?, 1)
      `,
      [name, description, price, categoryId, foto]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка добавления блюда' });
  }
});


// =======================
// UPDATE DISH
// =======================
app.put('/api/admin/dishes/:id', async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      categoryId,
      foto,
    } = req.body;

    name = name || null;
    description = description || null;
    price = price ? Number(price) : null;
    categoryId = categoryId ? Number(categoryId) : null;
    foto = foto || null;

    await db.promise().execute(
      `
      UPDATE menu
      SET
        Name_blyuda = ?,
        Opisanie = ?,
        Price = ?,
        ID_kategorii = ?,
        Foto = ?
      WHERE ID = ?
      `,
      [
        name,
        description,
        price,
        categoryId,
        foto,
        req.params.id
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка обновления блюда' });
  }
});


// =======================
// DELETE DISH
// =======================
app.delete('/api/admin/dishes/:id', async (req, res) => {
  try {
    await db.promise().execute(
      `DELETE FROM menu WHERE ID = ?`,
      [req.params.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка удаления блюда' });
  }
});


// =======================
// TOGGLE ACTIVE
// =======================
app.patch('/api/admin/dishes/toggle/:id', async (req, res) => {
  try {
    await db.promise().execute(`
      UPDATE menu
      SET aktiv = NOT aktiv
      WHERE ID = ?
    `, [req.params.id]);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка переключения статуса' });
  }
});
app.post('/api/admin/categories', async (req, res) => {
  const { name } = req.body;

  try {
    await db.promise().execute(
      `
      INSERT INTO kategorii (nazvanie_kategorii)
      VALUES (?)
      `,
      [name]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка создания категории' });
  }
});

app.delete('/api/admin/categories/:id', async (req, res) => {
  try {
    const [dishes] = await db.promise().execute(
      `
      SELECT ID
      FROM menu
      WHERE ID_kategorii = ?
      `,
      [req.params.id]
    );

    if (dishes.length > 0) {
      return res.status(400).json({
        error:
          'Категория не удалена! Проверьте наличие блюд в категории'
      });
    }

    await db.promise().execute(
      'DELETE FROM kategorii WHERE ID = ?',
      [req.params.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Ошибка удаления категории'
    });
  }
});

app.patch('/api/admin/categories/:id', async (req, res) => {
  const { name } = req.body;

  try {
    await db.promise().execute(
      `
      UPDATE kategorii
      SET nazvanie_kategorii = ?
      WHERE ID = ?
      `,
      [name, req.params.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Ошибка обновления категории'
    });
  }
});

// =======================
// ⭐ СОЗДАНИЕ ОТЗЫВА
// =======================

app.post('/api/reviews', async (req, res) => {
  const { user_id, text, grade, photo } = req.body;

  if (!user_id || !text || !grade) {
    return res.status(400).json({
      error: 'Не хватает данных',
    });
  }

  try {
    await db.promise().execute(
      `
      INSERT INTO otzyvy
      (id_user, Otzyv, Photo, Grade, ver)
      VALUES (?, ?, ?, ?, 0)
      `,
      [
        user_id,
        text,
        photo || null,
        grade,
      ]
    );

    res.json({
      success: true,
      message: 'Отзыв отправлен на модерацию',
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Ошибка создания отзыва',
    });
  }
});

// =======================
// ⭐ ВСЕ ОДОБРЕННЫЕ + СВОИ ОТЗЫВЫ
// =======================
app.get('/api/reviews', async (req, res) => {
  const userId = req.query.userId; // передаём ID текущего пользователя

  try {
    let query = `
      SELECT
        o.ID,
        o.id_user,
        o.Otzyv,
        o.Photo,
        o.Grade,
        o.ver,
        p.FIO
      FROM otzyvy o
      LEFT JOIN avtorizaciya a ON o.id_user = a.ID
      LEFT JOIN personal_info p ON a.ID = p.id_user
      WHERE 1=1
    `;

    const params = [];

    if (userId) {
      // Пользователь видит свои отзывы (даже на модерации) + все одобренные
      query += ` AND (o.ver = 1 OR o.id_user = ?)`;
      params.push(userId);
    } else {
      // Если не авторизован — только одобренные
      query += ` AND o.ver = 1`;
    }

    query += ` ORDER BY o.ID DESC`;

    const [rows] = await db.promise().execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки отзывов' });
  }
});


// =====================================
// ПОЛЬЗОВАТЕЛЬСКИЕ АКЦИИ
// =====================================

app.get('/api/promotions', async (req, res) => {

  try {

    const [rows] = await db.promise().execute(`
      SELECT
        a.*,
        m.Name_blyuda,
        m.Foto,
        k.nazvanie_kategorii

      FROM aktsiya a

      LEFT JOIN menu m
        ON a.id_tovara = m.ID

      LEFT JOIN kategorii k
        ON a.id_kategorii = k.ID

      WHERE a.aktiv = 1

      ORDER BY a.ID DESC
    `);

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка загрузки акций',
    });
  }

});


// =====================================
// ПОЛЬЗОВАТЕЛЬСКИЕ МЕРОПРИЯТИЯ
// =====================================

app.get('/api/events', async (req, res) => {

  try {

    const [rows] = await db.promise().execute(`
      SELECT * 
	FROM events 
	WHERE Data_okonchaniya > CURRENT_DATE 
	ORDER BY Data_nachala DESC

    `);

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка загрузки мероприятий',
    });
  }

});

// =====================================
// АКЦИИ
// =====================================

// ПОЛУЧИТЬ ВСЕ АКЦИИ
app.get('/api/admin/promotions', async (req, res) => {

  try {

    const [rows] = await db.promise().execute(`
      SELECT
        a.*,
        m.Name_blyuda,
        k.nazvanie_kategorii
      FROM aktsiya a
      LEFT JOIN menu m
        ON a.id_tovara = m.ID
      LEFT JOIN kategorii k
        ON a.id_kategorii = k.ID
      ORDER BY a.ID DESC
    `);

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка загрузки акций',
    });
  }

});

// СОЗДАТЬ АКЦИЮ
app.post('/api/admin/promotions', async (req, res) => {

  const {
    name,
    id_tovara,
    id_kategorii,
    procent_skidki,
    aktiv,
  } = req.body;

  try {

    await db.promise().execute(`
      INSERT INTO aktsiya
      (
        name,
        id_tovara,
        id_kategorii,
        procent_skidki,
        aktiv
      )
      VALUES (?, ?, ?, ?, ?)
    `, [
      name,
      id_tovara || null,
      id_kategorii || null,
      procent_skidki,
      aktiv ? 1 : 0,
    ]);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка создания акции',
    });
  }

});

// УДАЛИТЬ АКЦИЮ
app.delete('/api/admin/promotions/:id', async (req, res) => {

  try {

    await db.promise().execute(`
      DELETE FROM aktsiya
      WHERE ID = ?
    `, [req.params.id]);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка удаления',
    });
  }

});

// ВКЛ/ВЫКЛ АКЦИИ
app.patch('/api/admin/promotions/toggle/:id', async (req, res) => {

  try {

    await db.promise().execute(`
      UPDATE aktsiya
      SET aktiv = NOT aktiv
      WHERE ID = ?
    `, [req.params.id]);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка переключения',
    });
  }

});




const promotionsStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      path.join(
        __dirname,
        '../public/images/promotions'
      )
    );
  },

  filename: (req, file, cb) => {

    const fileName =
      Date.now() +
      '-' +
      file.originalname;

    cb(null, fileName);
  },

});

const uploadPromotionImage = multer({
  storage: promotionsStorage,
});

app.post(
  '/api/upload-promotion-image',
  uploadPromotionImage.single('image'),
  (req, res) => {

    res.json({
      filename: req.file.filename,
    });

  }
);

// =====================================
// МЕРОПРИЯТИЯ
// =====================================

// ВСЕ МЕРОПРИЯТИЯ
app.get('/api/admin/events', async (req, res) => {

  try {

    const [rows] = await db.promise().execute(`
      SELECT *
      FROM events
      ORDER BY Data_nachala DESC
    `);

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка загрузки мероприятий',
    });
  }

});

// СОЗДАНИЕ
app.post('/api/admin/events', async (req, res) => {

  const {
    event_name,
    Opisanie,
    Izobrazhenie,
    Data_nachala,
    Data_okonchaniya,
  } = req.body;

  try {

    await db.promise().execute(`
      INSERT INTO events
      (
        event_name,
        Opisanie,
        Izobrazhenie,
        Data_nachala,
        Data_okonchaniya
      )
      VALUES (?, ?, ?, ?, ?)
    `, [
      event_name,
      Opisanie,
      Izobrazhenie,
      Data_nachala,
      Data_okonchaniya,
    ]);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка создания мероприятия',
    });
  }

});

// УДАЛЕНИЕ
app.delete('/api/admin/events/:id', async (req, res) => {

  try {

    await db.promise().execute(`
      DELETE FROM events
      WHERE ID = ?
    `, [req.params.id]);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка удаления',
    });
  }

});

app.put('/api/admin/events/:id', async (req, res) => {
  const {
    event_name,
    Opisanie,
    Izobrazhenie,
    Data_nachala,
    Data_okonchaniya,
  } = req.body;

  try {
    await db.promise().execute(`
      UPDATE events
      SET
        event_name = ?,
        Opisanie = ?,
        Izobrazhenie = ?,
        Data_nachala = ?,
        Data_okonchaniya = ?
      WHERE ID = ?
    `, [
      event_name,
      Opisanie,
      Izobrazhenie,
      Data_nachala,
      Data_okonchaniya,
      req.params.id,
    ]);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка обновления мероприятия' });
  }
});

// =====================================
// ЗАКАЗЫ АДМИН
// =====================================

app.get('/api/admin/orders', async (req, res) => {

  try {

    const [orders] = await db.promise().execute(`
      SELECT
        z.ID,
        z.Summa_zakaza,
        z.Status,
        z.Data,

        p.FIO,
        p.Phone,
        p.Adres

      FROM zakaz z

      LEFT JOIN personal_info p
        ON z.personal_id = p.ID
		WHERE Status NOT LIKE '%архив%'
      ORDER BY z.ID DESC
    `);

    for (const order of orders) {

      const [items] = await db.promise().execute(`
        SELECT
          pvz.*,
          m.Name_blyuda,
          m.Foto

        FROM poziciya_v_zakaze pvz

        LEFT JOIN menu m
          ON pvz.ID_blyuda = m.ID

        WHERE pvz.ID_zakaza = ?
      `, [order.ID]);

      order.items = items;
    }

    res.json(orders);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка загрузки заказов',
    });
  }

});

app.patch(
  '/api/admin/orders/:id/status',
  async (req, res) => {

    const { status } = req.body;

    try {

      await db.promise().execute(`
        UPDATE zakaz
        SET Status = ?
        WHERE ID = ?
      `, [
        status,
        req.params.id,
      ]);

      res.json({
        success: true,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: 'Ошибка обновления статуса',
      });
    }

});

app.delete(
  '/api/admin/orders/:id',
  async (req, res) => {

    try {

      await db.promise().execute(`
        DELETE FROM poziciya_v_zakaze
        WHERE ID_zakaza = ?
      `, [req.params.id]);

      await db.promise().execute(`
        DELETE FROM zakaz
        WHERE ID = ?
      `, [req.params.id]);

      res.json({
        success: true,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: 'Ошибка удаления заказа',
      });
    }

});


// =====================================
// АВТО УДАЛЕНИЕ АРХИВА
// =====================================

let ARCHIVE_DELETE_DAYS =
  Number(process.env.ARCHIVE_DELETE_DAYS) || 7;

// каждый день в 03:00
cron.schedule('0 3 * * *', async () => {

  try {

    console.log('🧹 Очистка архива заказов...');

    // находим старые архивные заказы
    const [orders] = await db.promise().execute(`
      SELECT ID
      FROM zakaz
      WHERE
        (
          Status LIKE '%архив%'
        )
        AND Data < DATE_SUB(
          NOW(),
          INTERVAL ? DAY
        )
    `, [ARCHIVE_DELETE_DAYS]);

    for (const order of orders) {

      // удалить позиции
      await db.promise().execute(`
        DELETE FROM poziciya_v_zakaze
        WHERE ID_zakaza = ?
      `, [order.ID]);

      // удалить заказ
      await db.promise().execute(`
        DELETE FROM zakaz
        WHERE ID = ?
      `, [order.ID]);

      console.log(
        `🗑 Удалён архивный заказ #${order.ID}`
      );
    }

    console.log('✅ Очистка завершена');

  } catch (err) {

    console.error(
      'Ошибка автоочистки:',
      err
    );

  }

});

// =====================================
// НАСТРОЙКА АВТОУДАЛЕНИЯ АРХИВА
// =====================================

// получить текущую настройку
app.get(
  '/api/admin/archive-settings',
  (req, res) => {

    res.json({
      days: ARCHIVE_DELETE_DAYS,
    });

});

// изменить настройку
app.post(
  '/api/admin/archive-settings',
  async (req, res) => {

    try {

      const { days } = req.body;

      if (!days || days < 1) {
        return res.status(400).json({
          error: 'Некорректное число дней',
        });
      }

      // обновляем переменную
      ARCHIVE_DELETE_DAYS = Number(days);

      // читаем .env
      let envContent =
        fs.readFileSync(
          ENV_PATH,
          'utf8'
        );

      // заменить строку
      if (
        envContent.includes(
          'ARCHIVE_DELETE_DAYS='
        )
      ) {

        envContent =
          envContent.replace(
            /ARCHIVE_DELETE_DAYS=.*/g,
            `ARCHIVE_DELETE_DAYS=${days}`
          );

      } else {

        envContent +=
          `\nARCHIVE_DELETE_DAYS=${days}`;

      }

      // записать .env
      fs.writeFileSync(
        ENV_PATH,
        envContent
      );

      res.json({
        success: true,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: 'Ошибка сохранения',
      });

    }

});

// =====================================
// АРХИВ ЗАКАЗОВ
// =====================================
app.get('/api/admin/ordersarchive', async (req, res) => {
  try {
    const [orders] = await db.promise().execute(`
      SELECT
        z.ID,
        z.Summa_zakaza,
        z.Status,
        z.Data,
        p.FIO,
        p.Phone,
        p.Adres
      FROM zakaz z
      LEFT JOIN personal_info p ON z.personal_id = p.ID
      WHERE Status LIKE '%архив%'
      ORDER BY z.ID DESC
    `);

    for (const order of orders) {
      const [items] = await db.promise().execute(`
        SELECT
          pvz.*,
          m.Name_blyuda,
          m.Foto
        FROM poziciya_v_zakaze pvz
        LEFT JOIN menu m ON pvz.ID_blyuda = m.ID
        WHERE pvz.ID_zakaza = ?
      `, [order.ID]);
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки архива заказов' });
  }
});

// =====================================
// АВТО АРХИВАЦИЯ ЗАКАЗОВ
// =====================================

// каждый день в 00:00
cron.schedule('0 0 * * *', async () => {

  try {

    console.log(
      '📦 Запуск автоархивации заказов'
    );

    // взять все НЕархивные заказы
    const [orders] = await db.promise().execute(`
      SELECT
        ID,
        Status
      FROM zakaz
      WHERE Status NOT LIKE '%архив%'
    `);

    for (const order of orders) {

      // новый статус
      const archiveStatus =
        `${order.Status}-архив`;

      await db.promise().execute(`
        UPDATE zakaz
        SET Status = ?
        WHERE ID = ?
      `, [
        archiveStatus,
        order.ID,
      ]);

      console.log(
        `📦 Заказ #${order.ID} → ${archiveStatus}`
      );

    }

    console.log(
      '✅ Архивация завершена'
    );

  } catch (err) {

    console.error(
      'Ошибка архивации:',
      err
    );

  }

});
// =======================
// 👤 ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
// =======================
app.get('/api/profile/:id', async (req, res) => {
  try {
    const [rows] = await db.promise().execute(`
      SELECT
        p.*,
        a.Login
      FROM personal_info p
      LEFT JOIN avtorizaciya a ON p.id_user = a.ID
      WHERE p.id_user = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки профиля' });
  }
});

// =======================
// 👤 ОБНОВЛЕНИЕ ПРОФИЛЯ
// =======================
app.patch('/api/profile/:id', async (req, res) => {
  const { fio, phone, address } = req.body;

  try {
    await db.promise().execute(`
      UPDATE personal_info
      SET
        FIO = ?,
        Phone = ?,
        Adres = ?
      WHERE id_user = ?
    `, [fio, phone, address, req.params.id]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

// =======================
// 👤 ЗАКАЗЫ ПОЛЬЗОВАТЕЛЯ
// =======================

// Вариант 1 (рекомендуемый — используешь сейчас)
app.get('/api/my-orders/:userId', async (req, res) => {
  try {
    const [orders] = await db.promise().execute(`
      SELECT z.*
      FROM zakaz z
      LEFT JOIN personal_info p ON z.personal_id = p.ID
      WHERE p.id_user = ?
      ORDER BY z.ID DESC
    `, [req.params.userId]);

    // Подгружаем товары для каждого заказа
    for (const order of orders) {
      const [items] = await db.promise().execute(`
        SELECT
          pvz.*,
          m.Name_blyuda,
          m.Foto
        FROM poziciya_v_zakaze pvz
        LEFT JOIN menu m ON pvz.ID_blyuda = m.ID
        WHERE pvz.ID_zakaza = ?
      `, [order.ID]);

      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки заказов' });
  }
});

// =======================
// УДАЛЕНИЕ ПРОФИЛЯ
// =======================

app.delete('/api/profile/:id', async (req, res) => {

  const userId = req.params.id;

  try {

    // удаляем позиции заказов
    await db.promise().execute(`
      DELETE pvz
      FROM poziciya_v_zakaze pvz
      INNER JOIN zakaz z
      ON pvz.ID_zakaza = z.ID
      WHERE z.personal_id = ?
    `, [userId]);

    // удаляем заказы
    await db.promise().execute(`
      DELETE FROM zakaz
      WHERE personal_id = ?
    `, [userId]);

    // удаляем отзывы
    await db.promise().execute(`
      DELETE FROM otzyvy
      WHERE id_user = ?
    `, [userId]);

    // удаляем personal_info
    await db.promise().execute(`
      DELETE FROM personal_info
      WHERE id_user = ?
    `, [userId]);

    // удаляем аккаунт
    await db.promise().execute(`
      DELETE FROM avtorizaciya
      WHERE ID = ?
    `, [userId]);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Ошибка удаления профиля',
    });

  }

});

// Альтернативный вариант (если понадобится)
app.get('/api/profile/:id/orders', async (req, res) => {
  try {
    const [orders] = await db.promise().execute(`
      SELECT *
      FROM zakaz
      WHERE personal_id = ?
      ORDER BY ID DESC
    `, [req.params.id]);

    for (const order of orders) {
      const [items] = await db.promise().execute(`
        SELECT pvz.*, m.Name_blyuda, m.Foto
        FROM poziciya_v_zakaze pvz
        LEFT JOIN menu m ON pvz.ID_blyuda = m.ID
        WHERE pvz.ID_zakaza = ?
      `, [order.ID]);

      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки заказов' });
  }
});

// запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен: http://0.0.0.0:${PORT}`);
});