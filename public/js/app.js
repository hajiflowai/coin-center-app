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
  // 1. Australia
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
    name: 'Government Assay Office, Adelaide (โรงกษาปณ์แอดิเลด)',
    country: 'Australia',
    countryTh: 'ออสเตรเลีย',
    flag: '🇦🇺',
    city: 'Adelaide, South Australia (Victoria Square)',
    coordinates: '34.9285° S, 138.6007° E',
    lat: -34.9285,
    lng: 138.6007,
    tagColor: '#ef4444',
    founded: 'ค.ศ. 1852',
    status: 'โรงถลุงและผลิตเหรียญทองคำแห่งแรกของออสเตรเลีย (Bullion Act 1852)',
    coinsMinted: ['1852 Adelaide Pound (Type I & Type II เหรียญทองคำแรกของออสเตรเลีย)', 'Adelaide Gold Ingots'],
    technology: 'แท่นปั๊มลูกตุ้มแรงเหวี่ยงและแม่พิมพ์แกะมือโดยช่างแกะสลักประจำเมือง Joshua Payne',
    history: 'ก่อตั้งตามกฎหมาย Bullion Act 1852 เพื่อแก้วิกฤตการณ์ขาดแคลนเงินตราหลังผู้คนแห่ไปขุดทองที่รัฐวิกตอเรีย โดยนำทองคำบริสุทธิ์ 22 กะรัตมาหลอมเป็นแท่งและปั๊มเป็นเหรียญ Adelaide Pound ถือเป็นเหรียญทองคำอย่างเป็นทางการเหรียญแรกในประวัติศาสตร์ออสเตรเลีย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-34.9285,138.6007'
  },

  // 2. United States of America
  {
    id: 'mint-philadelphia',
    name: 'Philadelphia Mint (โรงกษาปณ์ฟิลาเดลเฟีย - ไม่มีมาร์ก / มาร์ก P)',
    country: 'United States of America',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'Philadelphia, Pennsylvania, USA (5th & Arch St)',
    coordinates: '39.9535° N, 75.1481° W',
    lat: 39.9535,
    lng: -75.1481,
    tagColor: '#2563eb',
    founded: 'ค.ศ. 1792',
    status: 'โรงกษาปณ์แม่แห่งแรกของสหรัฐอเมริกา (First US Mint)',
    coinsMinted: ['Morgan Silver Dollar (1878–1904, 1921)', 'Peace Silver Dollar (1921–1935)', 'Walking Liberty Half Dollar (1916–1947)', '1964 Kennedy Half Dollar (90% Silver)'],
    technology: 'แท่นปั๊มสกรูแรงม้าในยุคแรก พัฒนาสู่แท่นปั๊มไอน้ำ Peale Coining Press ค.ศ. 1836',
    history: 'สภาคองเกรสก่อตั้งขึ้นตามรัฐบัญญัติ Coinage Act of 1792 โดยประธานาธิบดีจอร์จ วอชิงตัน ถือเป็นโรงกษาปณ์หลักในการผลิตเหรียญเงินและเหรียญทองคำของชาติ เหรียญที่ผลิตที่นี่ส่วนใหญ่ในยุคคลาสสิกจะไม่ใส่เครื่องหมายโรงกษาปณ์ (No Mint Mark)',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=39.9535,-75.1481'
  },
  {
    id: 'mint-san-francisco',
    name: 'San Francisco Mint (โรงกษาปณ์ซานฟรานซิสโก - มาร์ก S / The Granite Lady)',
    country: 'United States of America',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'San Francisco, California, USA (88 5th St)',
    coordinates: '37.7702° N, 122.4267° W',
    lat: 37.7702,
    lng: -122.4267,
    tagColor: '#2563eb',
    founded: 'ค.ศ. 1854',
    status: 'โรงกษาปณ์แห่งยุคตื่นทองแคลิฟอร์เนีย (California Gold Rush)',
    coinsMinted: ['1909-S VDB Lincoln Cent (สุดยอดเหรียญเซนต์หายาก ผลิต 484,000 เหรียญ)', '1893-S Morgan Dollar (Key Date มูลค่าสูงสุด)', 'Walking Liberty Half Dollar (S)', 'Peace Dollar (S)'],
    technology: 'อาคารหินแกรนิตเสริมเหล็กกล้า รอดพ้นจากแผ่นดินไหวและไฟไหม้ใหญ่ปี 1906 อย่างปาฏิหาริย์',
    history: 'ก่อตั้งขึ้นเพื่อแปรรูปทองคำมหาศาลจากยุคตื่นทองแคลิฟอร์เนีย 1849 อาคารโรงกษาปณ์ The Old Mint หรือ Granite Lady โด่งดังจากการรอดพ้นแผ่นดินไหวใหญ่ปี 1906 และเป็นแหล่งผลิตเหรียญระดับตำนานอย่าง 1909-S VDB และ 1893-S Morgan Dollar',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=37.7702,-122.4267'
  },
  {
    id: 'mint-denver',
    name: 'Denver Mint (โรงกษาปณ์เดนเวอร์ - มาร์ก D)',
    country: 'United States of America',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'Denver, Colorado, USA (320 W Colfax Ave)',
    coordinates: '39.7397° N, 104.9926° W',
    lat: 39.7397,
    lng: -104.9926,
    tagColor: '#2563eb',
    founded: 'ค.ศ. 1906',
    status: 'โรงกษาปณ์หลักแห่งเทือกเขาร็อกกี',
    coinsMinted: ['1964-D Kennedy Half Dollar (90% Silver)', '1921-D Morgan Silver Dollar', 'Peace Dollar (D)', 'Walking Liberty (D)'],
    technology: 'ระบบหลอมและปั๊มโลหะด้วยพลังงานไฟฟ้าความเร็วสูง',
    history: 'เริ่มต้นจากการเป็นโรงตรวจวิเคราะห์ทองคำ Clark, Gruber & Co. ในปี 1860 ก่อนรัฐบาลสหรัฐฯ เข้าซื้อกิจการและเปิดเป็นโรงกษาปณ์ผลิตเหรียญอย่างเป็นทางการในปี 1906 ผลิตเหรียญหมุนเวียนหลักของสหรัฐฯ มาจนถึงปัจจุบัน',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=39.7397,-104.9926'
  },
  {
    id: 'mint-carson-city',
    name: 'Carson City Mint (โรงกษาปณ์คาร์สันซิตี - มาร์ก CC)',
    country: 'United States of America',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'Carson City, Nevada, USA (N Carson St)',
    coordinates: '39.1678° N, 119.7674° W',
    lat: 39.1678,
    lng: -119.7674,
    tagColor: '#2563eb',
    founded: 'ค.ศ. 1870',
    status: 'โรงกษาปณ์แห่งสายแร่เงินคอมสต็อก (Comstock Lode)',
    coinsMinted: ['Morgan Silver Dollar CC (1878–1893)', 'Seated Liberty Silver Coins', 'Double Eagles Gold ($20)'],
    technology: 'แท่นปั๊ม Morgan & Orr Steam Press #1 ผลิตตรงจากสายแร่เงินธรรมชาติ',
    history: 'ตั้งอยู่ใกล้กับสายแร่เงินที่ใหญ่ที่สุดในประวัติศาสตร์อเมริกา Comstock Lode เหรียญที่ปั๊มตรา "CC" เป็นที่ต้องการสูงสุดในหมู่นักสะสมทั่วโลก ปิดทำการในปี 1893 ปัจจุบันเป็นพิพิธภัณฑ์แห่งรัฐเนวาดา',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=39.1678,-119.7674'
  },
  {
    id: 'mint-new-orleans',
    name: 'New Orleans Mint (โรงกษาปณ์นิวออร์ลีนส์ - มาร์ก O)',
    country: 'United States of America',
    countryTh: 'สหรัฐอเมริกา',
    flag: '🇺🇸',
    city: 'New Orleans, Louisiana, USA (400 Esplanade Ave)',
    coordinates: '29.9631° N, 90.0610° W',
    lat: 29.9631,
    lng: -90.0610,
    tagColor: '#2563eb',
    founded: 'ค.ศ. 1838',
    status: 'โรงกษาปณ์ประวัติศาสตร์ริมแม่น้ำมิสซิสซิปปี',
    coinsMinted: ['Morgan Silver Dollar O (1879–1904)', 'Seated Liberty & Barber Silver Coins'],
    technology: 'แท่นปั๊มไอน้ำขนาดใหญ่ รองรับการค้าปากแม่น้ำมิสซิสซิปปี',
    history: 'เป็นโรงกษาปณ์แห่งเดียวที่เคยดำเนินการภายใต้ 3 รัฐบาล (สหรัฐอเมริกา, รัฐลุยเซียนา, และสมาพันธรัฐอเมริกาช่วงสงครามกลางเมือง) ผลิตเหรียญเงินมอร์แกนดอลลาร์ตรา O ที่มีชื่อเสียง ปิดทำการในปี 1909',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=29.9631,-90.0610'
  },

  // 3. Canada
  {
    id: 'mint-ottawa',
    name: 'Royal Canadian Mint (โรงกษาปณ์หลวงแคนาดา - Ottawa)',
    country: 'Canada',
    countryTh: 'แคนาดา',
    flag: '🇨🇦',
    city: 'Ottawa, Ontario, Canada (320 Sussex Drive)',
    coordinates: '45.4297° N, 75.6985° W',
    lat: 45.4297,
    lng: -75.6985,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1908',
    status: 'โรงกษาปณ์หลวงแห่งเครือจักรภพแคนาดา',
    coinsMinted: ['Canada 1 Dollar Silver Voyageur 1948 (King George VI - ผลิตเพียง 18,780 เหรียญ)', 'Canadian Silver Maple Leaf', 'เหรียญเงินฉลองครบรอบประวัติศาสตร์แคนาดา'],
    technology: 'แท่นปั๊มกษาปณ์มาตรฐานสูงของเครือจักรภพอังกฤษ และเทคโนโลยีรีดเหรียญเงิน 80% Fine Silver',
    history: 'เปิดทำการอย่างเป็นทางการในวันที่ 2 มกราคม 1908 โดยข้าหลวงใหญ่ Earl Grey เดิมเป็นสาขาของ Royal Mint ลอนดอน ก่อนโอนมาอยู่ภายใต้การบริหารของกระทรวงการคลังแคนาดาในปี 1931 ผลิตเหรียญเงินดอลลาร์ประวัติศาสตร์ 1948 Voyageur ซึ่งเป็นหนึ่งในเหรียญเงินแคนาดาที่หายากและมีมูลค่าสูงสุด',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=45.4297,-75.6985'
  },

  // 4. United Kingdom
  {
    id: 'mint-royal-uk',
    name: 'The Royal Mint (โรงกษาปณ์หลวงสหราชอาณาจักร - Tower Hill / Llantrisant)',
    country: 'United Kingdom',
    countryTh: 'สหราชอาณาจักร',
    flag: '🇬🇧',
    city: 'Tower Hill, London / Llantrisant, Wales, UK',
    coordinates: '51.5100° N, 0.0736° W',
    lat: 51.5100,
    lng: -0.0736,
    tagColor: '#1e3a8a',
    founded: 'ค.ศ. 886',
    status: 'หนึ่งในโรงกษาปณ์ที่เก่าแก่ที่สุดในโลก (กว่า 1,100 ปี)',
    coinsMinted: ['Victorian Gothic Crown 1847 (เหรียญเงินกอธิคคราวน์ ผลิตเพียง 8,000 เหรียญ)', '1935 New Zealand Waitangi Crown (ผลิต 1,128 เหรียญ)', 'British Trade Dollar 1895–1935', 'Sovereign Gold Coins'],
    technology: 'แท่นปั๊มไอน้ำ Matthew Boulton & James Watt ค.ศ. 1810 และเครื่องมือแกะลายระดับโลกโดย William Wyon',
    history: 'ก่อตั้งขึ้นในรัชสมัยของกษัตริย์อัลเฟรดมหาราช (ค.ศ. 886) ผลิตเหรียญให้กับสหราชอาณาจักรและดินแดนในเครือจักรภพทั่วโลก รวมถึงสร้างผลงานระดับมาสเตอร์พีซของโลกอย่าง Gothic Crown 1847 และ Waitangi Crown 1935',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=51.5100,-0.0736'
  },
  {
    id: 'mint-birmingham',
    name: 'The Mint, Birmingham (โรงกษาปณ์เบอร์มิงแฮม - Heaton & Sons / มาร์ก H)',
    country: 'United Kingdom',
    countryTh: 'สหราชอาณาจักร',
    flag: '🇬🇧',
    city: 'Birmingham, England, UK (Icknield St)',
    coordinates: '52.4862° N, 1.8904° W',
    lat: 52.4862,
    lng: -1.8904,
    tagColor: '#1e3a8a',
    founded: 'ค.ศ. 1850',
    status: 'โรงกษาปณ์เอกชนที่ใหญ่ที่สุดในโลกยุควิกตอเรีย',
    coinsMinted: ['British Trade Dollar (ตรา H)', 'เหรียญกษาปณ์สยามสมัยรัชกาลที่ 5 (อันเฟื้อง, เสี้ยว, ซีก, โสฬส)', 'เหรียญกษาปณ์กว่า 40 ประเทศทั่วโลก'],
    technology: 'แท่นปั๊มลูกสูบไอน้ำความแม่นยำสูงและเตาหลอมโลหะผสมพิเศษ',
    history: 'ก่อตั้งโดย Ralph Heaton รับจ้างผลิตเหรียญกษาปณ์ให้กับรัฐบาลทั่วโลกกว่า 40 ประเทศ รวมถึงเป็นผู้รับจ้างปั๊มเหรียญทองแดงและดีบุกให้กับประเทศสยาม (ไทย) ในสมัยรัชกาลที่ 5 เพื่อแก้วิกฤตการณ์เหรียญกษาปณ์ในประเทศ',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=52.4862,-1.8904'
  },

  // 5. France & French Empire
  {
    id: 'mint-paris',
    name: 'Monnaie de Paris (โรงกษาปณ์ปารีส - มาร์ก A / Cornucopia)',
    country: 'France',
    countryTh: 'ฝรั่งเศส',
    flag: '🇫🇷',
    city: 'Paris, France (11 Quai de Conti, 6th Arrondissement)',
    coordinates: '48.8566° N, 2.3387° E',
    lat: 48.8566,
    lng: 2.3387,
    tagColor: '#3b82f6',
    founded: 'ค.ศ. 864',
    status: 'สถาบันที่เก่าแก่ที่สุดของฝรั่งเศส (ก่อตั้งโดยพระเจ้าชาร์ลส์ผู้ศีรษะล้าน)',
    coinsMinted: ['French Third Republic 5 Francs Hercules 1875 (มาร์ก A)', 'French Indochina 1 Piastre de Commerce 1885–1928 (เหรียญนางกวักอินโดจีน)', 'Russian Empire 1 Ruble 1897 (ปั๊มช่วยรัสเซีย)'],
    technology: 'แท่นปั๊มกษาปณ์แบบ Balancier และแท่นปั๊ม Thonnelier ความแม่นยำสูง แกะสลักโดย Augustin Dupré และ Barre',
    history: 'ก่อตั้งขึ้นตามพระบรมราชโองการ Edict of Pistres ค.ศ. 864 เป็นโรงกษาปณ์ที่เก่าแก่ที่สุดของฝรั่งเศส ผลิตเหรียญเงิน 5 Francs Hercules และเหรียญการค้า French Indochina Piastre (เหรียญนางกวัก) ซึ่งกลายเป็นสกุลเงินหลักที่แพร่หลายในเวียดนาม กัมพูชา ลาว และภาคอีสานของไทย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=48.8566,2.3387'
  },
  {
    id: 'mint-bordeaux',
    name: 'Bordeaux Mint (โรงกษาปณ์บอร์กโดซ์ - มาร์ก K)',
    country: 'France',
    countryTh: 'ฝรั่งเศส',
    flag: '🇫🇷',
    city: 'Bordeaux, Gironde, France',
    coordinates: '44.8378° N, 0.5792° W',
    lat: 44.8378,
    lng: -0.5792,
    tagColor: '#3b82f6',
    founded: 'ค.ศ. 1550',
    status: 'โรงกษาปณ์สาขาหลักของฝรั่งเศสทางภาคตะวันตกเฉียงใต้',
    coinsMinted: ['French 5 Francs Hercules (มาร์ก K)', 'French Franc Silver Series'],
    technology: 'แท่นปั๊มเหรียญกษาปณ์พลังน้ำและไอน้ำประจำเมืองท่าบอร์กโดซ์',
    history: 'เป็นโรงกษาปณ์สาขาที่สำคัญของฝรั่งเศส ใช้สัญลักษณ์ตัวอักษร "K" มีบทบาทสำคัญในการปั๊มเหรียญเงินหมุนเวียนและเหรียญพาณิชยการทางทะเล ปิดสายการผลิตเหรียญกษาปณ์ในปี 1878',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=44.8378,-0.5792'
  },

  // 6. Germany
  {
    id: 'mint-berlin',
    name: 'Staatliche Münze Berlin (โรงกษาปณ์แห่งรัฐเบอร์ลิน - มาร์ก A)',
    country: 'Germany',
    countryTh: 'เยอรมนี',
    flag: '🇩🇪',
    city: 'Berlin, Germany (Ollenhauerstraße 97)',
    coordinates: '52.5658° N, 13.3328° E',
    lat: 52.5658,
    lng: 13.3328,
    tagColor: '#eab308',
    founded: 'ค.ศ. 1280',
    status: 'โรงกษาปณ์หลวงแห่งจักรวรรดิเยอรมันและปรัสเซีย (มาร์ก A)',
    coinsMinted: ['German Empire Prussia 5 Mark Wilhelm II 1913 (ตรา A)', 'เหรียญทองคำ 20 Mark Wilhelm II', 'เหรียญเงินจักรวรรดิเยอรมัน Deutsches Reich'],
    technology: 'แท่นปั๊มกษาปณ์ระบบ Uhlhorn Lever Press มาตรฐานวิศวกรรมเยอรมันขั้นสูง',
    history: 'ก่อตั้งขึ้นตั้งแต่ปี ค.ศ. 1280 ได้รับเกียรติให้ใช้เครื่องหมายโรงกษาปณ์ตัวอักษร "A" ในฐานะโรงกษาปณ์หลวงอันดับ 1 ของปรัสเซียและจักรวรรดิเยอรมัน ผลิตเหรียญเงิน 5 มาร์ค จักรพรรดิวิลเฮ็ล์มที่ 2 เนื่องในวาระครองราชย์ครบ 25 ปี ค.ศ. 1913',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=52.5658,13.3328'
  },

  // 7. Austria
  {
    id: 'mint-vienna',
    name: 'Münze Österreich (โรงกษาปณ์เวียนนา - Austrian Mint)',
    country: 'Austria',
    countryTh: 'ออสเตรีย',
    flag: '🇦🇹',
    city: 'Vienna, Austria (Am Heumarkt 1)',
    coordinates: '48.2014° N, 16.3817° E',
    lat: 48.2014,
    lng: 16.3817,
    tagColor: '#ef4444',
    founded: 'ค.ศ. 1194',
    status: 'โรงกษาปณ์แห่งจักรวรรดิออสเตรีย-ฮังการีและราชวงศ์ฮับส์บูร์ก',
    coinsMinted: ['Austria Maria Theresa Thaler 1780 (เหรียญการค้าที่ผลิตมากที่สุดในโลกกว่า 800 ล้านเหรียญ)', 'Vienna Philharmonic Gold & Silver', 'Corona & Gulden Series'],
    technology: 'แท่นปั๊มกษาปณ์ Screw Press ยุคฮับส์บูร์ก และเทคโนโลยีขอบเหรียญตัวหนังสือนูน (Raised Edge Lettering)',
    history: 'มีจุดเริ่มต้นจากการเรียกค่าไถ่พระเจ้าริชาร์ดใจสิงห์แห่งอังกฤษในปี 1194 ผลิตเหรียญการค้าระดับตำนาน Maria Theresa Thaler 1780 (MTT) ซึ่งได้รับการยอมรับและใช้หมุนเวียนข้ามทวีปตั้งแต่ยุโรป ตะวันออกกลาง จนถึงแอฟริกาตะวันออกมายาวนานกว่า 200 ปี',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=48.2014,16.3817'
  },

  // 8. Switzerland
  {
    id: 'mint-swissmint',
    name: 'Swissmint (โรงกษาปณ์แห่งสหพันธ์สวิส - Bern Mint / มาร์ก B)',
    country: 'Switzerland',
    countryTh: 'สวิตเซอร์แลนด์',
    flag: '🇨🇭',
    city: 'Bern, Switzerland (Bernastrasse 28)',
    coordinates: '46.9427° N, 7.4474° E',
    lat: 46.9427,
    lng: 7.4474,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1853',
    status: 'โรงกษาปณ์ทางการแห่งสมาพันธรัฐสวิส',
    coinsMinted: ['Switzerland 5 Francs Standing Helvetia 1900 (ตรา B - ขอบอักษรนูน DOMINUS PROVIDEBIT)', 'Vreneli 20 Francs Gold', 'Swiss Franc Silver Series'],
    technology: 'แม่พิมพ์กษาปณ์ความแม่นยำสูงระดับนาฬิกาสวิส แกะสลักโดย Antoine Bovy และ Paul Burkhard',
    history: 'ก่อตั้งขึ้นหลังการรวมระบบเงินตราของสวิตเซอร์แลนด์ตามรัฐบัญญัติ Federal Coinage Act 1850 สัญลักษณ์มาร์ก "B" หมายถึงกรุงเบิร์น ผลิตเหรียญเงิน 5 Francs เทพีเฮลเวเทีย (Standing Helvetia) ที่มีมาตรฐานความบริสุทธิ์ของเนื้อเงิน 90% ตามข้อตกลง Latin Monetary Union (LMU)',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=46.9427,7.4474'
  },

  // 9. Italy
  {
    id: 'mint-rome',
    name: 'Zecca di Roma (โรงกษาปณ์กรุงโรม - มาร์ก R)',
    country: 'Italy',
    countryTh: 'อิตาลี',
    flag: '🇮🇹',
    city: 'Rome, Italy (Via Principe Umberto / Via Salaria)',
    coordinates: '41.8797° N, 12.4839° E',
    lat: 41.8797,
    lng: 12.4839,
    tagColor: '#16a34a',
    founded: 'ค.ศ. 1871',
    status: 'โรงกษาปณ์แห่งชาติราชอาณาจักรอิตาลี (Istituto Poligrafico e Zecca dello Stato)',
    coinsMinted: ['Kingdom of Italy 5 Lire Vittorio Emanuele II 1874 (มาร์ก R)', 'เหรียญทองคำ 20 Lire Umberto I', 'เหรียญเงิน 5 Lire Regno d Italia'],
    technology: 'แท่นปั๊มไฮดรอลิกมาตรฐานราชอาณาจักร แกะแม่พิมพ์โดย Giuseppe Ferraris',
    history: 'กลายเป็นโรงกษาปณ์หลวงหลักของอิตาลีหลังการรวมชาติและการย้ายเมืองหลวงมายังกรุงโรมในปี 1871 ผลิตเหรียญเงิน 5 Lire กษัตริย์วิกเตอร์ เอ็มมานูเอลที่ 2 ที่มีตราอาร์มราชวงศ์ซาวอยและสายสร้อยพระราชทานแอนนันซิอาตา',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=41.8797,12.4839'
  },
  {
    id: 'mint-milan',
    name: 'Regia Zecca di Milano (โรงกษาปณ์มิลาน - มาร์ก M)',
    country: 'Italy',
    countryTh: 'อิตาลี',
    flag: '🇮🇹',
    city: 'Milan, Lombardy, Italy',
    coordinates: '45.4642° N, 9.1900° E',
    lat: 45.4642,
    lng: 9.1900,
    tagColor: '#16a34a',
    founded: 'ศตวรรษที่ 4 (ยุคโรมัน)',
    status: 'โรงกษาปณ์ประวัติศาสตร์แห่งแคว้นลอมบาร์เดีย',
    coinsMinted: ['Kingdom of Italy 5 Lire (มาร์ก M)', 'เหรียญกษาปณ์ราชอาณาจักรลอมบาร์ดี-เวเนเชีย'],
    technology: 'แท่นปั๊มลูกสูบพลังน้ำและไอน้ำยุคฟื้นฟูศิลปวิทยาการสู่ยุคปฏิวัติอุตสาหกรรม',
    history: 'เป็นโรงกษาปณ์เก่าแก่ตั้งแต่ยุคจักรวรรดิโรมัน ผลิตเหรียญเงิน 5 Lire ให้กับราชอาณาจักรอิตาลีในยุคแรกของการรวมชาติ โดยใช้สัญลักษณ์ตัวอักษร "M" ปิดสายการผลิตในปี 1892',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=45.4642,9.1900'
  },

  // 10. Netherlands
  {
    id: 'mint-utrecht',
    name: 'Royal Dutch Mint (โรงกษาปณ์หลวงเนเธอร์แลนด์ - Utrecht / ตรา Caduceus)',
    country: 'Netherlands',
    countryTh: 'เนเธอร์แลนด์',
    flag: '🇳🇱',
    city: 'Utrecht / Houten, Netherlands',
    coordinates: '52.0298° N, 5.1764° E',
    lat: 52.0298,
    lng: 5.1764,
    tagColor: '#f97316',
    founded: 'ค.ศ. 1567',
    status: 'โรงกษาปณ์แห่งราชอาณาจักรเนเธอร์แลนด์ (Koninklijke Nederlandse Munt)',
    coinsMinted: ['Netherlands 2.5 Gulden Rijksdaalder - Queen Wilhelmina 1938 (เนื้อเงิน 72%)', '10 Gulden Gold Coin', 'เหรียญกษาปณ์ดัตช์อีสต์อินดีส (อินโดนีเซีย)'],
    technology: 'แท่นปั๊มกษาปณ์ความแม่นยำสูง พร้อมตราสัญลักษณ์คทาคาดูเซียส (Caduceus) และตราม้าน้ำ/เรือใบประจำนายกษาปณ์',
    history: 'ก่อตั้งขึ้นในปี 1567 เป็นผู้ผลิตเงินตราหลักของชาวดัตช์และเหรียญการค้าในดินแดนอาณานิคมโพ้นทะเล เหรียญ 2.5 Gulden (ไรค์สดาลเดอร์) พระราชินีวิลเฮลมินาเป็นหนึ่งในเหรียญเงินหมุนเวียนขนาดใหญ่ที่ได้รับความนิยมอย่างสูงทั่วยุโรป',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=52.0298,5.1764'
  },

  // 11. Belgium
  {
    id: 'mint-brussels',
    name: 'Royal Mint of Belgium (โรงกษาปณ์หลวงเบลเยียม - Brussels)',
    country: 'Belgium',
    countryTh: 'เบลเยียม',
    flag: '🇧🇪',
    city: 'Brussels, Belgium (Boulevard Pachéco 32)',
    coordinates: '50.8466° N, 4.3528° E',
    lat: 50.8466,
    lng: 4.3528,
    tagColor: '#ca8a04',
    founded: 'ค.ศ. 1832',
    status: 'โรงกษาปณ์แห่งราชอาณาจักรเบลเยียม (Monnaie Royale de Belgique)',
    coinsMinted: ['Kingdom of Belgium 5 Francs Leopold II 1873 (เนื้อเงิน 90% LMU)', 'Belgian 20 Francs Gold Leopold II', 'Russian 1 Ruble 1897 (ปั๊มช่วยจักรวรรดิรัสเซีย - มาร์ก 2 ดาว)'],
    technology: 'แท่นปั๊มกษาปณ์มาตรฐานสูง แกะสลักโดยประติมากรหลวง Léopold Wiener',
    history: 'ก่อตั้งขึ้นหลังการประกาศเอกราชของเบลเยียม ผลิตเหรียญเงินขนาดใหญ่ 5 Francs กษัตริย์เลโอโปลด์ที่ 2 ซึ่งมีคำขวัญภาษาดัตช์และฝรั่งเศส "L UNION FAIT LA FORCE" (ความสามัคคีคือพลัง) รวมถึงได้รับเกียรติให้ปั๊มเหรียญเงิน 1 รูเบิลช่วยซาร์นิโคลัสที่ 2 แห่งรัสเซียในปี 1897',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=50.8466,4.3528'
  },

  // 12. Russian Empire
  {
    id: 'mint-spb',
    name: 'Saint Petersburg Mint (โรงกษาปณ์เซนต์ปีเตอร์สเบิร์ก - ตรา СПБ / АГ)',
    country: 'Russian Empire',
    countryTh: 'รัสเซีย',
    flag: '🇷🇺',
    city: 'Saint Petersburg, Russia (Peter and Paul Fortress)',
    coordinates: '59.9500° N, 30.3167° E',
    lat: 59.9500,
    lng: 30.3167,
    tagColor: '#0284c7',
    founded: 'ค.ศ. 1724',
    status: 'โรงกษาปณ์หลวงแห่งราชวงศ์โรมานอฟ (ก่อตั้งโดยซาร์ปีเตอร์มหาราช)',
    coinsMinted: ['Russian Empire 1 Ruble - Tsar Nicholas II 1897 (เหรียญเงิน 1 รูเบิล ซาร์นิโคลัสที่ 2)', 'Gold 5, 10, 15 Roubles Nicholas II', 'Imperial Silver Roubles 1724–1917'],
    technology: 'โรงกษาปณ์ตั้งอยู่ภายในป้อมปราการปีเตอร์แอนด์พอล (Peter and Paul Fortress) พร้อมระบบแกะอักษรขอบเหรียญนูน (Edge Inscription)',
    history: 'ก่อตั้งขึ้นตามพระราชโองการของซาร์ปีเตอร์มหาราชในปี 1724 เป็นศูนย์กลางการผลิตเหรียญเงินและทองคำของจักรวรรดิรัสเซีย ผลิตเหรียญ 1 รูเบิล ซาร์นิโคลัสที่ 2 ซึ่งถือเป็นเหรียญเงินหมุนเวียนหลักชุดสุดท้ายก่อนการปฏิวัติรัสเซียปี 1917',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=59.9500,30.3167'
  },

  // 13. Spain & Colonial Spanish Mints
  {
    id: 'mint-madrid',
    name: 'Real Casa de la Moneda (โรงกษาปณ์หลวงแห่งสเปน - Madrid / มาร์ก M / ดาวหกแฉก)',
    country: 'Spain',
    countryTh: 'สเปน',
    flag: '🇪🇸',
    city: 'Madrid, Spain (Calle de Jorge Juan 106)',
    coordinates: '40.4225° N, 3.6669° W',
    lat: 40.4225,
    lng: -3.6669,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1591',
    status: 'โรงกษาปณ์หลวงแห่งราชอาณาจักรสเปน (FNMT)',
    coinsMinted: ['Spanish 8 Reales & 5 Pesetas Silver Series', 'Gold Escudos & Doubloons', 'เหรียญกษาปณ์อาณานิคมสเปน'],
    technology: 'แท่นปั๊มกษาปณ์ลูกสูบระบบไอน้ำและเครื่องรีดแผ่นเงินบริสุทธิ์',
    history: 'ก่อตั้งขึ้นในรัชสมัยพระเจ้าฟิลิปที่ 2 เป็นศูนย์กลางการเงินและการผลิตเหรียญกษาปณ์หลักของจักรวรรดิสเปนบนคาบสมุทรไอบีเรีย ควบคุมดูแลระบบเงินตรา Reales และ Pesetas มายาวนานกว่า 4 ศตวรรษ',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=40.4225,-3.6669'
  },
  {
    id: 'mint-potosi',
    name: 'Casa de Moneda de Potosí (โรงกษาปณ์โปโตซี - โบลิเวีย / Cerro Rico / มาร์ก PTS)',
    country: 'Spain',
    countryTh: 'สเปน',
    flag: '🇧🇴',
    city: 'Potosí, Bolivia (Calle Nogales)',
    coordinates: '19.5836° S, 65.7531° W',
    lat: -19.5836,
    lng: -65.7531,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1572',
    status: 'โรงกษาปณ์แร่เงินที่ใหญ่ที่สุดในโลกยุคอาณานิคม (ภูเขาแร่เงินเซร์โรริโก)',
    coinsMinted: ['Spanish 8 Reales Columnarios (ตรา PTS)', '8 Reales Cob Coins (เหรียญเงินตัดมุมก้นขนมปัง)', 'Silver Macuquinas'],
    technology: 'กังหันพลังน้ำจากอ่างเก็บน้ำบนเทือกเขาแอนดีส และแท่นปั๊มลูกกลิ้งไม้โอ๊คยักษ์ (Laminadores)',
    history: 'ตั้งอยู่บนระดับความสูงกว่า 4,000 เมตรเหนือระดับน้ำทะเล ใกล้ภูเขาแร่เงิน Cerro Rico ซึ่งผลิตแร่เงินคิดเป็นกว่าครึ่งหนึ่งของผลผลิตเงินทั่วโลกในคริสต์ศตวรรษที่ 16–18 เหรียญ 8 Reales จากที่นี่ถูกขนส่งข้ามมหาสมุทรไปหมุนเวียนทั่วโลก',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-19.5836,-65.7531'
  },
  {
    id: 'mint-lima',
    name: 'Casa Nacional de Moneda, Lima (โรงกษาปณ์ลิมา - เปรู / มาร์ก LIME / LM)',
    country: 'Spain',
    countryTh: 'สเปน',
    flag: '🇵🇪',
    city: 'Lima, Peru (Jirón Junín 791)',
    coordinates: '12.0464° S, 77.0428° W',
    lat: -12.0464,
    lng: -77.0428,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1565',
    status: 'โรงกษาปณ์แห่งแรกในทวีปอเมริกาใต้',
    coinsMinted: ['Spanish 8 Reales Columnarios (ตรา LM)', 'Peruvian Sol Silver Series', 'Gold Escudos'],
    technology: 'ระบบหลอมและรีดแผ่นเงินจากเหมืองแร่ในเปรู สู่แท่นปั๊มกษาปณ์เสาโรมัน',
    history: 'ก่อตั้งโดยอุปราชแห่งเปรูในปี 1565 ถือเป็นโรงกษาปณ์แห่งแรกในอเมริกาใต้ ผลิตเหรียญ 8 Reales เสาค้ำโลก Columnarios ที่ใช้สัญลักษณ์ LM หมุนเวียนในตลาดการค้าระหว่างประเทศและเป็นที่ยอมรับอย่างกว้างขวางในเอเชีย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-12.0464,-77.0428'
  },

  // 14. Mexico
  {
    id: 'mint-mexico-city',
    name: 'Casa de Moneda de México (โรงกษาปณ์เม็กซิโกซิตี - มาร์ก Mo / Oldest in Americas)',
    country: 'Mexico',
    countryTh: 'เม็กซิโก',
    flag: '🇲🇽',
    city: 'Mexico City, Mexico (Paseo de la Reforma / Apartado St)',
    coordinates: '19.4326° N, 99.1332° W',
    lat: 19.4326,
    lng: -99.1332,
    tagColor: '#16a34a',
    founded: 'ค.ศ. 1535',
    status: 'โรงกษาปณ์ที่เก่าแก่ที่สุดในทวีปอเมริกา (กว่า 490 ปี)',
    coinsMinted: ['Spanish Empire 8 Reales Columnarios 1732–1772 (ตรา Mo)', 'Mexican 8 Reales Cap & Rays (เหรียญนกเม็กซิโก 1823–1897)', 'Centenario 50 Pesos Gold Coin', 'Libertad Silver Series'],
    technology: 'แท่นปั๊มลูกกลิ้งสกรู (Screw Press) รุ่นแรกของทวีปอเมริกา และเครื่องมือขึ้นรูปเหรียญทรงกลมสมบูรณ์แบบ',
    history: 'ก่อตั้งขึ้นตามพระบรมราชโองการของพระเจ้าชาร์ลส์ที่ 5 แห่งสเปน ในปี ค.ศ. 1535 เป็นแหล่งผลิตเหรียญเงิน 8 Reales "Columnarios" (เสาโรมัน) และ "Cap & Rays" (เหรียญนกเม็กซิโก) ที่หมุนเวียนเป็นสกุลเงินสากลของโลกและเป็นต้นกำเนิดของเครื่องหมายดอลลาร์ ($)',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.4326,-99.1332'
  },
  {
    id: 'mint-guanajuato',
    name: 'Casa de Moneda de Guanajuato (โรงกษาปณ์กวานาคัวโต - มาร์ก Go)',
    country: 'Mexico',
    countryTh: 'เม็กซิโก',
    flag: '🇲🇽',
    city: 'Guanajuato, Mexico (Calle de Alonso)',
    coordinates: '21.0190° N, 101.2574° W',
    lat: 21.0190,
    lng: -101.2574,
    tagColor: '#16a34a',
    founded: 'ค.ศ. 1812',
    status: 'โรงกษาปณ์สายแร่เงินวาเลนเซียนา (La Valenciana Silver Mine)',
    coinsMinted: ['Mexican 8 Reales Cap & Rays (มาร์ก Go)', 'Silver Pesos Series'],
    technology: 'แท่นปั๊มกลไกไอน้ำประจำเหมืองเงินที่มั่งคั่งที่สุดแห่งหนึ่งของโลก',
    history: 'ก่อตั้งขึ้นในช่วงสงครามประกาศเอกราชเม็กซิโก ตั้งอยู่ใจกลางแหล่งแร่เงิน La Valenciana ซึ่งผลิตแร่เงินได้ถึง 2 ใน 3 ของผลผลิตเงินทั่วประเทศเม็กซิโก เหรียญที่ปั๊มตรา "Go" ได้รับความนิยมสูงมากในตลาดค้าเงินของจีนและเอเชียตะวันออกเฉียงใต้',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.0190,-101.2574'
  },

  // 15. China
  {
    id: 'mint-tianjin',
    name: 'Tianjin Central Mint (โรงกษาปณ์กลางเทียนจิน - โรงกษาปณ์เป่ยหยาง)',
    country: 'China',
    countryTh: 'จีน',
    flag: '🇨🇳',
    city: 'Tianjin, China (Hedong District / Dazhigu)',
    coordinates: '39.1356° N, 117.2008° E',
    lat: 39.1356,
    lng: 117.2008,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1905',
    status: 'โรงกษาปณ์กลางแห่งรัฐบาลสาธารณรัฐจีน (Central Mint of the Republic of China)',
    coinsMinted: ['Yuan Shih-kai 1 Dollar 1914 (เหรียญหัวโต ยวนซีไข่ ปีที่ 3, 8, 9, 10)', 'Sun Yat-sen Memento Dollar', 'Dragon Dollar Beiyang Series'],
    technology: 'เครื่องจักรปั๊มเหรียญไฟฟ้าสั่งนำเข้าจากเยอรมนีและสหรัฐอเมริกา และแม่พิมพ์แกะสลักโดยช่างอิตาลี Luigi Giorgi (L.GIORGI)',
    history: 'เป็นโรงกษาปณ์หลักในการผลิตเหรียญเงินดอลลาร์ของจีนยุคสาธารณรัฐ แม่พิมพ์ต้นแบบของเหรียญ Yuan Shih-kai 1 Dollar ถูกแกะสลักขึ้นที่นี่โดยหัวหน้าช่างแกะสลักชาวอิตาลี Luigi Giorgi ก่อนส่งต่อไปยังโรงกษาปณ์หนานจิงและอู่ชางเพื่อผลิตหมุนเวียนทั่วประเทศกว่า 750 ล้านเหรียญ',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=39.1356,117.2008'
  },
  {
    id: 'mint-kwangtung',
    name: 'Kwangtung Mint (โรงกษาปณ์กวางตุ้ง - Canton Mint / โรงกษาปณ์มังกร)',
    country: 'China',
    countryTh: 'จีน',
    flag: '🇨🇳',
    city: 'Guangzhou, Guangdong, China (Yuexiu District)',
    coordinates: '23.1291° N, 113.2644° E',
    lat: 23.1291,
    lng: 113.2644,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1887',
    status: 'โรงกษาปณ์เครื่องจักรกลสมัยใหม่แห่งแรกของจีน (สร้างโดยข้าหลวงจางจือตง)',
    coinsMinted: ['Kwangtung 7 Mace and 2 Candareens Dragon Dollar 1890 (เหรียญมังกรกวางตุ้ง)', 'Kwangtung 1 Mace and 4.4 Candareens (20 Cents)', 'Copper Cash Coins Series'],
    technology: 'เครื่องจักรไอน้ำปั๊มเหรียญกษาปณ์ครบวงจร 90 แท่นปั๊ม สั่งนำเข้าจากบริษัท Ralph Heaton & Sons แห่งเมืองเบอร์มิงแฮม ประเทศอังกฤษ',
    history: 'ริเริ่มก่อตั้งโดยขุนนางปฏิรูป จาง จือตง (Zhang Zhidong) ในรัชสมัยกวางซู่ เพื่อปฏิรูประบบเงินตราจีนให้ทันสมัยทัดเทียมตะวันตก ถือเป็นโรงกษาปณ์ที่ใหญ่ที่สุดในโลกในขณะนั้นด้วยกำลังผลิต 2.7 ล้านเหรียญต่อวัน และเป็นต้นกำเนิดของเหรียญมังกรเงินแท้ที่แพร่หลายไปทั่วเอเชียรวมถึงสยาม',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=23.1291,113.2644'
  },
  {
    id: 'mint-nanjing',
    name: 'Nanjing Mint (โรงกษาปณ์นานกิง / เจียงหนาน - Jiangnan Mint)',
    country: 'China',
    countryTh: 'จีน',
    flag: '🇨🇳',
    city: 'Nanjing, Jiangsu, China',
    coordinates: '32.0603° N, 118.7969° E',
    lat: 32.0603,
    lng: 118.7969,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1897',
    status: 'โรงกษาปณ์สำคัญแห่งลุ่มแม่น้ำแยงซีเกียง',
    coinsMinted: ['Jiangnan Dragon Dollar Series', 'Yuan Shih-kai 1 Dollar (Nanjing Issue)', 'Sun Yat-sen Junk Dollar (เหรียญเรือสำเภา)'],
    technology: 'แท่นปั๊มกษาปณ์นำเข้าจากอังกฤษและสหรัฐอเมริกา',
    history: 'มีบทบาทสำคัญทั้งในยุคปลายราชวงศ์ชิงและยุคสาธารณรัฐจีน ผลิตเหรียญเงินมังกรเจียงหนาน (Jiangnan Dragon) ที่มีตัวอักษรบอกปีนักษัตร รวมถึงผลิตเหรียญเรือสำเภา Sun Yat-sen Junk Dollar และเหรียญยวนซีไข่หัวโต',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=32.0603,118.7969'
  },

  // 16. Japan
  {
    id: 'mint-osaka',
    name: 'Japan Mint, Osaka (โรงกษาปณ์โอซาก้า ประเทศญี่ปุ่น)',
    country: 'Japan',
    countryTh: 'ญี่ปุ่น',
    flag: '🇯🇵',
    city: 'Osaka, Japan (1-1-79 Temma, Kita-ku)',
    coordinates: '34.6976° N, 135.5226° E',
    lat: 34.6976,
    lng: 135.5226,
    tagColor: '#dc2626',
    founded: 'ค.ศ. 1871',
    status: 'โรงกษาปณ์สมัยใหม่แห่งยุคปฏิรูปเมจิ (Meiji Restoration)',
    coinsMinted: ['Japan 1 Yen Silver Meiji Era 1870–1914 (เหรียญเงิน 1 เยนมังกรญี่ปุ่น)', 'Trade Dollar 420 Grains (เหรียญการค้าโบเอกิ)', 'Gold Yen 1871–1897', 'เหรียญกษาปณ์หมุนเวียนญี่ปุ่นปัจจุบัน'],
    technology: 'เครื่องจักรปั๊มเหรียญไอน้ำที่ซื้อต่อมาจากโรงกษาปณ์ฮ่องกง (Hong Kong Mint) และปรับปรุงด้วยวิศวกรรมญี่ปุ่นชั้นเลิศ',
    history: 'ก่อตั้งขึ้นในรัชสมัยจักรพรรดิเมจิ เพื่อปฏิรูประบบเงินตราโบราณเข้าสู่ระบบทศนิยมสากล (เยน) โดยซื้อเครื่องจักรทั้งหมดจากโรงกษาปณ์ฮ่องกงที่ปิดตัวลง ผลิตเหรียญมังกร 1 เยนเงินแท้ 90% ซึ่งมีลายมังกรญี่ปุ่นอุ้มแก้วสารพัดนึกอันวิจิตรงดงาม ได้รับการยอมรับอย่างสูงในการค้าสากลแถบเอเชียตะวันออก',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=34.6976,135.5226'
  },

  // 17. India
  {
    id: 'mint-bombay',
    name: 'India Government Mint, Mumbai (โรงกษาปณ์บอมเบย์ - มาร์ก B / จุด)',
    country: 'India',
    countryTh: 'อินเดีย',
    flag: '🇮🇳',
    city: 'Mumbai (Bombay), Maharashtra, India (Shahid Bhagat Singh Rd)',
    coordinates: '18.9322° N, 72.8364° E',
    lat: 18.9322,
    lng: 72.8364,
    tagColor: '#ea580c',
    founded: 'ค.ศ. 1829',
    status: 'โรงกษาปณ์ศูนย์กลางการค้าแห่งบริติชราช (British Raj)',
    coinsMinted: ['British Trade Dollar 1895–1935 (มาร์ก B / จุด)', 'British India 1 Rupee Victoria Empress 1877–1901 (มาร์ก B / จุด)', 'Straits Settlements 1 Dollar 1903–1904 (มาร์ก B)', 'Gold Sovereigns 1918 (มาร์ก I)'],
    technology: 'แท่นปั๊มกษาปณ์ไอน้ำขนาดใหญ่ของบริษัท Boulton & Watt และเตาหลอมเงินบริสุทธิ์มาตรฐานอังกฤษ',
    history: 'เป็นโรงกษาปณ์หลักในการผลิตเหรียญการค้า British Trade Dollar (เหรียญบริทาเนีย) และ Straits Settlements Dollar (ดอลลาร์ช่องแคบมะละกา) เพื่อใช้ขับเคลื่อนระบบเศรษฐกิจและการค้าระหว่างประเทศแถบสิงคโปร์ มาลายา ฮ่องกง และสยาม',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=18.9322,72.8364'
  },
  {
    id: 'mint-calcutta',
    name: 'India Government Mint, Kolkata (โรงกษาปณ์กัลกัตตา - มาร์ก C / Alipore)',
    country: 'India',
    countryTh: 'อินเดีย',
    flag: '🇮🇳',
    city: 'Kolkata (Calcutta), West Bengal, India (Strand Road / Alipore)',
    coordinates: '22.5186° N, 88.3308° E',
    lat: 22.5186,
    lng: 88.3308,
    tagColor: '#ea580c',
    founded: 'ค.ศ. 1757',
    status: 'โรงกษาปณ์แห่งแรกของบริษัทอินเดียตะวันออก (East India Company)',
    coinsMinted: ['British India 1 Rupee Victoria Empress 1877–1901 (มาร์ก C / ไม่มีมาร์ก)', 'British Trade Dollar (มาร์ก C)', 'Straits Settlements 1 Dollar (มาร์ก C)', 'William IV & Victoria Queen 1 Rupee'],
    technology: 'แท่นปั๊มไอน้ำ Watt Steam Mint ค.ศ. 1831 และแม่พิมพ์แกะสลักลายพรรณพฤกษามาตรฐานจักรวรรดิอังกฤษ',
    history: 'ก่อตั้งขึ้นหลังยุทธการที่ปลาซี (Battle of Plassey 1757) เป็นโรงกษาปณ์หลักในการผลิตเหรียญรูปีเงิน (One Rupee) ของสมเด็จพระราชินีนาถวิกตอเรียในฐานะ "จักรพรรดินีแห่งอินเดีย" (Kaisar-i-Hind) หมุนเวียนทั่วชมพูทวีป ตะวันออกกลาง และภาคใต้ของไทย',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=22.5186,88.3308'
  },

  // 18. Thailand
  {
    id: 'mint-thailand',
    name: 'Royal Thai Mint (โรงกษาปณ์สิทธิการ / โรงกษาปณ์ไทย)',
    country: 'Thailand',
    countryTh: 'ไทย',
    flag: '🇹🇭',
    city: 'Bangkok / Pathum Thani, Thailand (พระบรมมหาราชวัง / คลองหลวง รังสิต)',
    coordinates: '14.0158° N, 100.6158° E',
    lat: 14.0158,
    lng: 100.6158,
    tagColor: '#0284c7',
    founded: 'ค.ศ. 1860',
    status: 'โรงกษาปณ์หลวงแห่งราชอาณาจักรไทย (ตั้งแต่สมัยรัชกาลที่ 4)',
    coinsMinted: ['เหรียญเงินบรรณาการ รัชกาลที่ 4', 'เหรียญเงินช้างสามเศียร หนวด รัชกาลที่ 5', 'เหรียญเงินหนึ่งบาท รัชกาลที่ 6', 'เหรียญกษาปณ์หมุนเวียนและที่ระลึกของไทย'],
    technology: 'เครื่องจักรปั๊มเหรียญด้วยแรงดันไอน้ำพระราชทานจากสมเด็จพระราชินีนาถวิกตอเรียแห่งอังกฤษ สู่เทคโนโลยีระบบอัตโนมัติความเร็วสูงในปัจจุบัน',
    history: 'พระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัว (รัชกาลที่ 4) ทรงโปรดเกล้าฯ ให้สร้าง "โรงกระสาปน์สิทธิการ" ขึ้นในพระบรมมหาราชวังเมื่อปี พ.ศ. 2403 เพื่อยกเลิกการใช้เงินพดด้วงและผลิตเหรียญกษาปณ์กลมแบนตามมาตรฐานสากล ต่อมาได้พัฒนาและย้ายที่ทำการสู่โรงกษาปณ์รังสิตในสังกัดกรมธนารักษ์ กระทรวงการคลัง',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.0158,100.6158'
  },

  // 19. New Zealand
  {
    id: 'mint-waitangi-nz',
    name: 'Reserve Bank of New Zealand / Royal Mint (เวลลิงตัน)',
    country: 'New Zealand',
    countryTh: 'นิวซีแลนด์',
    flag: '🇳🇿',
    city: 'Wellington, New Zealand (2 The Terrace)',
    coordinates: '41.2865° S, 174.7762° E',
    lat: -41.2865,
    lng: 174.7762,
    tagColor: '#059669',
    founded: 'ค.ศ. 1934',
    status: 'ธนาคารกลางและผู้ควบคุมการผลิตเหรียญกษาปณ์แห่งนิวซีแลนด์',
    coinsMinted: ['1935 New Zealand Waitangi Crown 5 Shillings (สนธิสัญญาไวตังกิ - ผลิตเพียง 1,128 เหรียญ)', '1940 Centennial Half Crown', 'เหรียญกษาปณ์เงินนิวซีแลนด์'],
    technology: 'แม่พิมพ์ปั๊มพิเศษ Proof Finish และการควบคุมคุณภาพเหรียญที่ระลึกระดับราชสำนัก',
    history: 'ก่อตั้งขึ้นเพื่อดูแลระบบการเงินของนิวซีแลนด์ โดยมอบหมายให้ Royal Mint ลอนดอนปั๊มเหรียญ 1935 Waitangi Crown เพื่อเฉลิมฉลองสนธิสัญญาไวตังกิ (Treaty of Waitangi 1840) ระหว่างมงกุฎอังกฤษกับชนเผ่าเมารี ถือเป็นเหรียญมงกุฎที่หายากและเป็นที่ต้องการสูงสุดของนิวซีแลนด์',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-41.2865,174.7762'
  }
];

