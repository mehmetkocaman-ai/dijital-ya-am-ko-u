const { useMemo, useState } = React;
const { createRoot } = ReactDOM;

const palette = {
  primary: '#0A5FA8',
  secondary: '#1C7ED6',
  gold: '#C89B3C',
};

const categories = [
  { id: 'places', title: "Kütahya'da Gezilecek Yerler", icon: '🏛️', text: 'Müzelerden Frig Vadisi rotalarına kadar seçilmiş deneyimler.', href: '#gezilecek-yerler' },
  { id: 'food', title: "Kütahya'da Ne Yenir", icon: '🍲', text: 'Yöresel lezzetler, restoranlar, kahveler ve tatlı durakları.', href: '#ne-yenir' },
  { id: 'districts', title: 'Kütahya İlçeleri', icon: '🧭', text: 'Merkez hariç 12 ilçeyi tarih, kültür ve rota bilgileriyle inceleyin.', href: '#ilceler' },
  { id: 'events', title: 'Kütahya Etkinlikleri', icon: '🎭', text: 'Festival, sergi, tiyatro ve spor etkinliklerini takvimden takip edin.', href: '#etkinlikler' },
];

const placeCategories = ['Müzeler', 'Tarihi Yerler', 'Doğal Güzellikler', 'Camiler', 'Kervansaraylar', 'Şehir Meydanları', 'Mesire Alanları', 'Seyir Noktaları'];
const foodCategories = ['Yöresel Yemekler', 'Restoranlar', 'Kafeler', 'Tatlıcılar', 'Kahvaltı Mekanları', 'Fast Food'];
const eventTypes = ['Konser', 'Festival', 'Tiyatro', 'Sinema', 'Sergi', 'Fuar', 'Çocuk Etkinliği', 'Konferans', 'Organizasyon', 'Spor'];

const places = [
  {
    title: 'Aizanoi Antik Kenti', category: 'Tarihi Yerler', district: 'Çavdarhisar', rating: 4.9, price: 'Müzekart', status: 'Açık',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    description: 'Zeus Tapınağı, antik tiyatro ve stadyum aksıyla Kütahya’nın dünya ölçeğinde kültür mirası.',
    address: 'Çavdarhisar, Kütahya', phone: '+90 274 351 20 03', hours: '08:30 - 19:00', lat: 39.1933, lng: 29.6139,
  },
  {
    title: 'Frig Vadisi', category: 'Doğal Güzellikler', district: 'Merkez', rating: 4.8, price: 'Ücretsiz', status: 'Açık',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    description: 'Peri bacaları, kaya anıtları ve yürüyüş yollarıyla doğa ve tarih odaklı keşif rotası.',
    address: 'Yeni Bosna Köyü çevresi', phone: '+90 274 223 60 10', hours: '24 saat', lat: 39.2691, lng: 30.1444,
  },
  {
    title: 'Kütahya Çinili Camii', category: 'Camiler', district: 'Merkez', rating: 4.7, price: 'Ücretsiz', status: 'Açık',
    image: 'https://images.unsplash.com/photo-1601191362988-ac1ebec629c8?auto=format&fit=crop&w=1200&q=80',
    description: 'Mavi-beyaz çini estetiğini çağdaş mimariyle buluşturan ikonik durak.',
    address: 'Maltepe Mahallesi, Kütahya', phone: '+90 274 223 60 10', hours: 'Namaz vakitleri', lat: 39.4192, lng: 29.9833,
  },
];

const foods = [
  { title: 'Cimcik', category: 'Yöresel Yemekler', district: 'Merkez', range: '₺₺', rating: 4.8, description: 'Sarımsaklı yoğurt ve tereyağıyla servis edilen Kütahya klasiği.', instagram: '@burasikutahya', website: 'burasikutahya.com', lat: 39.419, lng: 29.985 },
  { title: 'Ilıbada Dolması', category: 'Yöresel Yemekler', district: 'Tavşanlı', range: '₺₺', rating: 4.7, description: 'Ekşi-ot aromasıyla yöre sofralarının özel dolma tarifi.', instagram: '@kutahyalezzet', website: 'burasikutahya.com', lat: 39.543, lng: 29.497 },
  { title: 'Gediz Tarhanası', category: 'Kahvaltı Mekanları', district: 'Gediz', range: '₺', rating: 4.6, description: 'Kışlık gelenekten gelen, besleyici ve güçlü aromalı yöresel çorba.', instagram: '@gedizsofrasi', website: 'burasikutahya.com', lat: 38.993, lng: 29.39 },
];

