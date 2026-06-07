# Manual Test Cases - Trang Quản Trị (Admin Page)

## Nhóm 1: Chức năng chung và Điều hướng

### Test Case 1: Truy cập và Điều hướng Sidebar
- **Mục tiêu:** Kiểm tra truy cập trang Admin và khả năng chuyển đổi giữa các tab.
- **Bước:**
  1. Mở đường dẫn `/admin` trên trình duyệt.
  2. Kiểm tra giao diện Sidebar hiển thị logo và danh sách chức năng.
  3. Click vào tab "Quản lý Thể loại".
  4. Click vào tab "Quản lý Game".
  5. Click vào nút "Về trang chính" (hoặc "Quay lại").
- **Kỳ vọng:**
  - [ ] Tab mặc định khi mới vào là "Quản lý Game".
  - [ ] Chuyển sang giao diện quản lý thể loại thành công khi click tương ứng.
  - [ ] Sidebar làm nổi bật (highlight) đúng tab đang active.
  - [ ] Nút "Về trang chính" đưa người dùng về lại trang chủ `/`.

---

## Nhóm 2: Quản lý Game (Game Management)

### Test Case 2: Hiển thị danh sách Game
- **Mục tiêu:** Kiểm tra dữ liệu game hiển thị đúng trên bảng.
- **Bước:**
  1. Truy cập tab "Quản lý Game".
  2. Chờ dữ liệu tải xong.
- **Kỳ vọng:**
  - [ ] Hiển thị thống kê tổng số game và số thể loại.
  - [ ] Bảng danh sách game hiển thị đúng các cột: STT, Game (Tên + Ảnh), Thể loại chính, Loại, Hành động.
  - [ ] Thông báo "Không có game nào" nếu dữ liệu rỗng.

### Test Case 3: Tìm kiếm Game
- **Mục tiêu:** Kiểm tra tính năng tìm kiếm theo tên game.
- **Bước:**
  1. Tại tab "Quản lý Game", nhập từ khóa vào ô "Tìm kiếm game...".
  2. Nhập một từ khóa không tồn tại.
- **Kỳ vọng:**
  - [ ] Bảng tự động lọc hiển thị các game có tên chứa từ khóa.
  - [ ] Hiển thị trạng thái không tìm thấy kết quả nếu từ khóa không tồn tại.

### Test Case 4: Thêm Game mới - Validation (Xác thực dữ liệu)
- **Mục tiêu:** Đảm bảo form thêm game yêu cầu nhập đủ dữ liệu hợp lệ.
- **Bước:**
  1. Click nút "Thêm game".
  2. Bỏ trống các trường và click "Lưu".
  3. Nhập URL ảnh không đúng định dạng (VD: `abc`) và click "Lưu".
