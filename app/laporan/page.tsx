// app/laporan/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

interface StokAwal {
  id: number;
  nama: string;
  jumlah: number;
  satuan: string;
  kategori: string;
}

interface Sisa {
  id: number;
  nama: string;
  jumlah: number;
  satuan: string;
  kategori: string;
}

interface LaporanItem {
  id: string;
  tanggal: string;
}

export default function LaporanPage() {
  const [stokAwal, setStokAwal] = useState<StokAwal[]>([]);
  const [sisa, setSisa] = useState<Sisa[]>([]);
  const [laporanList, setLaporanList] = useState<LaporanItem[]>([]);
  const [filtered, setFiltered] = useState<LaporanItem[]>([]);
  const [selected, setSelected] = useState<LaporanItem | null>(null);

  const [detail, setDetail] = useState<
    { nama: string; stok_awal: number; sisa: number; penggunaan: number }[]
  >([]);

  const tableRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // load stok_awal & sisa
  useEffect(() => {
    const load = async () => {
      try {
        const sAwal = await (await fetch("/api/stok_awal")).json();
        const sSisa = await (await fetch("/api/sisa")).json();

        setStokAwal(sAwal || []);
        setSisa(sSisa || []);
      } catch (e) {
        console.error("Gagal load data:", e);
      }
    };
    load();
  }, []);

  // generate dummy laporan (example)
  useEffect(() => {
    const today = new Date();
    const dummy: LaporanItem[] = [];

    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const format =
        String(date.getDate()).padStart(2, "0") +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        date.getFullYear();

      dummy.push({ id: "L" + (i + 1), tanggal: format });
    }

    setLaporanList(dummy);
    setFiltered(dummy);
  }, []);

  // filter hari
  const applyFilter = (hari: number | "all") => {
    if (hari === "all") return setFiltered(laporanList);

    const today = new Date();

    const f = laporanList.filter((lap) => {
      const [d, m, y] = lap.tanggal.split("-");
      const t = new Date(Number(y), Number(m) - 1, Number(d));
      const diff = Math.floor((today.getTime() - t.getTime()) / 86400000);
      return diff <= hari;
    });

    setFiltered(f);
  };

  // hitung detail laporan (dipanggil saat popup dibuka)
  const openDetail = (lap: LaporanItem) => {
    setSelected(lap);

    const dt = stokAwal.map((item) => {
      const s = sisa.find((x) => x.nama === item.nama);
      const sisaJml = s ? s.jumlah : 0;

      return {
        nama: item.nama,
        stok_awal: Number(item.jumlah ?? 0),
        sisa: Number(sisaJml ?? 0),
        penggunaan: Number((Number(item.jumlah ?? 0) - Number(sisaJml ?? 0)) || 0),
      };
    });

    setDetail(dt);
  };

  // export PDF (multi-page)
  const exportPDF = async () => {
    if (!tableRef.current || !chartRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    // optional: add logo jika tersedia (pastikan path valid)
    // const logo = "/logooyako.jpg";
    // pdf.addImage(logo, "JPEG", 10, 10, 25, 25);

    pdf.setFontSize(16);
    pdf.text("Laporan Harian Warung Oyako", 14, 18);
    pdf.setFontSize(12);
    pdf.text(`Tanggal: ${selected?.tanggal}`, 14, 26);

    // PAGE 1 - table
    const tableCanvas = await html2canvas(tableRef.current, { scale: 2 });
    const tableImg = tableCanvas.toDataURL("image/png");
    const pageWidth = 190; // mm (A4 width minus margins)
    let imgHeight = (tableCanvas.height * pageWidth) / tableCanvas.width;
    pdf.addImage(tableImg, "PNG", 10, 34, pageWidth, imgHeight);

    // PAGE 2 - charts (both charts inside chartRef)
    pdf.addPage();
    const chartCanvas = await html2canvas(chartRef.current, { scale: 2 });
    const chartImg = chartCanvas.toDataURL("image/png");
    imgHeight = (chartCanvas.height * pageWidth) / chartCanvas.width;
    pdf.addImage(chartImg, "PNG", 10, 20, pageWidth, imgHeight);

    pdf.save(`Laporan-${selected?.tanggal}.pdf`);
  };

  // chart data (bar)
  const chartData = {
    labels: detail.map((d) => d.nama),
    datasets: [
      {
        label: "Stok Awal",
        data: detail.map((d) => d.stok_awal),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
      {
        label: "Sisa",
        data: detail.map((d) => d.sisa),
        backgroundColor: "rgba(255, 206, 86, 0.8)",
      },
      {
        label: "Pemakaian",
        data: detail.map((d) => d.penggunaan),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
    ],
  };

  // pie data (persentase pemakaian)
  const piePercentages: number[] = detail.map((d) =>
    d.stok_awal > 0 ? Math.round(((d.penggunaan / d.stok_awal) * 100 + Number.EPSILON) * 100) / 100 : 0
  );

  const pieData = {
    labels: detail.map((d) => d.nama),
    datasets: [
      {
        label: "Persentase Pemakaian (%)",
        data: piePercentages,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#66CC66",
          "#C9CBCF",
          "#8DD3C7",
          "#B3DE69",
        ],
      },
    ],
  };

  // chart options (simple)
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { mode: "index" as const, intersect: false },
    },
    interaction: { mode: "nearest" as const, intersect: false },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const v = context.raw ?? 0;
            return `${context.label}: ${v}%`;
          },
        },
      },
    },
  };

  // ---------------- UI -----------------
  return (
    <div className="max-w-6xl mx-auto bg-white p-6 shadow rounded-lg">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Laporan</h1>

        <div className="flex gap-3">
          <button onClick={() => applyFilter("all")} className="px-3 py-2 bg-gray-300 rounded">
            Semua
          </button>
          <button onClick={() => applyFilter(3)} className="px-3 py-2 bg-gray-300 rounded">
            3 Hari
          </button>
          <button onClick={() => applyFilter(7)} className="px-3 py-2 bg-gray-300 rounded">
            7 Hari
          </button>
          <button onClick={() => applyFilter(14)} className="px-3 py-2 bg-gray-300 rounded">
            14 Hari
          </button>
        </div>
      </div>

      {/* TABLE LIST */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Tanggal</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((lap) => (
            <tr key={lap.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{lap.id}</td>
              <td className="py-3 px-4">{lap.tanggal}</td>
              <td className="py-3 px-4">
                <button onClick={() => openDetail(lap)} className="px-4 py-1 bg-blue-500 text-white rounded">
                  Tampil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* POPUP */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[820px] shadow-lg max-h-[95vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Detail Laporan — {selected.tanggal}</h2>

            {/* PDF PAGE 1: TABEL */}
            <div ref={tableRef} className="bg-white p-3">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3">Nama</th>
                    <th className="py-2 px-3">Stok Awal</th>
                    <th className="py-2 px-3">Sisa</th>
                    <th className="py-2 px-3">Pemakaian</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.map((d) => (
                    <tr key={d.nama} className="border-b">
                      <td className="py-2 px-3">{d.nama}</td>
                      <td className="py-2 px-3">{d.stok_awal}</td>
                      <td className="py-2 px-3">{d.sisa}</td>
                      <td className="py-2 px-3">{d.penggunaan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PDF PAGE 2: GRAFIK (Bar + Pie) */}
            <div ref={chartRef} className="bg-white mt-6 p-3">
              <h3 className="text-xl font-semibold mb-3">Grafik Stok & Pemakaian</h3>
              <div>
                <Bar data={chartData} options={barOptions} />
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Persentase Pemakaian</h3>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between mt-6">
              <button onClick={exportPDF} className="px-4 py-2 bg-green-600 text-white rounded">
                Export PDF
              </button>

              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-red-500 text-white rounded">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