const districts = ['Altıntaş', 'Aslanapa', 'Çavdarhisar', 'Domaniç', 'Dumlupınar', 'Emet', 'Gediz', 'Hisarcık', 'Pazarlar', 'Simav', 'Şaphane', 'Tavşanlı'];
const events = [
  { title: 'Çini ve El Sanatları Festivali', type: 'Festival', date: '2026-08-14', time: '19:30', place: 'Kütahya Kent Meydanı', paid: false, organizer: 'Burası Kütahya Kültür Ekibi' },
  { title: 'Aizanoi Yaz Konserleri', type: 'Konser', date: '2026-08-22', time: '21:00', place: 'Çavdarhisar Antik Tiyatro', paid: true, organizer: 'Kültür Rotası' },
  { title: 'Frig Vadisi Fotoğraf Yürüyüşü', type: 'Spor', date: '2026-09-06', time: '08:00', place: 'Frig Vadisi Başlangıç Noktası', paid: false, organizer: 'Doğa Kulübü' },
];

const adminModules = ['Dashboard', 'Gezilecek Yerler', 'Ne Yenir', 'İlçeler', 'Etkinlikler', 'Medya', 'Kategoriler', 'Kullanıcılar', 'Ayarlar'];
const crudFields = ['Başlık', 'Kapak Fotoğrafı', 'Galeri', 'Açıklama', 'Adres', 'Telefon', 'Google Maps Konumu', 'Youtube Videosu', 'Meta Title', 'Meta Description', 'Keywords', 'Slug'];

