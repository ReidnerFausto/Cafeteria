import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Venda from './pages/Venda';
import Pedidos from './pages/Pedidos';
import CardapioAdmin from './pages/CardapioAdmin';
import Dashboard from './pages/Dashboard'; // <--- NOVO
import Promocoes from './pages/Promocoes'; // <--- NOVO

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} /> {/* Agora o Dashboard abre no inicio */}
          <Route path="venda" element={<Venda />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="cardapio-admin" element={<CardapioAdmin />} />
          <Route path="promocoes" element={<Promocoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;