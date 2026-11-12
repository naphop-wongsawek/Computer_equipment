function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">เกี่ยวกับ TechReview</h1>
      <p className="mt-3 leading-relaxed text-slate-600">
        TechReview คือเว็บรีวิวอุปกรณ์คอมพิวเตอร์ รวบรวมข้อมูลและความเห็นเกี่ยวกับการ์ดจอ ซีพียู เมาส์
        คีย์บอร์ด จอมอนิเตอร์ หูฟัง SSD และแรม เพื่อช่วยให้เลือกซื้ออุปกรณ์ได้ง่ายขึ้น
        สมาชิกสามารถเขียนรีวิวและบันทึกอุปกรณ์ที่อยากได้ไว้ดูภายหลัง
      </p>

      <p className="mt-4 text-sm leading-relaxed text-slate-500">
        โปรเจกต์นี้จัดทำในรายวิชา 520 341 Client Side Web Programming
        ราคาและคะแนนที่แสดงเป็นข้อมูลตัวอย่างเพื่อการเรียนรู้
      </p>

      <h2 className="mt-8 font-medium text-slate-900">ทีมผู้จัดทำ</h2>
      <ul className="mt-2 list-disc pl-5 text-slate-700">
        <li>ชื่อ นามสกุล (รหัสนักศึกษา)</li>
        <li>ชื่อ นามสกุล (รหัสนักศึกษา)</li>
      </ul>
    </div>
  );
}

export default About;