const routeUrl = (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

function SectionTitle({ eyebrow, title, text }) {
  return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>;
}

function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Tümü');
  const [eventView, setEventView] = useState('Kart');
  const searchable = useMemo(() => [...places, ...foods, ...events].filter((item) => `${item.title} ${item.category || item.type} ${item.district || item.place}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))), [query]);

  return <main>
    <nav className="topbar"><a className="brand" href="#hero"><span>◆</span> BURASI KÜTAHYA</a><label className="search">⌕<input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Gezilecek yer, yemek, ilçe veya etkinlik ara" /></label><a href="#admin">Admin</a></nav>
    <section id="hero" className="hero"><div className="tile-bg" /><div className="hero-content"><div className="logo-mark">BK</div><h1>BURASI KÜTAHYA</h1><p>“Kütahya'yı Keşfet”</p><div className="hero-cards">{categories.map((c)=><a className="hero-card" href={c.href} key={c.id}><b>{c.icon}</b><h3>{c.title}</h3><small>{c.text}</small></a>)}</div></div></section>
    {query && <section className="panel search-results"><SectionTitle eyebrow="Genel arama" title="Anında sonuçlar" text="Tüm içerikler tek arama deneyiminde listelenir."/><div className="grid cards">{searchable.map((i)=><article className="mini-card" key={i.title}><b>{i.title}</b><span>{i.category || i.type || i.place}</span></article>)}</div></section>}
    <section id="gezilecek-yerler" className="panel"><SectionTitle eyebrow="Keşif" title="Kütahya'da Gezilecek Yerler" text="Yönetim panelinden yönetilecek kategori, galeri, SEO ve rota bilgileriyle zengin içerikler."/><div className="chips">{['Tümü',...placeCategories].map(x=><button onClick={()=>setFilter(x)} className={filter===x?'active':''}>{x}</button>)}</div><div className="grid cards">{places.filter(p=>filter==='Tümü'||p.category===filter).map((p)=><article className="content-card"><img src={p.image}/><div><span>{p.category} • {p.district} • ⭐ {p.rating}</span><h3>{p.title}</h3><p>{p.description}</p><ul><li>Adres: {p.address}</li><li>Telefon: {p.phone}</li><li>Çalışma Saatleri: {p.hours}</li><li>Giriş Ücreti: {p.price}</li></ul><a className="route" target="_blank" href={routeUrl(p.lat,p.lng)}>ROTA OLUŞTUR</a></div></article>)}</div></section>
    <section id="ne-yenir" className="panel blue"><SectionTitle eyebrow="Lezzet" title="Kütahya'da Ne Yenir" text="Menü, fiyat aralığı, sosyal medya, değerlendirme ve konum bilgisi hazır."/><div className="chips light">{foodCategories.map(x=><button>{x}</button>)}</div><div className="grid food-grid">{foods.map(f=><article className="glass"><span>{f.category} • {f.district} • ⭐ {f.rating}</span><h3>{f.title}</h3><p>{f.description}</p><b>{f.range} · Menü · Web: {f.website} · Instagram: {f.instagram}</b><a className="route gold" target="_blank" href={routeUrl(f.lat,f.lng)}>ROTA OLUŞTUR</a></article>)}</div></section>
    <section id="ilceler" className="panel"><SectionTitle eyebrow="12 ilçe" title="Kütahya İlçeleri" text="Her ilçe için tanıtım, tarihçe, nüfus, gezilecek yerler, yemek, etkinlik, galeri, harita, konaklama, restoran ve iletişim alanları."/><div className="district-list">{districts.map((d,idx)=><article><div><b>{String(idx+1).padStart(2,'0')}</b><h3>{d}</h3><p>Germiyan kültürü, yerel üretim, doğa rotaları ve ilçe rehberi modülü.</p></div><a className="route" href={routeUrl(39.4 + idx/100,29.9 + idx/100)} target="_blank">ROTA OLUŞTUR</a></article>)}</div></section>
    <section id="etkinlikler" className="panel"><SectionTitle eyebrow="Takvim" title="Kütahya Etkinlikleri" text="Aylık görünüm, liste görünümü ve kart görünümü destekli etkinlik altyapısı."/><div className="view-tabs">{['Aylık','Liste','Kart'].map(v=><button className={eventView===v?'active':''} onClick={()=>setEventView(v)}>{v} görünüm</button>)}</div><div className={`events ${eventView.toLowerCase()}`}>{events.map(e=><article><span>{e.type} • {e.paid?'Ücretli':'Ücretsiz'}</span><h3>{e.title}</h3><p>{e.date} · {e.time} · {e.place}</p><small>Organizatör: {e.organizer} · Bilet linki ve harita alanı</small><a className="route" target="_blank" href={routeUrl(39.42,29.98)}>ROTA OLUŞTUR</a></article>)}</div><div className="chips">{eventTypes.map(t=><button>{t}</button>)}</div></section>
    <section className="panel map-panel"><SectionTitle eyebrow="Harita" title="Marker, cluster, rota ve konum" text="Google Maps veya OpenStreetMap entegrasyonuna hazır API katmanı."/><div className="map"><span>Aizanoi</span><span>Frig Vadisi</span><span>Çinili Camii</span><div className="route-line" /></div></section>
    <section id="admin" className="admin"><aside>{adminModules.map(m=><a>{m}</a>)}</aside><div><SectionTitle eyebrow="Yönetim Paneli" title="Responsive Admin Console" text="RBAC, JWT/NextAuth, Prisma/PostgreSQL, medya ve SEO yönetimine uygun ölçeklenebilir mimari."/><div className="admin-grid"><article><h3>CRUD Modülleri</h3><p>Gezilecek yerler, lezzetler, ilçeler ve etkinlikler için oluşturma, düzenleme, silme ve yayınlama iş akışları.</p></article><article><h3>Medya Yönetimi</h3><p>WebP, otomatik yeniden boyutlandırma, sürükle bırak ve çoklu yükleme ekranları.</p></article><article><h3>SEO & PWA</h3><p>Schema.org, Open Graph, Twitter Cards, XML sitemap, robots.txt, breadcrumb, canonical URL ve offline kabiliyet.</p></article></div><div className="form-mock">{crudFields.map(f=><label>{f}<input placeholder={`${f} girin`} /></label>)}</div></div></section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
