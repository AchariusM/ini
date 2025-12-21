// Simple seed for laporan table with dummy transaksi data.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const toISO = (dateStr, timeStr) => {
  // dateStr: "2025-11-24", timeStr: "12:45"
  return new Date(`${dateStr}T${timeStr || "00:00"}:00`).toISOString();
};

const transaksi = [
  { judul: "TRX #2025001", tanggal: "2025-11-24", waktu: "12:45", total: 121000, note: "Dine-in" },
  { judul: "TRX #2025002", tanggal: "2025-11-24", waktu: "19:10", total: 89000, note: "Takeaway" },
  { judul: "TRX #2025003", tanggal: "2025-11-23", waktu: "11:20", total: 56000, note: "Dine-in" },
  { judul: "TRX #2025004", tanggal: "2025-11-22", waktu: "09:05", total: 99000, note: "Catering" },
  { judul: "TRX #2025005", tanggal: "2025-11-21", waktu: "18:35", total: 76500, note: "Dine-in" },
  { judul: "TRX #2025006", tanggal: "2025-11-20", waktu: "14:10", total: 64200, note: "Takeaway" },
  { judul: "TRX #2025007", tanggal: "2025-11-19", waktu: "10:50", total: 145000, note: "Event" },
  { judul: "TRX #2025008", tanggal: "2025-11-18", waktu: "16:30", total: 81750, note: "Dine-in" },
  { judul: "TRX #2025009", tanggal: "2025-11-17", waktu: "08:40", total: 52500, note: "Breakfast" },
  { judul: "TRX #2025010", tanggal: "2025-11-16", waktu: "20:05", total: 147050, note: "Takeaway" },
];

const menuItems = [
  // Pakai nasi
  { nama: "Gyudon", harga: 39000, kategori: "Pakai Nasi" },
  { nama: "Omurice", harga: 29000, kategori: "Pakai Nasi" },
  { nama: "Katsudon", harga: 37000, kategori: "Pakai Nasi" },
  { nama: "Oyakodon", harga: 26000, kategori: "Pakai Nasi" },
  { nama: "Nasi katsu ayam", harga: 26000, kategori: "Pakai Nasi" },
  { nama: "Nasi katsu dori", harga: 28000, kategori: "Pakai Nasi" },
  { nama: "Nasi karage ayam", harga: 25000, kategori: "Pakai Nasi" },
  { nama: "Nasi karage dori", harga: 27000, kategori: "Pakai Nasi" },
  { nama: "Nasi kare Jepang", harga: 25000, kategori: "Pakai Nasi" },
  { nama: "Nasi katsu kare ayam", harga: 34000, kategori: "Pakai Nasi" },
  { nama: "Nasi katsu kare dori", harga: 37000, kategori: "Pakai Nasi" },
  { nama: "Nasi karage kare ayam", harga: 32000, kategori: "Pakai Nasi" },
  { nama: "Nasi karage kare dori", harga: 35000, kategori: "Pakai Nasi" },

  // Yakitori (isi 4 per porsi)
  { nama: "Kawa", harga: 22000, kategori: "Yakitori", deskripsi: "Isi 4 per porsi" },
  { nama: "Tsukune", harga: 24000, kategori: "Yakitori", deskripsi: "Isi 4 per porsi" },
  { nama: "Momo", harga: 24000, kategori: "Yakitori", deskripsi: "Isi 4 per porsi" },
  { nama: "Mix yakitori", harga: 23000, kategori: "Yakitori", deskripsi: "Isi 4 per porsi" },

  // Snack
  { nama: "Gyoza", harga: 20000, kategori: "Snack", deskripsi: "Isi 4 per porsi" },
  { nama: "Tamagoyaki", harga: 18000, kategori: "Snack", deskripsi: "Isi 8 potong per porsi" },
  { nama: "Katsu ala carte ayam", harga: 20000, kategori: "Snack" },
  { nama: "Katsu ala carte dori", harga: 22000, kategori: "Snack" },
  { nama: "Karage ayam", harga: 21000, kategori: "Snack" },
  { nama: "Karage dori", harga: 23000, kategori: "Snack" },

  // Minuman & dessert
  { nama: "Ocha", harga: 5000, kategori: "Minuman" },
  { nama: "Es teh", harga: 5000, kategori: "Minuman" },
  { nama: "Es jeruk nipis", harga: 10000, kategori: "Minuman" },
  { nama: "Es teh jeruk nipis", harga: 12000, kategori: "Minuman" },
  { nama: "Air putih", harga: 4000, kategori: "Minuman" },
  { nama: "Air mineral botol", harga: 8000, kategori: "Minuman" },
  { nama: "Purrin", harga: 16000, kategori: "Dessert" },
];

