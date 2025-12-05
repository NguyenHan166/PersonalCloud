Task 5.2 – Grid thumbnail + preview behavior

Mục tiêu: Thumbs đẹp & preview cơ bản.

Việc cần làm:

FileCard với thumbnail:

image/video: preview nhỏ,

pdf: icon + “PDF” badge,

others: generic icon.

Click → mở modal preview:

image viewer,

video player (HTML5),

PDF iframe/embed,

others: thông tin + nút Download.

BE-friendly:

FileMeta phải có mimeType để FE decide view.

Download link sau này sẽ dùng signed URL; hiện fake href.