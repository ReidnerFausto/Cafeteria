package br.univille.fabsoft_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.univille.fabsoft_backend.entity.ItemMenu;
import br.univille.fabsoft_backend.entity.ItemPedido;
import br.univille.fabsoft_backend.entity.Pedido;
import br.univille.fabsoft_backend.repository.ItemMenuRepository;
import br.univille.fabsoft_backend.repository.PedidoRepository;
import br.univille.fabsoft_backend.service.PedidoService;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository; // Repositório de pedidos para CRUD

    @Autowired
    private ItemMenuRepository itemMenuRepository; // Repositório de itens de menu para buscar preços e detalhes completos

    // Método que retorna todos os pedidos do banco de dados
    @Override
    public List<Pedido> getAll() {
        return pedidoRepository.findAll();
    }

    // Método que cria um novo pedido
    @Override
    public Pedido save(Pedido pedido) {
        // Atualiza os preços unitários dos itens e calcula o total do pedido
        atualizarPrecosEPedido(pedido);

        // Define o status inicial do pedido como ABERTO
        pedido.setStatus(Pedido.StatusPedido.ABERTO);

        // Salva o pedido no banco de dados e retorna o objeto persistido
        return pedidoRepository.save(pedido);
    }

    // Método que atualiza um pedido existente
    @Override
    public Pedido update(long id, Pedido pedido) {
        // Busca o pedido existente no banco pelo ID; se não existir, lança exceção
        Pedido pedidoExistente = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Substitui os itens do pedido existente pelos novos itens enviados
        pedidoExistente.setItens(pedido.getItens());

        // Atualiza os preços unitários dos itens e recalcula o total do pedido
        atualizarPrecosEPedido(pedidoExistente);

        // Salva o pedido atualizado no banco e retorna o objeto persistido
        return pedidoRepository.save(pedidoExistente);
    }

    // Método que finaliza o pedido
    @Override
    public Pedido finalizarPedido(long id) {
        // Busca o pedido existente no banco pelo ID; se não existir, lança exceção
        Pedido pedidoExistente = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Define o status do pedido como FINALIZADO
        pedidoExistente.setStatus(Pedido.StatusPedido.FINALIZADO);

        // Atualiza os preços unitários dos itens e recalcula o total do pedido
        atualizarPrecosEPedido(pedidoExistente);

        // Salva o pedido finalizado no banco e retorna o objeto persistido
        return pedidoRepository.save(pedidoExistente);
    }

    // Método auxiliar que atualiza o preço unitário de cada item e calcula o total do pedido
    private void atualizarPrecosEPedido(Pedido pedido) {
        float total = 0.0f; // Inicializa o total do pedido

        // Itera por cada item do pedido
        for (ItemPedido item : pedido.getItens()) {
            if (item.getItemMenu() != null) {
                // Busca o ItemMenu completo no banco usando o ID do item
                ItemMenu itemMenuReal = itemMenuRepository.findById(item.getItemMenu().getId()).orElseThrow(() -> new RuntimeException("ItemMenu não encontrado"));

                // Atualiza o item com os dados completos do ItemMenu
                item.setItemMenu(itemMenuReal);

                // Atualiza o preço unitário do item baseado no ItemMenu
                item.setPrecoUnitario(itemMenuReal.getPreco());

                // Acumula no total do pedido (quantidade * preço unitário)
                total += item.getPrecoUnitario() * item.getQuantidade();
            }
        }

        // Define o total calculado no pedido
        pedido.setTotal(total);
    }
}
