Task 6.3 – Add Note flow (nếu muốn có Notes)

Mục tiêu: Tạo item type note.

Việc cần làm:

Nút “New note”.

Modal hoặc page nhỏ:

Title, content (textarea/editor), tags, category, project.

BE-friendly:

API tương tự POST /api/items với type = 'note':

interface CreateNoteItemPayload {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  project?: string;
  importance?: Importance;
}