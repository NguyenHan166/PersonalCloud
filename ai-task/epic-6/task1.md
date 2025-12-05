Task 6.1 – Upload dialog (drag & drop multi-file)

Mục tiêu: Flow upload chuẩn theo spec của bạn.

Việc cần làm:

Nút “Add file” trong Library + Files:

mở modal upload.

Drag & drop zone + button chọn file.

Cho phép chọn collection, tags, category, project trước upload (optional).

BE-friendly:

FE flow:

Gửi POST /api/upload/init với danh sách file (name, type, size) → nhận uploadUrl + storageKey.

Upload trực tiếp lên R2/S3 qua uploadUrl.

Sau khi thành công, gọi POST /api/files/confirm với storageKey + metadata (title, type, tags…).

Trong FE hiện giờ chỉ mock 3 bước nhưng giữ đúng shape function:

interface InitUploadResponse {
  uploadUrl: string;
  storageKey: string;
}

initUpload(files: InitUploadFile[]): Promise<InitUploadResponse[]>;
confirmFileUpload(payload: ConfirmFileUploadPayload): Promise<FileMeta>;