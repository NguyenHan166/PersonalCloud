Task 6.2 – Add Link flow

Mục tiêu: Tạo item type link.

Việc cần làm:

Nút “Add link” ở Library.

Modal:

URL, Title (optional → auto fill), Description, Tags, Category, Project.

Validate URL.

BE-friendly:

API dự kiến: POST /api/items với type = 'link'.

Payload:

interface CreateLinkItemPayload {
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  project?: string;
  importance?: Importance;
}