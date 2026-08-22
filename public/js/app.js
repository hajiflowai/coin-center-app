// Dribbble Modern UI App Module - Coin Center Data Store & Exact GPS World Mint Map
let globalCoinsData = [];
let activePreset = 'home';
let activeCoverflowIndex = 0;
let activeMintCountry = 'all';
let leafletMap = null;
let leafletMarkersLayer = null;

// Auth State (VIP Supporter & Admin)
let currentUser = JSON.parse(localStorage.getItem('coin_center_user') || 'null');
let adminToken = localStorage.getItem('coin_center_admin_token') || null;

function isVipSupporter() {
  return currentUser && currentUser.status === 'approved';
}

// Complete Dataset of World Mints with Exact Real-World GPS Coordinates & Technology
const worldMintsData = [
  {
    id: 'mint-melbourne',
    name: 'Melbourne Mint (โรงกษาปณ์เมลเบิร์น)',
    country: 'Australia',
    countryTh: 'ออสเตรเลีย',
    flag: '🇦🇺',
    city: 'Melbourne, Victoria, Australia (280 William St)',
    coordinates: '37.8136° S, 144.9631° E',
    lat: -37.8136,
    lng: 144.9631,
    tagColor: '#ef4444',
    founded: 'ค.ศ. 1872',
    status: 'โรงกษาปณ์หลักยุคตื่นทอง (Victorian Gold Rush)',
    coinsMinted: ['1930 Australian Penny (King of Australian Coins - ผลิตไม่ถึง 1,500 เหรียญ)', 'เหรียญทองคำ Gold Sovereigns 1872–1931'],
    technology: 'แท่นปั๊มไอน้ำ Taylor & Challen และแม่พิมพ์กษาปณ์ส่งตรงจาก Royal Mint ลอนดอน',
    history: 'ก่อตั้งขึ้นในปี ค.ศ. 1872 เพื่อรองรับผลผลิตทองคำจากยุคตื่นทองและปั๊มเหรียญกษาปณ์หลักของออสเตรเลีย ในปี 1930 สภาวะเศรษฐกิจตกต่ำครั้งใหญ่ (Great Depression) รัฐบาลสั่งงดผลิตเหรียญหมุนเวียน แต่โรงกษาปณ์ได้ทดลองปั๊มเหรียญด้วยแม่พิมพ์ปี 1930 เพื่อทดสอบเครื่องจักร หลุดออกมาสู่สาธารณะเพียงประมาณ 1,500 เหรียญเท่านั้น กลายเป็นเหรียญที่หายากและแพงที่สุดในประวัติศาสตร์ออสเตรเลีย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-37.8136,144.9631'
  },
  {
    id: 'mint-adelaide',
    name: 'Government Assay Office (โรงหลอมและกษาปณ์อะดิเลด)',
    country: 'Australia',
    countryTh: 'ออสเตรเลีย',
    flag: '🇦🇺',
    city: 'Adelaide, South Australia (Victoria Square)',
    coordinates: '34.9285° S, 138.6007° E',
    lat: -34.9285,
    lng: 138.6007,
    tagColor: '#f59e0b',
    founded: 'ค.ศ. 1852 (พ.ร.บ. Bullion Act 1852)',
    status: 'โรงกษาปณ์ฉุกเฉินแห่งแรกในประวัติศาสตร์ออสเตรเลีย',
    coinsMinted: ['1852 Adelaide Pound Type I (ขอบมงกุฎร้าว ~40-100 เหรียญ)', '1852 Adelaide Pound Type II (ขอบหยัก เหลือรอด 250-300 เหรียญ)'],
    technology: 'เตาหลอมทองคำความบริสุทธิ์ 22K และแท่นปั๊มแรงเหวี่ยงฉุกเฉิน',
    history: 'เป็นโรงหลอมและกษาปณ์ฉุกเฉินแห่งแรกในออสเตรเลีย ก่อตั้งขึ้นตาม พ.ร.บ. Bullion Act 1852 เพื่อแปรรูปทองคำดิบจากยุคตื่นทองให้กลายเป็นเหรียญมาตรฐานปอนด์ ก่อนที่สภาองคมนตรีอังกฤษจะสั่งยกเลิก ปั๊มเหรียญรวม 24,711 เหรียญ แต่เนื่องจากมูลค่าทองคำสูงกว่าหน้าเหรียญ (£1) ผู้คนจึงนำไปหลอมละลาย เหลือรอดในโลกเพียง 250-300 เหรียญเท่านั้น',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-34.9285,138.6007'
  },
  {
    id: 'mint-philadelphia',
    name: 'Philadelphia Mint (โรงกษาปณ์ฟิลาเดลเฟีย - P)',
    country: 'USA',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'Philadelphia, Pennsylvania, USA (151 N Independence Mall E)',
    coordinates: '39.9537° N, 75.1481° W',
    lat: 39.9537,
    lng: -75.1481,
    tagColor: '#0284c7',
    founded: 'ค.ศ. 1792 (กฎหมาย Coinage Act)',
    status: 'โรงกษาปณ์แห่งแรกและใหญ่ที่สุดของสหรัฐอเมริกา',
    coinsMinted: ['1964 Kennedy Half Dollar (90% Silver เนื้อเงินรุ่นสุดท้าย)', 'Morgan Silver Dollar (1878–1921 / 1895 Proof)', 'Peace Dollar', 'Lincoln Cent'],
    technology: 'เครื่องจักรปั๊มเหรียญไอน้ำยุคแรก จนถึงระบบอัตโนมัติความเร็วสูง 1 ล้านเหรียญ/30 นาที',
    history: 'ก่อตั้งขึ้นในสมัยประธานาธิบดีจอร์จ วอชิงตัน และโทมัส เจฟเฟอร์สัน เป็นโรงกษาปณ์หลักแห่งแรกของสหรัฐอเมริกา ผลิตเหรียญเงินเคนเนดี 90% ในปี 1964 เป็นปีสุดท้ายก่อนปรับลดเนื้อเงิน และผลิตเหรียญเงินประวัติศาสตร์มากมาย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=39.9537,-75.1481'
  },
  {
    id: 'mint-san-francisco',
    name: 'San Francisco Mint (โรงกษาปณ์ซานฟรานซิสโก - S)',
    country: 'USA',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'San Francisco, California, USA (155 Hermann St / Old Mint 88 5th St)',
    coordinates: '37.7818° N, 122.4069° W',
    lat: 37.7818,
    lng: -122.4069,
    tagColor: '#0284c7',
    founded: 'ค.ศ. 1854 (California Gold Rush)',
    status: 'ฉายา "The Granite Lady" รอดพ้นจากแผ่นดินไหวใหญ่ 1906',
    coinsMinted: ['1909-S VDB Lincoln Wheat Cent (Key Date ผลิต 484,000 เหรียญ)', '1893-S Morgan Silver Dollar (ผลิต 100,000 เหรียญ ราคาประมูลหลักล้าน)'],
    technology: 'ศูนย์กลางการผลิตเหรียญขัดเงาพิเศษ Proof Coin & Collector Strike ชั้นนำระดับโลก',
    history: 'ก่อตั้งขึ้นเพื่อแปรรูปทองคำมหาศาลจากยุคตื่นทองแคลิฟอร์เนีย เป็นแหล่งผลิตเหรียญคีย์เดตหายากอันดับ 1 ของสายเหรียญ 1 เซนต์ ลินคอล์น (1909-S VDB) และเหรียญมอร์แกนดอลลาร์ 1893-S ที่มีราคาซื้อขายหลักล้านบาท',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=37.7818,-122.4069'
  },
  {
    id: 'mint-denver',
    name: 'Denver Mint (โรงกษาปณ์เดนเวอร์ - D)',
    country: 'USA',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'Denver, Colorado, USA (320 W Colfax Ave)',
    coordinates: '39.7397° N, 104.9915° W',
    lat: 39.7397,
    lng: -104.9915,
    tagColor: '#0284c7',
    founded: 'ค.ศ. 1863 (เริ่มปั๊มเหรียญกษาปณ์ ค.ศ. 1906)',
    status: 'โรงกษาปณ์ที่มีกำลังผลิตเหรียญหมุนเวียนสูงที่สุดในโลก',
    coinsMinted: ['1964-D Kennedy Half Dollar (90% Silver)', '1914-D Lincoln Cent', 'Morgan & Peace Dollars (D)'],
    technology: 'สายการผลิตกษาปณ์ความเร็วสูงระดับสิบล้านเหรียญต่อวัน',
    history: 'ก่อตั้งขึ้นช่วงยุคตื่นทองเทือกเขาร็อกกี้ (Pikes Peak Gold Rush) ปัจจุบันเป็นโรงกษาปณ์หลักร่วมกับฟิลาเดลเฟียในการผลิตเหรียญหมุนเวียนของสหรัฐอเมริกา',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=39.7397,-104.9915'
  },
  {
    id: 'mint-carson-city',
    name: 'Carson City Mint (โรงกษาปณ์คาร์สันซิตี - CC)',
    country: 'USA',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'Carson City, Nevada, USA (600 N Carson St)',
    coordinates: '39.1685° N, 119.7677° W',
    lat: 39.1685,
    lng: -119.7677,
    tagColor: '#0284c7',
    founded: 'ค.ศ. 1870 (ปิดสายการผลิต ค.ศ. 1893)',
    status: 'โรงกษาปณ์เหมืองแร่เงินเนวาดา (ปัจจุบันเป็นพิพิธภัณฑ์แห่งรัฐ)',
    coinsMinted: ['Morgan Silver Dollar ตราตอก CC (เช่น 1889-CC, 1878-CC ถึง 1893-CC)'],
    technology: 'เครื่องจักรปั๊มเหรียญไอน้ำเฉพาะสำหรับแท่งเงินจากสายแร่ Comstock Lode',
    history: 'ตั้งอยู่ติดกับสายแร่เงินคอมสต็อกโลดอันโด่งดัง ปั๊มเหรียญเงินมอร์แกนที่มีตราตอก "CC" ซึ่งเป็นที่ต้องการสูงสุดในหมู่นักสะสมทั่วโลก',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=39.1685,-119.7677'
  },
  {
    id: 'mint-tianjin',
    name: 'Tianjin Central Mint (โรงกษาปณ์เทียนจิน - โรงกษาปณ์กลาง)',
    country: 'China',
    countryTh: 'จีน',
    flag: '🇨🇳',
    city: 'Tianjin, Hebei, China (Hebei District, ริมแม่น้ำไห่เหอ)',
    coordinates: '39.1415° N, 117.1895° E',
    lat: 39.1415,
    lng: 117.1895,
    tagColor: '#e11d48',
    founded: 'ค.ศ. 1903 (สถาปนาเป็นโรงกษาปณ์กลาง ค.ศ. 1912)',
    status: 'โรงกษาปณ์กลางแห่งรัฐบาลสาธารณรัฐจีน',
    coinsMinted: ['China Republic Yuan Shih-kai 1 Dollar (เหรียญหัวโต 1914-1921)', 'เหรียญมังกรไท่ชิง 1911'],
    technology: 'แม่พิมพ์แกะสลักพิเศษโดยประติมากรชาวอิตาลี Luigi Giorgi (บล็อกตัวอย่างมีอักษร L.GIORGI)',
    history: 'เป็นโรงกษาปณ์หลักในการกำหนดมาตรฐานเหรียญเงินแห่งชาติของจีน มีการปั๊มเหรียญเงินยวนซีไข่ (เหรียญหัวโต) ออกมามากกว่า 750 ล้านเหรียญ และส่งต่อแม่พิมพ์ให้โรงกษาปณ์สาขาหนานจิงและอู่ชาง',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=39.1415,117.1895'
  },
  {
    id: 'mint-kwangtung',
    name: 'Kwangtung Mint (โรงกษาปณ์กวางตุ้ง / Canton Mint)',
    country: 'China',
    countryTh: 'จีน',
    flag: '🇨🇳',
    city: 'Guangzhou, Guangdong, China (Yuexiu District)',
    coordinates: '23.1291° N, 113.2644° E',
    lat: 23.1291,
    lng: 113.2644,
    tagColor: '#e11d48',
    founded: 'ค.ศ. 1887 (ริเริ่มโดยมหาเสนาบดีจาง จื้อต้ง)',
    status: 'โรงกษาปณ์เครื่องจักรไอน้ำแห่งแรกของแผ่นดินจีน',
    coinsMinted: ['Kwangtung Province 7 Mace and 2 Candareens Dragon Dollar (เหรียญมังกรกวางตุ้ง 1889-1908)'],
    technology: 'เครื่องจักรปั๊มเหรียญไอน้ำ 90 แรงม้าสั่งทำพิเศษจาก Ralph Heaton & Sons (Heaton Mint, อังกฤษ)',
    history: 'เป็นโรงกษาปณ์แห่งแรกในจีนที่ใช้เครื่องจักรไอน้ำตามมาตรฐานตะวันตก ผลิตเหรียญเงินลายมังกร 7 Mace 2 Candareens ซึ่งกลายเป็นต้นแบบให้มณฑลอื่น ๆ ทั่วแผ่นดินจีนนำไปปั๊มตาม',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=23.1291,113.2644'
  },
  {
    id: 'mint-royal-uk',
    name: 'Royal Mint, London (โรงกษาปณ์หลวงสหราชอาณาจักร)',
    country: 'UK',
    countryTh: 'สหราชอาณาจักร',
    flag: '🇬🇧',
    city: 'Tower Hill, London, UK (EC3N 4AB)',
    coordinates: '51.5098° N, 0.0754° W',
    lat: 51.5098,
    lng: -0.0754,
    tagColor: '#6366f1',
    founded: 'ค.ศ. 886 (กว่า 1,100 ปี สมัยพระเจ้าอัลเฟรดมหาราช)',
    status: 'โรงกษาปณ์หลวงแห่งสหราชอาณาจักรและเครือจักรภพ',
    coinsMinted: ['1935 New Zealand Waitangi Crown 5 Shillings (One-Year Type ผลิตเพียง 1,128 เหรียญ)', 'Gold Sovereign', 'Britannia'],
    technology: 'แท่นปั๊มเหรียญไอน้ำ Boulton & Watt ในศตวรรษที่ 19 สู่เทคโนโลยีกษาปณ์ดิจิทัลสมัยใหม่',
    history: 'เคยมี เซอร์ ไอแซก นิวตัน (Sir Isaac Newton) ดำรงตำแหน่งผู้ว่าการโรงกษาปณ์ ปั๊มเหรียญกษาปณ์ที่ระลึกสนธิสัญญาไวทังกิ 5 ชิลลิง ให้นิวซีแลนด์ในปี 1935 ซึ่งได้รับการยกย่องว่าเป็นสุดยอดเหรียญหายากระดับตำนาน',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=51.5098,-0.0754'
  },
  {
    id: 'mint-birmingham',
    name: 'The Mint, Birmingham / Ralph Heaton & Sons (Heaton Mint - H)',
    country: 'UK',
    countryTh: 'สหราชอาณาจักร',
    flag: '🇬🇧',
    city: 'Birmingham, England (Icknield St, Jewellery Quarter)',
    coordinates: '52.4883° N, 1.9168° W',
    lat: 52.4883,
    lng: -1.9168,
    tagColor: '#6366f1',
    founded: 'ค.ศ. 1819',
    status: 'โรงกษาปณ์เอกชนที่ใหญ่ที่สุดในโลกยุคปฏิวัติอุตสาหกรรม',
    coinsMinted: ['เครื่องจักรและแม่พิมพ์เหรียญมังกรกวางตุ้ง 1889', 'เหรียญกษาปณ์ส่งออกกว่า 40 ประเทศ'],
    technology: 'โรงงานหล่อและสร้างเครื่องจักรผลิตเหรียญไอน้ำส่งออกทั่วโลก',
    history: 'เป็นผู้สร้างเครื่องจักรไอน้ำและแม่พิมพ์เหรียญมังกรชุดแรกให้แก่โรงกษาปณ์กวางตุ้งของจีนในปี 1887 และปั๊มเหรียญตราตอก "H" ให้แก่หลายประเทศทั่วโลก',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=52.4883,-1.9168'
  },
  {
    id: 'mint-thailand',
    name: 'Royal Thai Mint (สำนักกษาปณ์ กรมธนารักษ์ รังสิต)',
    country: 'Thailand',
    countryTh: 'ไทย',
    flag: '🇹🇭',
    city: 'ต.คลองหนึ่ง อ.คลองหลวง จ.ปทุมธานี 12120',
    coordinates: '14.0208° N, 100.6140° E',
    lat: 14.0208,
    lng: 100.6140,
    tagColor: '#10b981',
    founded: 'พ.ศ. 2403 (สมัย ร.4 โรงกษาปณ์สิทธิการ) / รังสิต พ.ศ. 2545',
    status: 'โรงกษาปณ์แห่งชาติ สังกัดกรมธนารักษ์ กระทรวงการคลัง',
    coinsMinted: ['เหรียญเงินบรรณาการ ร.4', 'เหรียญเงิน ร.5 ปราบฮ่อ', 'เหรียญ 10 บาท 2 สี 2533', 'เหรียญหมุนเวียนและที่ระลึกทุกรุ่น'],
    technology: 'ระบบปั๊มเหรียญอัตโนมัติความเร็วสูงและระบบตรวจสอบคุณภาพด้วยเลเซอร์',
    history: 'พระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัว (ร.4) โปรดเกล้าฯ ให้สั่งซื้อเครื่องจักรผลิตเหรียญจากประเทศอังกฤษมาติดตั้งในพระบรมมหาราชวัง พระราชทานนามว่า "โรงกระสาปน์สิทธิการ" นับเป็นจุดเริ่มต้นของเหรียญกษาปณ์แบนกลมแบบสากลของไทย ก่อนจะย้ายสู่โรงกษาปณ์รังสิตที่ทันสมัยระดับเอเชีย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.0208,100.6140'
  },
  {
    id: 'mint-waitangi-nz',
    name: 'Waitangi Treaty Grounds (จุดกำเนิดเหรียญสนธิสัญญาไวทังกิ)',
    country: 'New Zealand',
    countryTh: 'นิวซีแลนด์',
    flag: '🇳🇿',
    city: 'Waitangi, Bay of Islands, New Zealand (106 Tau Henare Dr)',
    coordinates: '35.2673° S, 174.0837° E',
    lat: -35.2673,
    lng: 174.0837,
    tagColor: '#ec4899',
    founded: 'ค.ศ. 1840 (ลงนามสนธิสัญญาไวทังกิ) / เหรียญผลิต ค.ศ. 1935',
    status: 'อนุสรณ์สถานแห่งชาติ จุดกำเนิดประวัติศาสตร์นิวซีแลนด์',
    coinsMinted: ['1935 Waitangi Crown (King of New Zealand Coins)'],
    technology: 'สั่งปั๊มเหรียญที่ระลึกระดับราชวงศ์จาก Royal Mint London',
    history: 'สถานที่ลงนามในสนธิสัญญาประวัติศาสตร์ไวทังกิ (Treaty of Waitangi) ปี 1840 ระหว่างเรือเอกวิลเลียม ฮอบสัน ตัวแทนกษัตริย์อังกฤษกับหัวหน้าเผ่าเมารี ซึ่งเป็นที่มาของลวดลายบนเหรียญ 1935 Waitangi Crown',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-35.2673,174.0837'
  },
  {
    id: 'mint-paris',
    name: 'Monnaie de Paris (โรงกษาปณ์ปารีส - มาร์ก A)',
    country: 'France',
    countryTh: 'ฝรั่งเศส',
    flag: '🇫🇷',
    city: '11 Quai de Conti, 75006 Paris, France',
    coordinates: '48.8566° N, 2.3391° E',
    lat: 48.8566,
    lng: 2.3391,
    tagColor: '#3b82f6',
    founded: 'ค.ศ. 864 (สถาปนาโดยพระเจ้าชาร์ลส์ผู้ศีรษะล้าน)',
    status: 'โรงกษาปณ์แห่งชาติที่เก่าแก่ที่สุดในโลก',
    coinsMinted: ['French Indochina 1 Piastre de Commerce (เหรียญนางกวักการค้าอินโดจีน 1885–1928)', 'เหรียญฟรังก์ฝรั่งเศส'],
    technology: 'เครื่องจักรปั๊มเหรียญระบบแรงดันไฮดรอลิกและแม่พิมพ์แกะสลัก Barre ระดับโลก',
    history: 'สถาปนาในปี ค.ศ. 864 ถือเป็นสถาบันผลิตกษาปณ์ที่เก่าแก่ที่สุดของฝรั่งเศสและของโลก เป็นผู้ผลิตเหรียญเงินการค้า 1 Piastre de Commerce (เหรียญนางกวัก) ส่งมายังดินแดนอาณานิคมอินโดจีนและลุ่มแม่น้ำโขงในสมัย ร.5',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=48.8566,2.3391'
  },
  {
    id: 'mint-bombay',
    name: 'India Government Mint, Mumbai (โรงกษาปณ์บอมเบย์ - มาร์ก B)',
    country: 'India',
    countryTh: 'อินเดีย',
    flag: '🇮🇳',
    city: 'Shahid Bhagat Singh Rd, Fort, Mumbai, Maharashtra 400001, India',
    coordinates: '18.9322° N, 72.8398° E',
    lat: 18.9322,
    lng: 72.8398,
    tagColor: '#f97316',
    founded: 'ค.ศ. 1829 (ยุคบริติชราช)',
    status: 'โรงกษาปณ์หลักแห่งจักรวรรดิบริติชราชในเอเชียใต้',
    coinsMinted: ['British Trade Dollar (เหรียญบริติชดอลลาร์การค้า ตราตอก B ในง่ามตรีศูล)', 'British India 1 Rupee Victoria Empress', 'Straits Settlements 1 Dollar'],
    technology: 'แท่นปั๊มไอน้ำแรงดันสูง Boulton & Watt และเครื่องจักรผลิตเหรียญมาตรฐานสเตอร์ลิง',
    history: 'เป็นโรงกษาปณ์หลักของรัฐบาลบริติชราชในการผลิตเหรียญเงินการค้าสากลส่งออกไปทั่วเอเชียตะวันออกและช่องแคบมะละกา รวมทั้งเหรียญเงินบริติชดอลลาร์การค้าและเหรียญรูปีวิกตอเรีย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=18.9322,72.8398'
  },
  {
    id: 'mint-calcutta',
    name: 'India Government Mint, Kolkata (โรงกษาปณ์กัลกัตตา - มาร์ก C)',
    country: 'India',
    countryTh: 'อินเดีย',
    flag: '🇮🇳',
    city: 'Alipore, Kolkata, West Bengal 700053, India',
    coordinates: '22.5186° N, 88.3284° E',
    lat: 22.5186,
    lng: 88.3284,
    tagColor: '#f97316',
    founded: 'ค.ศ. 1757 (ย้ายสู่อะลีปุระ ค.ศ. 1952)',
    status: 'โรงกษาปณ์แห่งแรกของบริษัทบริติชอีสต์อินเดีย',
    coinsMinted: ['British India 1 Rupee Victoria Empress (มาร์ก C)', 'British Trade Dollar (1900-C Key Date)', 'Straits Settlements 1 Dollar'],
    technology: 'เตาหลอมเงินสเตอร์ลิงขนาดใหญ่และแท่นปั๊มเหรียญไอน้ำมาตรฐานลอนดอน',
    history: 'ก่อตั้งขึ้นตั้งแต่ยุคบริษัทบริติชอีสต์อินเดีย (British East India Company) ผลิตเหรียญรูปีเงินวิกตอเรียและเหรียญบริติชเทรดดอลลาร์มาร์ก C ที่หายากและมีราคาสูงในปัจจุบัน',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=22.5186,88.3284'
  },
  {
    id: 'mint-osaka',
    name: 'Japan Mint, Osaka (โรงกษาปณ์โอซาก้า ประเทศญี่ปุ่น)',
    country: 'Japan',
    countryTh: 'ญี่ปุ่น',
    flag: '🇯🇵',
    city: '1-1-79 Temma, Kita Ward, Osaka 530-0043, Japan',
    coordinates: '34.6975° N, 135.5222° E',
    lat: 34.6975,
    lng: 135.5222,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1871 (เมจิปีที่ 4)',
    status: 'โรงกษาปณ์แห่งชาติจักรวรรดิญี่ปุ่นยุคปฏิรูปเมจิ',
    coinsMinted: ['Japan 1 Yen Silver Meiji Era (เหรียญ 1 เยนมังกรเงิน ยุคเมจิ 1870–1914)', 'เหรียญทองคำ Gold Yen 20 Yen Meiji'],
    technology: 'เครื่องจักรปั๊มเหรียญไอน้ำมาตรฐานสากลสั่งซื้อจากโรงกษาปณ์ฮ่องกง',
    history: 'ก่อตั้งขึ้นในยุคปฏิรูปเมจิ (Meiji Restoration) เพื่อปฏิวัติระบบเงินตราของญี่ปุ่นสู่มาตรฐานสากล เป็นผู้ผลิตเหรียญเงิน 1 เยนมังกรถือลูกแก้วจักรพรรดิอันวิจิตรตระการตาและมีชื่อเสียงไปทั่วโลก',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=34.6975,135.5222'
  },
  {
    id: 'mint-mexico-city',
    name: 'Casa de Moneda de México (โรงกษาปณ์เม็กซิโกซิตี้ - มาร์ก Mo)',
    country: 'Mexico',
    countryTh: 'เม็กซิโก',
    flag: '🇲🇽',
    city: 'Paseo de la Reforma, Mexico City, Mexico',
    coordinates: '19.4326° N, 99.1332° W',
    lat: 19.4326,
    lng: -99.1332,
    tagColor: '#16a34a',
    founded: 'ค.ศ. 1535 (โดยพระบรมราชโองการกษัตริย์สเปน)',
    status: 'โรงกษาปณ์ที่เก่าแก่ที่สุดในทวีปอเมริกา (Oldest Mint in the Americas)',
    coinsMinted: ['Mexican 8 Reales Cap and Rays (เหรียญนกเม็กซิโก / หมวกเสรีภาพ 8 เรอัล)', 'เหรียญเงินเปโซเม็กซิโกการค้าโลก'],
    technology: 'แท่นปั๊มสกรูแรงเหวี่ยงยุคอาณานิคม สู่แท่นปั๊มไอน้ำไอน์เฮาส์แห่งศตวรรษที่ 19',
    history: 'สถาปนาขึ้นในปี ค.ศ. 1535 ถือเป็นโรงกษาปณ์ที่เก่าแก่ที่สุดในทวีปอเมริกา ผลิตเหรียญเงิน 8 Reales (เหรียญนกเม็กซิโก / หัวแปด) ที่กลายเป็นสกุลเงินการค้าหลักของโลกและใช้หมุนเวียนในสยามสมัย ร.3–ร.5',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.4326,-99.1332'
  },
  {
    id: 'mint-guanajuato',
    name: 'Guanajuato Mint (โรงกษาปณ์กวานาคัวโต - มาร์ก Go)',
    country: 'Mexico',
    countryTh: 'เม็กซิโก',
    flag: '🇲🇽',
    city: 'Guanajuato, Guanajuato State, Mexico',
    coordinates: '21.0190° N, 101.2574° W',
    lat: 21.0190,
    lng: -101.2574,
    tagColor: '#16a34a',
    founded: 'ค.ศ. 1812',
    status: 'โรงกษาปณ์ศูนย์กลางแหล่งแร่เงินมหาศาลแห่งเม็กซิโก',
    coinsMinted: ['Mexican 8 Reales ตราตอก Go (บล็อกยอดนิยม ผลิตจำนวนมาก)', 'Cap and Rays Silver Peso'],
    technology: 'เครื่องจักรปั๊มเหรียญพลังงานน้ำและไอน้ำประจำเหมืองแร่เงินวาเลนเซียนา',
    history: 'ตั้งอยู่ติดกับเหมืองแร่เงินวาเลนเซียนา (Valenciana Mine) ซึ่งเป็นหนึ่งในเหมืองเงินที่สมบูรณ์ที่สุดในประวัติศาสตร์โลก ปั๊มเหรียญเงิน 8 Reales ตรา Go ที่ส่งออกไปค้าขายในทวีปเอเชียและสยามอย่างแพร่หลาย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.0190,-101.2574'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  setupNavigation();
  setupFilters();
  setupMintSearch();
  renderAuthHeader();
  await loadNetworkInfo();
  await loadCoins();
  initLeafletMap();
  renderMintExplorer();
}

// Helper to determine National Flag Background CSS class
function getCountryFlagClass(country) {
  const c = (country || '').toLowerCase();
  if (c.includes('australia') || c.includes('ออสเตรเลีย')) return 'flag-bg-australia';
  if (c.includes('united states') || c.includes('usa') || c.includes('อเมริกา') || c.includes('america')) return 'flag-bg-usa';
  if (c.includes('china') || c.includes('จีน') || c.includes('chinese')) return 'flag-bg-china';
  if (c.includes('japan') || c.includes('ญี่ปุ่น')) return 'flag-bg-japan';
  if (c.includes('french') || c.includes('indochina') || c.includes('ฝรั่งเศส') || c.includes('อินโดจีน')) return 'flag-bg-france';
  if (c.includes('mexico') || c.includes('เม็กซิโก')) return 'flag-bg-mexico';
  if (c.includes('straits') || c.includes('สเตรทส์') || c.includes('malaya') || c.includes('singapore')) return 'flag-bg-straits';
  if (c.includes('india') || c.includes('อินเดีย')) return 'flag-bg-india';
  if (c.includes('united kingdom') || c.includes('uk') || c.includes('อังกฤษ') || c.includes('britain')) return 'flag-bg-uk';
  if (c.includes('new zealand') || c.includes('นิวซีแลนด์') || c.includes('nz')) return 'flag-bg-nz';
  if (c.includes('thailand') || c.includes('ไทย')) return 'flag-bg-thailand';
  return 'flag-bg-default';
}

// Helper to get weight text
function getWeightText(coin) {
  if (coin.features && coin.features.weightG) return `${coin.features.weightG} g`;
  if (coin.weightG) return `${coin.weightG} g`;
  if (coin.weight) return `${coin.weight}`;
  return 'ไม่ระบุ';
}

// Helper to get metal composition text & percentage
function getCompositionText(coin) {
  if (coin.composition) return coin.composition;
  if (coin.features && coin.features.composition) return coin.features.composition;
  if (coin.material) return coin.material;
  return 'ไม่ระบุสัดส่วน';
}

// Toast Notification System
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast`;
  toast.innerHTML = `<span>⚡ ${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Navigation Tabs Manager
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-link');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      if (targetId === 'tab-home') {
        setNavMode('home');
      } else if (targetId === 'tab-catalog') {
        setNavMode('all');
      } else if (targetId === 'tab-counter') {
        setNavMode('counter');
      } else {
        switchTab(targetId);
      }
    });
  });

  const lanBadge = document.getElementById('btn-lan-qr');
  if (lanBadge) {
    lanBadge.addEventListener('click', () => openModal('modal-lan-qr'));
  }
}

