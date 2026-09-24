// =====================================================
// IMPORTAÇÕES
// =====================================================

// Hooks do React utilizados para:
// - useState: controle de estados locais
// - useEffect: controle do ciclo de vida do componente
import { useEffect, useState } from "react";

// Instância central do Axios configurada com o backend
// Responsável por realizar requisições HTTP
import { api } from "../services/api";

// Reutiliza o CSS do Menu para manter padrão visual
import "./Menu.css";

// =====================================================
// COMPONENTE LANCHES
// =====================================================

// Este componente é responsável por:
// - Exibir os lanches disponíveis
// - Controlar o fluxo de compra (quantidade + CPF)
// - Registrar pedidos de lanches no sistema
export default function Lanches() {

  // -------------------------------
  // ESTADO: LISTA DE LANCHES
  // -------------------------------

  // Armazena os lanches retornados do backend
  // Inicialmente começa como um array vazio
  const [lanches, setLanches] = useState([]);

  // -------------------------------
  // ESTADOS: CONTROLE DO FLUXO DE COMPRA
  // -------------------------------

  // Armazena o lanche selecionado para compra
  const [produto, setProduto] = useState(null);

  // Armazena a quantidade escolhida pelo cliente
  // Começa com valor padrão 1
  const [quantidade, setQuantidade] = useState(1);

  // Armazena o CPF digitado pelo cliente
  const [cpf, setCpf] = useState("");

  // Controla a etapa atual do processo de compra
  // null  → nenhuma ação ativa
  // "qtd" → modal de escolha de quantidade
  // "cpf" → modal de digitação do CPF
  const [etapa, setEtapa] = useState(null);

  // =====================================================
  // CARREGAMENTO INICIAL DOS LANCHES
  // =====================================================

  // Executado automaticamente quando o componente é montado
  // Busca no backend apenas os lanches ativos
  useEffect(() => {
    api.get("/lanches")
      .then(res => setLanches(res.data)) // Atualiza o estado com os dados recebidos
      .catch(err => console.error(err)); // Loga erro caso a requisição falhe
  }, []);

  // =====================================================
  // FLUXO DE COMPRA
  // =====================================================

  // Função acionada ao clicar em "Comprar"
  // Define o lanche selecionado e abre o modal de quantidade
  function abrirQuantidade(item) {
    setProduto(item);     // Salva o lanche selecionado
    setQuantidade(1);     // Define quantidade inicial
    setEtapa("qtd");      // Avança para a etapa de quantidade
  }

  // Confirma a quantidade escolhida
  // Avança para a etapa de CPF
  function confirmarQuantidade() {
    setEtapa("cpf");
  }

  // =====================================================
  // CONFIRMAÇÃO DO PEDIDO
  // =====================================================

  // Função responsável por:
  // 1. Validar o CPF
  // 2. Verificar se o cliente existe
  // 3. Registrar o pedido no backend
  async function confirmarPedido() {
    try {
      // Remove caracteres não numéricos do CPF
      const cpfLimpo = cpf.replace(/\D/g, "");

      // -------------------------------
      // VALIDAÇÃO DO CPF
      // -------------------------------
      // Verifica se o CPF possui exatamente 11 dígitos
      if (cpfLimpo.length !== 11) {
        alert("CPF inválido");
        return;
      }

      // -------------------------------
      // VERIFICA SE O CPF ESTÁ CADASTRADO
      // -------------------------------
      // Consulta o backend para validar existência do cliente
      const resCpf = await api.get(`/clientes/cpf/${cpfLimpo}`);

      // Se o cliente não existir, o pedido não pode prosseguir
      if (!resCpf.data.existe) {
        alert("CPF não cadastrado!");
        return;
      }

      // -------------------------------
      // REGISTRO DO PEDIDO
      // -------------------------------
      // Envia os dados do pedido para o backend
      // Utiliza a tabela de pedidos padrão do sistema
      await api.post("/pedidos", {
        cpf: cpfLimpo,
        menu_id: 8,           // ID do produto selecionado
        produto_nome: produto.nome,    // Nome do lanche
        preco: produto.preco,          // Preço unitário
        quantidade: quantidade,        // Quantidade escolhida
        total: produto.preco * quantidade // Valor total calculado
      });

      // Mensagem de confirmação ao usuário
      alert("Pedido realizado com sucesso!");

      // -------------------------------
      // LIMPEZA DOS ESTADOS
      // -------------------------------
      // Reseta o fluxo após finalizar o pedido
      setProduto(null);
      setCpf("");
      setEtapa(null);

    } catch (err) {
      // Caso ocorra erro em qualquer etapa
      console.error(err);
      alert("Erro ao realizar pedido");
    }
  }

  // =====================================================
  // RENDERIZAÇÃO DA INTERFACE
  // =====================================================

  return (
    <div className="conteudo">
      <h1>Lanches</h1>

      {/* LISTA DE LANCHES */}
      <div className="lista-grid">
        {lanches.map(item => (
          <div key={item.id} className="card">

            {/* Imagem do lanche servida pelo backend */}
            <img
              src={`http://localhost:3001${item.imagem}`}
              alt={item.nome}
              className="menu-img"
            />

            {/* Informações do lanche */}
            <h3>{item.nome}</h3>
            <p>{item.descricao}</p>
            <strong>R$ {item.preco}</strong>

            {/* Botão que inicia o fluxo de compra */}
            <button onClick={() => abrirQuantidade(item)}>
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* ================================================= */}
      {/* MODAL DE QUANTIDADE */}
      {/* ================================================= */}
      {etapa === "qtd" && (
        <div className="modal">
          <div className="modal-box">
            <h3>{produto.nome}</h3>

            {/* Campo para escolha da quantidade */}
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={e => setQuantidade(e.target.value)}
            />

            {/* Confirma ou cancela a etapa */}
            <button onClick={confirmarQuantidade}>Confirmar</button>
            <button onClick={() => setEtapa(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MODAL DE CPF */}
      {/* ================================================= */}
      {etapa === "cpf" && (
        <div className="modal">
          <div className="modal-box">
            <h3>Digite o CPF</h3>

            {/* Campo de entrada do CPF */}
            <input
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              placeholder="CPF"
            />

            {/* Finaliza ou cancela o pedido */}
            <button onClick={confirmarPedido}>
              Finalizar Pedido
            </button>
            <button onClick={() => setEtapa(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
