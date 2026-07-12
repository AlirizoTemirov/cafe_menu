# Cafe Kassa — Online Menyu va Sotuv Tizimi

Kofexona kassiri uchun mobil-birinchi veb-ilova: menyuni ko'rish, savatga
mahsulot qo'shish, to'lov turini tanlash, buyurtmani saqlash va sotuvlar
tarixi/foydani kuzatish.

**Texnologiyalar:** Next.js 14 (App Router) · Supabase (DB + Storage) ·
Tailwind CSS · Zustand

---

## 1. Supabase loyihasini sozlash

1. [supabase.com](https://supabase.com) da yangi loyiha yarating.
2. Loyiha ichida **SQL Editor** ga kiring, `supabase/schema.sql` faylidagi
   kodni to'liq nusxalab, **Run** tugmasini bosing. Bu barcha jadvallarni
   (categories, products, orders, order_items), xavfsizlik siyosatlarini
   (RLS) va rasm saqlash uchun `product-images` nomli Storage bucket'ni
   avtomatik yaratadi.
3. **Project Settings > API** bo'limidan quyidagilarni oling:
   - `Project URL`
   - `anon public` kalit

## 2. Loyihani ishga tushirish

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` faylini ochib, Supabase'dan olingan qiymatlarni kiriting:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

So'ng ishga tushiring:

```bash
npm run dev
```

Brauzerda `http://localhost:3000` ni oching. Telefon rejimini ko'rish uchun
brauzer dev-tools'dagi "mobile view" dan foydalaning, yoki telefoningizni
kompyuter bilan bir Wi-Fi'ga ulab, `http://<kompyuter-IP>:3000` orqali kiring.

## 3. Ilova tuzilishi

- **`/` — Menyu** — kategoriyalar bo'yicha mahsulotlar, ko'zcha bosilganda
  katta rasm + tarkibi + `+/-` bilan savatga qo'shish modali. Pastda suzuvchi
  "Savat" tugmasi (jami summa bilan) — bosilganda chek-ko'rinishidagi savat
  ochiladi: mahsulotlar jadvali (soni, birlik narxi, jami), to'lov turi
  (Karta / Naqd / Ikkalasi ham — aralash to'lovda kartaga tushgan summani
  qo'lda kiritasiz, qolgani avtomatik naqdga hisoblanadi) va **Saqlash**
  tugmasi — bosilganda buyurtma Supabase'ga yoziladi.
- **`/sales` — Sotuvlar** — kunlar bo'yicha guruhlangan barcha buyurtmalar,
  har birini ochib mahsulotlarni ko'rish mumkin. Yuqorida jami tushum,
  sof foyda, kartadan/naqddan tushgan summalar ko'rsatiladi.
- **`/admin` — Boshqaruv** — mahsulot va kategoriya qo'shish/tahrirlash/
  o'chirish. Mahsulot qo'shishda rasm galereyadan tanlanadi (fayl input) va
  avtomatik Supabase Storage'ga yuklanadi.

## 4. Muhim eslatmalar

- Hozirgi holatda ilova login talab qilmaydi (bitta kassa uchun soddalashtirilgan).
  Agar bir nechta xodim/filial bo'lsa, keyinchalik Supabase Auth qo'shib,
  RLS siyosatlarini xodimga bog'lash mumkin.
- **Tannarx** (cost_price) maydoni sof foydani hisoblash uchun kerak — har bir
  mahsulot qo'shilganda uni to'ldirishni unutmang, aks holda sof foyda sotuv
  narxiga teng chiqadi.
- Loyihani Vercel'ga bepul deploy qilish mumkin: GitHub'ga push qiling,
  vercel.com'da import qiling, `.env.local` dagi ikkita o'zgaruvchini
  Vercel Environment Variables'ga qo'shing.
