Task 4.2 – Inline edit metadata

Mục tiêu: Edit UX mượt.

Việc cần làm:

Cho phép click vào title/description để edit.

Tag selector: multi-select với autocomplete.

Category/Project: dropdown + free-typing (optional).

Importance: radio/badge toggle.

BE-friendly:

Tạo DTO update:

interface UpdateItemPayload {
  title?: string;
  description?: string;
  tags?: string[];       // tag names or IDs (quy ước từ đầu)
  category?: string;
  project?: string;
  importance?: Importance;
}


updateItem(id, payload) trong libraryApi.