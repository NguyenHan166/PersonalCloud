Task 8.2 – Create share link trong Item Detail

Mục tiêu: Flow tạo share link từ panel.

Việc cần làm:

Nút “Create share link”:

mở modal:

Expiration: 1h / 1d / 7d / custom,

Optional password.

Sau khi tạo (mock), hiện dòng mới trong bảng share links.

BE-friendly:

API dự kiến: POST /api/shared-links:

interface CreateSharedLinkPayload {
  itemId: string;
  expiresInHours: number;
  password?: string;
}