function setNavMode(mode) {
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === `tab-${mode}`);
  });

  if (mode === 'home') {
    switchTab('tab-catalog');
    setQuickPreset('home');
  } else if (mode === 'all') {
    switchTab('tab-catalog');
    setQuickPreset('all');
  } else if (mode === 'counter') {
    switchTab('tab-counter');
  }
}

function switchTab(targetId) {
  document.querySelectorAll('.tab-view-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === targetId);
  });

  if (targetId === 'tab-counter') {
    if (leafletMap) {
      setTimeout(() => {
        leafletMap.invalidateSize();
      }, 150);
    }
    renderMintExplorer();
  }
}

// Fetch Home Server LAN IP & QR Code from Backend API
async function loadNetworkInfo() {
  try {
    const res = await fetch('/api/network-info');
    const data = await res.json();

    const ipBadge = document.getElementById('server-lan-ip');
    const qrImg = document.getElementById('qr-code-img');
    const qrUrlText = document.getElementById('qr-modal-url');

    if (ipBadge) ipBadge.textContent = data.ip;
    if (qrImg) qrImg.src = data.qrDataUrl;
    if (qrUrlText) qrUrlText.textContent = data.serverUrl;
  } catch (err) {
    console.error('Failed to load network info:', err);
  }
}

