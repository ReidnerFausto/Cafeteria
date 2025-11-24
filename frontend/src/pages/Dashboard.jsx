import { useState, useEffect, useCallback } from 'react';

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [resumo, setResumo] = useState({ totalVendas: 0, qtdPedidos: 0, ticketMedio: 0 });
  const [carregando, setCarregando] = useState(true);

  // URL Fixa do seu Backend
  const API_URL = "https://reimagined-goggles-5g4w759wqpwgh7747-8080.app.github.dev/api/v1/pedidos";

  const carregarDados = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      const pedidosFinalizados = data.filter(p => p.status === 'FINALIZADO');
      
      const totalVendas = pedidosFinalizados.reduce((acc, p) => acc + p.total, 0);
      const ticketMedio = pedidosFinalizados.length > 0 ? totalVendas / pedidosFinalizados.length : 0;

      setResumo({
        totalVendas,
        qtdPedidos: pedidosFinalizados.length,
        ticketMedio
      });

      const ultimosPedidos = data.sort((a, b) => b.id - a.id).slice(0, 10); 
      setPedidos(ultimosPedidos);

      setCarregando(false);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => carregarDados(), 0);
    const intervalo = setInterval(carregarDados, 10000); 
    return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalo);
    };
  }, [carregarDados]);

  const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="transition-all duration-200 ease-in-out">
      <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Faturamento (ÍCONE DE CIFRÃO $) */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-500">Faturamento</h4>
                <p className="text-2xl font-bold text-secondary mt-1">
                    {carregando ? '...' : fmt(resumo.totalVendas)}
                </p>
            </div>
          </div>
        </div>

        {/* Card 2: Quantidade de Pedidos */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-500">Pedidos Entregues</h4>
                <p className="text-2xl font-bold text-secondary mt-1">
                    {carregando ? '...' : resumo.qtdPedidos}
                </p>
            </div>
          </div>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-500">Ticket Médio</h4>
                <p className="text-2xl font-bold text-secondary mt-1">
                    {carregando ? '...' : fmt(resumo.ticketMedio)}
                </p>
            </div>
          </div>
        </div>

      </div>

      <h2 className="text-2xl font-bold text-secondary mb-6">Últimos Pedidos</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resumo</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {carregando ? (
                        <tr><td colSpan="4" className="text-center py-4 text-gray-500">Atualizando...</td></tr>
                    ) : pedidos.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-10 text-gray-500">Nenhum pedido registrado.</td></tr>
                    ) : (
                        pedidos.map(pedido => (
                            <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">
                                    #{pedido.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${pedido.status === 'ABERTO' ? 'bg-yellow-100 text-yellow-800' : 
                                          pedido.status === 'CANCELADO' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {pedido.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {pedido.itens.slice(0, 2).map(i => `${i.quantidade}x ${i.itemMenu?.nome}`).join(', ')}
                                    {pedido.itens.length > 2 && '...'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-tertiary">
                                    {fmt(pedido.total)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}