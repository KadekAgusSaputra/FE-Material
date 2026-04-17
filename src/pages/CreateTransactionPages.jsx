import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncomeServices } from '../services/IncomeService';

function CreateTransactionPages() {
  const navigate = useNavigate();

  // --- STATE ---
  const [vehicles, setVehicles] = useState([]); 
  const [prices, setPrices] = useState([]);     
  const [selectedPrice, setSelectedPrice] = useState(0);

  const [formData, setFormData] = useState({
    vehicleId: '',
    materialName: '',
    quantity: 1,
    expensesDescription: '',
    expensesAmount: '',
    transactionDate: new Date().toLocaleDateString('en-CA')
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await IncomeServices.getVehicle();
        setVehicles(data);
      } catch (err) {
        console.error("Gagal load kendaraan:", err);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadPrices = async () => {
      if (formData.vehicleId) {
        try {
          const data = await IncomeServices.getPriceMaterial(formData.vehicleId);
          setPrices(data);
          // Reset pilihan material & harga saat ganti truck
          setFormData(prev => ({ ...prev, materialName: '' }));
          setSelectedPrice(0);
        } catch (err) {
          console.error("Gagal load harga:", err);
        }
      }
    };
    loadPrices();
  }, [formData.vehicleId]);

    const handleVehicleChange = (e) => {
    setFormData({ 
      ...formData, 
      vehicleId: e.target.value,
      materialName: '', // Reset jika user ganti truck secara manual
    });
    setSelectedPrice(0);
  };

  // --- HANDLERS ---
  const handleMaterialChange = (e) => {
    const name = e.target.value;
    const match = prices.find(p => p.materialName === name);
    const harga = match ? match.amount : 0;
    setSelectedPrice(harga);
    setFormData({ ...formData, materialName: name });
  };

const handleQty = (type) => {
  const currentQty = parseFloat(formData.quantity) || 0;
  const step = 0.25;

  if (type === 'up') {
    // Batasi maksimal misal 20
    if (currentQty < 20) {
      setFormData(prev => ({ ...prev, quantity: currentQty + step }));
    }
  } else if (type === 'down') {
    // Batasi minimal 0.25, biar gak minus
    if (currentQty > step) {
      setFormData(prev => ({ ...prev, quantity: currentQty - step }));
    }
  }
};

  const handleSubmit = async () => {
    if (!formData.vehicleId || !formData.materialName) {
      alert("Lengkapi data dulu, Gus!");
      return;
    }

    try {
      const payload = {
        vehicleId: parseInt(formData.vehicleId),
        materialName: formData.materialName,
        quantity: formData.quantity,
        transactionDate: formData.transactionDate,
        expensesDescription: formData.expensesDescription || '',
        expensesAmount: formData.expensesAmount ? parseFloat(formData.expensesAmount) : 0
      };

      await IncomeServices.createTransaction(payload);
      alert("Berhasil Simpan Transaksi!");
      navigate('/history'); 
    } catch (err) {
      console.error(err);
      alert("Gagal simpan ke database");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-[20px] flex justify-center font-['Roboto']">
      <div className="w-full max-w-[393px] flex flex-col gap-[16px]">
        
        {/* CARD UTAMA */}
        <div className="bg-white rounded-[20px] shadow-sm p-[24px] flex flex-col gap-[16px]">
          <h2 className="text-center font-bold text-[18px] text-[#1F2937]">Form Transaksi</h2>

          {/* Nama Truck */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Nama Truck :</label>
            <select 
              className="w-full p-[12px] bg-[#F3F4F6] rounded-[8px] font-medium outline-none text-[#1F2937]"
              value={formData.vehicleId}
              onChange={handleVehicleChange}
            >
              <option value="">Pilih Sopir</option>
              {vehicles?.map(v => (
                <option key={v.id} value={v.id}>{v.truckName}</option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Material :</label>
            <select 
              className="w-full p-[12px] bg-[#F3F4F6] rounded-[8px] font-medium outline-none text-[#1F2937]"
              value={formData.materialName}
              disabled={!prices.length}
              onChange={handleMaterialChange}
            >
              <option value="">Pilih Material</option>
              {prices?.map((p, i) => (
                <option key={i} value={p.materialName}>{p.materialName}</option>
              ))}
            </select>
          </div>

          {/* Harga Satuan (Read Only) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Harga :</label>
            <div className="w-full p-[12px] bg-[#E5E7EB] rounded-[8px] text-[#6B7280] text-center font-medium">
              Rp {selectedPrice.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Jumlah :</label>
            <div className="flex items-center gap-[10px]">
              <button onClick={() => handleQty('down')} className="flex-1 py-[10px] bg-[#DBEafe] text-[#2563EB] rounded-[8px] font-bold">-</button>
              <div className="flex-[2] text-center font-bold text-[18px]">{formData.quantity}</div>
              <button onClick={() => handleQty('up')} className="flex-1 py-[10px] bg-[#2563EB] text-white rounded-[8px] font-bold">+</button>
            </div>
          </div>

          {/* Total Harga (Otomatis) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Total Harga :</label>
            <div className="w-full p-[12px] bg-[#E5E7EB] rounded-[8px] text-[#16A34A] font-bold text-center text-[18px]">
              Rp {(selectedPrice * formData.quantity).toLocaleString('id-ID')}
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="flex flex-col gap-[6px]">
  <label className="text-[#6B7280] text-[14px]">Pengeluaran :</label>
  <div className="relative">
    <span className="absolute left-[12px] top-[12px] text-[#6B7280] font-bold">Rp</span>
    <input 
      type="text" // 1. Ubah ke text agar bisa menampilkan titik
      placeholder="0"
      className="w-full p-[12px] pl-[40px] bg-[#F3F4F6] rounded-[8px] font-bold outline-none text-[#1F2937]"
      
      value={formData.expensesAmount ? Number(formData.expensesAmount).toLocaleString('id-ID') : ''} 
      
      onChange={(e) => {
        const rawValue = e.target.value.replace(/\./g, '');

        if (!isNaN(rawValue) || rawValue === '') {
          setFormData({...formData, expensesAmount: rawValue});
        }
      }}
    />
  </div>
</div>

          {/* Deskripsi Pengeluaran */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Keterangan Pengeluaran :</label>
            <input 
              type="text"
              placeholder="Bensin, Ban, dll"
              className="w-full p-[12px] bg-[#F3F4F6] rounded-[8px] outline-none"
              value={formData.expensesDescription}
              onChange={(e) => setFormData({...formData, expensesDescription: e.target.value})}
            />
          </div>

          {/* Tanggal */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Tanggal :</label>
            <input 
              type="date"
              className="w-full p-[12px] bg-[#F3F4F6] rounded-[8px] outline-none"
              value={formData.transactionDate}
              onChange={(e) => setFormData({...formData, transactionDate: e.target.value})}
            />
          </div>

          {/* Tombol Simpan */}
          <button 
            onClick={handleSubmit}
            className="w-full py-[14px] bg-[#DBEafe] text-[#2563EB] font-bold rounded-[8px] mt-[8px] hover:bg-[#d0e4ff] transition-all"
          >
            Simpan
          </button>
        </div>

        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate('/')}
          className="w-full py-[14px] bg-[#2563EB] text-white font-bold rounded-[8px] shadow-lg active:scale-95 transition-all"
        >
          Kembali
        </button>

      </div>
    </div>
  );
}

export default CreateTransactionPages;