// Fetch coins dataset from Backend API
async function loadCoins() {
  try {
    const res = await fetch('/api/coins');
    const data = await res.json();
    globalCoinsData = data.coins || [];

    renderCatalog();
    renderMintExplorer();
  } catch (err) {
    console.error('Failed to load coins:', err);
    showToast('เกิดข้อผิดพลาดในการโหลดข้อมูลเหรียญ');
  }
}

// Quick Preset Filters
function setQuickPreset(preset) {
  activePreset = preset;
  activeCoverflowIndex = 0; // Reset to 1st coin
  document.querySelectorAll('.preset-chips-list .dribbble-chip').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${preset}'`));
  });

  // Sync Top Nav active state
  const homeNav = document.querySelector('.nav-link[data-tab="tab-home"]');
  const catalogNav = document.querySelector('.nav-link[data-tab="tab-catalog"]');
  const counterNav = document.querySelector('.nav-link[data-tab="tab-counter"]');
  if (homeNav && catalogNav && counterNav) {
    if (preset === 'home') {
      homeNav.classList.add('active');
      catalogNav.classList.remove('active');
      counterNav.classList.remove('active');
    } else {
      homeNav.classList.remove('active');
      catalogNav.classList.toggle('active', preset === 'all');
      counterNav.classList.remove('active');
    }
  }

  // Update dynamic hero badge and subtitle
  const badgeEl = document.getElementById('hero-badge-mode');
  const subEl = document.getElementById('hero-sub-text');
  if (badgeEl && subEl) {
    if (preset === 'home') {
      badgeEl.innerHTML = `<span>🇹🇭 คัดเฉพาะ 5 เหรียญเงินแท้ยอดนิยมในไทย</span>`;
      subEl.textContent = `ศูนย์ข้อมูลเหรียญประจำร้าน คัดสรร 5 เหรียญเงินประวัติศาสตร์ยอดนิยมที่พบและหมุนเวียนจริงในแผ่นดินสยาม/ประเทศไทย`;
    } else {
      badgeEl.innerHTML = `<span>📂 คลังข้อมูลเหรียญกษาปณ์สะสมสากล (15 รายการ)</span>`;
      subEl.textContent = `ศูนย์ข้อมูลเหรียญประจำร้าน แสดงสเปกเนื้อโลหะ สัดส่วน% โลหะ ประวัติความเป็นมาจากบันทึกทางประวัติศาสตร์ และระบบเหรียญวนลูป 3D Coverflow`;
    }
  }

  renderCatalog();
}

