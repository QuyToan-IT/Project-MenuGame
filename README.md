# 🎮 Project - MenuGame

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
* **Framework:** ReactJS (Vite)
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
* **Routing:** React Router DOM

### Backend & Database
* **Framework:** Spring Boot
* **Java Version:** 17
* **Database:** MySQL 8.x

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy Local

### Bước 1: Chuẩn bị Cơ sở dữ liệu (MySQL)
* Mở MySQL Workbench và vào connections của bạn. Vì dự án đã được cấu hình tự động hóa hoàn toàn ở cả 2 tầng. Bạn không cần phải tạo database hay gõ lệnh import dữ liệu bằng tay.
* Nhờ tham số `createDatabaseIfNotExist=true` trong chuỗi kết nối và cấu hình tự động chạy script, hệ thống sẽ tự nhận diện, khởi tạo database `menu_game`, dựng cấu trúc các bảng và nạp sẵn toàn bộ dữ liệu game ngay trong lần đầu tiên khởi chạy Backend.

### Bước 2: Cấu hình Tài khoản kết nối
Mở file `backend/menugame/src/main/resources/application.properties` và cập nhật lại mật khẩu MySQL của bạn:
```markdown
properties
spring.datasource.username=root
spring.datasource.password=Mật_Khẩu_MySQL_Của_Bạn
```

### Bước 3: Khởi chạy backend
Mở một Terminal tại thư mục gốc của dự án và thực hiện lệnh:
```bash
cd backend/menugame
# Đối với hệ điều hành Windows (CMD / PowerShell):
mvnw spring-boot:run
# Đối với hệ điều hành macOS / Linux (Cần phân quyền thực thi trước):
chmod +x mvnw
./mvnw spring-boot:run
```
Backend sẽ được khởi chạy tại cổng: `http://localhost:8080`

### Bước 4: Khởi chạy frontend
```bash
cd frontend/frontend-menugame
npm install
npm run dev
```
Frontend sẽ được khởi chạy tại cổng: `http://localhost:5173`
