# TechReview

เว็บรีวิวอุปกรณ์คอมพิวเตอร์ สมาชิกเข้าสู่ระบบเพื่อเขียนรีวิว ให้คะแนน และบันทึกอุปกรณ์ที่สนใจ

สร้างด้วย React 19, React Router 6 และ Tailwind CSS 3 โดยใช้ API contract เดียวกับ Go backend ในไฟล์อ้างอิง

## เริ่มใช้งาน

ติดตั้ง dependencies:

```bash
npm install
```

เปิด backend จำลองใน terminal แรก:

```bash
npm run mock
```

เปิดเว็บใน terminal ที่สอง:

```bash
npm start
```

เมื่อ `REACT_APP_API_URL` ว่าง CRA จะ proxy `/api` ไปที่ mock บน `localhost:4000`

บัญชีสำหรับ mock:

- สมาชิก: `demo@techreview.test` / `1234`
- ผู้ดูแล: `admin@techreview.test` / `1234`

ข้อมูล mock เก็บในหน่วยความจำ ปิด server แล้วข้อมูลที่เพิ่มระหว่างใช้งานจะหายไป

## Backend จริง

เมื่อตั้ง `REACT_APP_API_URL` เป็น origin ของ Go backend ใน `.env.local` หน้าเว็บระหว่างพัฒนาจะส่ง `/api` ผ่าน dev proxy เพื่อหลีกเลี่ยง CORS ใน browser ส่วน production จะเรียก API โดยตรง จึงต้องตั้งค่า origin นี้ใน Environment Variables ของ deployment เช่น:

```env
REACT_APP_API_URL=https://api.example.com
```

Go backend ต้องอนุญาต origin ของ frontend ใน `ALLOWED_ORIGINS` และทุกคำขอที่ต้อง login จะส่ง `Authorization: Bearer <token>`

รายละเอียดตารางและ endpoint อยู่ใน [docs/db-schema.md](./docs/db-schema.md) และ [docs/api-wishlist.md](./docs/api-wishlist.md)

## รูปแบบข้อมูลอุปกรณ์จาก API

รายการอุปกรณ์ใช้ field ตาม Go backend:

| Field | ความหมาย |
|---|---|
| `id` | รหัสอุปกรณ์ |
| `title` | ชื่อรุ่น |
| `titleTh` | ยี่ห้อ |
| `genre` | ชื่อหมวดภาษาไทย |
| `year` | ปีเปิดตัว |
| `rating` | คะแนนทีมงาน (0–10) |
| `price` | ราคาโดยประมาณ (บาท) |
| `emoji` | ไอคอนเมื่อไม่มีรูป |
| `poster` | URL รูป |
| `detail` | รายละเอียด |

รายละเอียดหน้ารายการยังมี `memberRating`, `memberVoteCount`, `myVote` และ `inWishlist`