// Setup Search & Filter Handlers
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('btn-search-trigger');

  if (searchInput) searchInput.addEventListener('input', () => {
    activeCoverflowIndex = 0;
    renderCatalog();
  });
  if (searchBtn) searchBtn.addEventListener('click', () => {
    activeCoverflowIndex = 0;
    renderCatalog();
  });
}

// Helper to get filtered coins list
function getFilteredCoins() {
  const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase();

  const THAI_FEATURED_IDS = [
    'coin-fr-indochina-piastre',
    'coin-uk-trade-dollar',
    'coin-cn-yuan-shih-kai-dollar',
    'coin-cn-kwangtung-dragon-dollar',
    'coin-mx-8-reales'
  ];

  let filtered = globalCoinsData.filter(c => {
    const matchSearch = !searchVal || 
      c.name.toLowerCase().includes(searchVal) ||
      c.country.toLowerCase().includes(searchVal) ||
      (c.composition && c.composition.toLowerCase().includes(searchVal)) ||
      (c.mint && c.mint.toLowerCase().includes(searchVal)) ||
      (c.location && c.location.toLowerCase().includes(searchVal)) ||
      c.year.toString().includes(searchVal);

    let matchPreset = true;
    if (activePreset === 'home') {
      matchPreset = c.popularInThailand === true || THAI_FEATURED_IDS.includes(c.id);
    } else if (activePreset === 'australia') {
      matchPreset = (c.country || '').includes('Australia') || (c.country || '').includes('ออสเตรเลีย');
    } else if (activePreset === 'usa') {
      matchPreset = (c.country || '').includes('United States') || (c.country || '').includes('USA') || (c.country || '').includes('อเมริกา');
    } else if (activePreset === 'china') {
      matchPreset = (c.country || '').includes('China') || (c.country || '').includes('จีน');
    } else if (activePreset === 'japan') {
      matchPreset = (c.country || '').includes('Japan') || (c.country || '').includes('ญี่ปุ่น');
    } else if (activePreset === 'uk') {
      matchPreset = (c.country || '').includes('United Kingdom') || (c.country || '').includes('UK') || (c.country || '').includes('อังกฤษ') || (c.country || '').includes('India') || (c.country || '').includes('อินเดีย');
    } else if (activePreset === 'indochina') {
      matchPreset = (c.country || '').includes('Indochina') || (c.country || '').includes('France') || (c.country || '').includes('อินโดจีน') || (c.country || '').includes('ฝรั่งเศส');
    } else if (activePreset === 'straits') {
      matchPreset = (c.country || '').includes('Straits') || (c.country || '').includes('สเตรทส์') || (c.country || '').includes('Singapore') || (c.country || '').includes('Malaya');
    } else if (activePreset === 'mexico') {
      matchPreset = (c.country || '').includes('Mexico') || (c.country || '').includes('เม็กซิโก');
    } else if (activePreset === 'newzealand') {
      matchPreset = (c.country || '').includes('New Zealand') || (c.country || '').includes('นิวซีแลนด์');
    } else if (activePreset === 'rare') {
      matchPreset = (c.rarity || '').includes('Rare') || (c.rarity || '').includes('Legendary') || (c.rarity || '').includes('Key Date') || (c.rarity || '').includes('MYTHIC') || (c.rarity || '').includes('EPIC');
    }

    return matchSearch && matchPreset;
  });

  if (activePreset === 'home') {
    filtered.sort((a, b) => (a.thaiRank || 99) - (b.thaiRank || 99));
  }

  return filtered;
}

// ----------------------------------------------------
// 3D COVERFLOW CAROUSEL LOGIC
// ----------------------------------------------------
function renderCatalog() {
  const track = document.getElementById('coverflow-track');
  const dotsContainer = document.getElementById('coverflow-dots');
  if (!track) return;

  const filtered = getFilteredCoins();

  if (filtered.length === 0) {
    track.innerHTML = `
      <div style="text-align:center; padding:4rem 1rem; color:var(--text-muted); font-weight:700;">
        ไม่พบรายการเหรียญตรงตามเงื่อนไขค้นหา
      </div>
    `;
    if (dotsContainer) dotsContainer.innerHTML = '';
    return;
  }

  // Bound index safely
  if (activeCoverflowIndex >= filtered.length) activeCoverflowIndex = 0;
  if (activeCoverflowIndex < 0) activeCoverflowIndex = filtered.length - 1;

  track.innerHTML = filtered.map((coin, idx) => {
    const total = filtered.length;
    let posClass = 'hidden';

    if (idx === activeCoverflowIndex) {
      posClass = 'active';
    } else if (idx === (activeCoverflowIndex - 1 + total) % total) {
      posClass = 'prev';
    } else if (idx === (activeCoverflowIndex + 1) % total) {
      posClass = 'next';
    }

    return createCoverflowCardHtml(coin, idx, posClass);
  }).join('');

  // Render navigation dots
  if (dotsContainer) {
    dotsContainer.innerHTML = filtered.map((_, idx) => `
      <div class="coverflow-dot ${idx === activeCoverflowIndex ? 'active' : ''}" onclick="setCoverflowIndex(${idx})"></div>
    `).join('');
  }
}

