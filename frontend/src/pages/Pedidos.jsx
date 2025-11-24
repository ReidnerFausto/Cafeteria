import { useState, useEffect, useCallback } from 'react';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  
  const API_URL = "https://reimagined-goggles-5g4w759wqpwgh7747-8080.app.github.dev/api/v1/pedidos";

  const carregarPedidos = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      
      // Ordenação: ABERTOS primeiro, depois Recentes
      const ordenados = data.sort((a, b) => {
        if (a.status === 'ABERTO' && b.status !== 'ABERTO') return -1;
        if (a.status !== 'ABERTO' && b.status === 'ABERTO') return 1;
        return b.id - a.id;
      });

      setPedidos(ordenados);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => carregarPedidos(), 0);
    const intervalo = setInterval(carregarPedidos, 5000); 
    return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalo);
    };
  }, [carregarPedidos]);

  const finalizarPedido = async (id) => {
    if (!window.confirm("Confirmar entrega do pedido?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}/finalizar`, { method: 'PUT' });
      if (res.ok) carregarPedidos(); 
    } catch (error) { console.error(error); }
  };

  // --- NOVA FUNÇÃO DE CANCELAR ---
  const cancelarPedido = async (id) => {
    if (!window.confirm("TEM CERTEZA que deseja cancelar este pedido?")) return;
    try {
        const res = await fetch(`${API_URL}/${id}/cancelar`, { method: 'PUT' });
        if (res.ok) carregarPedidos();
    } catch (error) { console.error(error); }
  };

  // Função auxiliar para cor do status
  const getStatusStyle = (status) => {
      switch(status) {
          case 'ABERTO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'FINALIZADO': return 'bg-green-100 text-green-800 border-green-200';
          case 'CANCELADO': return 'bg-red-100 text-red-800 border-red-200';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Gestão de Pedidos</h1>
        <button onClick={carregarPedidos} className="text-sm text-primary hover:underline">
            Atualizar Lista
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidos.length === 0 && <p className="text-gray-500 col-span-3 text-center py-10">Nenhum pedido no histórico.</p>}

        {pedidos.map(pedido => {
          const isAberto = pedido.status === 'ABERTO';
          const isCancelado = pedido.status === 'CANCELADO';
          
          return (
            <div 
                key={pedido.id} 
                className={`border rounded-xl shadow-sm p-6 flex flex-col transition-all relative overflow-hidden
                ${isAberto ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}
            >
                {/* Efeito visual para cancelados */}
                {isCancelado && (
                    <div className="absolute inset-0 bg-red-50/30 pointer-events-none flex items-center justify-center">
                        <span className="text-red-200 text-5xl font-bold -rotate-12 opacity-50 border-4 border-red-200 p-4 rounded-xl">CANCELADO</span>
                    </div>
                )}

                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className={`text-xl font-bold ${isAberto ? 'text-primary' : 'text-gray-600'}`}>
                        Pedido #{pedido.id}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusStyle(pedido.status)}`}>
                        {pedido.status}
                    </span>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                    {pedido.itens && pedido.itens.map((item, index) => (
                        <div key={index} className="flex flex-col border-b border-gray-100 last:border-0 py-2">
                            <div className="flex justify-between text-sm">
                                <span className={`font-bold ${isCancelado ? 'text-gray-400 line-through' : 'text-secondary'}`}>
                                    {item.quantidade}x {item.itemMenu?.nome || "Item Removido"}
                                </span>
                            </div>
                            {item.observacao && (
                                <span className="text-xs text-gray-500 italic pl-4">
                                    + {item.observacao}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 z-10">
                    <span className={`font-bold text-lg ${isCancelado ? 'text-gray-400 line-through' : 'text-tertiary'}`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}
                    </span>
                    
                    {/* BOTÕES DE AÇÃO (Só aparecem se estiver ABERTO) */}
                    {isAberto ? (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => cancelarPedido(pedido.id)}
                                className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-semibold border border-red-200"
                                title="Cancelar Pedido"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => finalizarPedido(pedido.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-sm"
                            >
                                Entregar
                            </button>
                        </div>
                    ) : (
                        <span className="text-gray-400 text-xs font-medium italic">
                            {isCancelado ? 'Sem faturamento' : 'Faturado'}
                        </span>
                    )}
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}