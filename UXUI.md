Dưới đây là một **“Yêu cầu UI/UX chung”** mà bạn có thể đính kèm cho *mọi task FE*.
Agent chỉ cần đọc phần này là hiểu style phải bám theo.

---

## 🎨 YÊU CẦU CHUNG VỀ UI/UX CHO MỌI TASK

> Áp dụng cho **tất cả các màn hình, component, flow** trong dự án.

---

### 1. Phong cách tổng thể

* Giao diện **hiện đại, tối giản, gọn gàng**, ưu tiên nội dung.
* Màu sắc:

  * Nền: sáng vừa, không quá chói (off-white / gray rất nhạt).
  * Card / surface: tách bạch nhẹ với nền bằng **shadow mềm + border mỏng**.
  * Primary color dùng tiết chế (nút, link, chip trạng thái), không lạm dụng.
* Không nhồi quá nhiều viền, dùng **spacing + shadow** để phân khu.

---

### 2. Responsive & Layout

* **Bắt buộc responsive**:

  * Mobile (≤ 768px), Tablet (768–1024px), Desktop (≥ 1024px).
* Sidebar:

  * Desktop: hiển thị đầy đủ.
  * Mobile: auto collapse thành icon bar hoặc slide-in drawer.
* Panel chi tiết:

  * Desktop: slide-in từ bên phải.
  * Mobile: dùng dạng full-screen modal.
* Không để scroll lồng nhau quá nhiều; ưu tiên:

  * 1 scroll chính cho content,
  * panel/ modal có scroll riêng nếu cần.

---

### 3. Typography & Spacing

* Tiêu đề và text phải rõ ràng, dễ scan:

  * Title page: ~`text-2xl` / `text-xl` đậm.
  * Subheading / section title: `text-lg`.
  * Body: `text-sm` hoặc `text-base`.
* **Không text quá nhỏ.**
* Spacing:

  * Card: padding tối thiểu `p-4`.
  * Section: `py-4`–`py-6`.
  * Khoảng cách giữa các item list: ít nhất `gap-2`/`gap-3`.
* Nội dung quan trọng phải đứng đầu: **title → action chính → info phụ**.

---

### 4. Trạng thái UI (bắt buộc phải có)

Mọi component / màn hình có tương tác data đều cần đủ 4 trạng thái:

1. **Loading**

   * Dùng skeleton hoặc spinner + nội dung ghost.
   * Không để màn hình trắng.
2. **Empty state**

   * Có icon/illustration nhẹ + message đơn giản + CTA (ví dụ “Add file / Add link”).
3. **Error state**

   * Hiển thị message ngắn gọn (“Something went wrong”) + nút “Retry”.
4. **Normal state**

   * Rõ ràng, dễ hiểu, không bừa bộn.

Ngoài ra:

* Button / link phải có:

  * **Hover, Active, Disabled** rõ ràng.
* Input:

  * **Focus** state nổi bật nhẹ (border + shadow mỏng), tránh chỉ dùng màu.

---

### 5. Form & Inputs

* Cấu trúc form:

  * Mỗi field có **label rõ ràng** + placeholder (nếu cần).
  * Error message hiển thị **gần field** (dưới hoặc bên dưới label).
* Validation:

  * Nếu có validation client, hiển thị thông báo cụ thể (không chung chung).
* Không để field đụng sát nhau; dùng `space-y-3` hoặc tương đương.
* Button:

  * Primary action (Save/Create) luôn **nổi bật và ở bên phải** (trong dialog/footer).
  * Secondary action (Cancel) ở bên trái và ít nổi bật hơn.

---

### 6. Component Reuse & Code Style UI

* Ưu tiên **dùng lại component** chung:

  * Luôn dùng `Button`, `Input`, `Modal`, `Badge`… đã định nghĩa, **không tự làm mới** nếu không thực sự cần style khác.
* Không inline style lung tung; **dùng Tailwind** + class helper (`classNames`).
* Tách nhỏ component:

  * Page → section component → card/row component.
  * Tránh nhồi 1 file 500–1000 dòng.

---

### 7. Trải nghiệm người dùng (UX)

* Các thao tác chính phải **rõ ràng**:

  * Upload, Add Link, Create Collection, Share… luôn có **button dễ thấy**.
* Phản hồi cho user:

  * Sau action quan trọng (Create, Delete, Share...), **bắt buộc** có toast/notification (success / error).
* Không yêu cầu user click quá nhiều:

  * Nếu có thể, cho inline edit (title, description, tags) trong panel chi tiết.
* Không tự động mất dữ liệu:

  * Nếu đang edit trong modal/panel, tránh reset form khi đóng mở lại, trừ khi intentionally reset.

---

### 8. Accessibility (A11y) tối thiểu

* Icon-only button phải có:

  * `aria-label` hoặc tooltip để biết chức năng (vd: Copy link, Revoke, Close).
* Có thể điều hướng cơ bản bằng phím Tab:

  * Button, input, link đều focus được.
* Đảm bảo contrast đủ:

  * Text trên nền không quá nhạt.

---

### 9. Animation & Motion

* Motion **nhẹ nhàng, tinh tế**, không gây mệt:

  * Panel slide-in: duration khoảng 200–300ms.
  * Modal open/close: fade + slight scale.
  * Hover button: transform nhỏ + shadow nhẹ.
* Tránh animation lặp vô hạn gây phân tán (trừ loader nhỏ).

---

### 10. Kỹ thuật UI (liên quan đến code)

* Không block UI khi call API:

  * Button có `loading` state, disable trong lúc gửi request.
  * Có thể show small spinner trên button thay vì full page loading.
* Pagination hoặc infinite scroll cho list dài:

  * Không render quá nhiều item một lúc nếu list nhiều.
* Sử dụng **toasts** cho thông báo nhanh, không dùng alert browser.

---