function createCoverflowCardHtml(coin, index, posClass) {
  const weight = getWeightText(coin);
  const mintage = coin.mintage || 'ไม่ระบุ';
  const composition = getCompositionText(coin);
  const flagBgClass = getCountryFlagClass(coin.country);
  const mainImage = coin.obverseImage || coin.image;
  const thaiBadge = coin.popularInThailand ? `<span class="card-badge" style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.3); font-weight:800; font-size:0.7rem; padding:0.2rem 0.55rem;">🇹🇭 นิยมในไทย #${coin.thaiRank || ''}</span>` : '';

  return `
    <div class="coverflow-card ${posClass}" id="cover-card-${coin.id}" data-side="obv" onclick="handleCardClick(${index}, '${coin.id}')">
      <div class="card-top-content">
        <div class="card-header-row">
          <div style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
            <span class="card-badge">📅 ${coin.year}</span>
            ${thaiBadge}
          </div>
          <button class="card-arrow-btn" title="ดูรายละเอียด">↗</button>
        </div>

        <div class="card-coin-name">${coin.name}</div>

        <!-- Specs Display including composition % & Mint -->
        <div class="card-4specs">
          <div>🏛️ โรงกษาปณ์: <b>${coin.mint || 'ไม่ระบุ'}</b></div>
          <div>🧪 โลหะ: <b>${composition}</b></div>
          <div>⚖️ น้ำหนัก: <b>${weight}</b></div>
          <div>🪙 ผลิต: <b>${mintage}</b></div>
        </div>

        ${coin.thaiMarketNote ? `
          <div style="margin-top:0.4rem; font-size:0.74rem; line-height:1.3; color:#b45309; background:#fffbeb; padding:0.3rem 0.55rem; border-radius:8px; border:1px solid #fde68a; font-weight:700;">
            📍 ${coin.thaiMarketNote}
          </div>
        ` : ''}
      </div>

      <!-- Flag Background Container -->
      <div class="card-image-wrapper ${flagBgClass}" onclick="toggleCoinSide('cover-card-${coin.id}', '${coin.id}', event)">
        <img src="${mainImage}" class="card-coin-img" alt="${coin.name}" onerror="this.onerror=null; this.src='/images/default-coin.svg';">
        <div class="side-flip-badge" style="position:absolute; bottom:0.6rem; background:rgba(30,39,46,0.9); backdrop-filter:blur(8px); color:#fff; padding:0.3rem 0.8rem; border-radius:9999px; font-size:0.75rem; font-weight:800; border:1px solid rgba(255,255,255,0.2);">
          🔄 ด้านหน้า (แตะเพื่อสลับ)
        </div>
      </div>
    </div>
  `;
}

function handleCardClick(index, coinId) {
  if (index === activeCoverflowIndex) {
    openCoinDetailModal(coinId);
  } else {
    activeCoverflowIndex = index;
    renderCatalog();
  }
}

function nextCoverflowCard() {
  const filtered = getFilteredCoins();
  if (filtered.length === 0) return;
  activeCoverflowIndex = (activeCoverflowIndex + 1) % filtered.length;
  renderCatalog();
}

function prevCoverflowCard() {
  const filtered = getFilteredCoins();
  if (filtered.length === 0) return;
  activeCoverflowIndex = (activeCoverflowIndex - 1 + filtered.length) % filtered.length;
  renderCatalog();
}

function setCoverflowIndex(index) {
  activeCoverflowIndex = index;
  renderCatalog();
}

// Toggle Coin Side between Obverse (ด้านหน้า) and Reverse (ด้านหลัง)
function toggleCoinSide(cardElementId, coinId, event) {
  if (event) event.stopPropagation();

  const cardEl = document.getElementById(cardElementId);
  const coin = globalCoinsData.find(c => c.id === coinId);
  if (!cardEl || !coin) return;

  const imgEl = cardEl.querySelector('.card-coin-img');
  const badgeEl = cardEl.querySelector('.side-flip-badge');
  if (!imgEl) return;

  const obv = coin.obverseImage || coin.image;
  const rev = coin.reverseImage || coin.image;
  const currentSide = cardEl.getAttribute('data-side') || 'obv';
  const newSide = currentSide === 'obv' ? 'rev' : 'obv';

  cardEl.setAttribute('data-side', newSide);

  imgEl.style.transition = 'transform 0.25s ease-in, opacity 0.25s ease-in';
  imgEl.style.transform = 'scale(0.8) rotateY(90deg)';
  imgEl.style.opacity = '0.5';

  setTimeout(() => {
    imgEl.src = newSide === 'obv' ? obv : rev;
    if (badgeEl) badgeEl.textContent = newSide === 'obv' ? '🔄 ด้านหน้า (แตะเพื่อสลับ)' : '🔄 ด้านหลัง (แตะเพื่อสลับ)';
    imgEl.style.transform = 'scale(1) rotateY(0deg)';
    imgEl.style.opacity = '1';
  }, 250);
}

// ----------------------------------------------------
// REAL GPS LEAFLET INTERACTIVE MAP & EXPLORER (Tab 3)
// ----------------------------------------------------
function initLeafletMap() {
  const mapContainer = document.getElementById('leaflet-mint-map');
  if (!mapContainer || leafletMap) return;

  // Initialize Leaflet Map centered globally
  leafletMap = L.map('leaflet-mint-map', {
    center: [22, 15],
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    scrollWheelZoom: true
  });

  // Free high-resolution crisp map tiles from CartoDB Voyager
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(leafletMap);

  leafletMarkersLayer = L.layerGroup().addTo(leafletMap);
}

function setupMintSearch() {
  const searchInput = document.getElementById('mint-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderMintExplorer());
  }
}

function filterMintsByCountry(country) {
  activeMintCountry = country;
  document.querySelectorAll('#mint-filter-chips .dribbble-chip').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${country}'`));
  });

  renderMintExplorer();

  // Smooth Fly-To Animation right into the exact target country/region
  if (!leafletMap) return;

  if (country === 'Australia') {
    leafletMap.flyTo([-32, 138], 4.5, { duration: 1.2 });
  } else if (country === 'USA') {
    leafletMap.flyTo([38.5, -98.5], 4, { duration: 1.2 });
  } else if (country === 'China') {
    leafletMap.flyTo([31.5, 115], 4.8, { duration: 1.2 });
  } else if (country === 'Japan') {
    leafletMap.flyTo([36.0, 137.5], 5.5, { duration: 1.2 });
  } else if (country === 'UK') {
    leafletMap.flyTo([52.0, -1.0], 6.2, { duration: 1.2 });
  } else if (country === 'India') {
    leafletMap.flyTo([20.5937, 78.9629], 4.8, { duration: 1.2 });
  } else if (country === 'France') {
    leafletMap.flyTo([48.0, 2.3], 5.5, { duration: 1.2 });
  } else if (country === 'Mexico') {
    leafletMap.flyTo([22.5, -100.5], 5.0, { duration: 1.2 });
  } else if (country === 'Thailand') {
    leafletMap.flyTo([13.9, 100.55], 9.5, { duration: 1.2 });
  } else if (country === 'New Zealand') {
    leafletMap.flyTo([-38, 175], 5.2, { duration: 1.2 });
  } else {
    leafletMap.flyTo([22, 15], 2, { duration: 1.0 });
  }
}

function renderMintExplorer() {
  const searchVal = (document.getElementById('mint-search-input')?.value || '').toLowerCase();
  
  let filtered = worldMintsData.filter(mint => {
    const matchSearch = !searchVal || 
      mint.name.toLowerCase().includes(searchVal) ||
      mint.city.toLowerCase().includes(searchVal) ||
      mint.country.toLowerCase().includes(searchVal) ||
      mint.countryTh.toLowerCase().includes(searchVal) ||
      mint.coordinates.toLowerCase().includes(searchVal) ||
      mint.coinsMinted.some(c => c.toLowerCase().includes(searchVal)) ||
      mint.technology.toLowerCase().includes(searchVal);

    let matchCountry = true;
    if (activeMintCountry !== 'all') {
      matchCountry = mint.country.toLowerCase() === activeMintCountry.toLowerCase();
    }

    return matchSearch && matchCountry;
  });

  renderLeafletMarkers(filtered);
  renderMintCards(filtered);

  // Update mint counter label
  const counterLabel = document.getElementById('mints-counter-label');
  if (counterLabel) {
    counterLabel.textContent = `แสดง ${filtered.length} จากทั้งหมด ${worldMintsData.length} โรงกษาปณ์`;
  }
}

