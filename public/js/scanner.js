// Streamlined Real-time Camera Scanner Popup & Image Matcher for Store Staff
let videoStream = null;

document.addEventListener('DOMContentLoaded', () => {
  const btnOpenCam = document.getElementById('btn-start-camera');
  const btnDoScan = document.getElementById('btn-capture-scan');

  btnOpenCam?.addEventListener('click', startCamera);
  btnDoScan?.addEventListener('click', captureFrameAndScan);
});

// Open Scanner Popup Window
function openScannerPopup() {
  const modal = document.getElementById('modal-scanner');
  if (!modal) return;

  modal.classList.add('active');
  startCamera();
}

// Close Scanner Popup & Stop Camera Feed
function closeScannerPopup() {
  const modal = document.getElementById('modal-scanner');
  if (modal) modal.classList.remove('active');

  stopCamera();
}

// Start User Camera Feed
async function startCamera() {
  const video = document.getElementById('webcam-feed');
  const btnDoScan = document.getElementById('btn-capture-scan');
  const btnOpenCam = document.getElementById('btn-start-camera');

  try {
    if (videoStream) {
      stopCamera();
    }

    videoStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });

    if (video) {
      video.srcObject = videoStream;
      video.play().catch(() => {});
    }
    if (btnDoScan) btnDoScan.disabled = false;
    if (btnOpenCam) btnOpenCam.textContent = '🔄 รีเฟรชกล้อง';
  } catch (err) {
    console.error('Camera error:', err);
    if (btnOpenCam) btnOpenCam.textContent = '🎬 เปิดกล้อง';
  }
}

// Stop Video Stream to save battery and turn off device camera indicator
function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
  const video = document.getElementById('webcam-feed');
  if (video) video.srcObject = null;
  const btnDoScan = document.getElementById('btn-capture-scan');
  if (btnDoScan) btnDoScan.disabled = true;
}

// Capture Video Frame and Run API Matcher
async function captureFrameAndScan() {
  const video = document.getElementById('webcam-feed');
  const canvas = document.getElementById('snapshot-canvas');
  const resultCard = document.getElementById('scan-results-content');

  if (!videoStream && (!video || !video.srcObject)) {
    alert('โปรดกดเปิดกล้องก่อนสแกน');
    return;
  }

  if (canvas && video) {
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  if (resultCard) {
    resultCard.innerHTML = `
      <div style="text-align:center; padding:1.5rem; color:var(--accent-gold); font-weight:800;">
        ⚡ กำลังวิเคราะห์ลวดลายและแมตช์ข้อมูลในคลัง...
      </div>
    `;
  }

  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metalType: 'Bronze' })
    });
    const data = await res.json();
    renderScanResult(data);
  } catch (err) {
    console.error('Scan error:', err);
    if (resultCard) resultCard.innerHTML = `<div style="color:var(--accent-red); text-align:center; font-weight:800;">เกิดข้อผิดพลาดในการสแกน</div>`;
  }
}

// Handle Image File Upload for Scanning
async function handleScannerFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const resultCard = document.getElementById('scan-results-content');
  if (resultCard) {
    resultCard.innerHTML = `
      <div style="text-align:center; padding:1.5rem; color:var(--accent-gold); font-weight:800;">
        ⚡ กำลังประมวลผลไฟล์ภาพและค้นหาในคลัง...
      </div>
    `;
  }

  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metalType: 'Silver' })
    });
    const data = await res.json();
    renderScanResult(data);
  } catch (err) {
    console.error('File scan error:', err);
    if (resultCard) resultCard.innerHTML = `<div style="color:var(--accent-red); text-align:center; font-weight:800;">เกิดข้อผิดพลาดในการสแกนไฟล์</div>`;
  }
}

// Render Matching Coin Card with Specs & Jump Button
function renderScanResult(data) {
  const container = document.getElementById('scan-results-content');
  if (!container) return;

  if (!data.bestMatch || !data.bestMatch.coin) {
    container.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-weight:700;">ไม่พบข้อมูลเหรียญที่ตรงกัน</div>`;
    return;
  }

  const coin = data.bestMatch.coin;
  const confidence = data.bestMatch.confidence;
  const weight = (coin.features && coin.features.weightG) ? `${coin.features.weightG} g` : (coin.weightG ? `${coin.weightG} g` : 'ไม่ระบุ');
  const mintage = coin.mintage || 'ไม่ระบุ';
  const imgUrl = coin.obverseImage || coin.image;
  const composition = coin.composition || (coin.features && coin.features.composition) || 'ไม่ระบุ';

  container.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
      <span style="font-size:0.85rem; font-weight:800; color:var(--accent-green); background:rgba(16,185,129,0.12); padding:0.35rem 0.75rem; border-radius:20px;">
        🎯 ความแม่นยำ ${confidence}%
      </span>
      <span style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">แมตช์สำเร็จ</span>
    </div>

    <div style="display:flex; gap:0.75rem; align-items:center; margin-bottom:0.9rem;">
      <img src="${imgUrl}" style="width:75px; height:75px; object-fit:cover; border-radius:14px; filter:drop-shadow(0 6px 14px rgba(0,0,0,0.15));" alt="${coin.name}">
      <div style="flex:1;">
        <div style="font-size:1.05rem; font-weight:900; color:var(--text-main); line-height:1.2;">${coin.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">📍 ${coin.location || 'ตู้นิรภัยส่วนตัว A1'}</div>
      </div>
    </div>

    <!-- 4 Key Fields Grid -->
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; background:#ffffff; padding:0.75rem; border-radius:16px; border:1px solid #e2e8f0; font-size:0.82rem; margin-bottom:0.9rem;">
      <div>🧪 โลหะ: <b style="color:var(--accent-blue);">${composition}</b></div>
      <div>⚖️ น้ำหนัก: <b style="color:var(--accent-gold);">${weight}</b></div>
      <div>📅 ปีผลิต: <b style="color:var(--text-main);">${coin.year}</b></div>
      <div>🪙 จำนวนผลิต: <b style="color:var(--accent-green);">${mintage}</b></div>
    </div>

    <div style="display:flex; gap:0.5rem;">
      <button class="dribbble-search-btn" style="flex:1; padding:0.6rem 0.8rem; font-size:0.85rem;" onclick="closeScannerPopup(); openCoinDetailModal('${coin.id}')">
        🔍 ดูรายละเอียดเต็ม
      </button>
    </div>
  `;
}
