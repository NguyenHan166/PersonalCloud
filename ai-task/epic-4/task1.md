EPIC 4 – Item Detail Panel (slide-in panel)
Task 4.1 – Layout panel chi tiết item

Mục tiêu: Panel bên phải khi click item.

Việc cần làm:

Panel overlay dạng slide từ bên phải (width ~ 400–480px).

Section:

Preview: thumbnail / embed / link preview.

Metadata:

Title (editable inline),

Type (read-only),

Tags (multi-select),

Category, Project, Importance,

Created/Updated time read-only.

AI box:

Summary text area (read-only nếu từ BE),

Buttons: “Generate tags”, “Summarize content”, “Improve description”.

Sharing:

Button “Create share link”,

Bảng các share links (nếu có).

BE-friendly:

Panel nhận itemId; dùng getItem(itemId) trong libraryApi.

Edit metadata dùng API PATCH /api/items/:id.