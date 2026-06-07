# Manual Test Cases - Trang Chủ Game

## Test Case 1: Hiển thị trang chủ
- **Mục tiêu:** Kiểm tra trang chủ tải đúng giao diện
- **Bước:**
  1. Mở trang chủ ứng dụng
  2. Chờ tải dữ liệu
- **Kỳ vọng:**
  - [ ] Logo "MenuGame" hiển thị ở sidebar
  - [ ] Thanh tìm kiếm hiển thị ở header
  - [ ] Danh sách game hiển thị dạng lưới

## Test Case 2: Banner slide tự động
- **Mục tiêu:** Kiểm tra banner tự động chuyển slide
- **Bước:**
  1. Mở trang chủ (không có filter)
  2. Quan sát banner trong 10 giây
- **Kỳ vọng:**
  - [ ] Banner hiển thị game đại diện
  - [ ] Slide tự động chuyển sau 5 giây
  - [ ] Các nút chấm pagination active đúng vị trí

## Test Case 3: Điều hướng banner thủ công
- **Mục tiêp:** Kiểm tra nút mũi tên điều khiển slide
- **Bước:**
  1. Di chuột lên banner
  2. Click nút "mũi tên trái" (ChevronLeft)
  3. Click nút "mũi tên phải" (ChevronRight)
  4. Click vào các nút chấm pagination
- **Kỳ vọng:**
  - [ ] Slide di chuyển đúng hướng
  - [ ] Slide quay vòng (cuối về đầu, đầu về cuối)

## Test Case 4: Lọc game theo thể loại
- **Mục tiêu:** Kiểm tra bộ lọc thể loại
- **Bước:**
  1. Click vào category "Action" trong sidebar
  2. Quan sát lại grid game
- **Kỳ vọng:**
  - [ ] Chỉ hiển thị game có category "Action"
  - [ ] Số lượng kết quả giảm
  - [ ] Category được highlight đang chọn

## Test Case 5: Lọc game theo loại (Online/Offline)
- **Mục tiêu:** Kiểm tra bộ lọc game type
- **Bước:**
  1. Click vào nút "Game Online" ở dưới banner
  2. Click vào nút "Game Offline"
  3. Click vào nút "Khác"
- **Kỳ vọng:**
  - [ ] Grid chỉ hiển thị game đúng loại
  - [ ] Nút được highlight đang chọn

## Test Case 6: Tìm kiếm game
- **Mục tiêu:** Kiểm tra chức năng tìm kiếm
- **Bước:**
  1. Nhập từ khóa "game" vào ô tìm kiếm
  2. Xóa và nhập từ khóa không tồn tại
- **Kỳ vọng:**
  - [ ] Kết quả hiển thị game chứa từ khóa
  - [ ] Thông báo "Không tìm thấy kết quả" khi không có

## Test Case 7: Kết hợp bộ lọc
- **Mục tiêu:** Kiểm tra đồng thời nhiều bộ lọc
- **Bước:**
  1. Chọn category "Action"
  2. Chọn game type "Game Online"
  3. Nhập từ khóa tìm kiếm
- **Kỳ vọng:**
  - [ ] Grid chỉ hiển thị game thỏa mãn cả 3 điều kiện

## Test Case 8: Khởi chạy game
- **Mục tiêu:** Kiểm tra dialog khởi chạy
- **Bước:**
  1. Click vào nút PLAY trên banner hoặc nút Play trên thẻ game
  2. Chờ 3 giây
- **Kỳ vọng:**
  - [ ] Dialog "Hệ thống kích hoạt" hiện lên
  - [ ] Tên game hiển thị trong dialog
  - [ ] Dialog tự đóng sau 3 giây

## Test Case 9: Xử lý lỗi
- **Mục tiêu:** Kiểm tra giao diện khi lỗi API
- **Bước:**
  1. Tắt backend server
  2. Refresh trang
- **Kỳ vọng:**
  - [ ] Hiển thị thông báo "Lỗi tải dữ liệu"
  - [ ] Nút "Thử lại" xuất hiện

## Test Case 10: Responsive
- **Mục tiêu:** Kiểm tra giao diện trên mobile
- **Bước:**
  1. Thu nhỏ màn hình < 768px
- **Kỳ vọng:**
  - [ ] Sidebar ẩn đi
  - [ ] Grid hiển thị 2 cột
  - [ ] Khi mở sidebar trên mobile (nếu có)