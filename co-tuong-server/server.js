const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'asds123A@',
  database: 'co_tuong'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
    return;
  }
  console.log('Kết nối MySQL thành công');
});

// API đăng ký
app.post('/api/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hash],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại.' });
          }
          console.error(err);
          return res.status(500).json({ message: 'Lỗi hệ thống.' });
        }
        res.status(200).json({ message: 'Đăng ký thành công!' });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy ở http://localhost:${port}`);
});

// Đăng nhập
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Sai tên hoặc mật khẩu' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Sai tên hoặc mật khẩu' });
    }

    return res.json({ message: 'Đăng nhập thành công' });
  });
});

