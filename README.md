


## Yêu cầu

- [Node.js](https://nodejs.org/en/blog/release/v20.9.0) (v20.9.0)
- [npm](https://www.npmjs.com/)  (9.8.1)

- Kiểm tra phiên bản truy cập cmd sau đó thực hiện lệnh
  node -v
  npm -v

## Cài đặt

1. **Clone repository này về máy của bạn:**

    ```sh
    git clone https://github.com/vanquan19/english_center.git
    ```

2. **Chuyển vào thư mục dự án:**

    ```sh
    cd english_center
    ```

3. **Cài đặt các gói cần thiết:**

    ```sh
    npm install
    ```

## Cấu hình

Tạo file `.env` trong thư mục gốc của dự án và thêm các biến môi trường cần thiết. Ví dụ:

(Thêm file env gửi riêng)
## Import database
Tạo database englishcenter trong xampp
sau đó vào mục import, thêm file có đuôi sql vào và nhập
## Chạy dự án

1. **Khởi động server:**

    ```sh
    npm start
    ```

2. Mở trình duyệt và truy cập `http://localhost:3000`

## Cấu trúc Thư mục

    ```
    project-name/
    ├── node_modules/   # Thư viện Node.js đã cài đặt
    ├── public/         # Tài nguyên tĩnh (HTML, CSS, JS, hình ảnh)
    ├── src/            # Mã nguồn dự án
    │   ├── controllers/ # Điều khiển (Controllers)
    │   ├── models/      # Mô hình (Models)
    │   ├── routes/      # Định tuyến (Routes)
    │   └── views/       # Giao diện (Views)
    ├── .env            # Biến môi trường
    ├── .gitignore      # Danh sách file bỏ qua khi commit
    ├── package.json    # Thông tin dự án và danh sách các gói cần thiết
    └── README.md       # Hướng dẫn thiết lập và sử dụng dự án
    ```

## Scripts

- `npm start`: Chạy ứng dụng ở môi trường nodemon




## Ghi chú

- Đảm bảo bạn đã cài đặt đúng phiên bản Node.js và npm trước khi bắt đầu.
- Sử dụng `nodemon` để tự động tải lại server khi có thay đổi trong mã nguồn:

    ```sh
    npm install -g nodemon
    npm run dev
    ```




