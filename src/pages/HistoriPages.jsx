import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncomeServices } from '../services/IncomeService';

function HistoriPages(){
    const navigate = useNavigate();

    const [historiData, setHistoriData] = useState([]);

    const loadHistoriData = useCallback(async () => {
      console.log("1. Fungsi loadHistoriData dipanggil...");
        try {
            const resHistori = await IncomeServices.getAllData();
            console.log("data histori : ", resHistori)
            setHistoriData(resHistori);
        } catch (error) {
            console.error("Gagal Load Data Histori", error)
        }
    },[])

    useEffect(() => {
      console.log("useEffect jalan...");
        loadHistoriData()
    },[loadHistoriData])

    const handleDelete = async (id) => {
      const isConfirmed = window.confirm("Apkah anda yakin untuk menghapus transaksi ini? ");

      if(isConfirmed){
        try {
          await IncomeServices.deleteTransaction(id);
          alert("Transaksi Berhasil Di Hapus");

          setHistoriData(prevData => prevData.filter(item => item.id !== id))
        } catch (error) {
          console.error("Gagal hapus data:", error);
        alert("Gagal menghapus data, periksa koneksi atau database.");
        }
      }
    }

    return (
    <div className="min-h-screen bg-[#F3F4F6] font-['Roboto'] p-[20px] flex flex-col items-center">
      <div className="w-full max-w-[393px] flex flex-col gap-[20px]">
        
        {/* Logo Section */}
        <div className="flex justify-center py-4">
          <img src="/logo-material.png" alt="AG Material" className="h-10" />
        </div>

        {/* Container Card Putih */}
        <div className="bg-white rounded-[20px] shadow-sm p-[24px] flex flex-col gap-[20px]">
          <h2 className="text-[18px] font-bold text-[#1F2937] text-center mb-2">Histori Transaksi</h2>

          {/* MULAI LOOPING DATA */}
          {historiData.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-[12px]">
              
              {/* Data Rows */}
              <div className="flex flex-col gap-[8px] text-[15px]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Nama Truck</span>
                  <span className="text-[#6B7280]">{item.truckName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Material</span>
                  <span className="text-[#6B7280]">{item.materialName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Harga Beli</span>
                  <span className="text-[#16A34A] font-medium">Rp {(item.buyPrice || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Harga Jual</span>
                  <span className="text-[#16A34A] font-medium">Rp {(item.sellPrice || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Jumlah</span>
                  <span className="text-[#6B7280] font-medium">{item.quantity.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Pengeluaran</span>
                  <span className="text-[#DC2626] font-medium">Rp {(item.expensesAmount || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-[#6B7280]">Total Harga</span>
                  <span className="text-[#16A34A]">Rp {(item.totalPrice || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Tombol Aksi - Menggunakan ID Tersembunyi */}
              <div className="flex flex-col gap-[8px] mt-2">
                <button 
                  onClick={() => navigate(`/update/${item.id}`)}
                  className="w-full py-[8px] bg-[#2563EB1A] text-[#2563EB] rounded-[4px] font-bold text-[14px]"
                >
                  Update
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="w-full py-[8px] bg-[#DC26261A] text-[#DC2626] rounded-[4px] font-bold text-[14px]"
                >
                  Delete
                </button>
              </div>

              {/* Divider antar item, kecuali item terakhir */}
              {index !== historiData.length - 1 && (
                <hr className="border-[#E5E7EB] my-4" />
              )}
            </div>
          ))}
        </div>

        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate('/')}
          className="w-full py-[12px] bg-[#2563EB] text-white rounded-[8px] font-bold text-[16px] shadow-lg active:scale-[0.98] transition"
        >
          Kembali
        </button>

      </div>
    </div>
  );

  
}

export default HistoriPages;