## Cấu Trúc Phân Luồng Nhánh

### Sơ đồ tổng thể

```
main ─────────────────────────────────────────────────► production
  │                                            ▲
  │  (chỉ merge từ dev khi release)            │ merge qua PR
  │                                            │
  └──► dev ──────────────────────────────────────────► staging / test
         │                             ▲
         │  (tạo nhánh tính năng từ đây) │ merge qua PR
         │                             │
         ├──► feat/auth ───────────────┘
         ├──► feat/user-management ────┘
         ├──► bugfix/login-crash ──────┘
         └──► refactor/service-layer ──┘

hotfix ─► main (bypass dev, chỉ dùng khẩn cấp)
       └► dev  (đồng bộ lại sau hotfix)
```

---

### Vai trò từng nhánh

| Nhánh | Tồn tại | Mục đích | Ai được merge vào |
|-------|---------|----------|-------------------|
| `main` | Vĩnh viễn | Code đang chạy production, luôn ổn định | Chỉ từ `dev` (khi release) hoặc `hotfix/*` |
| `dev` | Vĩnh viễn | Nhánh tích hợp — tất cả tính năng hội tụ về đây | Từ `feat/*`, `bugfix/*`, `refactor/*` |
| `feat/*` | Tạm thời | Phát triển 1 tính năng cụ thể | Xóa sau khi merge vào `dev` |
| `bugfix/*` | Tạm thời | Sửa lỗi phát hiện trên `dev` | Xóa sau khi merge vào `dev` |
| `hotfix/*` | Tạm thời | Sửa lỗi khẩn cấp trực tiếp từ `main` | Merge vào cả `main` lẫn `dev` |
| `refactor/*` | Tạm thời | Tái cấu trúc không thay đổi tính năng | Xóa sau khi merge vào `dev` |
| `docs/*` | Tạm thời | Cập nhật tài liệu thuần túy | Xóa sau khi merge vào `dev` |

---

### Luồng làm việc chuẩn

#### Luồng thông thường — tính năng mới / sửa lỗi

```
1. Tạo nhánh từ dev
   dev → feat/ten-tinh-nang

2. Viết code, commit nhiều lần trên nhánh này

3. Khi xong → tạo PR: feat/ten-tinh-nang → dev
   (Code review, CI pass)

4. Merge vào dev → xóa nhánh feat/

5. Khi đủ tính năng cho 1 release → tạo PR: dev → main
```

#### Luồng hotfix — lỗi khẩn cấp trên production

```
1. Tạo nhánh từ main (KHÔNG từ dev)
   main → hotfix/ten-loi

2. Sửa lỗi, commit

3. Merge vào main → deploy production ngay

4. Merge vào dev để đồng bộ
   (tránh lỗi tái xuất hiện ở lần release tiếp theo)

5. Xóa nhánh hotfix/
```

---

### Quy tắc bảo vệ nhánh

| Quy tắc | `main` | `dev` |
|---------|--------|-------|
| Push trực tiếp | ❌ Cấm | ❌ Cấm |
| Merge phải qua PR | ✅ Bắt buộc | ✅ Bắt buộc |
| CI phải pass trước khi merge | ✅ | ✅ |

> **Không bao giờ** commit thẳng vào `main` hoặc `dev`, dù là admin.

---

## Đặt tên Branch

Tên nhánh viết thường, không dấu, phân cách bằng `-`, tiền tố theo loại công việc:

| Tiền tố | Tạo từ nhánh | Dùng khi | Ví dụ |
|---------|-------------|----------|-------|
| `feat/` | `dev` | Tính năng mới | `feat/auth-login` |
| `bugfix/` | `dev` | Sửa lỗi phát hiện trên dev/staging | `bugfix/auth-cookie-refresh` |
| `hotfix/` | `main` | Sửa lỗi khẩn cấp trên production | `hotfix/login-crash` |
| `refactor/` | `dev` | Tái cấu trúc, không đổi tính năng | `refactor/service-layer` |
| `docs/` | `dev` | Cập nhật tài liệu thuần túy | `docs/update-git-guidelines` |

