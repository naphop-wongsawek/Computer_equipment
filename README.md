# TechReview

เว็บแคตตาล็อกและรีวิวอุปกรณ์คอมพิวเตอร์ สมาชิกสามารถค้นหาอุปกรณ์ ให้คะแนน เขียนรีวิว และบันทึกรายการที่สนใจ ส่วนผู้ดูแลจัดการข้อมูลอุปกรณ์และสมาชิกได้

สร้างด้วย React 19, React Router 6 และ Tailwind CSS 3 โดย frontend ใช้ API contract ที่ทำงานร่วมกับ Go backend ได้ และมี mock backend สำหรับพัฒนาในเครื่อง

## ความสามารถ

- ค้นหาและกรองอุปกรณ์ตามหมวดหมู่
- ดูรายละเอียด ให้คะแนน และเขียนรีวิวเมื่อเข้าสู่ระบบ
- บันทึกอุปกรณ์ในรายการที่สนใจ
- จัดการอุปกรณ์ สมาชิก และสิทธิ์ผู้ใช้ผ่านหน้าผู้ดูแล

## เริ่มใช้งานในเครื่อง

ต้องใช้ Node.js 18 ขึ้นไป

ติดตั้ง dependencies และสร้างไฟล์ตั้งค่าในเครื่อง:

```bash
npm install
cp .env.example .env
```

ค่า `REACT_APP_API_URL` ใน `.env` ว่างไว้เพื่อใช้ mock backend โดยค่าเริ่มต้น

เปิด mock backend ใน terminal แรก:

```bash
npm run mock
```

เปิดเว็บใน terminal ที่สอง:

```bash
npm start
```

เว็บจะทำงานที่ `http://localhost:3000` และเรียก mock backend ที่ `http://localhost:4000`

### บัญชีสำหรับ mock

- สมาชิก: `demo@techreview.test` / `12345678`
- ผู้ดูแล: `demo2@techreview.test` / `12345678`

ข้อมูล mock เก็บในหน่วยความจำ เมื่อปิด server ข้อมูลรีวิว คะแนน รายการที่สนใจ และการเปลี่ยนแปลงระหว่างใช้งานจะหายไป รายการอุปกรณ์ตั้งต้นอยู่ใน [`mock/equipment.json`](./mock/equipment.json)

## ใช้ Go backend

กำหนด `REACT_APP_API_URL` เป็น origin ของ Go backend เช่น:

```env
REACT_APP_API_URL=https://api.example.com
```

ระหว่างพัฒนา CRA จะ proxy `/api` ไปยัง origin นี้ ส่วน build สำหรับ production จะเรียก API ที่ origin โดยตรง จึงต้องกำหนดตัวแปรนี้ก่อนสั่ง build หรือใน environment ของ deployment และตั้ง `ALLOWED_ORIGINS` ฝั่ง Go backend ให้ยอมรับ origin ของ frontend

## คำสั่งที่ใช้ได้

| คำสั่ง | การทำงาน |
|---|---|
| `npm start` | เริ่มเว็บสำหรับพัฒนา |
| `npm run mock` | เริ่ม mock backend |
| `npm test` | รันทดสอบ |
| `npm run build` | สร้างไฟล์สำหรับ production ใน `build/` |

## เส้นทางหลักในเว็บ

- `/` หน้าแรก
- `/products` รายการอุปกรณ์ ค้นหา และกรองตามหมวด
- `/products/:id` รายละเอียดอุปกรณ์ รีวิว และการให้คะแนน
- `/login` และ `/register` เข้าสู่ระบบและสมัครสมาชิก
- `/me/wishlist` รายการอุปกรณ์ที่สนใจของสมาชิก
- `/admin` หน้าผู้ดูแล จัดการอุปกรณ์และสมาชิก

## รูปแบบข้อมูลอุปกรณ์จาก API

รายการอุปกรณ์ใช้ field ตาม API contract:

| Field | ความหมาย |
|---|---|
| `id` | รหัสอุปกรณ์ |
| `title` | ชื่อรุ่น |
| `titleTh` | ยี่ห้อ |
| `genre` | ชื่อหมวด |
| `year` | ปีเปิดตัว |
| `rating` | คะแนนอุปกรณ์จากแคตตาล็อก (0–10) |
| `price` | ราคาโดยประมาณ |
| `emoji` | ไอคอนเมื่อไม่มีรูป |
| `poster` | URL รูป |
| `detail` | รายละเอียด |

รายละเอียดอุปกรณ์อาจมี `memberRating`, `memberVoteCount`, `myVote` และ `inWishlist` เพิ่มเติม ส่วนหน้าเว็บจะแปลงชื่อ field เหล่านี้เป็นรูปแบบที่ใช้แสดงผล

ดูรายละเอียดตารางและ API ได้ที่ [`docs/db-schema.md`](./docs/db-schema.md) และ [`docs/api-wishlist.md`](./docs/api-wishlist.md)
