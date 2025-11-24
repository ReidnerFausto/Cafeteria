import { useState, useEffect, useCallback } from 'react';

export default function CardapioAdmin() {
  const [itens, setItens] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalOpcoesAberto, setModalOpcoesAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  
  const [itemEmEdicao, setItemEmEdicao] = useState(null); // Usado para o modal de opções
  const [opcoesDoItem, setOpcoesDoItem] = useState({}); 

  // Estado do formulário (agora pode conter ID se for edição)
  const itemVazio = { id: null, nome: '', categoria: '', preco: '', descricao: '' };
  const [formularioItem, setFormularioItem] = useState(itemVazio);
  
  const API_URL = "https://reimagined-goggles-5g4w759wqpwgh7747-8080.app.github.dev/api/v1/itensmenu";

  const carregarItens = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if(res.ok) {
        const data = await res.json();
        setItens(data);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => carregarItens(), 0);
    return () => clearTimeout(timeoutId);
  }, [carregarItens]);

  // --- LÓGICA UNIFICADA: CRIAR OU EDITAR ---
  const abrirModalNovo = () => {
    setFormularioItem(itemVazio); // Limpa o form
    setModalAberto(true);
  };

  const abrirModalEdicao = (item) => {
    // Preenche o form com os dados do item clicado
    setFormularioItem({
        id: item.id,
        nome: item.nome,
        categoria: item.categoria,
        preco: item.preco,
        descricao: item.descricao
    });
    setModalAberto(true);
  };

  const salvarItem = async (e) => {
    e.preventDefault();
    setSalvando(true);
    
    let precoFloat = parseFloat(formularioItem.preco.toString().replace(',', '.'));
    if (isNaN(precoFloat)) precoFloat = 0.0;

    // Se tem ID, é Edição (PUT). Se não, é Novo (POST).
    const isEdicao = !!formularioItem.id;
    const method = isEdicao ? 'PUT' : 'POST';
    const url = isEdicao ? `${API_URL}/${formularioItem.id}` : API_URL;

    const payload = {
      ...formularioItem,
      preco: precoFloat,
      disponibilidade: true, 
      // Se for edição, precisamos mandar as opções antigas para não apagá-las
      // Se for novo, manda lista vazia
      gruposOpcoes: isEdicao 
        ? itens.find(i => i.id === formularioItem.id)?.gruposOpcoes || [] 
        : []
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(isEdicao ? "Item atualizado!" : "Item cadastrado!");
        setModalAberto(false);
        carregarItens();
      } else {
        const txt = await res.text();
        alert("Erro: " + txt);
      }
    } catch {
        alert("Erro de conexão.");
    } finally {
      setSalvando(false);
    }
  };

  // (Removi a função excluirItem pois você não quer mais ela)

  const toggleDisponibilidade = async (id, statusAtual) => {
    setItens(itens.map(i => i.id === id ? {...i, disponibilidade: !statusAtual} : i));
    try {
        await fetch(`${API_URL}/${id}/disponibilidade`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(!statusAtual)
        });
    } catch { carregarItens(); }
  };

  // --- LÓGICA DO MODAL DE OPÇÕES ---
  const abrirModalOpcoes = (item) => {
    setItemEmEdicao(item);
    const opcoesFormatadas = {};
    if (item.gruposOpcoes) {
        item.gruposOpcoes.forEach(grupo => {
            opcoesFormatadas[grupo.nome] = grupo.opcoes.map(op => ({
                name: op.nome,
                price: op.acrescimo
            }));
        });
    }
    setOpcoesDoItem(opcoesFormatadas); 
    setModalOpcoesAberto(true);
  };

  const salvarOpcoesNoBanco = async () => {
      if (!itemEmEdicao) return;

      const gruposParaSalvar = Object.keys(opcoesDoItem).map(nomeGrupo => ({
          nome: nomeGrupo,
          opcoes: opcoesDoItem[nomeGrupo].map(tag => ({
              nome: tag.name,
              acrescimo: tag.price
          }))
      }));

      const itemAtualizado = { 
          ...itemEmEdicao, 
          gruposOpcoes: gruposParaSalvar 
      };

      try {
          const res = await fetch(`${API_URL}/${itemEmEdicao.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(itemAtualizado)
          });

          if (res.ok) {
              alert("Opções salvas com sucesso!");
              setModalOpcoesAberto(false);
              carregarItens();
          } else {
              const erro = await res.text();
              alert("Erro ao salvar opções: " + erro);
          }
      } catch (error) {
          console.error(error);
          alert("Erro de conexão ao salvar opções.");
      }
  };

  const adicionarGrupo = (e) => {
    e.preventDefault();
    const input = e.target.elements.novoGrupo;
    const nomeGrupo = input.value.trim();
    if (nomeGrupo) {
        setOpcoesDoItem({ ...opcoesDoItem, [nomeGrupo]: [] });
        input.value = "";
    }
  };

  const adicionarTag = (e, grupo) => {
    e.preventDefault();
    const inputNome = e.target.elements.novaTag;
    const inputPreco = e.target.elements.novoPreco;
    const nomeTag = inputNome.value.trim();
    const precoTag = parseFloat(inputPreco.value) || 0;

    if (nomeTag) {
        const novaTagObj = { name: nomeTag, price: precoTag };
        const novasTags = [...(opcoesDoItem[grupo] || []), novaTagObj];
        setOpcoesDoItem({ ...opcoesDoItem, [grupo]: novasTags });
        inputNome.value = "";
        inputPreco.value = "";
        inputNome.focus();
    }
  };

  const removerTag = (grupo, tagParaRemover) => {
    const novasTags = opcoesDoItem[grupo].filter(t => t.name !== tagParaRemover.name);
    setOpcoesDoItem({ ...opcoesDoItem, [grupo]: novasTags });
  };

  return (
    <div className="transition-all duration-200 ease-in-out">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary">Gerenciar Cardápio</h1>
        {/* Botão chama abrirModalNovo para garantir form limpo */}
        <button onClick={abrirModalNovo} className="mt-4 sm:mt-0 flex items-center justify-center gap-2 w-full sm:w-auto bg-tertiary text-card-bg font-bold px-4 py-2 rounded-lg hover:bg-[#6c7d58] transition-colors">
          <span>+ Adicionar Novo Item</span>
        </button>
      </div>

      <div className="bg-card-bg rounded-lg shadow-sm border border-[#d6e5d1] px-6">
        <div className="divide-y divide-gray-200">
            {itens.length === 0 && <p className="text-center py-10 text-gray-500">Carregando itens...</p>}
            {itens.map((item) => (
                <div key={item.id} className="py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {/* Dados do Item */}
                        <div>
                            <p className="font-bold text-secondary text-lg">{item.nome}</p>
                            <p className="text-sm text-gray-500 italic">{item.categoria}</p>
                            <p className="text-sm font-bold text-tertiary mt-1">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 self-end sm:self-center">
                        {/* BOTÃO EDITAR DETALHES (NOVO) - Substitui o excluir */}
                        <button 
                            onClick={() => abrirModalEdicao(item)}
                            className="text-sm font-medium text-secondary hover:text-tertiary transition-colors underline"
                        >
                            Editar Detalhes
                        </button>

                        <button onClick={() => abrirModalOpcoes(item)} className="text-sm font-medium text-primary hover:text-tertiary transition-colors border border-primary px-3 py-1 rounded hover:bg-primary hover:text-white">
                            Opções Extras
                        </button>

                        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
                            <span className={`w-24 text-right text-sm font-medium ${item.disponibilidade ? "text-tertiary" : "text-gray-500"}`}>
                                {item.disponibilidade ? "Disponível" : "Indisponível"}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={item.disponibilidade} onChange={() => toggleDisponibilidade(item.id, item.disponibilidade)} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-tertiary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                            </label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* MODAL UNIFICADO (CRIAÇÃO E EDIÇÃO) */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    {/* Título muda dinamicamente */}
                    <h2 className="text-xl font-semibold text-secondary">
                        {formularioItem.id ? 'Editar Item' : 'Novo Item'}
                    </h2>
                    <button onClick={() => setModalAberto(false)} className="text-gray-500 text-2xl">&times;</button>
                </div>
                <form onSubmit={salvarItem} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <input 
                            placeholder="Nome" required 
                            className="w-full p-2 border rounded" 
                            value={formularioItem.nome} 
                            onChange={e => setFormularioItem({...formularioItem, nome: e.target.value})} 
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                placeholder="Categoria" required 
                                className="w-full p-2 border rounded" 
                                value={formularioItem.categoria} 
                                onChange={e => setFormularioItem({...formularioItem, categoria: e.target.value})} 
                            />
                            <input 
                                type="number" step="0.01" placeholder="Preço" required 
                                className="w-full p-2 border rounded" 
                                value={formularioItem.preco} 
                                onChange={e => setFormularioItem({...formularioItem, preco: e.target.value})} 
                            />
                        </div>
                        <textarea 
                            rows="3" placeholder="Descrição" 
                            className="w-full p-2 border rounded" 
                            value={formularioItem.descricao} 
                            onChange={e => setFormularioItem({...formularioItem, descricao: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="flex justify-end p-4 border-t space-x-2 bg-gray-50 rounded-b-xl">
                        <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                        <button type="submit" disabled={salvando} className="px-6 py-2 bg-tertiary text-white rounded font-bold">
                            {salvando ? 'Salvando...' : (formularioItem.id ? 'Atualizar' : 'Salvar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* MODAL EDITAR OPÇÕES (MANTIDO IGUAL) */}
      {modalOpcoesAberto && itemEmEdicao && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-secondary">Opções Extras: {itemEmEdicao.nome}</h2>
                    <button onClick={() => setModalOpcoesAberto(false)} className="text-gray-500 hover:text-secondary text-2xl font-bold">&times;</button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto bg-gray-50">
                    {Object.keys(opcoesDoItem).length === 0 && <p className="text-center text-gray-400 italic">Nenhuma opção cadastrada.</p>}
                    {Object.keys(opcoesDoItem).map((grupo) => (
                        <div key={grupo} className="bg-white p-4 border rounded-lg shadow-sm">
                            <h4 className="font-bold text-secondary mb-3 text-lg">{grupo}</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {opcoesDoItem[grupo].map((tag, idx) => (
                                    <div key={idx} className="inline-flex items-center gap-2 bg-accent-bg text-secondary text-sm font-medium px-3 py-1 rounded-full border border-tertiary/20">
                                        <span>{tag.name} {tag.price > 0 && <span className="text-tertiary ml-1 font-bold">(+R$ {tag.price})</span>}</span>
                                        <button onClick={() => removerTag(grupo, tag)} className="text-red-500 hover:text-red-700 font-bold hover:bg-red-100 rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={(e) => adicionarTag(e, grupo)} className="flex items-center gap-2">
                                <input type="text" name="novaTag" placeholder="Nome" required className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                <input type="number" step="0.50" name="novoPreco" placeholder="+ R$" className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                <button type="submit" className="bg-tertiary text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#6c7d58] transition-colors text-sm">Add</button>
                            </form>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                    <form onSubmit={adicionarGrupo} className="flex items-center gap-2 mb-4">
                        <input type="text" name="novoGrupo" placeholder="Nome do Novo Grupo (Ex: Molhos)" required className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm" />
                        <button type="submit" className="bg-secondary text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors">Criar Grupo</button>
                    </form>
                    <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                        <button onClick={() => setModalOpcoesAberto(false)} className="bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button onClick={salvarOpcoesNoBanco} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">Salvar Opções</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}