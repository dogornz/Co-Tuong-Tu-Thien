---
SẢN PHẨM WEB CỜ TƯỚNG SỬ DỤNG HTML, CSS, JAVA SCRIPT
Hướng dẫn sử dụng
1. Chạy bằng MySQL Workbench
====>
CREATE DATABASE IF NOT EXISTS co_tuong;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your-pass';
FLUSH PRIVILEGES;

USE co_tuong;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
)
2. Sau đó chạy tiếp server.js
====>
- Vào folder có thư mục chứa file server.js
- CMD vào folder đó xong chạy lệnh node server.js
- Hiện kết nối MySQL là thành công
3. Chạy game bằng file index.html 
====>
---