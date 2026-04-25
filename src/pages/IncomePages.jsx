import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncomeServices } from '../services/IncomeService';

function IncomePages() {
  const navigate = useNavigate();
  
  // State untuk data tunggal (Summary)
  const [laporan, setLaporan] = useState({ totalIncome: 0, totalExpenses: 0, profit: 0 });
  const [latestTrans, setLatestTrans] = useState({});

  const loadAllData = useCallback(async () => {
    try {
      // Fetch Laporan
      const resLaporan = await IncomeServices.getDataLaporan();
      setLaporan(resLaporan);

      // Fetch Histori (Ambil indeks 0)
      const resHistori = await IncomeServices.getAllData();
      if (resHistori && resHistori.length > 0) {
        setLatestTrans(resHistori[0]);
      }
    } catch (err) {
      console.error("Gagal load data:", err);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    // Body: Background F3F4F6, Font Roboto, Padding 20px (Gambar 1)
    <div className="min-h-screen bg-[#F3F4F6] font-['Roboto'] p-[20px] flex flex-col items-center">
      
      {/* Container Utama dengan Gap 40px (Gambar 1) */}
      <div className="w-full max-w-[393px] flex flex-col gap-[40px]">
        
        {/* Logo Section */}
        <div className="flex justify-center py-4">
           <img src="/logo-material.png" alt="AG Material" className="h-12" />
        </div>

        {/* --- CARD LAPORAN KEUANGAN (Gambar 2 & 3) --- */}
        <div className="bg-white rounded-[8px] p-[16px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex flex-col gap-[10px]">
          <h2 className="text-[18px] font-bold text-[#1F2937] text-center mb-2">Laporan Keuangan</h2>
          
          <div className="flex justify-between items-center text-[16px]">
            <span className="text-[#6B7280]">Pendapatan</span>
            <span className="font-medium text-[#16A34A]">Rp {laporan.totalIncome?.toLocaleString('id-ID')}</span>
          </div>
          
          <div className="flex justify-between items-center text-[16px]">
            <span className="text-[#6B7280]">Pengeluaran</span>
            <span className="font-medium text-[#DC2626]">Rp {laporan.totalExpenses?.toLocaleString('id-ID')}</span>
          </div>
          
          <div className="flex justify-between items-center text-[16px] font-bold border-t pt-2">
            <span className="text-[#1F2937]">Hasil Bersih</span>
            <span className="text-[#16A34A]">Rp {laporan.profit?.toLocaleString('id-ID')}</span>
          </div>

          <button 
            onClick={() => navigate('/laporan-detail')}
            className="w-full mt-2 py-[8px] bg-[#2563EB1A] text-[#2563EB] rounded-[4px] font-bold text-[14px] hover:bg-[#2563EB26] transition"
          >
            Detail Laporan
          </button>
        </div>

        {/* --- CARD HISTORI TRANSAKSI (Gambar 2 & 3) --- */}
        <div className="bg-white rounded-[8px] p-[16px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex flex-col gap-[10px]">
          <h2 className="text-[18px] font-bold text-[#1F2937] text-center mb-2">Histori Transaksi</h2>
          
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-[#6B7280]">Nama Truck</span>
            <span className="text-[#1F2937]">{latestTrans.truckName || '-'}</span>
          </div>
          
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-[#6B7280]">Material</span>
            <span className="text-[#1F2937]">{latestTrans.materialName || '-'}</span>
          </div>

          <div className="flex justify-between items-center text-[14px]">
            <span className="text-[#6B7280]">Harga Beli</span>
            <span className="text-[#DC2626] font-medium">Rp {latestTrans.buyPrice?.toLocaleString('id-ID')}</span>
          </div>
          
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-[#6B7280]">Harga Jual</span>
            <span className="text-[#16A34A] font-medium">Rp {latestTrans.sellPrice?.toLocaleString('id-ID')}</span>
          </div>

          <div className="flex justify-between items-center text-[14px]">
            <span className="text-[#6B7280]">Jumlah</span>
            <span className="text-[#1F2937]">{latestTrans.quantity}</span>
          </div>

          <div className="flex justify-between items-center text-[14px]">
            <span className="text-[#6B7280]">Pengeluaran</span>
            <span className="text-[#DC2626] font-medium">Rp {latestTrans.expensesAmount?.toLocaleString('id-ID') || 0}</span>
          </div>

          <div className="flex justify-between items-center text-[16px] font-bold border-t pt-2 text-[#16A34A]">
            <span className="text-[#1F2937]">Total Harga</span>
            <span>Rp {latestTrans.totalPrice?.toLocaleString('id-ID')}</span>
          </div>

          <button 
            onClick={() => navigate('/history')}
            className="w-full mt-2 py-[8px] bg-[#2563EB1A] text-[#2563EB] rounded-[4px] font-bold text-[14px] hover:bg-[#2563EB26] transition"
          >
            Detail Transaksi
          </button>
        </div>

        {/* Tombol Tambah Transaksi (Primary Blue) */}
        <button 
          onClick={() => navigate('/create')}
          className="w-full py-[12px] bg-[#2563EB] text-white rounded-[8px] font-bold text-[16px] shadow-lg active:scale-[0.98] transition"
        >
          Tambah Transaksi
        </button>

      </div>
    </div>
  );
}

export default IncomePages;