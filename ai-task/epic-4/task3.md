Task 4.3 – AI actions UI hooks (chưa gọi real AI)

Mục tiêu: UI sẵn cho AI.

Việc cần làm:

Nút “Generate tags”:

click → show loading state → hiển thị danh sách tags gợi ý (mock).

Nút “Summarize content”:

click → show skeleton summary → hiển thị text (mock).

BE-friendly:

Định nghĩa interface AI API:

interface AiTagSuggestion {
  tag: string;
  confidence: number;
}

interface AiSummaryResponse {
  summary: string;
}

function suggestTags(itemId: string): Promise<AiTagSuggestion[]>;
function summarizeItem(itemId: string): Promise<AiSummaryResponse>;


Sau này BE chỉ cần implement 2 endpoint tương ứng.