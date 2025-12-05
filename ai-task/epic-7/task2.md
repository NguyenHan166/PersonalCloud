Task 7.2 – Collection detail page

Mục tiêu: Xem item trong một collection.

Việc cần làm:

Route /collections/:id.

Header: tên collection + toggle Public.

List/Grid items (reuse Library components).

Nút “Add item to collection” (opens picker).

BE-friendly:

API dự kiến:

GET /api/collections/:id,

GET /api/collections/:id/items,

POST /api/collections/:id/items (thêm item),

DELETE /api/collections/:id/items/:itemId.