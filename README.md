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

```markdown
## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy Local

Mở file `backend/menugame/src/main/resources/application.properties` và cập nhật lại mật khẩu MySQL của bạn:

```properties
spring.datasource.password=Mật_Khẩu_MySQL_Của_Bạn
```

### Khởi chạy backend
```bash
cd backend/menugame
mvnw spring-boot:run
```

### Khởi chạy frontend
```bash
cd frontend
npm install
npm run dev
