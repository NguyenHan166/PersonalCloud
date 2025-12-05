EPIC 9 – Search & AI Search UX
Task 9.1 – Normal search (keyword)

Mục tiêu: Search title/tag/description/URL.

Việc cần làm:

Khi user gõ search và nhấn Enter:

Gọi listItems({ q, ...currentFilters }).

Hiển thị chip “Search: xxx” trong filter bar.

BE-friendly:

Search param q sau này map sang BE query.