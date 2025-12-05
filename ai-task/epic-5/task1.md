EPIC 5 – Files Page (Personal Cloud view)
Task 5.1 – Files toolbar & filter

Mục tiêu: UX giống Drive.

Việc cần làm:

Breadcrumb: Home / Files / [Images|Videos|Documents|Others].

Tabs hoặc filter pills: All / Images / Videos / Documents / Others.

Sort: by date, name, size.

BE-friendly:

Type ListFilesParams:

interface ListFilesParams {
  type?: 'image' | 'video' | 'document' | 'other';
  sort?: 'created_desc' | 'size_desc' | 'name_asc';
  page?: number;
  pageSize?: number;
}
