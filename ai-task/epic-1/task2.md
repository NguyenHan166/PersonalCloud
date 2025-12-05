Task 1.2 – Tag quick-filter ở sidebar

Mục tiêu: UX tốt cho việc filter nhanh.

Việc cần làm:

Phần “Popular Tags” / “My Tags” bên dưới menu.

Mặc định dùng dummy data; sau sẽ fetch /api/tags.

BE-friendly:

Chuẩn bị type Tag:

interface Tag { id: string; name: string; color?: string; usageCount?: number; }


Sidebar chỉ nhận tags: Tag[] và callback onTagSelect(tagId).