Task 3.3 – Empty states, loading, error

Mục tiêu: UX tốt từ đầu.

Việc cần làm:

Skeleton cards khi loading.

Empty state: “No items found” + nút “Add file / Add link”.

Error state hiển thị message chung.

BE-friendly:

API service chỉ cần trả promise; hook useItems xử lý isLoading, isError.