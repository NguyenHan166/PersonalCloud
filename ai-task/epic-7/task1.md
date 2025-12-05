EPIC 7 – Collections & Public Library
Task 7.1 – Collections list page

Mục tiêu: Quản lý collections.

Việc cần làm:

Page /collections:

List card: name, description, items count, isPublic badge.

Nút “New collection”.

Modal create/edit collection.

BE-friendly:

Type:

interface CreateCollectionPayload {
  name: string;
  description?: string;
  isPublic: boolean;
}
