// =====================================================
// IMPORTAÇÕES
// =====================================================

// Hooks do React para controle de estado e ciclo de vida
import { useEffect, useState } from "react";

// Instância central da API (Axios)
// Responsável pela comunicação com o backend
import { api } from "../services/api";

// Estilos específicos da página de menu
import "./Menu.css";

// =====================================================
// COMPONENTE MENU
// =====================================================

// Componente responsável por exibir os produtos do menu
// e controlar todo o fluxo de compra
export default function Menu() {

  // -------------------------------
  // ESTADO: LISTA DE PRODUTOS
  // -------------------------------

  // Armazena os produtos retornados do backend (/menu)
  const [menu, setMenu] = useState([]);

  // -------------------------------
  // ESTADOS: CONTROLE DO FLUXO DE COMPRA
  // -------------------------------

  // Produto selecionado para compra
  const [produto, setProduto] = useState(null);

  // Quantidade escolhida pelo cliente
  const [quantidade, setQuantidade] = useState(1);

  // CPF digitado pelo cliente
  const [cpf, setCpf] = useState("");

  // Controla a etapa atual do fluxo de compra
  // null → nenhuma ação
  // "qtd" → escolha de quantidade
  // "cpf" → digitação do CPF
  const [etapa, setEtapa] = useState(null);

  // =====================================================
  // CARREGAMENTO INICIAL DO MENU
  // =====================================================

  // Executado automaticamente quando o componente é montado
  // Busca apenas os produtos ativos do menu no backend
  useEffect(() => {
    api.get("/menu").then(res => setMenu(res.data));
  }, []);

  // =====================================================
  // FLUXO DE COMPRA
  // =====================================================

  // Inicia o fluxo de compra ao clicar em "Comprar"
  // Define o produto selecionado e abre o modal de quantidade
  function abrirQuantidade(item) {
    setProduto(item);
    setQuantidade(1);
    setEtapa("qtd");
  }

  // Confirma a quantidade escolhida
  // Avança para a etapa de digitação do CPF
  function confirmarQuantidade() {
    setEtapa("cpf");
  }

  // =====================================================
  // CONFIRMAÇÃO DO PEDIDO
  // =====================================================

  // Função responsável por:
  // 1. Validar o CPF
  // 2. Verificar se o cliente existe
  // 3. Calcular o total do pedido
  // 4. Registrar o pedido no backend
  async function confirmarPedido() {
    try {
      // Remove qualquer caractere não numérico do CPF
      const cpfLimpo = cpf.replace(/\D/g, "");

      // -------------------------------
      // VALIDAÇÃO DO CPF
      // -------------------------------
      // Garante que o CPF possui exatamente 11 dígitos
      if (cpfLimpo.length !== 11) {
        alert("CPF inválido. Digite os 11 números.");
        return;
      }

      // -------------------------------
      // VERIFICAÇÃO DE CLIENTE
      // -------------------------------
      // Consulta o backend para verificar se o CPF está cadastrado
      const resCpf = await api.get(`/clientes/cpf/${cpfLimpo}`);

      // Caso o cliente não exista, o pedido não é finalizado
      if (!resCpf.data.existe) {
        alert("CPF não cadastrado!");
        return;
      }

      // -------------------------------
      // CÁLCULO DO TOTAL
      // -------------------------------
      // Calcula o valor total do pedido
      const total = Number(produto.preco) * Number(quantidade);

      // -------------------------------
      // REGISTRO DO PEDIDO
      // -------------------------------
      // Envia os dados do pedido para o backend
      await api.post("/pedidos", {
        cpf: cpfLimpo,
        menu_id: produto.id,
        produto_nome: produto.nome,
        preco: produto.preco,
        quantidade: Number(quantidade),
        total: total
      });

      // Mensagem de confirmação
      alert("Pedido realizado com sucesso!");

      // -------------------------------
      // LIMPEZA DE ESTADO
      // -------------------------------
      // Reseta o fluxo após finalizar o pedido
      setProduto(null);
      setCpf("");
      setEtapa(null);

    } catch (err) {
      // Tratamento de erro em qualquer etapa do processo
      console.error("Erro ao realizar pedido:", err);
      alert("Erro ao realizar pedido");
    }
  }

  // =====================================================
  // RENDERIZAÇÃO DA TELA
  // =====================================================

  return (
    <div className="conteudo">
      <h1>Menu</h1>

      {/* LISTAGEM DOS PRODUTOS DO MENU */}
      <div className="lista-grid">
        {menu.map(item => (
          <div key={item.id} className="card">

            {/* Imagem do produto servida pelo backend */}
            <img
              src={`http://localhost:3001${item.imagem}`}
              alt={item.nome}
              className="menu-img"
            />

            {/* Informações do produto */}
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
            <p>Preço: R$ {produto.preco}</p>

            {/* Campo para escolha da quantidade */}
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={e => setQuantidade(e.target.value)}
            />

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
              placeholder="CPF"
              value={cpf}
              onChange={e => setCpf(e.target.value)}
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