const feedbacks = [
  { nama: "Andi", email: "andi@example.com", rating: 5, pesan: "Rasa gyudon mantap, porsi pas." },
  { nama: "Budi", email: "budi@example.com", rating: 4, pesan: "Yakitori kawa favorit, layanan cepat." },
  { nama: "Citra", email: "citra@example.com", rating: 4, pesan: "Omurice enak, mungkin bisa tambah saus." },
  { nama: "Dedi", email: "dedi@example.com", rating: 5, pesan: "Katsudon gurih dan crunchy." },
  { nama: "Eka", email: "eka@example.com", rating: 3, pesan: "Es teh jeruk nipis kurang dingin." },
  { nama: "Fina", email: "fina@example.com", rating: 4, pesan: "Karage ayam renyah, harga ok." },
  { nama: "Gilang", email: "gilang@example.com", rating: 5, pesan: "Pelayanan ramah, tempat nyaman." },
  { nama: "Hani", email: "hani@example.com", rating: 4, pesan: "Purrin manisnya pas, recommended." },
  { nama: "Indra", email: "indra@example.com", rating: 5, pesan: "Katsu kare ayam juara!" },
  { nama: "Joko", email: "joko@example.com", rating: 3, pesan: "Gyoza kurang panas saat datang." },
  { nama: "Kiki", email: "kiki@example.com", rating: 4, pesan: "Es jeruk nipis segar, harga ok." },
  { nama: "Lia", email: "lia@example.com", rating: 5, pesan: "Oyakodon comforting food." },
  { nama: "Mira", email: "mira@example.com", rating: 4, pesan: "Mix yakitori enak buat sharing." },
  { nama: "Niko", email: "niko@example.com", rating: 3, pesan: "Karage dori sedikit asin." },
  { nama: "Ovi", email: "ovi@example.com", rating: 5, pesan: "Omurice fluffy, worth it." },
  { nama: "Putra", email: "putra@example.com", rating: 4, pesan: "Nasi katsu ayam porsinya besar." },
  { nama: "Qory", email: "qory@example.com", rating: 5, pesan: "Pelayanan cepat walau ramai." },
  { nama: "Rama", email: "rama@example.com", rating: 4, pesan: "Katsu ala carte dori lembut." },
  { nama: "Sari", email: "sari@example.com", rating: 5, pesan: "Suka ambience dan musiknya." },
  { nama: "Tito", email: "tito@example.com", rating: 3, pesan: "Es teh sedikit terlalu manis." },
];

async function main() {
  for (const trx of transaksi) {
    await prisma.laporan.deleteMany({ where: { judul: trx.judul } });
    await prisma.laporan.create({
      data: {
        judul: trx.judul,
        rangkuman: JSON.stringify({ total: trx.total, note: trx.note }),
        periodeMulai: toISO(trx.tanggal, trx.waktu),
        dibuatOleh: "Seeder",
      },
    });
  }
  console.log(`Seeded ${transaksi.length} transaksi.`);

  const names = menuItems.map((m) => m.nama);
  await prisma.menuItem.deleteMany({ where: { nama: { in: names } } });
  await prisma.menuItem.createMany({ data: menuItems });
  console.log(`Seeded ${menuItems.length} menu items.`);

  await prisma.feedback.deleteMany({
    where: { email: { in: feedbacks.map((f) => f.email) } },
  });
  await prisma.feedback.createMany({ data: feedbacks });
  console.log(`Seeded ${feedbacks.length} feedback.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
