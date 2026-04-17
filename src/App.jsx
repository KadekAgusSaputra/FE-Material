import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IncomePages from './pages/IncomePages'; // Pastikan path import benar
import DashBoardPages from './pages/DashBoardPages'; // Pastikan path import benar
import HistoriPages from './pages/HistoriPages'; // Pastikan path import benar
import CreateTransactionPages from './pages/CreateTransactionPages'; // Pastikan path import benar
import UpdateTransactionPages from './pages/UpdateTransactionPages'; // Pastikan path import benar

function App() {
  return (
    <Router>
      <Routes>
        {/* Pastikan path-nya "/income" sama dengan yang kamu ketik di browser */}
        <Route path="/" element={<IncomePages />} />
        <Route path="/laporan-detail" element={<DashBoardPages />} />
        <Route path="/history" element={<HistoriPages />} />
        <Route path="/create" element={<CreateTransactionPages />} />
        <Route path="/update/:id" element={<UpdateTransactionPages />} />
        {/* Tambahkan route default jika perlu */}
      </Routes>
    </Router>
  );
}

export default App;