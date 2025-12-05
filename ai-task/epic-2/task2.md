Task 2.2 – API layer stub

Mục tiêu: Mọi API đều đi qua service, dễ switch sang BE.

Việc cần làm:

Tạo src/api/client.ts (axios/fetch wrapper) với:

get, post, put, patch, delete.

Interceptor lỗi (401, 500).

Tạo các service stub:

libraryApi.ts, filesApi.ts, collectionsApi.ts, sharedLinksApi.ts, aiApi.ts.

Tạm thời return mock data (Promise resolved).

BE-friendly:

Đặt ký hiệu rõ ràng đường dẫn dự kiến, ví dụ:

// libraryApi.ts
export async function listItems(params: ListItemsParams): Promise<Paginated<Item>> {
  // TODO: call GET /api/items với query: type, tags, category, project, sort...
}


Khi BE xong chỉ cần thay implementation trong service.