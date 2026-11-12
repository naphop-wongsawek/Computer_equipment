// ข้อมูลตัวอย่างสำหรับเว็บรีวิวอุปกรณ์คอมพิวเตอร์
// หมายเหตุ: ราคา (บาท) และคะแนนเป็นค่าตัวอย่าง แก้ให้ตรงกับที่คุณรีวิวได้เลย
// field "title" / "titleTh" / "genre" / "year" / "rating" / "detail" / "poster" ยังใช้ชื่อเดิม
// เพื่อให้ MovieGrid, MovieDetail, Home ที่ยังไม่ได้แก้ทำงานต่อได้
// (title = ชื่อรุ่น, titleTh = ยี่ห้อ, genre = หมวดอุปกรณ์, year = ปีที่เปิดตัว, poster = รูป)
export const movies = [
  {
    id: 1,
    title: "GeForce RTX 4060",
    titleTh: "NVIDIA",
    genre: "การ์ดจอ",
    year: 2023,
    rating: 8.0,
    price: 10900,
    emoji: "🎮",
    detail: "การ์ดจอระดับกลางที่เน้นเล่นเกมความละเอียด 1080p ได้ลื่น รองรับ DLSS และ Ray Tracing กินไฟต่ำ เหมาะกับคนที่อยากประกอบเครื่องเล่นเกมในงบไม่สูงมาก",
    poster: ""
  },
  {
    id: 2,
    title: "Ryzen 5 7600",
    titleTh: "AMD",
    genre: "ซีพียู",
    year: 2022,
    rating: 8.3,
    price: 7500,
    emoji: "🧠",
    detail: "ซีพียู 6 คอร์ 12 เธรด สถาปัตยกรรม Zen 4 ใช้ซ็อกเก็ต AM5 ประสิทธิภาพดีทั้งเล่นเกมและทำงานทั่วไป และมีกราฟิกในตัวสำหรับใช้งานเบื้องต้น",
    poster: ""
  },
  {
    id: 3,
    title: "Core i5-13400F",
    titleTh: "Intel",
    genre: "ซีพียู",
    year: 2023,
    rating: 8.0,
    price: 6500,
    emoji: "🧠",
    detail: "ซีพียู 10 คอร์ (6P+4E) คุ้มราคา เหมาะกับการเล่นเกมและงานทั่วไป รุ่น F ไม่มีกราฟิกในตัว ต้องใช้คู่กับการ์ดจอแยก",
    poster: ""
  },
  {
    id: 4,
    title: "G102 LIGHTSYNC",
    titleTh: "Logitech",
    genre: "เมาส์",
    year: 2018,
    rating: 7.8,
    price: 450,
    emoji: "🖱️",
    detail: "เมาส์เกมมิ่งราคาประหยัด เซนเซอร์แม่นยำ น้ำหนักเบา ปรับไฟ RGB ได้ เหมาะกับมือใหม่และงบจำกัด",
    poster: ""
  },
  {
    id: 5,
    title: "MX Master 3S",
    titleTh: "Logitech",
    genre: "เมาส์",
    year: 2022,
    rating: 9.0,
    price: 3500,
    emoji: "🖱️",
    detail: "เมาส์สำหรับงานออฟฟิศและครีเอทีฟ จับถนัดมือ ล้อเลื่อนเงียบ เชื่อมต่อได้หลายอุปกรณ์ เหมาะกับคนที่ใช้คอมทั้งวัน",
    poster: ""
  },
  {
    id: 6,
    title: "K2",
    titleTh: "Keychron",
    genre: "คีย์บอร์ด",
    year: 2020,
    rating: 8.4,
    price: 3200,
    emoji: "⌨️",
    detail: "คีย์บอร์ดแมคคานิคอลไร้สายขนาดกะทัดรัด 75% เชื่อมต่อบลูทูธได้หลายเครื่อง ใช้ได้ทั้ง Windows และ Mac เหมาะกับคนที่ชอบพิมพ์และพกพา",
    poster: ""
  },
  {
    id: 7,
    title: "UltraGear 27GP850",
    titleTh: "LG",
    genre: "จอมอนิเตอร์",
    year: 2021,
    rating: 8.6,
    price: 13900,
    emoji: "🖥️",
    detail: "จอเกมมิ่ง 27 นิ้ว ความละเอียด 1440p แผง Nano IPS รีเฟรชเรต 165Hz สีสวยและตอบสนองเร็ว เหมาะกับทั้งเล่นเกมและงานกราฟิก",
    poster: ""
  },
  {
    id: 8,
    title: "Cloud II",
    titleTh: "HyperX",
    genre: "หูฟัง",
    year: 2015,
    rating: 8.2,
    price: 3500,
    emoji: "🎧",
    detail: "หูฟังเกมมิ่งแบบครอบหู ใส่สบายแม้ใช้นาน เสียงชัด ไมค์ถอดได้ เป็นรุ่นที่ได้รับความนิยมมายาวนาน",
    poster: ""
  },
  {
    id: 9,
    title: "970 EVO Plus 1TB",
    titleTh: "Samsung",
    genre: "SSD",
    year: 2019,
    rating: 8.7,
    price: 2900,
    emoji: "💾",
    detail: "SSD NVMe ความเร็วสูง ความจุ 1TB เปิดเครื่องและโหลดเกมไว เหมาะใช้เป็นไดรฟ์หลัก มีชื่อเสียงด้านความทนทาน",
    poster: ""
  },
  {
    id: 10,
    title: "Fury Beast DDR5 16GB",
    titleTh: "Kingston",
    genre: "แรม",
    year: 2022,
    rating: 8.0,
    price: 1900,
    emoji: "📟",
    detail: "แรม DDR5 สำหรับเมนบอร์ดรุ่นใหม่ ติดตั้งง่าย รองรับ XMP/EXPO เหมาะกับการอัปเกรดเครื่องเล่นเกมและทำงาน",
    poster: ""
  }
];