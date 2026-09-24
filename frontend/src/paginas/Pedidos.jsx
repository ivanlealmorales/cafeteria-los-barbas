// =====================================================
// IMPORTAÇÕES
// =====================================================

// Importa os hooks do React:
// useState → controla estados do componente
// useEffect → executa código em momentos específicos do ciclo de vida
import { useEffect, useState } from "react";

// Importa a instância do Axios já configurada
// para se comunicar com o backend (localhost:3001)
import { api } from "../services/api";

// Importa o CSS específico da tela de pedidos
import "./Pedidos.css";

// =====================================================
// COMPONENTE PEDIDOS
// =====================================================
export default function Pedidos() {

  // ---------------------------------------------------
  // ESTADO: LISTA DE PEDIDOS
  // ---------------------------------------------------
  // Armazena os pedidos retornados do backend
  const [pedidos, setPedidos] = useState([]);

  // ===================================================
  // useEffect — EXECUTA NA ABERTURA DA TELA
  // ===================================================
  // Assim que o componente é montado,
  // a função carregarPedidos é chamada
  useEffect(() => {
    carregarPedidos();
  }, []);

  // ===================================================
  // FUNÇÃO: CARREGAR PEDIDOS EM ABERTO
  // ===================================================
  // Busca no backend todos os pedidos
  // que ainda NÃO foram concluídos
  async function carregarPedidos() {
    try {
      // Requisição GET para o endpoint /pedido
      const res = await api.get("/pedido");

      // Atualiza o estado com os dados retornados
      // Se não vier nada, evita erro setando array vazio
      setPedidos(res.data || []);
    } catch (err) {
      // Exibe erro no console (debug)
      console.error("Erro ao carregar pedidos:", err);

      // Evita quebra da interface
      setPedidos([]);
    }
  }

  // ===================================================
  // FUNÇÃO: CONCLUIR PEDIDO
  // ===================================================
  // Marca um pedido como concluído no banco de dados
  async function concluir(id) {

    // Confirmação para evitar conclusão acidental
    if (!confirm("Deseja concluir este pedido?")) return;

    try {
      // Requisição PUT para marcar o pedido como concluído
      await api.put(`/pedido/${id}/concluir`);

      // Feedback visual para o usuário
      alert("Pedido concluído com sucesso!");

      // Recarrega a lista após a conclusão
      carregarPedidos();
    } catch (err) {
      console.error("Erro ao concluir pedido:", err);
      alert("Erro ao concluir pedido");
    }
  }

  // ===================================================
  // RENDERIZAÇÃO DA INTERFACE
  // ===================================================
  return (
    <div className="pedidos-container">
      <h1>Pedidos</h1>

      {/* SE NÃO EXISTIREM PEDIDOS EM ABERTO */}
      {pedidos.length === 0 ? (
        <p>Nenhum pedido pendente.</p>
      ) : (

        // TABELA DE PEDIDOS
        <table className="pedidos-tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>CPF</th>
              <th>Qtd</th>
              <th>Preço Unit.</th>
              <th>Total</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>

                {/* Nome do produto vendido */}
                <td>{p.produto_nome}</td>

                {/* CPF do cliente */}
                <td>{p.cpf}</td>

                {/* Quantidade comprada */}
                <td>{p.quantidade}</td>

                {/* Preço unitário formatado */}
                <td>R$ {Number(p.preco).toFixed(2)}</td>

                {/* Valor total do pedido */}
                <td>
                  <strong>
                    R$ {Number(p.total).toFixed(2)}
                  </strong>
                </td>

                {/* Data e hora do pedido */}
                <td>
                  {new Date(p.data_pedido).toLocaleString()}
                </td>

                {/* Botão para concluir pedido */}
                <td>
                  <button
                    className="pedidos-btn"
                    onClick={() => concluir(p.id)}
                  >
                    Concluir
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
