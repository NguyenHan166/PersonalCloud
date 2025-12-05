EPIC 3 – Library Page (màn hình chính)
Task 3.1 – Library toolbar & search/filter row

Mục tiêu: Thanh trên cùng: search + filter.

Việc cần làm:

Search bar với placeholder: "Search by title, tags, content...".

Filter chips / dropdown:

Type (All, File, Link, Note),

Tags (multi-select),

Category, Project,

Sort (Newest, Oldest, A-Z, Z-A, Importance).

BE-friendly:

Tạo type ListItemsParams:

interface ListItemsParams {
  q?: string;
  type?: ItemType;
  tags?: string[];
  category?: string;
  project?: string;
  sort?: 'created_desc' | 'created_asc' | 'title_asc' | 'title_desc' | 'importance_desc';
  page?: number;
  pageSize?: number;
}


Khi user thay đổi filter, gọi listItems(params).