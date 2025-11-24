import { useState, useEffect, useCallback } from 'react';

export default function Promocoes() {
    const [promocoes, setPromocoes] = useState([]);
    const [itens, setItens] = useState([]); 
    const [novaPromo, setNovaPromo] = useState({ itemMenu: { id: '' }, descontoPercentual: 0, descontoValorFixo: 0, status: true });

    const API_URL = "https://reimagined-goggles-5g4w759wqpwgh7747-8080.app.github.dev/api/v1";

    // 1. DEFINIMOS A FUNÇÃO COM useCallback
    const carregarDados = useCallback(async () => {
        try {
            const [resItens, resPromos] = await Promise.all([
                fetch(`${API_URL}/itensmenu`),
                fetch(`${API_URL}/promocoes`)
            ]);
            
            const dataItens = await resItens.json();
            const dataPromos = await resPromos.json();

            setItens(dataItens);
            setPromocoes(dataPromos);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }, []);

    // 2. CHAMAMOS NO EFFECT (COM CORREÇÃO DE TIMEOUT)
    useEffect(() => {
        const timeoutId = setTimeout(() => carregarDados(), 0);
        return () => clearTimeout(timeoutId);
    }, [carregarDados]);

    const criarPromocao = async (e) => {
        e.preventDefault();
        
        if (!novaPromo.itemMenu.id) return alert("Selecione um item!");

        const descPerc = parseFloat(novaPromo.descontoPercentual) || 0;
        const descFixo = parseFloat(novaPromo.descontoValorFixo) || 0;

        // Validação de Segurança
        const itemAlvo = itens.find(i => i.id == novaPromo.itemMenu.id);
        if (itemAlvo) {
            if (descPerc >= 100) return alert("O desconto não pode ser 100% ou mais!");
            
            const precoBase = itemAlvo.precoOriginal > 0 ? itemAlvo.precoOriginal : itemAlvo.preco;
            if (descFixo >= precoBase) {
                return alert(`Erro: O desconto (R$ ${descFixo}) é maior ou igual ao valor do item (R$ ${precoBase})!`);
            }
        }

        const payload = {
            ...novaPromo,
            descontoPercentual: descPerc,
            descontoValorFixo: descFixo
        };

        try {
            const res = await fetch(`${API_URL}/promocoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if(res.ok) {
                alert("Promoção criada!");
                setNovaPromo({ itemMenu: { id: '' }, descontoPercentual: 0, descontoValorFixo: 0, status: true });
                carregarDados();
            } else {
                const erroMsg = await res.text(); 
                try {
                    const erroJson = JSON.parse(erroMsg);
                    alert("Erro: " + (erroJson.message || erroMsg));
                } catch {
                    alert("Erro ao criar: " + erroMsg);
                }
            }
        } catch (error) { console.error(error); }
    };

    const toggleStatus = async (id, statusAtual) => {
        try {
            await fetch(`${API_URL}/promocoes/${id}/status`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(!statusAtual)
            });
            carregarDados();
        } catch (error) { console.error(error); }
    }

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-8">Gerenciar Promoções</h1>

            <div className="bg-white rounded-lg shadow-sm border border-[#d6e5d1] p-6 mb-8">
                <h2 className="text-xl font-bold text-secondary mb-4">Nova Promoção</h2>
                <form onSubmit={criarPromocao} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Item</label>
                        <select 
                            className="block w-full rounded-md border-gray-300 p-2 border"
                            value={novaPromo.itemMenu.id}
                            onChange={e => setNovaPromo({...novaPromo, itemMenu: { id: e.target.value }})}
                        >
                            <option value="">Selecione...</option>
                            {itens.map(i => (
                                <option key={i.id} value={i.id}>
                                    {i.nome} - R$ {i.precoOriginal || i.preco}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">% Desconto</label>
                            <input type="number" className="w-full p-2 border rounded" 
                                placeholder="0"
                                value={novaPromo.descontoPercentual}
                                onChange={e => setNovaPromo({...novaPromo, descontoPercentual: e.target.value, descontoValorFixo: 0})}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">OU Valor Fixo (R$)</label>
                            <input type="number" className="w-full p-2 border rounded" 
                                placeholder="0.00"
                                value={novaPromo.descontoValorFixo}
                                onChange={e => setNovaPromo({...novaPromo, descontoValorFixo: e.target.value, descontoPercentual: 0})}
                            />
                        </div>
                    </div>
                    <button type="submit" className="px-6 py-2 bg-tertiary text-white font-bold rounded-lg hover:bg-[#6c7d58]">Criar Promoção</button>
                </form>
            </div>

            <h2 className="text-2xl font-bold text-secondary mb-6">Promoções Cadastradas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promocoes.length === 0 && <p className="text-gray-500 col-span-3 py-4">Nenhuma promoção ativa.</p>}
                
                {promocoes.map(promo => (
                    <div key={promo.id} className={`border rounded-lg p-4 flex flex-col ${promo.status ? 'bg-accent-bg border-tertiary' : 'bg-gray-100 border-gray-300'}`}>
                        <div className="flex-grow">
                            <p className="text-2xl font-bold text-tertiary">
                                {promo.descontoPercentual > 0 ? `${promo.descontoPercentual}% OFF` : `R$ ${promo.descontoValorFixo} OFF`}
                            </p>
                            <p className="text-secondary mt-1">No item: <strong>{promo.itemMenuNome}</strong></p>
                        </div>
                        <button 
                            onClick={() => toggleStatus(promo.id, promo.status)}
                            className={`mt-4 w-full text-center py-2 rounded-lg font-semibold text-white text-sm ${promo.status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {promo.status ? 'Desativar' : 'Ativar'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}