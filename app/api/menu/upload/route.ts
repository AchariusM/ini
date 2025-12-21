import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

type ParsedRow = {
  nama: string;
  harga: number;
  kategori: string;
  deskripsi: string;
  aktif: boolean;
};

const sampleRows: ParsedRow[] = [
  { nama: "Gyudon", harga: 39000, kategori: "Nasi", deskripsi: "Nasi dengan irisan daging sapi.", aktif: true },
  { nama: "Omurice", harga: 29000, kategori: "Nasi", deskripsi: "Nasi goreng dibungkus telur omelet.", aktif: true },
  { nama: "Katsudon", harga: 37000, kategori: "Nasi", deskripsi: "Nasi dengan katsu ayam dan telur.", aktif: true },
  { nama: "Oyakodon", harga: 26000, kategori: "Nasi", deskripsi: "Nasi dengan ayam dan telur lembut.", aktif: true },
  { nama: "Nasi katsu ayam", harga: 26000, kategori: "Nasi", deskripsi: "Nasi dengan katsu ayam.", aktif: true },
  { nama: "Nasi katsu dori", harga: 28000, kategori: "Nasi", deskripsi: "Nasi dengan katsu dori.", aktif: true },
  { nama: "Nasi karage ayam", harga: 25000, kategori: "Nasi", deskripsi: "Nasi dengan karage ayam.", aktif: true },
  { nama: "Nasi karage dori", harga: 27000, kategori: "Nasi", deskripsi: "Nasi dengan karage dori.", aktif: true },
  { nama: "Nasi kare Jepang", harga: 25000, kategori: "Nasi", deskripsi: "Nasi kare khas Jepang.", aktif: true },
  { nama: "Nasi katsu kare ayam", harga: 34000, kategori: "Nasi", deskripsi: "Nasi kare dengan katsu ayam.", aktif: true },
  { nama: "Nasi katsu kare dori", harga: 37000, kategori: "Nasi", deskripsi: "Nasi kare dengan katsu dori.", aktif: true },
  { nama: "Nasi karage kare ayam", harga: 32000, kategori: "Nasi", deskripsi: "Nasi kare dengan karage ayam.", aktif: true },
  { nama: "Nasi karage kare dori", harga: 35000, kategori: "Nasi", deskripsi: "Nasi kare dengan karage dori.", aktif: true },
  { nama: "Kawa", harga: 22000, kategori: "Yakitori", deskripsi: "Yakitori kulit (isi 4 tusuk).", aktif: true },
  { nama: "Tsukune", harga: 24000, kategori: "Yakitori", deskripsi: "Yakitori bakso ayam (isi 4 tusuk).", aktif: true },
  { nama: "Momo", harga: 24000, kategori: "Yakitori", deskripsi: "Yakitori paha ayam (isi 4 tusuk).", aktif: true },
  { nama: "Mix yakitori", harga: 23000, kategori: "Yakitori", deskripsi: "Paket mix yakitori (isi 4 tusuk).", aktif: true },
  { nama: "Gyoza", harga: 20000, kategori: "Snack", deskripsi: "Gyoza isi 4 per porsi.", aktif: true },
  { nama: "Tamagoyaki", harga: 18000, kategori: "Snack", deskripsi: "Tamagoyaki 8 potong per porsi.", aktif: true },
  { nama: "Katsu ala carte ayam", harga: 20000, kategori: "Snack", deskripsi: "Katsu ayam tanpa nasi.", aktif: true },
  { nama: "Katsu ala carte dori", harga: 22000, kategori: "Snack", deskripsi: "Katsu dori tanpa nasi.", aktif: true },
  { nama: "Karage ayam", harga: 21000, kategori: "Snack", deskripsi: "Karage ayam renyah.", aktif: true },
  { nama: "Karage dori", harga: 23000, kategori: "Snack", deskripsi: "Karage dori renyah.", aktif: true },
  { nama: "Ocha", harga: 5000, kategori: "Minuman", deskripsi: "Teh ocha.", aktif: true },
  { nama: "Es teh", harga: 5000, kategori: "Minuman", deskripsi: "Es teh manis.", aktif: true },
  { nama: "Es jeruk nipis", harga: 10000, kategori: "Minuman", deskripsi: "Es jeruk nipis segar.", aktif: true },
  { nama: "Es teh jeruk nipis", harga: 12000, kategori: "Minuman", deskripsi: "Perpaduan teh dan jeruk nipis.", aktif: true },
  { nama: "Air putih", harga: 4000, kategori: "Minuman", deskripsi: "Air mineral gelas.", aktif: true },
  { nama: "Air mineral botol", harga: 8000, kategori: "Minuman", deskripsi: "Air mineral botol.", aktif: true },
  { nama: "Purrin", harga: 16000, kategori: "Minuman", deskripsi: "Puding purrin dingin.", aktif: true },
];

