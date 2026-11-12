# TechReview API Endpoints

ทุก endpoint ใช้ prefix `/api` และตอบ JSON ตาม [สัญญา backend](./db-schema.md) เว้นแต่ระบุ status `204` ซึ่งไม่มี response body

| Method | Path | Login | ใช้ทำอะไร |
|---|---|---:|---|
| GET | `/api/equipment?q=คำค้น&category=รหัสหมวด` | ไม่ | รายการและค้นหาอุปกรณ์ |
| GET | `/api/equipment/{id}` | ไม่ | รายละเอียดอุปกรณ์ พร้อมสถานะของผู้ใช้เมื่อส่ง token |
| GET | `/api/categories` | ไม่ | รายการหมวด |
| POST | `/api/auth/register` | ไม่ | สมัครด้วย `{ "email", "password", "displayName" }`; รหัสผ่านอย่างน้อย 8 ตัวอักษรและไม่เกิน 72 ไบต์ |
| POST | `/api/auth/login` | ไม่ | เข้าสู่ระบบด้วย `{ "email", "password" }` |
| GET | `/api/me` | ใช่ | ข้อมูลสมาชิกปัจจุบัน |
| GET | `/api/equipment/{id}/reviews` | ไม่ | รีวิวของอุปกรณ์ |
| POST | `/api/equipment/{id}/reviews` | ใช่ | ส่ง `{ "text" }`; ข้อความยาว 10–2000 ตัวอักษร |
| DELETE | `/api/reviews/{reviewId}` | ใช่ | ลบรีวิวของตนเอง (admin ลบได้ทุกรีวิว) |
| PUT | `/api/equipment/{id}/vote` | ใช่ | ส่ง `{ "score": 1 }` ถึง `{ "score": 10 }` |
| DELETE | `/api/equipment/{id}/vote` | ใช่ | ถอนคะแนนของตนเอง |
| GET | `/api/me/wishlist` | ใช่ | รายการอุปกรณ์ที่บันทึกไว้ |
| PUT | `/api/me/wishlist/{equipmentId}` | ใช่ | เพิ่มหรือปรับโน้ต `{ "note": "..." }`; ไม่ส่ง body ก็ได้ |
| DELETE | `/api/me/wishlist/{equipmentId}` | ใช่ | เอาอุปกรณ์ออกจากรายการ |
| GET | `/api/admin/stats` | Admin | สถิติ dashboard |
| GET | `/api/admin/members` | Admin | รายชื่อสมาชิก |
| PUT | `/api/admin/members/{id}/role` | Admin | เปลี่ยน role ด้วย `{ "role": "member" }` หรือ `admin` |
| GET | `/api/admin/equipment/{id}` | Admin | โหลดข้อมูลแก้ไขและจำนวนข้อมูลที่จะถูกลบ |
| POST | `/api/admin/equipment` | Admin | เพิ่มอุปกรณ์ |
| PUT | `/api/admin/equipment/{id}` | Admin | แก้ไขอุปกรณ์ |
| DELETE | `/api/admin/equipment/{id}` | Admin | ลบอุปกรณ์และข้อมูลที่เกี่ยวข้อง |

คำขอที่ต้อง login ส่ง header `Authorization: Bearer <token>` ทุก error ตอบ `{ "error": { "code": "...", "message": "..." } }`
