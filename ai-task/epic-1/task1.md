EPIC 1 – Global Layout & Navigation
Task 1.1 – App shell: Sidebar + Header + Content

Mục tiêu: Layout chuẩn để mọi page reuse.

Việc cần làm:

Sidebar bên trái với menu:

Library, Collections, Files, Links, Notes, Shared Links, Trash.

Header trên:

ô Search lớn (sẽ gắn AI search sau),

filter tóm tắt, avatar user, nút Settings (stub).

Content dùng flex / grid, responsive (sidebar collapse khi mobile).

BE-friendly:

Tạo route sẵn (e.g. /library, /collections, /files, /links, /notes, /shared-links, /trash).

Dùng NavLink với state active (sau BE chỉ cần match route).