// ----------------------------------------------------
// 🌓 THEME MANAGER (LIGHT / DARK MODE)
// ----------------------------------------------------
let currentTheme = localStorage.getItem('coin_center_theme') || 'light';

function initTheme() {
  currentTheme = localStorage.getItem('coin_center_theme') || 'light';
  applyTheme(currentTheme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('coin_center_theme', currentTheme);
  applyTheme(currentTheme);
  showToast(currentTheme === 'dark' ? '🌙 สลับเป็นธีมมืด (Dark Mode)' : '☀️ สลับเป็นธีมสว่าง (Light Mode)');
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  const iconEl = document.getElementById('theme-icon');
  const textEl = document.getElementById('theme-text');
  if (iconEl) iconEl.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (textEl) textEl.textContent = theme === 'dark' ? 'ธีมสว่าง' : 'ธีมมืด';
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initApp();
});

async function initApp() {
  initTheme();
  setupNavigation();
  setupFilters();
  setupMintSearch();
  renderAuthHeader();
  renderPresetChips();
  await loadNetworkInfo();
  await loadCoins();
  initLeafletMap();
  renderMintExplorer();
}

// Helper to determine National Flag Background CSS class
function getCountryFlagClass(country) {
  const c = (country || '').toLowerCase().trim();
  if (c.includes('indochina') || c.includes('france') || c.includes('french') || c.includes('ฝรั่งเศส') || c.includes('อินโดจีน')) return 'flag-bg-france';
  if (c.includes('china') || c.includes('จีน') || c.includes('chinese')) return 'flag-bg-china';
  if (c.includes('canada') || c.includes('แคนาดา')) return 'flag-bg-canada';
  if (c.includes('germany') || c.includes('prussia') || c.includes('เยอรมัน') || c.includes('ปรัสเซีย')) return 'flag-bg-germany';
  if (c.includes('switzerland') || c.includes('สวิตเซอร์แลนด์') || c.includes('สวิส')) return 'flag-bg-switzerland';
  if (c.includes('russia') || c.includes('russian') || c.includes('รัสเซีย') || c.includes('โรมานอฟ')) return 'flag-bg-russia';
  if (c.includes('italy') || c.includes('อิตาลี')) return 'flag-bg-italy';
  if (c.includes('netherlands') || c.includes('เนเธอร์แลนด์') || c.includes('ฮอลแลนด์') || c.includes('dutch')) return 'flag-bg-netherlands';
  if (c.includes('belgium') || c.includes('เบลเยียม')) return 'flag-bg-belgium';
  if (c.includes('austria') || c.includes('ออสเตรีย') || c.includes('habsburg')) return 'flag-bg-austria';
  if (c.includes('spain') || c.includes('spanish') || c.includes('สเปน')) return 'flag-bg-spain';
  if (c.includes('australia') || c.includes('ออสเตรเลีย')) return 'flag-bg-australia';
  if (c.includes('united states') || c.includes('usa') || c.includes('อเมริกา') || c.includes('america')) return 'flag-bg-usa';
  if (c.includes('japan') || c.includes('ญี่ปุ่น')) return 'flag-bg-japan';
  if (c.includes('mexico') || c.includes('เม็กซิโก')) return 'flag-bg-mexico';
  if (c.includes('singapore') || c.includes('สิงคโปร์')) return 'flag-bg-singapore';
  if (c.includes('uae') || c.includes('united arab emirates') || c.includes('เอมิเรตส์') || c.includes('อาหรับ') || c.includes('ras al')) return 'flag-bg-uae';
  if (c.includes('straits') || c.includes('สเตรทส์') || c.includes('malaya')) return 'flag-bg-straits';
  if (c.includes('india') || c.includes('อินเดีย')) return 'flag-bg-india';
  if (c.includes('united kingdom') || c.includes('uk') || c.includes('อังกฤษ') || c.includes('britain')) return 'flag-bg-uk';
  if (c.includes('new zealand') || c.includes('นิวซีแลนด์') || c.includes('nz')) return 'flag-bg-nz';
  if (c.includes('thailand') || c.includes('ไทย') || c.includes('siam') || c.includes('สยาม')) return 'flag-bg-thailand';
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
  if (mode === 'all' && !isVipSupporter()) {
    showToast('🔒 คลังข้อมูลเหรียญทั้งหมด (36 รายการ) สงวนสิทธิ์เฉพาะผู้สนับสนุนเว็บไซต์ (199 บ.)');
    openRegisterModal();
    return;
  }

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

let isCountrySubmenuOpen = false;

// Render Dynamic Preset Chips (Home 5 Thai Coins, All 27 Coins, Rare Key Dates)
function renderPresetChips() {
  const container = document.getElementById('hero-preset-chips-list');
  if (!container) return;

  const isVip = isVipSupporter();
  const totalCoins = globalCoinsData.length || 36;

  const mainChips = [
    { id: 'home', label: '🏠 หน้าแรก (นิยมในไทย 5 เหรียญ)', isFree: true },
    { id: 'all', label: `📂 ทั้งหมด (${totalCoins} เหรียญ)`, isFree: false },
    { id: 'rare', label: '⭐ ปีหายาก (Key Dates)', isFree: false }
  ];

  // Sync nav & hero stats
  const navTotalCoins = document.getElementById('nav-total-coins');
  if (navTotalCoins) navTotalCoins.textContent = totalCoins;
  const heroTotalCoins = document.getElementById('hero-total-coins');
  if (heroTotalCoins) heroTotalCoins.textContent = totalCoins;

  let html = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      ${mainChips.map(p => {
        const isActive = activePreset === p.id;
        const lockIcon = (!isVip && !p.isFree) ? ' <span style="font-size:0.75rem; opacity:0.8;">🔒</span>' : '';
        return `<button class="dribbble-chip ${isActive ? 'active' : ''}" onclick="handlePresetClick('${p.id}')">${p.label}${lockIcon}</button>`;
      }).join('')}
    </div>
  `;

  container.innerHTML = html;
}

function handleMainPresetClick(presetId) {
  handlePresetClick(presetId);
}

// Handle Preset Click with VIP Access Check
function handlePresetClick(preset) {
  const isVip = isVipSupporter();
  if (preset !== 'home' && !isVip) {
    showToast('🔒 หมวดหมู่นี้สงวนสิทธิ์เฉพาะผู้สนับสนุนเว็บไซต์ (199 บ.)');
    openRegisterModal();
    return;
  }
  setQuickPreset(preset);
}

// Quick Preset Filters
function setQuickPreset(preset) {
  activePreset = preset;
  activeCoverflowIndex = 0; // Reset to 1st coin
  renderPresetChips();

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

// Helper to get filtered coins list (Constrained to 5 Thai coins for non-VIP)
function getFilteredCoins() {
  const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase();
  const isVip = isVipSupporter();

  const THAI_FEATURED_IDS = [
    'coin-fr-indochina-piastre',
    'coin-uk-trade-dollar',
    'coin-cn-yuan-shih-kai-dollar',
    'coin-cn-kwangtung-dragon-dollar',
    'coin-mx-8-reales'
  ];

  // Non-VIP users or Home preset is STRICTLY restricted to the 5 Thai coins
  let sourceCoins = globalCoinsData;
  if (!isVip || activePreset === 'home') {
    sourceCoins = globalCoinsData.filter(c => c.popularInThailand === true || THAI_FEATURED_IDS.includes(c.id));
  }

  let filtered = sourceCoins.filter(c => {
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
    } else if (activePreset === 'rare') {
      matchPreset = (c.rarity || '').includes('Rare') || (c.rarity || '').includes('Legendary') || (c.rarity || '').includes('Key Date') || (c.rarity || '').includes('MYTHIC') || (c.rarity || '').includes('EPIC');
    }

    return matchSearch && matchPreset;
  });

  if (activePreset === 'home' || !isVip) {
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

function getCoinImgUrl(url) {
  if (!url) return '/images/default-coin.svg';
  if (url.startsWith('data:') || url.startsWith('http')) return url;
  return url + (url.includes('?') ? '&' : '?') + 'v=3';
}

function createCoverflowCardHtml(coin, index, posClass) {
  const weight = getWeightText(coin);
  const mintage = coin.mintage || 'ไม่ระบุ';
  const composition = getCompositionText(coin);
  const flagBgClass = getCountryFlagClass(coin.country);
  const mainImage = getCoinImgUrl(coin.obverseImage || coin.image);
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
    imgEl.src = getCoinImgUrl(newSide === 'obv' ? obv : rev);
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

function renderMintFilterChips() {
  const chipsContainer = document.getElementById('mint-filter-chips');
  if (!chipsContainer) return;

  const countryCounts = {};
  const countryFlags = {};
  const countryThNames = {};

  worldMintsData.forEach(m => {
    countryCounts[m.country] = (countryCounts[m.country] || 0) + 1;
    countryFlags[m.country] = m.flag;
    countryThNames[m.country] = m.countryTh;
  });

  let html = `
    <button class="dribbble-chip ${activeMintCountry === 'all' ? 'active' : ''}" onclick="filterMintsByCountry('all')">
      🌐 ทั่วโลก (${worldMintsData.length} แห่ง)
    </button>
  `;

  Object.keys(countryCounts).forEach(c => {
    const activeClass = activeMintCountry.toLowerCase() === c.toLowerCase() ? 'active' : '';
    html += `
      <button class="dribbble-chip ${activeClass}" onclick="filterMintsByCountry('${c}')">
        ${countryFlags[c]} ${countryThNames[c]} (${countryCounts[c]})
      </button>
    `;
  });

  chipsContainer.innerHTML = html;
}

function updateMintSummaryStats() {
  const totalMintsEl = document.getElementById('stat-total-mints');
  const totalCountriesEl = document.getElementById('stat-total-countries');
  const oldestMintEl = document.getElementById('stat-oldest-mint');
  const totalCatalogCoinsEl = document.getElementById('stat-total-catalog-coins');

  const uniqueCountries = new Set(worldMintsData.map(m => m.country));
  
  if (totalMintsEl) totalMintsEl.textContent = `${worldMintsData.length} แห่ง`;
  if (totalCountriesEl) totalCountriesEl.textContent = `${uniqueCountries.size} ประเทศ`;
  if (oldestMintEl) oldestMintEl.textContent = 'ค.ศ. 864';
  if (totalCatalogCoinsEl) totalCatalogCoinsEl.textContent = `${globalCoinsData.length || 36} รายการ`;
}

function filterMintsByCountry(country) {
  activeMintCountry = country;
  renderMintFilterChips();
  renderMintExplorer();
}

function renderMintExplorer() {
  renderMintFilterChips();
  updateMintSummaryStats();

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

  const weight = coin.exactWeightG || getWeightText(coin);
  const mintage = coin.mintage || 'ไม่ระบุ';
  const composition = coin.exactPurity || getCompositionText(coin);
  const flagBgClass = getCountryFlagClass(coin.country);
  const obv = getCoinImgUrl(coin.obverseImage || coin.image);
  const historyText = coin.historyText || coin.description || 'ไม่มีข้อมูลประวัติศาสตร์';
  const isVip = isVipSupporter();

  // 1. Thai Local Market Price (Visible to All Users)
  const thaiPriceHtml = `
    <div class="modal-section-card modal-thai-price-card">
      <div class="modal-card-tag-green">
        🇹🇭 <span>ราคาซื้อขายพื้นฐานในประเทศไทย (Thai Market Price)</span>
      </div>
      <div class="modal-thai-price-val">
        ${coin.thaiMarketPrice || coin.marketPriceRange || '2,500 – 6,500 บาท (ตามสภาพ)'}
      </div>
    </div>
  `;

  // 2. Deep VIP Insights (Key Observations, Authenticity Guide, International Price, World Auction Records, Key Dates, Live Verification Links)
  const deepInsightsRawHtml = `
    <div class="modal-section-card modal-vip-insights-card">
      ${(isVip && currentUser) ? `
      <div class="modal-vip-badge-pill">
        👑 <span>ข้อมูลจริงปลดล็อกครบถ้วน (สำหรับ คุณ ${currentUser.name || ''} - ${currentUser.memberCode || ''})</span>
      </div>
      ` : ''}

      <!-- Key Observations & Minting Points -->
      ${coin.keyObservations ? `
      <div class="modal-sub-box modal-key-observations-box">
        <div class="modal-sub-box-title modal-title-orange">
          🔍 <span>จุดสังเกตเฉพาะเหรียญ &amp; ตำหนิแม่พิมพ์แท้ (Key Observations)</span>
        </div>
        <div class="modal-sub-box-content modal-text-orange">
          ${coin.keyObservations}
        </div>
      </div>
      ` : ''}

      <!-- 5-Step Counterfeit & Authenticity Guide -->
      ${coin.authenticityGuide ? `
      <div class="modal-sub-box modal-auth-guide-box">
        <div class="modal-sub-box-title modal-title-green">
          🛡️ <span>วิธีเช็คแท้-ปลอม 5 ขั้นตอน &amp; เสียงกังวาน (Authenticity &amp; Ping Test Guide)</span>
        </div>
        <div class="modal-sub-box-content modal-text-green">
          ${coin.authenticityGuide}
        </div>
      </div>
      ` : ''}

      <!-- Counterfeit Risk Rating -->
      ${coin.counterfeitRisk ? `
      <div class="modal-sub-box modal-counterfeit-risk-box">
        <span style="font-size:1.1rem;">⚠️</span>
        <div class="modal-counterfeit-text">
          <b>ความเสี่ยงการปลอมแปลงในตลาด:</b> ${coin.counterfeitRisk}
        </div>
      </div>
      ` : ''}

      <!-- International Market Price -->
      <div class="modal-insight-row">
        <div class="modal-insight-label modal-label-blue">
          🌐 <span>ราคาซื้อขายในตลาดต่างประเทศ (International Market)</span>
        </div>
        <div class="modal-insight-val modal-val-blue">
          ${coin.internationalPrice || '$150 – $450 USD'}
        </div>
      </div>

      <!-- World Auction Record Price -->
      <div class="modal-insight-row">
        <div class="modal-insight-label modal-label-purple">
          🔨 <span>สถิติราคาประมูลสูงสุดระดับโลก (Auction Records)</span>
        </div>
        <div class="modal-insight-val modal-val-purple">
          ${coin.auctionRecord || 'ประมูลจบระดับสากลที่ Heritage / Stacks Bowers'}
        </div>
      </div>

      <!-- Key Dates & Sought After Years -->
      ${coin.soughtAfterYears ? `
      <div class="modal-insight-row">
        <div class="modal-insight-label modal-label-orange">
          ⭐ <span>ปีที่นักสะสมตามหา &amp; บล็อกลับ (Key Dates / Sought-After Years)</span>
        </div>
        <div class="modal-insight-val modal-val-orange">
          ${coin.soughtAfterYears}
        </div>
      </div>
      ` : ''}

      <!-- Live Verification Reference Links -->
      ${coin.referenceSources && coin.referenceSources.length ? `
      <div style="margin-top:0.75rem;">
        <div class="modal-insight-label modal-label-teal" style="margin-bottom:0.45rem;">
          🔗 <span>แหล่งข้อมูลอ้างอิงจริง กดตามไปดูข้อมูลกษาปณ์ (Live Verification Links)</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          ${coin.referenceSources.map(ref => `
            <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="modal-reference-link">
              <span>🌐 ${ref.name}</span>
              <span class="modal-ref-arrow">เปิดดูข้อมูลจริง ↗</span>
            </a>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  `;

  let deepInsightsBlockHtml = '';
  if (isVip) {
    deepInsightsBlockHtml = `<div style="margin-bottom:1.25rem;">${deepInsightsRawHtml}</div>`;
  } else {
    deepInsightsBlockHtml = `
      <div class="vip-blur-wrapper">
        <div class="vip-blur-content">
          ${deepInsightsRawHtml}
        </div>
        <div class="vip-blur-overlay">
          <div class="vip-lock-icon">🔒</div>
          <div class="vip-lock-title">จุดสังเกตแม่พิมพ์, วิธีเช็คแท้-ปลอม, ราคาต่างชาติ และสถิติประมูล สงวนสิทธิ์เฉพาะผู้สนับสนุน</div>
          <div class="vip-lock-sub">
            สมัครสมาชิก 199 บาท (โอนเข้าบัญชี SCB 4190025841 ศรัณย์ทองขวัญ) เพื่อปลดล็อกจุดสังเกตเก๊-แท้ครบทุกมิติ และลิงก์ตรวจเช็กจริง
          </div>
          <div class="vip-lock-actions">
            <button class="pill-btn btn-vip-cta" onclick="closeModal('modal-coin-detail'); openRegisterModal();">✨ สมัครสมาชิก (199 บ.)</button>
            <button class="pill-btn btn-vip-login" onclick="closeModal('modal-coin-detail'); openLoginModal();">🔑 เข้าสู่ระบบ</button>
          </div>
        </div>
      </div>
    `;
  }

  modalBody.innerHTML = `
    <div style="text-align:center; margin-bottom:1.5rem;" id="modal-img-container" data-side="obv">
      <div class="card-image-wrapper ${flagBgClass}" style="height:200px; max-width:240px; margin:0 auto 1rem auto; cursor:pointer;" onclick="toggleModalCoinSide('${coin.id}')">
        <img id="modal-coin-img-element" src="${obv}" style="width:140px; height:140px; object-fit:contain; filter:drop-shadow(0 12px 28px rgba(0,0,0,0.45)); transition:transform 0.25s ease;" alt="${coin.name}">
        <div id="modal-side-badge" style="position:absolute; bottom:0.6rem; background:rgba(30,39,46,0.9); backdrop-filter:blur(8px); color:#fff; padding:0.35rem 0.85rem; border-radius:9999px; font-size:0.75rem; font-weight:800; border:1px solid rgba(255,255,255,0.2);">
          🔄 ด้านหน้า (แตะเพื่อสลับเป็นด้านหลัง)
        </div>
      </div>

      <h2 class="modal-coin-title">${coin.name}</h2>
    </div>

    <!-- Key Dates & Low Mintage Rare Alert Banner -->
    ${coin.keyDatesInfo ? `
    <div class="modal-keydates-banner">
      ${coin.keyDatesInfo}
    </div>
    ` : ''}

    <!-- Specs Grid with Accurate Purity, Weight, Size & Edge -->
    <div class="modal-specs-grid">
      <div class="spec-grid-item spec-grid-full">
        <div class="spec-grid-label">🧪 เปอร์เซ็นต์เนื้อโลหะบริสุทธิ์ตามจริง</div>
        <div class="spec-grid-val spec-grid-blue">${composition}</div>
      </div>
      <div class="spec-grid-item">
        <div class="spec-grid-label">⚖️ น้ำหนักมาตรฐานแท้</div>
        <div class="spec-grid-val spec-grid-gold">${weight}</div>
      </div>
      <div class="spec-grid-item">
        <div class="spec-grid-label">📏 ขนาด &amp; ความหนา</div>
        <div class="spec-grid-val">${coin.exactDiameterMm || '-'} (หนา ${coin.exactThicknessMm || '-'})</div>
      </div>
      <div class="spec-grid-item">
        <div class="spec-grid-label">⚙️ ลายขอบเหรียญ (Edge)</div>
        <div class="spec-grid-val">${coin.edgeDescription || 'ขอบเฟืองตรง'}</div>
      </div>
      <div class="spec-grid-item">
        <div class="spec-grid-label">🪙 จำนวนผลิต (Mintage)</div>
        <div class="spec-grid-val spec-grid-green">${mintage}</div>
      </div>
      <div class="spec-grid-item spec-grid-full">
        <div class="spec-grid-label">🏛️ โรงกษาปณ์ที่ผลิต</div>
        <div class="spec-grid-val">${coin.mint || 'ไม่ระบุ'}</div>
      </div>
    </div>

    <!-- Mint History Section -->
    ${coin.mintHistory ? `
    <div class="modal-mint-history-box">
      <div class="modal-mint-history-title">
        🏛️ <span>ประวัติโรงกษาปณ์ (${coin.mint || 'โรงกษาปณ์ต้นกำเนิด'})</span>
      </div>
      <div class="modal-mint-history-body">${coin.mintHistory}</div>
      ${coin.mintLocation ? `<div class="modal-mint-location">📍 ที่ตั้ง/พิกัด: ${coin.mintLocation}</div>` : ''}
    </div>
    ` : ''}

    <!-- Historical Background Section from DATA.txt & Archives -->
    <div class="modal-history-box">
      <div class="modal-history-title">
        📜 <span>ประวัติศาสตร์กษาปณ์ (จาก DATA.txt)</span>
      </div>
      <div class="modal-history-body">${historyText}</div>
    </div>

    <!-- Section 1: Thai Local Market Price (Visible to All) -->
    ${thaiPriceHtml}

    <!-- Section 2: Deep VIP Insights (International Price, Auction Records, Key Dates, Live Links) -->
    ${deepInsightsBlockHtml}

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
    imgEl.src = getCoinImgUrl(newSide === 'obv' ? obv : rev);
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
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');

  if (!el.hasAttribute('data-backdrop-bound')) {
    el.setAttribute('data-backdrop-bound', 'true');
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        closeModal(id);
      }
    });
  }
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

  renderPresetChips();
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
