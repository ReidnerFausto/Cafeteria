import { useState, useEffect } from 'react';

export default function Venda() {
  const [itensMenu, setItensMenu] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState({});
  const [precoTotalItem, setPrecoTotalItem] = useState(0);

  const [carregando, setCarregando] = useState(true);

  const API_URL = "https://reimagined-goggles-5g4w759wqpwgh7747-8080.app.github.dev/api/v1";

  useEffect(() => {
    fetch(`${API_URL}/itensmenu`)
      .then(res => res.json())
      .then(data => {
        setItensMenu(data);
        setCarregando(false);
      })
      .catch(err => {
        console.error("Erro:", err);
        setCarregando(false);
      });
  }, []);

  const categorias = ['todos', ...new Set(itensMenu.map(i => i.categoria))];
  const itensFiltrados = filtro === 'todos' 
    ? itensMenu 
    : itensMenu.filter(i => i.categoria === filtro);

  const abrirModal = (item) => {
    setItemSelecionado(item);
    setOpcoesSelecionadas({});
    setPrecoTotalItem(item.preco); // Preço já vem com desconto se houver
    setModalAberto(true);
  };

  const selecionarOpcao = (nomeGrupo, opcao) => {
    const novasSelecoes = { ...opcoesSelecionadas };
    if (novasSelecoes[nomeGrupo]?.nome === opcao.nome) {
        delete novasSelecoes[nomeGrupo];
    } else {
        novasSelecoes[nomeGrupo] = { nome: opcao.nome, acrescimo: opcao.acrescimo };
    }
    setOpcoesSelecionadas(novasSelecoes);
    const totalAcrescimos = Object.values(novasSelecoes).reduce((acc, opt) => acc + opt.acrescimo, 0);
    setPrecoTotalItem(itemSelecionado.preco + totalAcrescimos);
  };

  const adicionarAoCarrinho = () => {
    if (!itemSelecionado) return;
    const descricaoOpcoes = Object.values(opcoesSelecionadas).map(o => o.nome).join(', ');
    const novoItem = {
      ...itemSelecionado,
      uid: Date.now(),
      quantidade: 1,
      precoTotal: precoTotalItem,
      detalhes: descricaoOpcoes
    };
    setCarrinho([...carrinho, novoItem]);
    setModalAberto(false);
    setItemSelecionado(null);
  };

  const alterarQtd = (uid, delta) => {
    setCarrinho(carrinho.map(item => {
      if (item.uid === uid) return { ...item, quantidade: Math.max(0, item.quantidade + delta) };
      return item;
    }).filter(item => item.quantidade > 0));
  };

  const totalPedido = carrinho.reduce((acc, item) => acc + (item.precoTotal * item.quantidade), 0);

  const finalizarPedido = async () => {
    if (carrinho.length === 0) return alert("Carrinho vazio!");
    const pedidoParaSalvar = {
      itens: carrinho.map(itemCarrinho => ({
        quantidade: itemCarrinho.quantidade,
        precoUnitario: itemCarrinho.precoTotal,
        observacao: itemCarrinho.detalhes,
        itemMenu: { id: itemCarrinho.id }
      }))
    };
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoParaSalvar)
      });
      if (response.ok) {
        alert("Pedido enviado!");
        setCarrinho([]);
      } else {
        alert("Erro ao salvar pedido.");
      }
    } catch (error) { console.error(error); }
  };

  const fmt = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="lg:flex lg:gap-8 h-[calc(100vh-4rem)]">
      
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-secondary">Cardápio</h1>
            {!carregando && (
                <select 
                    className="p-2 border rounded-lg bg-white shadow-sm"
                    value={filtro} 
                    onChange={(e) => setFiltro(e.target.value)}
                >
                    {categorias.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
            {carregando ? (
                <> <SkeletonCard /> <SkeletonCard /> <SkeletonCard /> </>
            ) : (
                itensFiltrados.map(item => {
                    const temDesconto = item.preco < item.precoOriginal;
                    return (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 transition-transform hover:scale-[1.01]">
                        <div className="flex-1 w-full text-center sm:text-left">
                            <h3 className="font-bold text-secondary text-lg leading-tight">{item.nome}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.descricao}</p>
                            
                            <div className="flex justify-between items-center mt-3">
                                <div className="flex flex-col items-start">
                                    {temDesconto && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {fmt(item.precoOriginal)}
                                        </span>
                                    )}
                                    <p className={`font-bold text-lg ${temDesconto ? 'text-green-600' : 'text-tertiary'}`}>
                                        {fmt(item.preco)}
                                    </p>
                                </div>

                                {item.disponibilidade ? (
                                    <button onClick={() => abrirModal(item)} className="bg-tertiary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-opacity-90 shadow-md transition-colors">
                                        Adicionar
                                    </button>
                                ) : (
                                    <span className="text-xs font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-full">Indisponível</span>
                                )}
                            </div>
                        </div>
                    </div>
                    )
                })
            )}
        </div>
      </div>

      <aside className="w-full lg:w-96 bg-white p-6 rounded-xl border border-gray-200 shadow-lg h-fit sticky top-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6 border-b pb-4">Seu Pedido</h2>
        
        <div className="flex-1 space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-1">
            {carrinho.length === 0 && <div className="text-center py-10 text-gray-400 italic">Seu carrinho está vazio.</div>}
            
            {carrinho.map(item => (
                <div key={item.uid} className="flex justify-between items-start group">
                    <div>
                        <p className="font-bold text-secondary">{item.nome}</p>
                        {item.detalhes && <p className="text-xs text-gray-500 italic">+ {item.detalhes}</p>}
                        <p className="text-sm text-tertiary font-semibold mt-1">
                            {fmt(item.precoTotal)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button onClick={() => alterarQtd(item.uid, -1)} className="w-6 h-6 bg-white shadow text-gray-600 rounded hover:bg-red-50 font-bold">-</button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantidade}</span>
                        <button onClick={() => alterarQtd(item.uid, 1)} className="w-6 h-6 bg-white shadow text-gray-600 rounded hover:bg-green-50 font-bold">+</button>
                    </div>
                </div>
            ))}
        </div>

        <div className="border-t pt-6 mt-auto">
            <div className="flex justify-between items-end mb-6">
                <span className="text-gray-500 font-medium">Total</span>
                <span className="text-3xl font-bold text-tertiary">
                    {fmt(totalPedido)}
                </span>
            </div>
            <button onClick={finalizarPedido} disabled={carrinho.length === 0} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-all disabled:opacity-50">
                Finalizar Pedido
            </button>
        </div>
      </aside>

      {modalAberto && itemSelecionado && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="relative h-40 bg-gray-200">
                    <img src="https://via.placeholder.com/400x200?text=Cafe" className="w-full h-full object-cover" />
                    <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-600 font-bold">✕</button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="flex justify-between items-start mb-2">
                         <h2 className="text-2xl font-bold text-secondary">{itemSelecionado.nome}</h2>
                         {itemSelecionado.preco < itemSelecionado.precoOriginal && (
                             <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Promoção</span>
                         )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6">{itemSelecionado.descricao}</p>

                    {itemSelecionado.gruposOpcoes && itemSelecionado.gruposOpcoes.length > 0 ? (
                        <div className="space-y-6">
                            {itemSelecionado.gruposOpcoes.map(grupo => (
                                <div key={grupo.id}>
                                    <h3 className="font-bold text-gray-800 mb-3 flex justify-between">
                                        {grupo.nome} <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded">Escolha 1</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {grupo.opcoes.map(opcao => {
                                            const isSelected = opcoesSelecionadas[grupo.nome]?.nome === opcao.nome;
                                            return (
                                                <button 
                                                    key={opcao.id}
                                                    onClick={() => selecionarOpcao(grupo.nome, opcao)}
                                                    className={`px-4 py-2 rounded-lg text-sm border transition-all duration-200 flex items-center gap-2
                                                        ${isSelected 
                                                            ? 'bg-tertiary text-white border-tertiary shadow-md' 
                                                            : 'bg-white text-gray-600 border-gray-300 hover:border-tertiary'
                                                        }`}
                                                >
                                                    {opcao.nome}
                                                    {opcao.acrescimo > 0 && (
                                                        <span className={`text-xs font-bold ${isSelected ? 'text-white/80' : 'text-tertiary'}`}>
                                                            (+ {fmt(opcao.acrescimo)})
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 text-sm py-4 italic border-t border-b border-dashed">Sem opções extras.</p>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500">Total do Item</p>
                        <div className="flex items-baseline gap-2">
                            {itemSelecionado.preco < itemSelecionado.precoOriginal && precoTotalItem === itemSelecionado.preco && (
                                 <span className="text-xs text-gray-400 line-through">{fmt(itemSelecionado.precoOriginal)}</span>
                            )}
                            <p className="text-xl font-bold text-tertiary">
                                {fmt(precoTotalItem)}
                            </p>
                        </div>
                    </div>
                    <button onClick={adicionarAoCarrinho} className="bg-tertiary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 shadow-lg transition-transform active:scale-95">
                        Adicionar ao Pedido
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

// --- A CORREÇÃO FINAL: O COMPONENTE ESTÁ AQUI FORA ---
const SkeletonCard = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 animate-pulse">
      <div className="w-24 h-24 rounded-lg bg-gray-200"></div>
      <div className="flex-1 w-full space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
  </div>
);