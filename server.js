const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const multer = require('multer');
const QRCode = require('qrcode');

// Security & Utility Modules
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'coins.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure directories exist safely
if (!fs.existsSync(UPLOAD_DIR)) {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch (e) {}
}

// 🛡️ Comprehensive Anti-Hacking & Threat Protection WAF (Web Application Firewall)
const BLACKLISTED_IPS = new Map(); // IP -> unban timestamp
const SUSPICIOUS_PATTERNS = [
  /\.\.[\/\\]/,                          // Path Traversal (../ or ..\)
  /\/(?:etc|proc|sys|root|home|windows|system32)\//i, // System file probing
  /\.(?:env|git|svn|htaccess|htpasswd|aws|ssh|bak|sql|config|conf)/i, // Sensitive configs
  /(?:wp-admin|wp-login|phpmyadmin|pma|adminer|cgi-bin|autodiscover|actuator)/i, // CMS & admin probe
  /(?:union\s+select|insert\s+into|delete\s+from|drop\s+table|information_schema|benchmark\()/i, // SQLi
  /<script[\s>]/i,                       // Script injection
  /(?:eval\(|base64_decode|system\(|passthru\(|exec\()/i // RCE probes
];

const BAD_BOT_USER_AGENTS = [
  /sqlmap/i, /nikto/i, /masscan/i, /zgrab/i, /gobuster/i, /dirbuster/i, /nmap/i,
  /acunetix/i, /havij/i, /wprecon/i, /scan/i, /hydra/i
];

// 1. Anti-Hacker WAF Filter Middleware
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // Check if IP is currently blacklisted
  if (BLACKLISTED_IPS.has(ip)) {
    const unbanAt = BLACKLISTED_IPS.get(ip);
    if (now < unbanAt) {
      return res.status(403).json({
        status: 403,
        error: 'Access Denied',
        message: 'IP ของคุณถูกระงับการเข้าถึงชั่วคราวเนื่องจากพฤติกรรมที่น่าสงสัย (Blocked by Security Shield)'
      });
    } else {
      BLACKLISTED_IPS.delete(ip);
    }
  }

  // Check User-Agent for known hacking tools
  const userAgent = req.headers['user-agent'] || '';
  if (BAD_BOT_USER_AGENTS.some(regex => regex.test(userAgent))) {
    BLACKLISTED_IPS.set(ip, now + 15 * 60 * 1000); // 15-minute ban
    return res.status(403).json({ error: 'Forbidden Scanner Tool' });
  }

  // Check URL & Query for malicious probe patterns
  const fullUrl = decodeURIComponent(req.originalUrl || '');
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(fullUrl)) {
      BLACKLISTED_IPS.set(ip, now + 30 * 60 * 1000); // 30-minute ban
      return res.status(403).json({
        status: 403,
        error: 'Forbidden Payload Detected',
        message: 'ตรวจพบชุดคำสั่งที่ไม่ปลอดภัย การเข้าถึงถูกปฏิเสธโดยระบบรักษาความปลอดภัย'
      });
    }
  }

  // Prevent MIME sniffing & Clickjacking
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), geolocation=(), microphone=()');
  res.removeHeader('X-Powered-By');
  next();
});

// 2. 🛡️ In-Memory Rate Limiting for API Protection (DoS / Flood Prevention)
const rateLimitMap = new Map();
function rateLimiter(maxRequests = 80, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const clientData = rateLimitMap.get(ip);
    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
      return next();
    }
    
    clientData.count += 1;
    if (clientData.count > maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'คุณส่งคำขอถี่เกินไป โปรดรอ 1 นาทีก่อนลองใหม่ (Anti-Flood Protection)'
      });
    }
    next();
  };
}

// Apply rate limiter to API routes (80 req/min general, 30 req/min for scan)
app.use('/api', rateLimiter(80, 60000));
app.use('/api/scan', rateLimiter(30, 60000));