```bash
# Tạo nhánh tính năng từ dev (trường hợp thông thường)
git checkout dev
git pull origin dev
git checkout -b feat/auth-login

# Tạo nhánh hotfix từ main (khẩn cấp)
git checkout main
git pull origin main
git checkout -b hotfix/login-crash
```

---



## Định dạng Commit Message (Conventional Commits)

```
type(branch-name): mô tả ngắn gọn bằng tiếng Anh
```

### Các `type` thường dùng

| Type | Ý nghĩa |
|------|---------|
| `feat` | Tính năng mới |
| `fix` | Sửa lỗi |
| `docs` | Cập nhật tài liệu |
| `style` | Sửa format code (không đổi logic) |
| `refactor` | Tái cấu trúc code |
| `test` | Thêm / sửa test |
| `chore` | Cấu hình build, dependency... |

### Ví dụ commit đúng

```bash
feat(feat/auth): add role editing support
fix(feat/auth): clear cookies on session timeout
docs(feat/auth): add branch naming conventions
refactor(feat/auth): extract apiFetch to shared util
style(feat/auth): run prettier on all tsx files
```

### Ví dụ commit sai

```bash
# ❌ Không rõ ràng
update code
fix bug
wip

# ❌ Không có scope
feat: add something

# ❌ Tiếng Việt có dấu — khó search, khó đọc trong terminal
feat(users): thêm tính năng chỉnh sửa quyền
```

---

## Quy trình làm việc hằng ngày

```bash
# 1. Trước khi code — tạo nhánh từ dev (KHÔNG phải main)
git checkout dev
git pull origin dev
git checkout -b feat/ten-tinh-nang

# 2. Viết code xong — kiểm tra trước khi commit
npm run format       # format code tự động
npm run lint         # kiểm tra lỗi ESLint
npm run build        # phát hiện lỗi TypeScript tĩnh

# 3. Commit
git add .
git commit -m "feat(feat/ten-tinh-nang): implement profile details page"

# 4. Đẩy lên remote và tạo PR vào dev
git push origin feat/ten-tinh-nang
# → Tạo PR: feat/ten-tinh-nang → dev (trên GitHub/GitLab)
```

### Khi release lên production

```bash
# Tạo PR: dev → main (sau khi kiểm tra đủ trên staging)
# Chỉ thực hiện khi nhóm đồng ý release
git checkout main
git merge dev
git push origin main
```

### Khi có hotfix khẩn cấp

```bash
# 1. Tạo nhánh từ main
git checkout main
git pull origin main
git checkout -b hotfix/login-crash

# 2. Sửa lỗi, commit
git commit -m "fix(hotfix/login-crash): handle null token on session expire"

# 3. Merge vào main trước
git checkout main
git merge hotfix/login-crash
git push origin main

# 4. Đồng bộ lại vào dev
git checkout dev
git merge hotfix/login-crash
git push origin dev

# 5. Xóa nhánh hotfix
git branch -d hotfix/login-crash
git push origin --delete hotfix/login-crash
```

---

## Quy tắc Pull Request

- **1 PR = 1 tính năng / 1 bug fix** — không gộp nhiều việc không liên quan
- PR phải pass `npm run build` và `npm run lint` trước khi review
- Mô tả PR bằng tiếng Việt, giải thích thay đổi và cách test thủ công
- Không merge vào `main` nếu chưa có ít nhất 1 người review

---

## Các lệnh Git hay dùng

```bash
# Xem trạng thái file thay đổi
git status

# Xem lịch sử commit gọn
git log --oneline -10

# Hủy thay đổi chưa stage ở 1 file
git checkout -- src/app/page.tsx

# Tạm lưu công việc dang dở để chuyển nhánh
git stash
git stash pop
```