// Render Exact GPS Coordinates Pins on Leaflet Map
function renderLeafletMarkers(mints) {
  if (!leafletMap || !leafletMarkersLayer) return;

  leafletMarkersLayer.clearLayers();

  mints.forEach(mint => {
    const customIcon = L.divIcon({
      className: 'custom-leaflet-div-icon',
      html: `
        <div class="custom-leaflet-mint-pin" style="--pin-color:${mint.tagColor};">
          <div class="custom-leaflet-pin-pulse"></div>
          <div class="custom-leaflet-pin-head">${mint.flag}</div>
          <div class="custom-leaflet-pin-label">${mint.name.split('(')[0].trim()}</div>
        </div>
      `,
      iconSize: [120, 56],
      iconAnchor: [60, 20]
    });

    const marker = L.marker([mint.lat, mint.lng], { icon: customIcon }).addTo(leafletMarkersLayer);

    const popupHtml = `
      <div class="mint-popup-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem;">
          <div style="font-size:1.4rem;">${mint.flag}</div>
          <span class="card-badge" style="background:${mint.tagColor}18; color:${mint.tagColor}; font-size:0.7rem; padding:0.2rem 0.55rem; font-weight:800;">📅 ${mint.founded}</span>
        </div>
        <div style="font-size:0.75rem; color:#64748b; font-weight:800; text-transform:uppercase;">${mint.countryTh} (${mint.country})</div>
        <div style="font-weight:900; font-size:0.98rem; color:#0f172a; margin-bottom:0.35rem; line-height:1.2;">${mint.name}</div>
        <div style="font-size:0.76rem; color:#475569; margin-bottom:0.55rem; line-height:1.4;">
          📍 ${mint.city}<br>
          <span style="color:#0284c7; font-family:monospace; font-weight:700;">${mint.coordinates}</span>
        </div>
        
        <div style="font-size:0.74rem; font-weight:800; color:#334155; margin-bottom:0.2rem;">🪙 เหรียญเด่นประจำโรงกษาปณ์:</div>
        <div style="font-size:0.76rem; color:#0f172a; font-weight:800; margin-bottom:0.75rem; line-height:1.3; background:#f8fafc; padding:0.35rem 0.6rem; border-radius:8px; border:1px solid #e2e8f0;">
          ${mint.coinsMinted[0]}
        </div>

        <div style="display:flex; gap:0.4rem;">
          <a href="${mint.googleMapsUrl}" target="_blank" class="pill-btn" style="flex:1; justify-content:center; text-decoration:none; font-size:0.75rem; padding:0.4rem 0.5rem;">
            📍 Google Maps ↗
          </a>
          <button class="pill-btn" style="background:#ff6b00; color:#fff; border:none; font-size:0.75rem; padding:0.4rem 0.6rem;" onclick="filterCatalogByMint('${mint.name}')">
            🔍 ดูเหรียญ
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);

    marker.on('click', () => {
      highlightMintCard(mint.id);
    });
  });
}

function renderMintCards(mints) {
  const container = document.getElementById('mints-cards-grid');
  if (!container) return;

  if (mints.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted); font-weight:700;">
        ไม่พบข้อมูลโรงกษาปณ์ตรงตามเงื่อนไขค้นหา
      </div>
    `;
    return;
  }

  container.innerHTML = mints.map(mint => `
    <div class="mint-card-item" id="card-${mint.id}">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.4rem;">${mint.flag}</span>
            <div>
              <div style="font-size:0.78rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">${mint.countryTh} (${mint.country})</div>
              <div style="font-size:1.05rem; font-weight:900; color:var(--text-main); line-height:1.2;">${mint.name}</div>
            </div>
          </div>
          <span class="card-badge" style="background:${mint.tagColor}15; color:${mint.tagColor}; border:1px solid ${mint.tagColor}40; font-size:0.72rem; padding:0.25rem 0.6rem;">
            📅 ${mint.founded}
          </span>
        </div>

        <div style="background:#f8fafc; padding:0.85rem 1rem; border-radius:16px; border:1px solid #e2e8f0; margin-bottom:0.9rem; font-size:0.82rem; line-height:1.5;">
          <div style="display:flex; align-items:center; gap:0.4rem; font-weight:800; color:var(--text-main); margin-bottom:0.2rem;">
            <span>📍 ที่ตั้ง:</span>
            <span style="color:var(--text-muted); font-weight:600;">${mint.city}</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.4rem; font-weight:800; color:var(--accent-blue);">
            <span>🌐 พิกัดจริง (GPS):</span>
            <span style="font-family:monospace; font-weight:700;">${mint.coordinates}</span>
          </div>
        </div>

        <!-- Featured Coins Produced -->
        <div style="margin-bottom:0.9rem;">
          <div style="font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:0.35rem;">🪙 เหรียญเด่นที่ผลิต ณ โรงกษาปณ์นี้:</div>
          <div style="display:flex; flex-direction:column; gap:0.3rem;">
            ${mint.coinsMinted.map(c => `
              <div style="background:#f1f5f9; padding:0.4rem 0.75rem; border-radius:10px; font-size:0.78rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:0.35rem;">
                <span style="color:var(--accent-orange);">•</span> ${c}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Technology & History -->
        <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.55; margin-bottom:1.1rem;">
          <div style="font-weight:800; color:var(--text-main); margin-bottom:0.2rem;">⚙️ เครื่องจักร &amp; ประวัติความเป็นมา:</div>
          <div>${mint.history}</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; gap:0.5rem; padding-top:0.75rem; border-top:1px solid #f1f5f9; flex-wrap:wrap;">
        <button class="pill-btn" style="flex:1; justify-content:center; font-size:0.8rem; padding:0.5rem 0.8rem; background:#0f172a; color:#ffffff; border:none;" onclick="zoomDirectToMint('${mint.id}')">
          🎯 ซูมดูหมุดบนแผนที่
        </button>
        <a href="${mint.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="pill-btn" style="flex:1; justify-content:center; text-decoration:none; font-size:0.8rem; padding:0.5rem 0.8rem;">
          📍 Google Maps ↗
        </a>
        <button class="pill-btn" style="background:var(--accent-orange); color:#fff; border:none; font-size:0.8rem; padding:0.5rem 0.8rem;" onclick="filterCatalogByMint('${mint.name}')">
          🔍 ดูเหรียญในคลัง
        </button>
      </div>
    </div>
  `).join('');
}

// Zoom directly into exact mint building/city on the map
function zoomDirectToMint(mintId) {
  const mint = worldMintsData.find(m => m.id === mintId);
  if (!mint || !leafletMap) return;

  // Scroll to map
  document.getElementById('leaflet-mint-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Zoom into exact coordinates
  setTimeout(() => {
    leafletMap.flyTo([mint.lat, mint.lng], 13, { duration: 1.5 });
  }, 200);

  highlightMintCard(mintId);
  showToast(`🎯 ซูมพิกัดตรงจุด: ${mint.name}`);
}

function highlightMintCard(mintId) {
  document.querySelectorAll('.mint-card-item').forEach(c => c.classList.remove('highlighted'));
  const card = document.getElementById(`card-${mintId}`);
  if (card) {
    card.classList.add('highlighted');
  }
}

// Filter Catalog by Mint Name
function filterCatalogByMint(mintName) {
  const searchInput = document.getElementById('search-input');
  const shortName = mintName.split('(')[0].trim();
  if (searchInput) searchInput.value = shortName;
  setQuickPreset('all');
  switchTab('tab-catalog');
  showToast(`กรองรายการเหรียญจาก: ${shortName}`);
}

// ----------------------------------------------------
// COIN DETAIL MODAL
// ----------------------------------------------------
function openCoinDetailModal(coinId) {
  const coin = globalCoinsData.find(c => c.id === coinId);
  if (!coin) return;

  const modalBody = document.getElementById('detail-modal-body');
  if (!modalBody) return;

  const weight = getWeightText(coin);
  const mintage = coin.mintage || 'ไม่ระบุ';
  const composition = getCompositionText(coin);
  const flagBgClass = getCountryFlagClass(coin.country);
  const obv = coin.obverseImage || coin.image;
  const historyText = coin.historyText || coin.description || 'ไม่มีข้อมูลประวัติศาสตร์';
  const isVip = isVipSupporter();

  // Valuation Block (Rendered clear or blurred)
  let valuationBlockHtml = '';
  if (coin.soughtAfterYears || coin.marketPriceRange) {
    const rawValuationHtml = `
      <div style="background:linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border:1.5px solid #fdba74; padding:1.25rem; border-radius:24px; box-shadow:0 6px 20px rgba(251,146,60,0.12);">
        ${isVip ? `
        <div style="display:inline-flex; align-items:center; gap:0.35rem; background:#dcfce7; color:#166534; padding:0.25rem 0.65rem; border-radius:9999px; font-size:0.75rem; font-weight:800; margin-bottom:0.75rem; border:1px solid #86efac;">
          👑 <span>ข้อมูลจริงปลดล็อกแล้ว (สำหรับ ${currentUser.name} - ${currentUser.memberCode})</span>
        </div>
        ` : ''}

        ${coin.soughtAfterYears ? `
        <div style="margin-bottom:0.75rem;">
          <div style="font-size:0.8rem; color:#c2410c; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.25rem;">
            ⭐ ปีที่นักสะสมตามหา (Key Dates / Sought-After Years)
          </div>
          <div style="font-size:0.92rem; font-weight:900; color:#9a3412; line-height:1.4;">
            ${coin.soughtAfterYears}
          </div>
        </div>
        ` : ''}
        
        ${coin.marketPriceRange ? `
        <div>
          <div style="font-size:0.8rem; color:#15803d; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.25rem;">
            💰 ราคาที่เล่นกันในตลาดนักสะสม (Collector Market Price)
          </div>
          <div style="font-size:0.92rem; font-weight:900; color:#166534; line-height:1.45; background:#dcfce7; padding:0.65rem 0.9rem; border-radius:14px; border:1px solid #86efac;">
            ${coin.marketPriceRange}
          </div>
        </div>
        ` : ''}
      </div>
    `;

    if (isVip) {
      valuationBlockHtml = `<div style="margin-bottom:1.25rem;">${rawValuationHtml}</div>`;
    } else {
      valuationBlockHtml = `
        <div class="vip-blur-wrapper">
          <div class="vip-blur-content">
            ${rawValuationHtml}
          </div>
          <div class="vip-blur-overlay">
            <div class="vip-lock-icon">🔒</div>
            <div class="vip-lock-title">ข้อมูลสงวนสิทธิ์เฉพาะ "ผู้สนับสนุนเว็บไซต์"</div>
            <div class="vip-lock-sub">
              สมัครสมาชิกเพียง 199 บาท (โอนเข้าบัญชี SCB 4190025841 ศรัณย์ทองขวัญ) เพื่อปลดล็อกราคาประเมินตลาดจริง
            </div>
            <div class="vip-lock-actions">
              <button class="pill-btn btn-vip-cta" onclick="closeModal('modal-coin-detail'); openRegisterModal();">✨ สมัครสมาชิก (199 บ.)</button>
              <button class="pill-btn btn-vip-login" onclick="closeModal('modal-coin-detail'); openLoginModal();">🔑 เข้าสู่ระบบ</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  modalBody.innerHTML = `
    <div style="text-align:center; margin-bottom:1.5rem;" id="modal-img-container" data-side="obv">
      <div class="card-image-wrapper ${flagBgClass}" style="height:200px; max-width:240px; margin:0 auto 1rem auto; cursor:pointer;" onclick="toggleModalCoinSide('${coin.id}')">
        <img id="modal-coin-img-element" src="${obv}" style="width:140px; height:140px; object-fit:cover; filter:drop-shadow(0 12px 28px rgba(0,0,0,0.3)); transition:transform 0.25s ease;" alt="${coin.name}">
        <div id="modal-side-badge" style="position:absolute; bottom:0.6rem; background:rgba(30,39,46,0.9); backdrop-filter:blur(8px); color:#fff; padding:0.35rem 0.85rem; border-radius:9999px; font-size:0.75rem; font-weight:800; border:1px solid rgba(255,255,255,0.2);">
          🔄 ด้านหน้า (แตะเพื่อสลับเป็นด้านหลัง)
        </div>
      </div>

      <h2 style="font-size:1.5rem; font-weight:900; line-height:1.2;">${coin.name}</h2>
    </div>

    <!-- Key Dates & Low Mintage Rare Alert Banner -->
    ${coin.keyDatesInfo ? `
    <div style="background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color:#92400e; border:1.5px solid #f59e0b; padding:0.9rem 1.2rem; border-radius:20px; margin-bottom:1.25rem; font-size:0.88rem; font-weight:800; line-height:1.5;">
      ${coin.keyDatesInfo}
    </div>
    ` : ''}

    <!-- Specs Grid with Composition % -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; background:#f8fafc; padding:1.25rem; border-radius:20px; border:1.5px solid #e2e8f0; margin-bottom:1.25rem;">
      <div>
        <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">🧪 ส่วนประกอบโลหะ (%)</div>
        <div style="font-size:0.95rem; font-weight:800; color:var(--accent-blue);">${composition}</div>
      </div>
      <div>
        <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">⚖️ น้ำหนัก</div>
        <div style="font-size:0.95rem; font-weight:800; color:var(--accent-gold);">${weight}</div>
      </div>
      <div>
        <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">🏛️ โรงกษาปณ์ที่ผลิต</div>
        <div style="font-size:0.95rem; font-weight:800; color:var(--text-main);">${coin.mint || 'ไม่ระบุ'}</div>
      </div>
      <div>
        <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">🪙 จำนวนที่ผลิต (Mintage)</div>
        <div style="font-size:0.95rem; font-weight:800; color:var(--accent-green);">${mintage}</div>
      </div>
    </div>

    <!-- Mint History Section -->
    ${coin.mintHistory ? `
    <div style="background:#e0f2fe; color:#0369a1; padding:1.1rem; border-radius:20px; margin-bottom:1.25rem; font-size:0.88rem; line-height:1.6; border:1px solid #bae6fd;">
      <div style="font-weight:900; font-size:0.95rem; margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem;">
        🏛️ <span>ประวัติโรงกษาปณ์ (${coin.mint || 'โรงกษาปณ์ต้นกำเนิด'})</span>
      </div>
      <div>${coin.mintHistory}</div>
      ${coin.mintLocation ? `<div style="margin-top:0.4rem; font-size:0.82rem; font-weight:700; color:#0369a1;">📍 ที่ตั้ง/พิกัด: ${coin.mintLocation}</div>` : ''}
    </div>
    ` : ''}

    <!-- Historical Background Section from DATA.txt & Archives -->
    <div style="background:#f1f5f9; padding:1.25rem; border-radius:20px; margin-bottom:1.25rem; font-size:0.88rem; color:var(--text-main); line-height:1.65;">
      <div style="display:flex; align-items:center; gap:0.5rem; font-weight:900; font-size:0.95rem; margin-bottom:0.6rem;">
        📜 <span>ประวัติศาสตร์กษาปณ์ (จาก DATA.txt)</span>
      </div>
      <div>${historyText}</div>
    </div>

    <!-- Sought After Years & Market Valuation Section (with VIP Gatekeeper Blur) -->
    ${valuationBlockHtml}

    <!-- Reference Sources Section -->
    ${coin.referenceSources && coin.referenceSources.length ? `
    <div style="background:#f8fafc; padding:1.25rem; border-radius:24px; border:1.5px solid #cbd5e1; margin-bottom:1.25rem;">
      <div style="font-weight:900; font-size:0.95rem; color:var(--text-main); margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem;">
        🔗 <span>แหล่งข้อมูลอ้างอิงประจำเหรียญ (สถาบันกษาปณ์สากล)</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:0.6rem;">
        ${coin.referenceSources.map(ref => `
          <a href="${ref.url}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:space-between; background:#ffffff; border:1.5px solid #e2e8f0; padding:0.65rem 1rem; border-radius:16px; text-decoration:none; color:var(--text-main); font-size:0.88rem; font-weight:800; transition:all 0.2s ease;">
            <span>🌐 ${ref.name}</span>
            <span style="color:var(--accent-orange); font-weight:900;">เปิดดู ↗</span>
          </a>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:var(--text-muted); margin-bottom:1.5rem;">
      <span>📍 จัดเก็บ: <b style="color:var(--text-main);">${coin.location || 'ตู้โชว์สินค้า A1'}</b></span>
      <span>📦 สต็อก: <b style="color:var(--text-main);">${coin.stock || 1} ชิ้น</b></span>
    </div>

    <div style="display:flex; gap:0.75rem;">
      <button class="dribbble-search-btn" style="flex:1;" onclick="closeModal('modal-coin-detail')">
        ตกลง / ปิดหน้าต่าง
      </button>
    </div>
  `;

  openModal('modal-coin-detail');
}

// Toggle Side inside Detail Modal
function toggleModalCoinSide(coinId) {
  const coin = globalCoinsData.find(c => c.id === coinId);
  if (!coin) return;

  const container = document.getElementById('modal-img-container');
  const imgEl = document.getElementById('modal-coin-img-element');
  const badgeEl = document.getElementById('modal-side-badge');

  if (!container || !imgEl) return;

  const obv = coin.obverseImage || coin.image;
  const rev = coin.reverseImage || coin.image;
  const currentSide = container.getAttribute('data-side') || 'obv';
  const newSide = currentSide === 'obv' ? 'rev' : 'obv';

  container.setAttribute('data-side', newSide);

  imgEl.style.transition = 'transform 0.25s ease-in, opacity 0.25s ease-in';
  imgEl.style.transform = 'scale(0.8) rotateY(90deg)';
  imgEl.style.opacity = '0.5';

  setTimeout(() => {
    imgEl.src = newSide === 'obv' ? obv : rev;
    if (badgeEl) badgeEl.textContent = newSide === 'obv' ? '🔄 ด้านหน้า (แตะเพื่อสลับเป็นด้านหลัง)' : '🔄 ด้านหลัง (แตะเพื่อสลับเป็นด้านหน้า)';
    imgEl.style.transform = 'scale(1) rotateY(0deg)';
    imgEl.style.opacity = '1';
  }, 250);
}

// Add Coin Form Submit Handler
function setupAddForm() {
  const form = document.getElementById('add-coin-form');
  const obvInput = document.getElementById('add-image-obv');
  const revInput = document.getElementById('add-image-rev');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let obvUrl = '/images/1930-penny-obv.png';
    let revUrl = '/images/1930-penny-rev.png';

    if (obvInput && obvInput.files && obvInput.files[0]) {
      try {
        const formData = new FormData();
        formData.append('imageFile', obvInput.files[0]);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          obvUrl = uploadData.url;
        }
      } catch (uploadErr) {}
    }

    if (revInput && revInput.files && revInput.files[0]) {
      try {
        const formData = new FormData();
        formData.append('imageFile', revInput.files[0]);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          revUrl = uploadData.url;
        }
      } catch (uploadErr) {}
    }

    const payload = {
      name: document.getElementById('add-name').value,
      year: parseInt(document.getElementById('add-year').value) || new Date().getFullYear(),
      weightG: document.getElementById('add-weight').value || '-',
      composition: document.getElementById('add-composition').value || 'ไม่ระบุ',
      mintage: document.getElementById('add-mintage').value || 'ไม่ระบุ',
      country: document.getElementById('add-country').value,
      stock: parseInt(document.getElementById('add-stock')?.value) || 1,
      location: document.getElementById('add-location').value || 'ตู้นิรภัยส่วนตัว A1',
      description: document.getElementById('add-history').value || '',
      historyText: document.getElementById('add-history').value || '',
      image: obvUrl,
      obverseImage: obvUrl,
      reverseImage: revUrl,
      features: {
        weightG: parseFloat(document.getElementById('add-weight').value) || null,
        composition: document.getElementById('add-composition').value || null
      }
    };

    try {
      const res = await fetch('/api/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('บันทึกเหรียญใหม่เข้าคลังเรียบร้อยแล้ว!');
        form.reset();
        await loadCoins();
        switchTab('tab-catalog');
      }
    } catch (err) {
      console.error('Failed to add coin:', err);
    }
  });
}