const parseCsv = (text: string) => {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim() !== "");
  if (!lines.length) return { rows: [] as ParsedRow[], errors: ["CSV kosong"] };

  // detect delimiter (comma vs semicolon)
  const firstLine = lines[0];
  const delimiter = firstLine.includes(";") && !firstLine.includes(",") ? ";" : ",";

  const parseLine = (line: string) => {
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur);
    return cells.map((c) => c.trim().replace(/^"|"$/g, ""));
  };

  const header = parseLine(firstLine).map((h) => h.toLowerCase().replace(/^\ufeff/, ""));
  const body = lines.slice(1).map(parseLine);
  const find = (cols: string[], name: string) => cols.indexOf(name);

  const idxNama = find(header, "nama");
  const idxHarga = find(header, "harga");
  const idxKategori = find(header, "kategori");
  const idxDeskripsi = find(header, "deskripsi");
  const idxAktif = find(header, "aktif");

  const toNumber = (raw: string) => {
    if (!raw) return NaN;
    const cleaned = raw
      .replace(/rp/gi, "")
      .replace(/\s+/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  };

  const errors: string[] = [];
  if (idxNama < 0 || idxHarga < 0) {
    errors.push("Header wajib memuat: nama,harga (opsional: kategori,deskripsi,aktif)");
    return { rows: [], errors };
  }

  const rows: ParsedRow[] = [];

  body.forEach((cols, i) => {
    const lineNo = i + 2; // header = line 1
    const nama = idxNama >= 0 ? cols[idxNama] : "";
    const harga = idxHarga >= 0 ? toNumber(cols[idxHarga]) : NaN;
    const kategori = idxKategori >= 0 ? cols[idxKategori] : "";
    const deskripsi = idxDeskripsi >= 0 ? cols[idxDeskripsi] : "";
    const aktifVal = idxAktif >= 0 ? cols[idxAktif] : "";
    const aktif = aktifVal ? aktifVal.toLowerCase() !== "false" && aktifVal !== "0" : true;

    if (!nama || !Number.isFinite(harga)) {
      errors.push(`Baris ${lineNo}: nama/harga tidak valid`);
      return;
    }

    rows.push({ nama, harga, kategori, deskripsi, aktif });
  });

  return { rows, errors };
};

const normalizeJsonPayload = (body: any): ParsedRow[] => {
  if (!Array.isArray(body)) throw new Error("Payload harus array JSON");
  const rows: ParsedRow[] = [];
  body.forEach((b, idx) => {
    const nama = (b.nama ?? "").toString().trim();
    const harga = Number(b.harga);
    const kategori = (b.kategori ?? "").toString().trim();
    const deskripsi = (b.deskripsi ?? "").toString().trim();
    const aktif = b.aktif === false || b.aktif === "false" || b.aktif === 0 || b.aktif === "0" ? false : true;
    if (!nama || !Number.isFinite(harga)) {
      throw new Error(`Baris ${idx + 1}: nama/harga tidak valid`);
    }
    rows.push({ nama, harga, kategori, deskripsi, aktif });
  });
  if (!rows.length) throw new Error("Tidak ada data valid");
  return rows;
};

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const useSample = new URL(req.url).searchParams.get("seed") === "default";

    let rows: ParsedRow[] = [];
    if (useSample) {
      rows = sampleRows;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
      }

      const text = await file.text();
      const parsed = parseCsv(text);
      if (parsed.errors.length) {
        return NextResponse.json({ error: "CSV tidak valid", detail: parsed.errors }, { status: 400 });
      }
      rows = parsed.rows;
    } else {
      const json = await req.json();
      rows = normalizeJsonPayload(json);
    }

    const created = await prisma.menuItem.createMany({
      data: rows.map((r) => ({
        nama: r.nama,
        harga: new Prisma.Decimal(r.harga),
        kategori: r.kategori || null,
        deskripsi: r.deskripsi || null,
        aktif: r.aktif ?? true,
      })),
    });

    return NextResponse.json({ inserted: created.count });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Gagal upload CSV" }, { status: 400 });
  }
}
