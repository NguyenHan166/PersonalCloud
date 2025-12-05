EPIC 8 – Shared Links Management
Task 8.1 – Shared Links page

Mục tiêu: Table quản lý links shared.

Việc cần làm:

Route /shared-links.

Table:

Item name,

Share URL (copy button),

Expiration,

Status: Active / Expired / Revoked,

Actions: Copy, Revoke.

BE-friendly:

Type ListSharedLinksParams:

interface ListSharedLinksParams {
  status?: 'active' | 'expired' | 'revoked';
  page?: number;
  pageSize?: number;
}
