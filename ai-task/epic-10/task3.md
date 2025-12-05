Task 10.3 – Global toasts & error handling

Mục tiêu: Một chỗ quản lý toast/notification.

Việc cần làm:

Tạo ToastProvider + hook useToast.

Dùng cho: success create item, error upload, copy link, etc.

BE-friendly:

Khi nối BE, chỉ cần gọi toast ở chỗ .catch / .then.