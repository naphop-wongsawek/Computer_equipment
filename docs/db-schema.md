# TechReview Database and API Contract

เอกสารนี้อธิบายสัญญาที่ frontend ใช้ร่วมกับ Go backend (Go + PostgreSQL) ชื่อ JSON เป็น camelCase ตาม backend

## ตารางหลัก

| ตาราง | หน้าที่ |
|---|---|
| `categories` | หมวดอุปกรณ์ มี `name_en` และ `name_th` |
| `equipment` | ข้อมูลอุปกรณ์ รุ่น ยี่ห้อ หมวด ปี คะแนน ราคา รูป และรายละเอียด |
| `members` | บัญชีสมาชิก เก็บ password hash และ role `member` หรือ `admin` |
| `reviews` | รีวิวของสมาชิก โดยสมาชิกหนึ่งคนรีวิวอุปกรณ์หนึ่งรุ่นได้หนึ่งครั้ง |
| `votes` | คะแนน 1–10 ต่อสมาชิกและอุปกรณ์ |
| `wishlist_items` | รายการอุปกรณ์ที่สมาชิกบันทึกไว้ |
| `equipment_vote_stats` | View รวมคะแนนเฉลี่ยและจำนวนคะแนนของสมาชิก |

`reviews`, `votes` และ `wishlist_items` อ้างอิงสมาชิก/อุปกรณ์และลบตามอุปกรณ์เมื่อผู้ดูแลลบรุ่นนั้น

## รูปแบบข้อมูล

รายการอุปกรณ์ตอบกลับในรูปแบบ:

```json
{
  "id": 13,
  "title": "GeForce RTX 4060",
  "titleTh": "NVIDIA",
  "genre": "การ์ดจอ",
  "year": 2023,
  "rating": 8,
  "price": 10900,
  "emoji": "🎮",
  "poster": "https://example.com/rtx-4060.jpg",
  "detail": "รายละเอียดอุปกรณ์"
}
```

`GET /api/equipment/{id}` เพิ่ม `memberRating`, `memberVoteCount`, `myVote` และ `inWishlist` โดย `myVote` จะเป็น `null` และ `inWishlist` เป็น `false` เมื่อไม่มีผู้ใช้ที่ login

หมวดตอบเป็น `{ "items": [{ "id", "nameEn", "nameTh" }] }`; หน้า admin ส่ง `categoryId` เป็นตัวเลขตอนเพิ่มหรือแก้ไขอุปกรณ์

## Authentication และ error

- Login ตอบ `{ "token", "member" }`
- Endpoint ที่ต้อง login ใช้ `Authorization: Bearer <token>`
- Endpoint admin ต้องเป็นสมาชิก role `admin`
- Error ทุกตัวตอบ `{ "error": { "code": "...", "message": "..." } }` พร้อม HTTP status ที่เหมาะสม
- Backend Go รับ `ALLOWED_ORIGINS` เพื่อกำหนด origin ที่อนุญาต และให้บริการ health check ที่ `/healthz`

## Backend จำลอง

`mock/server.js` รองรับ endpoint และรูปแบบ JSON เดียวกับ Go backend เพื่อให้ frontend ทำงานในเครื่องได้โดยไม่ต้องมี PostgreSQL ข้อมูลเก็บในหน่วยความจำ ส่วนรายการตั้งต้นอยู่ใน `mock/equipment.json`
