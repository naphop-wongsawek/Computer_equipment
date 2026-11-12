// In-memory implementation of the TechReview Go API contract.
const express = require('express');
const cors = require('cors');
const equipmentSeed = require('./equipment.json');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  res.on('finish', () => console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`));
  next();
});

const now = () => new Date().toISOString();
const db = {
  equipment: equipmentSeed.map(item => ({ ...item })),
  categories: [
    { id: 1, nameEn: 'Graphics Card', nameTh: 'การ์ดจอ' },
    { id: 2, nameEn: 'CPU', nameTh: 'ซีพียู' },
    { id: 3, nameEn: 'Mouse', nameTh: 'เมาส์' },
    { id: 4, nameEn: 'Keyboard', nameTh: 'คีย์บอร์ด' },
    { id: 5, nameEn: 'Monitor', nameTh: 'จอมอนิเตอร์' },
    { id: 6, nameEn: 'Headset', nameTh: 'หูฟัง' },
    { id: 7, nameEn: 'SSD', nameTh: 'SSD' },
    { id: 8, nameEn: 'RAM', nameTh: 'แรม' },
    { id: 9, nameEn: 'Storage', nameTh: 'อุปกรณ์จัดเก็บข้อมูล' },
    { id: 10, nameEn: 'Motherboard', nameTh: 'เมนบอร์ด' },
    { id: 11, nameEn: 'PSU', nameTh: 'พาวเวอร์ซัพพลาย' },
    { id: 12, nameEn: 'Case', nameTh: 'เคสคอมพิวเตอร์' },
    { id: 13, nameEn: 'Cooling', nameTh: 'ชุดระบายความร้อน' },
  ],
  members: [
    {
      id: 1,
      email: 'demo@techreview.test',
      password: '1234',
      displayName: 'Demo',
      role: 'member',
      createdAt: now(),
    },
    {
      id: 2,
      email: 'admin@techreview.test',
      password: '1234',
      displayName: 'Admin',
      role: 'admin',
      createdAt: now(),
    },
  ],
  tokens: new Map(),
  reviews: [],
  votes: [],
  wishlist: [],
};
let nextMemberId = 3;
let nextReviewId = 1;
let nextEquipmentId = Math.max(...db.equipment.map(item => item.id)) + 1;

const publicMember = member => ({
  id: member.id,
  email: member.email,
  displayName: member.displayName,
  role: member.role,
  createdAt: member.createdAt,
});
const findEquipment = id => db.equipment.find(item => item.id === Number(id));
const publicEquipment = ({ categoryId, ...item }) => item;
const error = (res, status, code, message) => res.status(status).json({
  error: { code, message },
});

function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const memberId = db.tokens.get(token);
  const member = db.members.find(item => item.id === memberId);
  if (!member) return error(res, 401, 'NO_TOKEN', 'กรุณาเข้าสู่ระบบก่อน');
  req.member = member;
  return next();
}

function requireAdmin(req, res, next) {
  if (req.member.role !== 'admin') return error(res, 403, 'FORBIDDEN', 'ไม่มีสิทธิ์ใช้งานส่วนนี้');
  return next();
}

function checkEquipmentInput(input) {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (!title || title.length > 255) return 'ต้องมีชื่อรุ่น และยาวไม่เกิน 255 ตัวอักษร';
  if (input.titleTh != null && String(input.titleTh).trim().length > 100) return 'ยี่ห้อยาวไม่เกิน 100 ตัวอักษร';
  if (input.categoryId != null && !db.categories.some(item => item.id === Number(input.categoryId))) return 'ไม่มีหมวดรหัสนี้';
  if (input.year != null && (input.year < 1990 || input.year > 2100)) return 'ปีเปิดตัวต้องอยู่ระหว่าง 1990 ถึง 2100';
  if (input.rating != null && (input.rating < 0 || input.rating > 10)) return 'คะแนนต้องอยู่ระหว่าง 0 ถึง 10';
  if (input.price != null && (!Number.isInteger(input.price) || input.price < 0)) return 'ราคาต้องไม่ติดลบ';
  if (input.emoji != null && String(input.emoji).trim().length > 8) return 'ไอคอนยาวไม่เกิน 8 ตัวอักษร';
  if (input.detail != null && String(input.detail).trim().length > 5000) return 'รายละเอียดยาวไม่เกิน 5000 ตัวอักษร';
  if (input.poster != null && (!/^https?:\/\/.+/.test(String(input.poster).trim()) || String(input.poster).trim().length > 500)) {
    return 'รูปต้องเป็น URL เต็มที่ขึ้นต้นด้วย https:// หรือ http:// และยาวไม่เกิน 500 ตัวอักษร';
  }
  return null;
}

function applyEquipmentInput(input, id) {
  const category = db.categories.find(item => item.id === Number(input.categoryId));
  return {
    id,
    title: input.title.trim(),
    titleTh: input.titleTh?.trim() || null,
    genre: category?.nameTh || null,
    year: input.year ?? null,
    rating: input.rating ?? null,
    price: input.price ?? null,
    emoji: input.emoji?.trim() || null,
    poster: input.poster?.trim() || null,
    detail: input.detail?.trim() || null,
    categoryId: category?.id ?? null,
  };
}

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

app.get('/api/equipment', (req, res) => {
  const query = String(req.query.q || '').trim().toLocaleLowerCase();
  const categoryId = req.query.category ? Number(req.query.category) : 0;
  if (!Number.isInteger(categoryId) || categoryId < 0) {
    return error(res, 400, 'BAD_CATEGORY', 'category ต้องเป็นเลขหมวด');
  }
  const items = db.equipment
    .filter(item => (!query || `${item.title} ${item.titleTh || ''}`.toLocaleLowerCase().includes(query)))
    .filter(item => !categoryId || item.categoryId === categoryId)
    .sort((a, b) => a.id - b.id)
    .map(publicEquipment);
  return res.json({ items });
});

app.get('/api/equipment/:id', (req, res) => {
  const item = findEquipment(req.params.id);
  if (!item) return error(res, 404, 'EQUIPMENT_NOT_FOUND', 'ไม่พบอุปกรณ์รุ่นนี้');
  const votes = db.votes.filter(vote => vote.equipmentId === item.id);
  const authorization = req.get('Authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  const memberId = db.tokens.get(token);
  if (authorization && !memberId) return error(res, 401, 'NO_TOKEN', 'ตั๋วหมดอายุหรือไม่ถูกต้อง');
  return res.json({
    ...publicEquipment(item),
    memberRating: votes.length
      ? Math.round(votes.reduce((sum, vote) => sum + vote.score, 0) / votes.length * 10) / 10
      : null,
    memberVoteCount: votes.length,
    myVote: db.votes.find(vote => vote.memberId === memberId && vote.equipmentId === item.id)?.score ?? null,
    inWishlist: db.wishlist.some(entry => entry.memberId === memberId && entry.equipmentId === item.id),
  });
});

app.get('/api/categories', (req, res) => res.json({ items: db.categories }));

app.post('/api/auth/register', (req, res) => {
  const { email = '', password = '', displayName = '' } = req.body || {};
  if (typeof email !== 'string' || email.length > 255 || !email.includes('@') ||
      typeof password !== 'string' || Array.from(password).length < 8 || Buffer.byteLength(password, 'utf8') > 72 ||
      typeof displayName !== 'string' || !displayName.trim() || Array.from(displayName.trim()).length > 50) {
    return error(res, 400, 'BAD_REGISTER', 'อีเมลไม่ถูกต้อง ชื่อต้องยาวไม่เกิน 50 ตัวอักษร และรหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรและไม่เกิน 72 ไบต์');
  }
  if (db.members.some(member => member.email.toLowerCase() === email.toLowerCase())) {
    return error(res, 409, 'EMAIL_TAKEN', 'อีเมลนี้ถูกใช้แล้ว');
  }
  const member = {
    id: nextMemberId++,
    email: email.toLowerCase(),
    password,
    displayName: displayName.trim(),
    role: 'member',
    createdAt: now(),
  };
  db.members.push(member);
  return res.status(201).json(publicMember(member));
});

app.post('/api/auth/login', (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const member = db.members.find(item => item.email.toLowerCase() === email.toLowerCase());
  if (!member || member.password !== password) {
    return error(res, 401, 'BAD_LOGIN', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }
  const token = `mock.${member.id}.${Math.random().toString(36).slice(2)}`;
  db.tokens.set(token, member.id);
  return res.json({ token, member: publicMember(member) });
});

app.get('/api/me', requireAuth, (req, res) => res.json(publicMember(req.member)));

app.get('/api/equipment/:id/reviews', (req, res) => {
  const equipmentId = Number(req.params.id);
  const items = db.reviews
    .filter(review => review.equipmentId === equipmentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20)
    .map(review => {
      const member = db.members.find(item => item.id === review.memberId);
      const vote = db.votes.find(item => item.memberId === review.memberId && item.equipmentId === equipmentId);
      return {
        ...review,
        member: { id: member.id, displayName: member.displayName },
        score: vote?.score ?? null,
      };
    });
  return res.json({ items });
});

app.post('/api/equipment/:id/reviews', requireAuth, (req, res) => {
  const equipmentId = Number(req.params.id);
  if (!findEquipment(equipmentId)) return error(res, 404, 'EQUIPMENT_NOT_FOUND', 'ไม่พบอุปกรณ์รุ่นนี้');
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  const textLength = Array.from(text).length;
  if (textLength < 10 || textLength > 2000) return error(res, 400, 'BAD_TEXT', 'รีวิวต้องยาว 10–2000 ตัวอักษร');
  if (db.reviews.some(review => review.memberId === req.member.id && review.equipmentId === equipmentId)) {
    return error(res, 409, 'ALREADY_REVIEWED', 'คุณรีวิวอุปกรณ์รุ่นนี้ไปแล้ว');
  }
  const createdAt = now();
  const review = {
    id: nextReviewId++,
    memberId: req.member.id,
    equipmentId,
    text,
    createdAt,
    updatedAt: createdAt,
  };
  db.reviews.push(review);
  return res.status(201).json({
    ...review,
    member: { id: req.member.id, displayName: req.member.displayName },
    score: null,
  });
});

app.delete('/api/reviews/:reviewId', requireAuth, (req, res) => {
  const index = db.reviews.findIndex(review =>
    review.id === Number(req.params.reviewId) &&
    (review.memberId === req.member.id || req.member.role === 'admin')
  );
  if (index < 0) return error(res, 404, 'REVIEW_NOT_FOUND', 'ไม่พบรีวิวนี้');
  db.reviews.splice(index, 1);
  return res.status(204).end();
});

app.put('/api/equipment/:id/vote', requireAuth, (req, res) => {
  const equipmentId = Number(req.params.id);
  if (!findEquipment(equipmentId)) return error(res, 404, 'EQUIPMENT_NOT_FOUND', 'ไม่พบอุปกรณ์รุ่นนี้');
  const score = req.body?.score;
  if (!Number.isInteger(score) || score < 1 || score > 10) {
    return error(res, 400, 'BAD_SCORE', 'คะแนนต้องเป็นจำนวนเต็ม 1 ถึง 10');
  }
  const vote = db.votes.find(item => item.memberId === req.member.id && item.equipmentId === equipmentId);
  if (vote) vote.score = score;
  else db.votes.push({ memberId: req.member.id, equipmentId, score });
  return res.json({ equipmentId, score });
});

app.delete('/api/equipment/:id/vote', requireAuth, (req, res) => {
  const equipmentId = Number(req.params.id);
  db.votes = db.votes.filter(item => !(item.memberId === req.member.id && item.equipmentId === equipmentId));
  return res.status(204).end();
});

app.get('/api/me/wishlist', requireAuth, (req, res) => {
  const items = db.wishlist
    .filter(entry => entry.memberId === req.member.id)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .map(entry => ({
      ...publicEquipment(findEquipment(entry.equipmentId)),
      note: entry.note,
      addedAt: entry.addedAt,
    }));
  return res.json({ items });
});

app.put('/api/me/wishlist/:equipmentId', requireAuth, (req, res) => {
  const equipmentId = Number(req.params.equipmentId);
  if (!findEquipment(equipmentId)) return error(res, 404, 'EQUIPMENT_NOT_FOUND', 'ไม่พบอุปกรณ์รุ่นนี้');
  const entry = db.wishlist.find(item => item.memberId === req.member.id && item.equipmentId === equipmentId);
  const note = req.body?.note ?? null;
  if (entry) entry.note = note;
  else db.wishlist.push({ memberId: req.member.id, equipmentId, note, addedAt: now() });
  return res.json({ equipmentId, note });
});

app.delete('/api/me/wishlist/:equipmentId', requireAuth, (req, res) => {
  const equipmentId = Number(req.params.equipmentId);
  db.wishlist = db.wishlist.filter(item => !(item.memberId === req.member.id && item.equipmentId === equipmentId));
  return res.status(204).end();
});

app.get('/api/admin/stats', requireAuth, requireAdmin, (req, res) => {
  const topVoted = db.equipment
    .map(item => {
      const votes = db.votes.filter(vote => vote.equipmentId === item.id);
      return {
        id: item.id,
        title: item.title,
        titleTh: item.titleTh,
        poster: item.poster,
        voteCount: votes.length,
        voteAverage: votes.length
          ? votes.reduce((sum, vote) => sum + vote.score, 0) / votes.length
          : 0,
      };
    })
    .filter(item => item.voteCount > 0)
    .sort((a, b) => b.voteAverage - a.voteAverage || b.voteCount - a.voteCount)
    .slice(0, 5);
  return res.json({
    equipment: db.equipment.length,
    members: db.members.length,
    admins: db.members.filter(member => member.role === 'admin').length,
    reviews: db.reviews.length,
    votes: db.votes.length,
    wishlistItems: db.wishlist.length,
    newestMembers: [...db.members]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
      .map(publicMember),
    topVoted,
  });
});

app.get('/api/admin/members', requireAuth, requireAdmin, (req, res) => {
  const items = [...db.members]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(publicMember);
  return res.json({ items });
});

app.put('/api/admin/members/:id/role', requireAuth, requireAdmin, (req, res) => {
  const member = db.members.find(item => item.id === Number(req.params.id));
  if (!member) return error(res, 404, 'MEMBER_NOT_FOUND', 'ไม่พบสมาชิกคนนี้');
  if (member.id === req.member.id) return error(res, 400, 'SELF_ROLE', 'เปลี่ยนบทบาทของตัวเองไม่ได้ ให้ admin คนอื่นทำแทน');
  if (!['member', 'admin'].includes(req.body?.role)) return error(res, 400, 'BAD_ROLE', 'role ต้องเป็น member หรือ admin');
  member.role = req.body.role;
  return res.json(publicMember(member));
});

app.get('/api/admin/equipment/:id', requireAuth, requireAdmin, (req, res) => {
  const item = findEquipment(req.params.id);
  if (!item) return error(res, 404, 'EQUIPMENT_NOT_FOUND', 'ไม่พบอุปกรณ์รุ่นนี้');
  return res.json({
    ...item,
    impact: {
      reviews: db.reviews.filter(review => review.equipmentId === item.id).length,
      votes: db.votes.filter(vote => vote.equipmentId === item.id).length,
      wishlist: db.wishlist.filter(entry => entry.equipmentId === item.id).length,
    },
    updatedAt: now(),
  });
});

app.post('/api/admin/equipment', requireAuth, requireAdmin, (req, res) => {
  const message = checkEquipmentInput(req.body || {});
  if (message) return error(res, 400, 'BAD_EQUIPMENT', message);
  const item = applyEquipmentInput(req.body, nextEquipmentId++);
  db.equipment.push(item);
  return res.status(201).json({ ...item, impact: { reviews: 0, votes: 0, wishlist: 0 }, updatedAt: now() });
});

app.put('/api/admin/equipment/:id', requireAuth, requireAdmin, (req, res) => {
  const item = findEquipment(req.params.id);
  if (!item) return error(res, 404, 'EQUIPMENT_NOT_FOUND', 'ไม่พบอุปกรณ์รุ่นนี้');
  const message = checkEquipmentInput(req.body || {});
  if (message) return error(res, 400, 'BAD_EQUIPMENT', message);
  Object.assign(item, applyEquipmentInput(req.body, item.id));
  return res.json({
    ...item,
    impact: {
      reviews: db.reviews.filter(review => review.equipmentId === item.id).length,
      votes: db.votes.filter(vote => vote.equipmentId === item.id).length,
      wishlist: db.wishlist.filter(entry => entry.equipmentId === item.id).length,
    },
    updatedAt: now(),
  });
});

app.delete('/api/admin/equipment/:id', requireAuth, requireAdmin, (req, res) => {
  const item = findEquipment(req.params.id);
  if (!item) return error(res, 404, 'EQUIPMENT_NOT_FOUND', 'ไม่พบอุปกรณ์รุ่นนี้');
  db.equipment = db.equipment.filter(entry => entry.id !== item.id);
  db.reviews = db.reviews.filter(review => review.equipmentId !== item.id);
  db.votes = db.votes.filter(vote => vote.equipmentId !== item.id);
  db.wishlist = db.wishlist.filter(entry => entry.equipmentId !== item.id);
  return res.status(204).end();
});

app.use('/api', (req, res) => error(res, 404, 'NOT_FOUND', `ไม่มี endpoint ${req.method} ${req.originalUrl}`));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err instanceof SyntaxError && 'body' in err) return error(res, 400, 'BAD_JSON', 'อ่านกล่อง JSON ไม่ออก');
  console.error(err);
  return error(res, 500, 'INTERNAL', 'ระบบขัดข้อง ลองใหม่อีกครั้ง');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`TechReview mock backend พร้อมที่ http://localhost:${port}`);
  console.log('บัญชีทดลอง: demo@techreview.test / 1234');
  console.log('บัญชี admin สำหรับ mock: admin@techreview.test / 1234');
});