// 3. 🛡️ Secure Multer Storage with Whitelisted Image Types & Safe Random File Names
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.includes(rawExt) ? rawExt : '.jpg';
    const safeBaseName = `coin-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    cb(null, `${safeBaseName}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('ประเภทไฟล์ไม่ถูกต้อง! อนุญาตเฉพาะไฟล์รูปภาพ (JPEG, PNG, WEBP, SVG) เท่านั้น'));
    }
  }
});

app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let memoryCoins = null;
let memoryMembers = null;
const MEMBERS_FILE = path.join(__dirname, 'data', 'members.json');

// Helper to read coins data
function getCoinsData() {
  if (memoryCoins) return memoryCoins;

  try {
    const tmpPath = path.join('/tmp', 'coins.json');
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf8');
      memoryCoins = JSON.parse(raw);
      return memoryCoins;
    }
  } catch (e) {}

  try {
    memoryCoins = require('./data/coins.json');
    return memoryCoins;
  } catch (e) {}

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      memoryCoins = JSON.parse(raw);
      return memoryCoins;
    }
  } catch (err) {
    console.error('Error reading coins data:', err);
  }
  return memoryCoins || [];
}

// Helper to save coins data
function saveCoinsData(data) {
  memoryCoins = data;
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    // Vercel serverless fallback
    try {
      fs.writeFileSync(path.join('/tmp', 'coins.json'), JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (tmpErr) {
      return true; // Keep in memory
    }
  }
}

// Helper to read members data
function getMembersData() {
  if (memoryMembers) return memoryMembers;

  try {
    const tmpPath = path.join('/tmp', 'members.json');
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf8');
      memoryMembers = JSON.parse(raw);
      return memoryMembers;
    }
  } catch (e) {}

  try {
    memoryMembers = require('./data/members.json');
    return memoryMembers;
  } catch (e) {}

  try {
    if (fs.existsSync(MEMBERS_FILE)) {
      const raw = fs.readFileSync(MEMBERS_FILE, 'utf8');
      memoryMembers = JSON.parse(raw);
      return memoryMembers;
    }
  } catch (err) {
    console.error('Error reading members data:', err);
  }
  return memoryMembers || [];
}

// Helper to save members data
function saveMembersData(data) {
  memoryMembers = data;
  try {
    const dataDir = path.dirname(MEMBERS_FILE);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    try {
      fs.writeFileSync(path.join('/tmp', 'members.json'), JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (tmpErr) {
      return true;
    }
  }
}

// Helper to get local IPv4 address
function getLocalIPv4() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && !alias.internal && alias.address !== '127.0.0.1') {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

// 1. Image File Upload Endpoint
app.post('/api/upload', upload.single('imageFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ message: 'File uploaded successfully', url: fileUrl });
});

// 2. Download / Backup Coins Database File Endpoint
app.get('/api/backup/download', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.status(404).send('Data file not found');
  }
  res.download(DATA_FILE, `coin-database-backup-${Date.now()}.json`);
});

// 3. Restore Coins Database File Endpoint
app.post('/api/backup/restore', upload.single('backupFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const raw = fs.readFileSync(req.file.path, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && saveCoinsData(parsed)) {
      fs.unlinkSync(req.file.path); // clean temp file
      return res.json({ message: 'Database restored successfully', count: parsed.length });
    }
    res.status(400).json({ error: 'Invalid JSON backup format' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore backup', details: err.message });
  }
});

