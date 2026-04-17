import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IncomeServices } from "../services/IncomeService";

function UpdateTransactionPages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Awal (Kosongkan transactionDate agar tidak bentrok)
  const [formData, setFormData] = useState({
    vehicleId: "",
    materialName: "",
    quantity: 1,
    expensesDescription: "",
    expensesAmount: "",
    transactionDate: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);

  // 1. Load Daftar Kendaraan (Hanya sekali)
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

  // 2. Load Data Lama berdasarkan ID
  useEffect(() => {
    const loadTransactionData = async () => {
      try {
        const data = await IncomeServices.getDataById(id);
        // Langsung set data lama ke form
        setFormData({
          vehicleId: data.vehicleId,
          materialName: data.materialName,
          quantity: data.quantity,
          expensesDescription: data.expensesDescription,
          expensesAmount: data.expensesAmount,
          transactionDate: data.transactionDate,
        });
      } catch (error) {
        console.error("Gagal Load data transaction ", error);
      }
    };
    if (id) loadTransactionData();
  }, [id]);

  // 3. Load Daftar Material berdasarkan Kendaraan
  useEffect(() => {
    const loadPrices = async () => {
      if (formData.vehicleId) {
        try {
          const data = await IncomeServices.getPriceMaterial(
            formData.vehicleId,
          );
          setPrices(data);

          // Cari harga untuk material yang sedang terpilih
          const currentPriceObj = data.find(
            (p) => p.materialName === formData.materialName,
          );
          if (currentPriceObj) {
            setSelectedPrice(currentPriceObj.amount);
          }
        } catch (err) {
          console.error("Gagal load harga:", err);
        }
      }
    };
    loadPrices();
  }, [formData.vehicleId, formData.materialName]); // Tambah materialName di dependency

  // Handler Ganti Truck
  const handleVehicleChange = (e) => {
    setFormData({
      ...formData,
      vehicleId: e.target.value,
      materialName: "", // Reset jika user ganti truck secara manual
    });
    setSelectedPrice(0);
  };

  // Handler Ganti Material
  const handleMaterialChange = (e) => {
    const selectedName = e.target.value;
    const priceObj = prices.find((p) => p.materialName === selectedName);
    setFormData({ ...formData, materialName: selectedName });
    setSelectedPrice(priceObj ? priceObj.amount : 0);
  };

  const handleQty = (type) => {
    const currentQty = parseFloat(formData.quantity) || 0;
    const step = 0.25;

    if (type === "up") {
      // Batasi maksimal misal 20
      if (currentQty < 20) {
        setFormData((prev) => ({ ...prev, quantity: currentQty + step }));
      }
    } else if (type === "down") {
      // Batasi minimal 0.25, biar gak minus
      if (currentQty > step) {
        setFormData((prev) => ({ ...prev, quantity: currentQty - step }));
      }
    }
  };

  // Handler Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // NYALAKAN LOADING

    try {
      const payload = {
        ...formData,
        expensesAmount:
          formData.expensesAmount === "" || formData.expensesAmount === null
            ? null
            : Number(formData.expensesAmount.toString().replace(/\./g, "")),
        quantity: Number(formData.quantity),
      };

      await IncomeServices.updateTransaction(id, payload);
      alert("Data berhasil diupdate!");
      navigate("/history");
    } catch (err) {
      alert("Gagal update data!", err);
    } finally {
      setIsSubmitting(false); // MATIKAN LOADING (apapun hasilnya)
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-[20px] flex justify-center font-['Roboto']">
      <div className="w-full max-w-[393px] flex flex-col gap-[16px]">
        {/* CARD UTAMA */}
        <div className="bg-white rounded-[20px] shadow-sm p-[24px] flex flex-col gap-[16px]">
          <h2 className="text-center font-bold text-[18px] text-[#1F2937]">
            Form Transaksi
          </h2>

          {/* Nama Truck */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Nama Truck :</label>
            <select
              className="w-full p-[12px] bg-[#F3F4F6] rounded-[8px] font-medium outline-none text-[#1F2937]"
              value={formData.vehicleId}
              onChange={handleVehicleChange}
            >
              <option value="">Pilih Sopir</option>
              {vehicles?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.truckName}
                </option>
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
                <option key={i} value={p.materialName}>
                  {p.materialName}
                </option>
              ))}
            </select>
          </div>

          {/* Harga Satuan (Read Only) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Harga :</label>
            <div className="w-full p-[12px] bg-[#E5E7EB] rounded-[8px] text-[#6B7280] text-center font-medium">
              Rp {selectedPrice.toLocaleString("id-ID")}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Jumlah :</label>
            <div className="flex items-center gap-[10px]">
              <button
                onClick={() => handleQty("down")}
                className="flex-1 py-[10px] bg-[#DBEafe] text-[#2563EB] rounded-[8px] font-bold"
              >
                -
              </button>
              <div className="flex-[2] text-center font-bold text-[18px]">
                {formData.quantity}
              </div>
              <button
                onClick={() => handleQty("up")}
                className="flex-1 py-[10px] bg-[#2563EB] text-white rounded-[8px] font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Harga (Otomatis) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Total Harga :</label>
            <div className="w-full p-[12px] bg-[#E5E7EB] rounded-[8px] text-[#16A34A] font-bold text-center text-[18px]">
              Rp {(selectedPrice * formData.quantity).toLocaleString("id-ID")}
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Pengeluaran :</label>
            <div className="relative">
              <span className="absolute left-[12px] top-[12px] text-[#6B7280] font-bold">
                Rp
              </span>
              <input
                type="text" // 1. Ubah ke text agar bisa menampilkan titik
                placeholder="0"
                className="w-full p-[12px] pl-[40px] bg-[#F3F4F6] rounded-[8px] font-bold outline-none text-[#1F2937]"
                value={
                  formData.expensesAmount
                    ? Number(formData.expensesAmount).toLocaleString("id-ID")
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\./g, "");

                  if (!isNaN(rawValue) || rawValue === "") {
                    setFormData({ ...formData, expensesAmount: rawValue });
                  }
                }}
              />
            </div>
          </div>

          {/* Deskripsi Pengeluaran */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">
              Keterangan Pengeluaran :
            </label>
            <input
              type="text"
              placeholder="Bensin, Ban, dll"
              className="w-full p-[12px] bg-[#F3F4F6] rounded-[8px] outline-none"
              value={formData.expensesDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expensesDescription: e.target.value,
                })
              }
            />
          </div>

          {/* Tanggal */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[#6B7280] text-[14px]">Tanggal :</label>
            <input
              type="date"
              className="w-full p-[12px] bg-[#F3F4F6] rounded-[8px] outline-none"
              value={formData.transactionDate}
              onChange={(e) =>
                setFormData({ ...formData, transactionDate: e.target.value })
              }
            />
          </div>

          {/* Tombol update */}
          <button
            onClick={handleSubmit}
            // Tombol mati jika lagi loading ATAU truck belum dipilih
            disabled={isSubmitting || !formData.vehicleId}
            className={`w-full py-[14px] font-bold rounded-[8px] mt-[8px] transition-all
    ${
      isSubmitting || !formData.vehicleId
        ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Warna pas mati
        : "bg-[#DBEafe] text-[#2563EB] hover:bg-[#d0e4ff]" // Warna pas aktif
    }`}
          >
            {isSubmitting ? "Sedang Mengupdate..." : "Update"}
          </button>
        </div>

        {/* Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="w-full py-[14px] bg-[#2563EB] text-white font-bold rounded-[8px] shadow-lg active:scale-95 transition-all"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

export default UpdateTransactionPages;
