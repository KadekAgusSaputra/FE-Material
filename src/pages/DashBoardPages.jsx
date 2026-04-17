import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncomeServices } from '../services/IncomeService';

function DashBoardPages(){
    const navigate = useNavigate();

    const [dataLaporan, setDataLaporan] = useState([]);

    const loadDataLaporan = useCallback(async () => {
        try {
            const resLaporan = await IncomeServices.getDataDashBoard();
            setDataLaporan(resLaporan);
        } catch (error) {
            console.error("Gagal load data",error)
        }
    },[])

    useEffect(() => {
        loadDataLaporan();
    },[loadDataLaporan]);

    return (
    <div className="min-h-screen bg-[#F3F4F6] font-['Roboto'] p-[20px] flex flex-col items-center">
      <div className="w-full max-w-[393px] flex flex-col gap-[20px]">
        
        {/* Header Logo */}
        <div className="flex justify-center py-4">
          <img src="/logo-material.png" alt="AG Material" className="h-10" />
        </div>

        {/* Card Putih Utama */}
        <div className="bg-white rounded-[20px] shadow-sm p-[24px] flex flex-col gap-[16px]">
          <h2 className="text-[18px] font-bold text-[#1F2937] text-center mb-4">Laporan Keuangan</h2>

          {/* PROSES LOOPING DATA ARRAY */}
          {dataLaporan.map((item, index) => (
            <div key={item.vehicleId} className="flex flex-col gap-[12px]">
              
              {/* Header Baris (Kendaraan + Badge) */}
              <div className="flex items-center gap-[10px]">
                <span className="text-[16px] font-bold text-[#1F2937]">Kendaraan</span>
                <span className="px-[12px] py-[2px] bg-[#2563EB1A] text-[#2563EB] rounded-[4px] text-[14px] font-medium">
                  {item.truckCategory}
                </span>
              </div>

              {/* Garis Pemisah Tipis */}
              <hr className="border-[#E5E7EB]" />

              {/* List Detail Angka */}
              <div className="flex flex-col gap-[8px] text-[15px]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Nama Truck</span>
                  <span className="text-[#6B7280]">{item.truckName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]"> Pendapatan</span>
                  <span className="text-[#16A34A] font-medium">Rp {item.totalIncome.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Pengeluaran</span>
                  <span className="text-[#DC2626] font-medium">Rp {item.totalExpenses.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold mt-1">
                  <span className="text-[#1F2937]">Hasil Bersih</span>
                  <span className="text-[#16A34A]">Rp {item.profit.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Jangan kasih garis di item terakhir */}
              {index !== dataLaporan.length - 1 && (
                <hr className="border-[#E5E7EB] border-[1px] my-4" />
              )}
            </div>
          ))}
        </div>

        {/* Tombol Kembali (Sticky di bawah atau setelah card) */}
        <button 
          onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
          className="w-full py-[12px] bg-[#2563EB] text-white rounded-[8px] font-bold text-[16px] mt-4 shadow-lg active:scale-[0.98] transition"
        >
          Kembali
        </button>

      </div>
    </div>
  );
}

export default DashBoardPages;