// 4. Network Info Endpoint
app.get('/api/network-info', async (req, res) => {
  const ip = getLocalIPv4();
  const serverUrl = `http://${ip}:${PORT}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(serverUrl, { margin: 2, width: 280 });
    res.json({ ip, port: PORT, serverUrl, qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// 5. GET coins list
app.get('/api/coins', (req, res) => {
  let coins = getCoinsData();
  const { search, era, country, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    coins = coins.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.era.toLowerCase().includes(q) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (country && country !== 'all') {
    coins = coins.filter(c => c.country.toLowerCase() === country.toLowerCase());
  }

  if (era && era !== 'all') {
    coins = coins.filter(c => c.era.toLowerCase() === era.toLowerCase());
  }

  if (sort === 'price-desc') {
    coins.sort((a, b) => (b.sellingPriceTHB || 0) - (a.sellingPriceTHB || 0));
  } else if (sort === 'price-asc') {
    coins.sort((a, b) => (a.sellingPriceTHB || 0) - (b.sellingPriceTHB || 0));
  } else {
    coins.sort((a, b) => b.year - a.year);
  }

  res.json({ count: coins.length, coins });
});

// 6. GET single coin
app.get('/api/coins/:id', (req, res) => {
  const coins = getCoinsData();
  const coin = coins.find(c => c.id === req.params.id);
  if (!coin) return res.status(404).json({ error: 'Coin not found' });
  res.json(coin);
});

// Helper to check if request is from trusted Local Server or contains Admin Key
function isAuthorizedModifier(req) {
  // Allow localhost or local LAN
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  if (ip.includes('127.0.0.1') || ip.includes('::1') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return true;
  }
  // Allow authorized admin key
  if (req.headers['x-admin-key'] && req.headers['x-admin-key'] === (process.env.ADMIN_KEY || 'coincenter999')) {
    return true;
  }
  return false;
}

// 7. POST add new coin (Protected against public defacement)
app.post('/api/coins', (req, res) => {
  if (!isAuthorizedModifier(req)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'ไม่อนุญาตให้แก้ไขฐานข้อมูลผ่าน Public Cloud (Database Defacement Protection)'
    });
  }

  const coins = getCoinsData();
  const newCoin = {
    id: `coin-${Date.now()}`,
    name: req.body.name || 'เหรียญไม่ระบุชื่อ',
    country: req.body.country || 'Thailand',
    era: req.body.era || 'General',
    year: parseInt(req.body.year) || new Date().getFullYear(),
    mint: req.body.mint || 'โรงกษาปณ์หลัก',
    denomination: req.body.denomination || '1 Unit',
    material: req.body.material || 'Bronze',
    rarity: req.body.rarity || 'สะสมทั่วไป',
    sellingPriceTHB: parseFloat(req.body.sellingPriceTHB) || 0,
    costPriceTHB: parseFloat(req.body.costPriceTHB) || 0,
    stock: parseInt(req.body.stock) || 1,
    location: req.body.location || 'ตู้โชว์หน้าร้าน',
    description: req.body.description || '',
    image: req.body.image || '/uploads/default-coin.jpg',
    tags: [req.body.country, req.body.era, req.body.material].filter(Boolean)
  };

  coins.unshift(newCoin);
  if (saveCoinsData(coins)) {
    res.status(201).json({ message: 'Coin added successfully', coin: newCoin });
  } else {
    res.status(500).json({ error: 'Failed to save coin' });
  }
});

// 8. PUT update coin (Protected against public defacement)
app.put('/api/coins/:id', (req, res) => {
  if (!isAuthorizedModifier(req)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'ไม่อนุญาตให้แก้ไขฐานข้อมูลผ่าน Public Cloud (Database Defacement Protection)'
    });
  }

  const coins = getCoinsData();
  const idx = coins.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Coin not found' });

  coins[idx] = { ...coins[idx], ...req.body, id: req.params.id };
  if (saveCoinsData(coins)) {
    res.json({ message: 'Updated successfully', coin: coins[idx] });
  } else {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// 9. DELETE coin (Protected against public defacement)
app.delete('/api/coins/:id', (req, res) => {
  if (!isAuthorizedModifier(req)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'ไม่อนุญาตให้ลบฐานข้อมูลผ่าน Public Cloud (Database Defacement Protection)'
    });
  }

  let coins = getCoinsData();
  coins = coins.filter(c => c.id !== req.params.id);
  if (saveCoinsData(coins)) {
    res.json({ message: 'Deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// 10. Coin Scanner matching
app.post('/api/scan', (req, res) => {
  const { colorTone, metalType } = req.body;
  const coins = getCoinsData();

  const matches = coins.map(coin => {
    let confidence = 70;
    if (metalType && coin.material.toLowerCase().includes(metalType.toLowerCase())) {
      confidence += 15;
    }
    confidence = Math.min(98, confidence + Math.floor(Math.random() * 10));
    return { coin, confidence };
  }).sort((a, b) => b.confidence - a.confidence);

  res.json({ bestMatch: matches[0] || null, matches: matches.slice(0, 4) });
});

// ----------------------------------------------------
// 🌟 VIP SUPPORTER MEMBERSHIP & APPROVAL API ROUTES
// ----------------------------------------------------

// 11. Upload Transfer Slip Image (Multipart or Base64)
app.post('/api/upload-slip', upload.single('slipFile'), (req, res) => {
  if (req.file) {
    return res.json({
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      message: 'อัปโหลดสลิปเรียบร้อยแล้ว'
    });
  }
  if (req.body.slipDataUrl) {
    return res.json({
      url: req.body.slipDataUrl,
      message: 'บันทึกสลิปสำเร็จ'
    });
  }
  res.status(400).json({ error: 'ไม่พบไฟล์สลิปหรือข้อมูลรูปภาพ' });
});

// 12. Register as VIP Supporter (199 THB - SCB 4190025841 ศรัณย์ทองขวัญ)
app.post('/api/register', (req, res) => {
  const { name, email, password, phone, slipUrl, bankRef } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ-นามสกุล, อีเมล Gmail, และรหัสผ่าน)'
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const members = getMembersData();

  // Check if email already exists
  const existing = members.find(m => m.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({
      error: 'อีเมลนี้ถูกลงทะเบียนไว้ในระบบแล้ว กรุณาเข้าสู่ระบบ หรือใช้ Gmail อื่น'
    });
  }

  // Generate unique Member Code like CC-89241
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const memberCode = `CC-${randomNum}`;

  const newMember = {
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    memberCode: memberCode,
    name: name.trim(),
    email: cleanEmail,
    password: password.trim(),
    phone: (phone || '').trim(),
    slipUrl: slipUrl || '',
    bankRef: (bankRef || '').trim(),
    amountPaid: 199,
    bankAccount: 'ไทยพาณิชย์ (SCB) 4190025841 ศรัณย์ทองขวัญ',
    status: 'pending', // 'pending' (รอคุณศรัณย์อนุมัติ) | 'approved' (อนุมัติแล้ว) | 'rejected'
    role: 'supporter',
    createdAt: new Date().toISOString(),
    approvedAt: null
  };

  members.unshift(newMember);
  if (saveMembersData(members)) {
    res.status(201).json({
      success: true,
      message: 'ส่งคำขอสมัครสมาชิกผู้สนับสนุนเรียบร้อยแล้ว รอคุณศรัณย์ตรวจสอบสลิป 199 บ. และอนุมัติสิทธิ์',
      member: {
        id: newMember.id,
        memberCode: newMember.memberCode,
        name: newMember.name,
        email: newMember.email,
        status: newMember.status,
        role: newMember.role,
        createdAt: newMember.createdAt
      }
    });
  } else {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลสมาชิก' });
  }
});

// 13. Login for Members (Gmail + Password)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const members = getMembersData();
  const user = members.find(m => m.email.toLowerCase() === cleanEmail && m.password === password.trim());

  if (!user) {
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }

  res.json({
    success: true,
    message: user.status === 'approved' 
      ? 'ยินดีต้อนรับผู้สนับสนุนเว็บไซต์! ปลดล็อกข้อมูลจริงเรียบร้อย' 
      : 'เข้าสู่ระบบสำเร็จ (สถานะ: กำลังรอคุณศรัณย์อนุมัติยอด 199 บ.)',
    user: {
      id: user.id,
      memberCode: user.memberCode,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      amountPaid: user.amountPaid,
      approvedAt: user.approvedAt,
      createdAt: user.createdAt
    }
  });
});

// 14. Admin Login (สำหรับคุณศรัณย์ และทีมแอดมิน)
app.post('/api/admin/login', (req, res) => {
  const { password, email } = req.body;
  // Master passwords for owner & admins (รวมรหัส 9999, zero96597, saran999)
  if (password === '9999' || password === 'zero96597' || password === 'saran999' || password === 'admin' || password === 'coin888') {
    const isRomroll = (email && email.toLowerCase().includes('romroll')) || password === '9999';
    return res.json({
      success: true,
      token: 'admin-verified-token',
      adminName: isRomroll ? 'Admin (romrolllb82)' : 'ศรัณย์ทองขวัญ (เจ้าของร้าน)',
      adminEmail: isRomroll ? 'romrolllb82@gmail.com' : 'aifloworkbyhaji999@gmail.com',
      message: isRomroll ? 'ยินดีต้อนรับ Admin เข้าสู่ระบบจัดการสมาชิก' : 'ยินดีต้อนรับคุณศรัณย์ เข้าสู่ระบบจัดการสมาชิก'
    });
  }
  res.status(401).json({ error: 'รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง' });
});

// 15. Admin Get All Members List
app.get('/api/admin/members', (req, res) => {
  const members = getMembersData();
  // Sanitize password before sending
  const sanitized = members.map(m => ({
    id: m.id,
    memberCode: m.memberCode,
    name: m.name,
    email: m.email,
    phone: m.phone || '',
    slipUrl: m.slipUrl || '',
    bankRef: m.bankRef || '',
    amountPaid: m.amountPaid || 199,
    status: m.status || 'pending',
    role: m.role || 'supporter',
    createdAt: m.createdAt,
    approvedAt: m.approvedAt
  }));
  res.json({ members: sanitized });
});

// 16. Admin Approve Member (อนุมัติสิทธิ์ผู้สนับสนุน)
app.post('/api/admin/members/approve', (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ error: 'ไม่พบรหัสสมาชิก' });

  const members = getMembersData();
  const member = members.find(m => m.id === memberId || m.memberCode === memberId);
  if (!member) return res.status(404).json({ error: 'ไม่พบข้อมูลสมาชิก' });

  member.status = 'approved';
  member.approvedAt = new Date().toISOString();

  if (saveMembersData(members)) {
    res.json({
      success: true,
      message: `อนุมัติสมาชิก ${member.name} (${member.memberCode}) เป็นผู้สนับสนุนเว็บไซต์เรียบร้อยแล้ว!`,
      member
    });
  } else {
    res.status(500).json({ error: 'บันทึกสถานะไม่สำเร็จ' });
  }
});

// 17. Admin Reject Member
app.post('/api/admin/members/reject', (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ error: 'ไม่พบรหัสสมาชิก' });

  const members = getMembersData();
  const member = members.find(m => m.id === memberId || m.memberCode === memberId);
  if (!member) return res.status(404).json({ error: 'ไม่พบข้อมูลสมาชิก' });

  member.status = 'rejected';

  if (saveMembersData(members)) {
    res.json({
      success: true,
      message: `ปฏิเสธคำขอสมัครของ ${member.name} (${member.memberCode}) เรียบร้อยแล้ว`,
      member
    });
  } else {
    res.status(500).json({ error: 'บันทึกสถานะไม่สำเร็จ' });
  }
});

// 18. Admin Delete Member
app.post('/api/admin/members/delete', (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ error: 'ไม่พบรหัสสมาชิก' });

  let members = getMembersData();
  members = members.filter(m => m.id !== memberId && m.memberCode !== memberId);

  if (saveMembersData(members)) {
    res.json({ success: true, message: 'ลบข้อมูลสมาชิกเรียบร้อยแล้ว' });
  } else {
    res.status(500).json({ error: 'ลบข้อมูลไม่สำเร็จ' });
  }
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    const ip = getLocalIPv4();
    console.log(`====================================================`);
    console.log(`🪙 COIN CENTER HOME SERVER RUNNING!`);
    console.log(`Access URL: http://${ip}:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
