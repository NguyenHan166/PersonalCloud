Task 3.2 – Grid / List view component cho items

Mục tiêu: Reusable component hiển thị item theo dạng card/list.

Việc cần làm:

Component ItemCard:

icon theo type (📄, 🖼️, 🎥, 🔗),

title, tags, 1–2 dòng description,

optionally badges: type, domain, project, importance.

Component ItemListRow (table-like).

Toggle Grid/List ở toolbar.

BE-friendly:

ItemCard nhận item: Item, onClick(item); không logic API bên trong.