// Delete Coin
async function deleteCoin(coinId) {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการเหรียญนี้?')) return;

  try {
    const res = await fetch(`/api/coins/${coinId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('ลบรายการเหรียญเรียบร้อยแล้ว');
      closeModal('modal-coin-detail');
      await loadCoins();
    }
  } catch (err) {
    console.error('Failed to delete coin:', err);
  }
}

// Generic Modal Helpers
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

// ----------------------------------------------------
// 🌟 VIP SUPPORTER AUTH & ADMIN MANAGEMENT LOGIC
// ----------------------------------------------------

function renderAuthHeader() {
  const container = document.getElementById('auth-header-container');
  if (!container) return;

  if (!currentUser) {
    // Guest
    container.innerHTML = `
      <button class="pill-btn" style="background:linear-gradient(135deg,#ff6b00,#ea580c); color:#fff; font-weight:800; border:none; box-shadow:0 4px 12px rgba(255,107,0,0.3);" onclick="openRegisterModal()">
        ✨ <span>สมัครสมาชิก (199 บ.)</span>
      </button>
      <button class="pill-btn" style="background:#0f172a; color:#fff; font-weight:800; border:none;" onclick="openLoginModal()">
        🔑 <span>เข้าสู่ระบบ</span>
      </button>
    `;
  } else if (currentUser.status === 'approved') {
    // Approved VIP Supporter
    container.innerHTML = `
      <div class="vip-badge-header">
        <span>👑</span> <span>${currentUser.name}</span> <span class="member-code-badge" style="background:rgba(255,255,255,0.6); padding:0.15rem 0.4rem; font-size:0.75rem;">${currentUser.memberCode}</span>
      </div>
      <button class="pill-btn" style="padding:0.35rem 0.65rem; font-size:0.75rem; background:#f1f5f9; border:1px solid #cbd5e1;" onclick="handleLogout()" title="ออกจากระบบ">
        🚪 ออก
      </button>
    `;
  } else {
    // Pending Member
    container.innerHTML = `
      <div class="pending-badge-header" onclick="openPendingStatusModal()" title="คลิกเพื่อดูสถานะการสมัคร">
        <span>⏳</span> <span>${currentUser.memberCode} (รอคุณศรัณย์อนุมัติ)</span>
      </div>
      <button class="pill-btn" style="padding:0.35rem 0.65rem; font-size:0.75rem; background:#f1f5f9; border:1px solid #cbd5e1;" onclick="handleLogout()" title="ออกจากระบบ">
        🚪 ออก
      </button>
    `;
  }
}

function openRegisterModal() {
  openModal('modal-register');
}

function openLoginModal() {
  openModal('modal-login');
}

function openPendingStatusModal() {
  if (!currentUser) return;
  const codeEl = document.getElementById('pending-modal-code');
  const nameEl = document.getElementById('pending-modal-name');
  const emailEl = document.getElementById('pending-modal-email');
  if (codeEl) codeEl.textContent = currentUser.memberCode || 'CC-XXXXX';
  if (nameEl) nameEl.textContent = currentUser.name || '-';
  if (emailEl) emailEl.textContent = currentUser.email || '-';
  openModal('modal-pending-status');
}

function copyAccountNumber(accountNo) {
  navigator.clipboard.writeText(accountNo).then(() => {
    showToast(`📋 คัดลอกเลขบัญชี SCB: ${accountNo} เรียบร้อยแล้ว!`);
  }).catch(() => {
    showToast(`เลขบัญชี SCB: ${accountNo}`);
  });
}

let uploadedSlipBase64 = '';

function previewSlipUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedSlipBase64 = e.target.result;
    const imgEl = document.getElementById('reg-slip-preview-img');
    const container = document.getElementById('reg-slip-preview-container');
    if (imgEl && container) {
      imgEl.src = uploadedSlipBase64;
      container.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const phone = document.getElementById('reg-phone')?.value.trim() || '';

  if (!uploadedSlipBase64) {
    showToast('กรุณาแนบรูปภาพสลิปโอนเงิน 199 บาท');
    return;
  }

  const btn = document.getElementById('btn-submit-reg');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'กำลังส่งข้อมูลการสมัคร...';
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        slipUrl: uploadedSlipBase64,
        bankRef: 'SCB 4190025841 ศรัณย์ทองขวัญ'
      })
    });

    const data = await res.json();
    if (res.ok) {
      currentUser = data.member;
      localStorage.setItem('coin_center_user', JSON.stringify(currentUser));
      closeModal('modal-register');
      renderAuthHeader();
      openPendingStatusModal();
      showToast(`🎉 ส่งคำขอสมัครเรียบร้อย! รหัสสมาชิก: ${data.member.memberCode}`);
    } else {
      showToast(`❌ ${data.error || 'เกิดข้อผิดพลาดในการสมัคร'}`);
    }
  } catch (err) {
    console.error('Registration error:', err);
    showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '✨ ยืนยันการสมัคร & ส่งสลิป 199 บาท';
    }
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const btn = document.getElementById('btn-submit-login');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'กำลังตรวจสอบ...';
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      currentUser = data.user;
      localStorage.setItem('coin_center_user', JSON.stringify(currentUser));
      closeModal('modal-login');
      renderAuthHeader();

      if (currentUser.status === 'approved') {
        showToast(`👑 ยินดีต้อนรับ ${currentUser.name}! ปลดล็อกข้อมูลจริงเรียบร้อย`);
      } else {
        openPendingStatusModal();
        showToast(`⏳ เข้าสู่ระบบสำเร็จ (รหัส: ${currentUser.memberCode} - รออนุมัติ)`);
      }
    } else {
      showToast(`❌ ${data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'}`);
    }
  } catch (err) {
    console.error('Login error:', err);
    showToast('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🔑 เข้าสู่ระบบ';
    }
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('coin_center_user');
  renderAuthHeader();
  showToast('ออกจากระบบเรียบร้อยแล้ว');
}

// ----------------------------------------------------
// ⚙️ ADMIN MANAGEMENT FOR OWNER (คุณศรัณย์)
// ----------------------------------------------------

function openAdminModal() {
  if (adminToken) {
    document.getElementById('admin-auth-box').style.display = 'none';
    document.getElementById('admin-dashboard-panel').style.display = 'block';
    loadAdminMembersList();
  } else {
    document.getElementById('admin-auth-box').style.display = 'block';
    document.getElementById('admin-dashboard-panel').style.display = 'none';
  }
  openModal('modal-admin');
}

async function handleAdminLoginSubmit(event) {
  event.preventDefault();
  const password = document.getElementById('admin-pass-input').value.trim();

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    if (res.ok) {
      adminToken = data.token;
      localStorage.setItem('coin_center_admin_token', adminToken);
      document.getElementById('admin-auth-box').style.display = 'none';
      document.getElementById('admin-dashboard-panel').style.display = 'block';
      loadAdminMembersList();
      showToast(`👑 ${data.message || 'ยินดีต้อนรับคุณศรัณย์'}`);
    } else {
      showToast(`❌ ${data.error || 'รหัสผ่านไม่ถูกต้อง'}`);
    }
  } catch (err) {
    console.error('Admin login error:', err);
    showToast('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
  }
}

function handleAdminLogout() {
  adminToken = null;
  localStorage.removeItem('coin_center_admin_token');
  document.getElementById('admin-auth-box').style.display = 'block';
  document.getElementById('admin-dashboard-panel').style.display = 'none';
  showToast('ออกจากระบบผู้ดูแลเรียบร้อยแล้ว');
}

async function loadAdminMembersList() {
  const tbody = document.getElementById('admin-members-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem;">กำลังโหลดข้อมูลสมาชิก...</td></tr>`;

  try {
    const res = await fetch('/api/admin/members');
    const data = await res.json();
    const members = data.members || [];

    if (members.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:#64748b;">ยังไม่มีสมาชิกในระบบ</td></tr>`;
      return;
    }

    tbody.innerHTML = members.map(m => {
      let statusBadge = `<span class="status-badge-pending">⏳ รออนุมัติ</span>`;
      if (m.status === 'approved') statusBadge = `<span class="status-badge-approved">👑 ผู้สนับสนุน</span>`;
      if (m.status === 'rejected') statusBadge = `<span class="status-badge-rejected">❌ ปฏิเสธ</span>`;

      const slipThumb = m.slipUrl ? `
        <img src="${m.slipUrl}" alt="สลิป" style="width:48px; height:48px; object-fit:cover; border-radius:8px; cursor:pointer; border:1px solid #cbd5e1;" onclick="zoomSlipImage('${m.slipUrl}')" title="คลิกเพื่อดูรูปสลิปขนาดใหญ่">
      ` : `<span style="font-size:0.75rem; color:#94a3b8;">ไม่มีสลิป</span>`;

      const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : '-';

      return `
        <tr>
          <td><span class="member-code-badge">${m.memberCode || '-'}</span></td>
          <td><b>${m.name}</b></td>
          <td><span style="font-family:monospace;">${m.email}</span></td>
          <td><b style="color:#16a34a;">${m.amountPaid || 199} บ.</b></td>
          <td>${slipThumb}</td>
          <td>${statusBadge}</td>
          <td style="font-size:0.78rem; color:#64748b;">${dateStr}</td>
          <td>
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
              ${m.status !== 'approved' ? `
                <button class="btn-approve-action" onclick="approveMemberAction('${m.id}')" title="อนุมัติเป็นผู้สนับสนุนเว็บไซต์">
                  ✅ อนุมัติ
                </button>
              ` : ''}
              ${m.status !== 'rejected' && m.role !== 'admin' ? `
                <button class="btn-reject-action" onclick="rejectMemberAction('${m.id}')" title="ปฏิเสธคำขอ">
                  ❌ ปฏิเสธ
                </button>
              ` : ''}
              ${m.role !== 'admin' ? `
                <button style="background:#f1f5f9; color:#64748b; border:1px solid #cbd5e1; border-radius:6px; padding:0.25rem 0.5rem; font-size:0.72rem; cursor:pointer;" onclick="deleteMemberAction('${m.id}')" title="ลบข้อมูล">
                  🗑️
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading admin members:', err);
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:#ef4444;">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>`;
  }
}

async function approveMemberAction(memberId) {
  try {
    const res = await fetch('/api/admin/members/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`🎉 ${data.message || 'อนุมัติเรียบร้อยแล้ว'}`);
      loadAdminMembersList();

      // If current browser user is approved, update local storage
      if (currentUser && (currentUser.id === memberId || currentUser.memberCode === memberId)) {
        currentUser.status = 'approved';
        localStorage.setItem('coin_center_user', JSON.stringify(currentUser));
        renderAuthHeader();
      }
    }
  } catch (err) {
    console.error('Error approving member:', err);
    showToast('เกิดข้อผิดพลาดในการอนุมัติ');
  }
}

async function rejectMemberAction(memberId) {
  try {
    const res = await fetch('/api/admin/members/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`❌ ${data.message || 'ปฏิเสธคำขอเรียบร้อยแล้ว'}`);
      loadAdminMembersList();
    }
  } catch (err) {
    console.error('Error rejecting member:', err);
    showToast('เกิดข้อผิดพลาด');
  }
}

async function deleteMemberAction(memberId) {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประวัติสมาชิกนี้?')) return;
  try {
    const res = await fetch('/api/admin/members/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId })
    });
    if (res.ok) {
      showToast('ลบสมาชิกเรียบร้อยแล้ว');
      loadAdminMembersList();
    }
  } catch (err) {
    console.error('Error deleting member:', err);
    showToast('เกิดข้อผิดพลาดในการลบ');
  }
}

function zoomSlipImage(url) {
  const img = document.getElementById('zoom-slip-img');
  if (img) img.src = url;
  openModal('modal-slip-zoom');
}
