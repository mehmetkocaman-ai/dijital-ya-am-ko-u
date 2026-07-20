# Burası Kütahya

Modern, minimal ve premium görsel dile sahip Kütahya turizm ve şehir rehberi prototipi.

## Özellikler

- Fullscreen hero, çini motifli SVG arka plan ve dört ana keşif kartı
- Gezilecek yerler, yeme-içme, ilçeler, etkinlik takvimi ve rota butonları
- Genel arama, kategori filtreleri, etkinlik görünüm seçenekleri
- Harita marker/cluster/rota alanı için entegrasyon hazır UI
- Responsive yönetim paneli, CRUD, medya, SEO, PWA ve RBAC mimarisi ekranları
- SEO meta etiketleri, Open Graph, Twitter Card, canonical ve Schema.org

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

## Build

```bash
npm run build
```

## Hedef Üretim Mimarisi

Proje arayüzü; Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, TanStack Query, React Hook Form, Zod, Prisma, PostgreSQL ve NextAuth ile genişletilecek modüler mimariye uygun tasarlanmıştır.
