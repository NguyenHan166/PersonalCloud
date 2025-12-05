Task 9.2 – AI semantic search UI

Mục tiêu: Phân biệt rõ search thường vs AI search.

Việc cần làm:

Phần dưới search bar:

Toggle “AI Search” vs “Keyword Search”.

Khi bật “AI Search”:

Gọi aiSearchItems(query).

Hiển thị small text: “Results ordered by semantic similarity”.

BE-friendly:

Interface:

interface AiSearchResult {
  item: Item;
  score: number; // similarity
}

function aiSearchItems(query: string): Promise<AiSearchResult[]>;