- **Kỳ vọng:**
  - [ ] Modal thêm game hiển thị với các trường rỗng.
  - [ ] Báo lỗi "Vui lòng nhập tên game", "Vui lòng nhập URL ảnh", v.v. khi bỏ trống.
  - [ ] Báo lỗi yêu cầu URL hợp lệ (bắt đầu bằng http:// hoặc https://) đối với trường ảnh.

### Test Case 5: Thêm Game mới - Thành công
- **Mục tiêu:** Kiểm tra luồng thêm một game hoàn chỉnh.
- **Bước:**
  1. Click nút "Thêm game".
  2. Điền đầy đủ: Tên game, URL ảnh hợp lệ, chọn Thể loại chính, chọn một vài thể loại phụ (nếu có), chọn Loại game (ONLINE/OFFLINE).
  3. Click "Lưu".
- **Kỳ vọng:**
  - [ ] Form đóng lại.
  - [ ] Danh sách game tự động làm mới và hiển thị game vừa thêm ở cuối hoặc đầu bảng.
  - [ ] Tổng số game tăng lên 1.

### Test Case 6: Chỉnh sửa Game
- **Mục tiêu:** Kiểm tra tính năng cập nhật thông tin game.
- **Bước:**
  1. Click vào icon "Sửa" (hình cây bút) của một game bất kỳ trong bảng.
  2. Sửa tên game và thay đổi loại game.
  3. Click "Lưu".
- **Kỳ vọng:**
  - [ ] Modal mở lên và điền sẵn đúng thông tin cũ của game đó.
  - [ ] Form đóng lại sau khi lưu.
  - [ ] Bảng danh sách cập nhật ngay lập tức thông tin mới chỉnh sửa.

### Test Case 7: Xóa Game
- **Mục tiêu:** Kiểm tra thao tác xóa game và xác nhận.
- **Bước:**
  1. Click vào icon "Xóa" (hình thùng rác) của một game bất kỳ.
  2. Click "Hủy" trên modal xác nhận.
  3. Click lại icon "Xóa" và chọn "Xóa" trên modal xác nhận.
- **Kỳ vọng:**
  - [ ] Click "Hủy" không làm mất game.
  - [ ] Click "Xóa" đóng modal, game biến mất khỏi danh sách.
  - [ ] Số lượng tổng game giảm đi 1.

---

## Nhóm 3: Quản lý Thể loại (Category Management)

### Test Case 8: Hiển thị danh sách Thể loại
- **Mục tiêu:** Kiểm tra dữ liệu bảng thể loại.
- **Bước:**
  1. Chuyển sang tab "Quản lý Thể loại".
  2. Chờ dữ liệu tải xong.
- **Kỳ vọng:**
  - [ ] Bảng hiển thị các cột: STT, Tên thể loại, Mô tả, Số game, Hành động.
  - [ ] Số game (Game Count) được tính toán và hiển thị chính xác dựa trên số game đang áp dụng thể loại đó.

### Test Case 9: Tìm kiếm Thể loại
- **Mục tiêu:** Kiểm tra thanh tìm kiếm trên giao diện quản lý thể loại.
- **Bước:**
  1. Nhập từ khóa (VD: "Action") vào ô "Tìm kiếm thể loại...".
- **Kỳ vọng:**
  - [ ] Bảng lọc ngay lập tức giữ lại các thể loại có tên chứa "Action".

### Test Case 10: Thêm Thể loại mới
- **Mục tiêu:** Kiểm tra luồng thêm thể loại.
- **Bước:**
  1. Click nút "Thêm thể loại".
  2. Để trống tên và nhấn Lưu (Kiểm tra báo lỗi).
  3. Điền Tên thể loại mới và Mô tả, sau đó nhấn "Lưu".
- **Kỳ vọng:**
  - [ ] Báo lỗi "Vui lòng nhập tên thể loại" khi để trống.
  - [ ] Thêm thành công, đóng modal và thể loại mới xuất hiện dưới bảng.

### Test Case 11: Chỉnh sửa Thể loại
- **Mục tiêu:** Đảm bảo thay đổi thông tin thể loại thành công.
- **Bước:**
  1. Nhấn nút "Sửa" trên một dòng thể loại bất kỳ.
  2. Chỉnh sửa mô tả hoặc tên.
  3. Nhấn "Lưu".
- **Kỳ vọng:**
  - [ ] Dữ liệu cũ được tải đúng vào form.
  - [ ] Sau khi lưu, thông tin trên bảng được cập nhật ngay lập tức.

### Test Case 12: Xóa Thể loại
- **Mục tiêu:** Kiểm tra xác nhận xóa.
- **Bước:**
  1. Click icon "Xóa" ở thể loại cần xóa.
  2. Đọc nội dung cảnh báo trên popup xác nhận.
  3. Bấm "Xóa".
- **Kỳ vọng:**
  - [ ] Dialog xác nhận cảnh báo tên của thể loại sắp xóa.
  - [ ] Xóa thành công, thể loại biến mất khỏi bảng.

---

## Nhóm 4: Các Trạng Thái Phụ (Edge Cases)

### Test Case 13: Xử lý lỗi API (Error State)
- **Mục tiêu:** Đảm bảo giao diện không crash khi API sập.
- **Bước:**
  1. Tắt backend server (ngắt kết nối API).
  2. Truy cập vào trang Quản lý Game hoặc Quản lý Thể loại.
- **Kỳ vọng:**
  - [ ] Giao diện hiển thị icon Lỗi và dòng chữ "Lỗi tải dữ liệu" + chi tiết lỗi.
  - [ ] Nút "Thử lại" xuất hiện cho phép người dùng ấn để reload trang.

### Test Case 14: Responsive trên Mobile
- **Mục tiêu:** Trang Admin có thể xem được trên kích thước di động.
- **Bước:**
  1. Thu nhỏ màn hình trình duyệt xuống < 768px.
- **Kỳ vọng:**
  - [ ] Sidebar biến mất, thay vào đó hiển thị nút "Quay lại" ở thanh header.
  - [ ] Các thành phần bảng có thể cuộn ngang (scroll-x) mượt mà không vỡ layout tổng.