AI Task S1 — Auth UI + Account Shell (chuẩn bị cho multi-tenant)

Goal
Thêm UI cho đăng ký / đăng nhập / quên mật khẩu + “account shell” cơ bản (dù BE chưa làm thật, dùng mock).

Inputs

App FE hiện tại (React + TS + Tailwind + shadcn + Router).

Định hướng multi-tenant: user có thể thuộc 1 “account” (workspace).

Constraints

Dùng React Router để tách auth routes (/auth/*) và app routes (/app/*).

Form dùng React Hook Form + Zod.

Auth state tạm mock (zustand) để sau nối vào BE dễ.

Steps

Tạo layout Auth:

AuthLayout: logo, hình minh hoạ, card form giữa màn hình.

Responsive: mobile full width, desktop 2 cột (promo + form).

Tạo routes:

/auth/login

/auth/register

/auth/forgot-password

Tạo components:

LoginForm, RegisterForm, ForgotPasswordForm.

Validate: email, password (min length, confirm).

Tạo AuthStore (zustand):

user, account, isAuthenticated, login(), logout(), mockRegister().

Persist bằng localStorage (chưa cần token).

Route guard:

/app/* chỉ vào được nếu isAuthenticated = true.

Nếu chưa login → redirect /auth/login.

Trong App Shell hiện tại:

Di chuyển tất cả route chính sang /app/... (VD: /app/library, /app/files).

Thêm Account menu trong header: hiển thị email + nút “Đăng xuất”.

Deliverables

Giao diện auth đầy đủ, đẹp, responsive.

App chính nằm dưới /app, có guard.

Acceptance

Nếu chưa đăng nhập → truy cập /app/library sẽ tự bị chuyển về /auth/login.

Đăng ký xong → auto login → điều hướng /app/library.

Đăng nhập/đăng xuất hoạt động bằng mock store, không lỗi console.

Có ngoại lệ là những link share, những collections lib public thì không cần đăng nhập.