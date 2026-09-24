// Hooks do React para controle de estado
import { useState } from "react";

// Instância central da API (Axios)
import { api } from "../../services/api";

// Link para navegação entre rotas administrativas
import { Link } from "react-router-dom";

// Estilos específicos da Central de Cadastros
import "./CadastroGeral.css";

// =====================================================
// COMPONENTE CADASTRO GERAL
// =====================================================

// Este componente centraliza a manutenção de dados do sistema,
// permitindo pesquisar, editar, ocultar e excluir registros
export default function CadastroGeral() {

  // Categoria atual selecionada (menu, lanches, sucos ou clientes)
  const [categoria, setCategoria] = useState(null);

  // Modo de funcionamento da tela:
  // idle   → nenhuma ação
  // busca  → pesquisa ativa
  // edicao → edição de registro
  const [modo, setModo] = useState("idle");

  // Texto digitado no campo de busca
  const [busca, setBusca] = useState("");

  // Dados completos da categoria carregada
  const [dadosCategoria, setDadosCategoria] = useState([]);

  // Resultados filtrados conforme a busca
  const [resultados, setResultados] = useState([]);

  // Item atualmente selecionado para edição
  const [editingItem, setEditingItem] = useState(null);

  // -------------------------------
  // CAMPOS COMUNS (PRODUTOS)
  // -------------------------------

  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editPreco, setEditPreco] = useState("");

  // -------------------------------
  // CAMPOS ESPECÍFICOS DE CLIENTE
  // -------------------------------

  const [editTelefone, setEditTelefone] = useState("");
  const [editEndereco, setEditEndereco] = useState("");
  const [editNumero, setEditNumero] = useState("");
  const [editBairro, setEditBairro] = useState("");
  const [editCidade, setEditCidade] = useState("");
  const [editEstado, setEditEstado] = useState("");

  // =====================================================
  // ABRE A PESQUISA DA CATEGORIA
  // =====================================================

  async function abrirPesquisa(tipo) {
    setCategoria(tipo);
    setModo("busca");
    setBusca("");
    setResultados([]);
    setEditingItem(null);

    // Ajusta endpoint para clientes
    const endpoint = tipo === "clientes" ? "pessoafisica" : tipo;

    try {
      const res = await api.get(`/${endpoint}`);
      setDadosCategoria(res.data || []);
    } catch {
      setDadosCategoria([]);
    }
  }

  // =====================================================
  // FILTRO DE PESQUISA
  // =====================================================

  function pesquisar(texto) {
    setBusca(texto);

    // Se o campo estiver vazio, limpa resultados
    if (!texto.trim()) {
      setResultados([]);
      return;
    }

    // Filtra por CPF (clientes) ou nome (produtos)
    const filtrados = dadosCategoria.filter(item =>
      categoria === "clientes"
        ? (item.cpf || "").includes(texto)
        : (item.nome || "").toLowerCase().includes(texto.toLowerCase())
    );

    setResultados(filtrados);
  }

  // =====================================================
  // SELEÇÃO DO ITEM PARA EDIÇÃO
  // =====================================================

  function selecionarItem(item) {
    setEditingItem(item);
    setModo("edicao");
    setBusca("");
    setResultados([]);

    // Preenche campos conforme a categoria
    if (categoria === "clientes") {
      setEditNome(item.nome || "");
      setEditTelefone(item.telefone || "");
      setEditEndereco(item.endereco || "");
      setEditNumero(item.numero || "");
      setEditBairro(item.bairro || "");
      setEditCidade(item.cidade || "");
      setEditEstado(item.estado || "");
    } else {
      setEditNome(item.nome || "");
      setEditDescricao(item.descricao || "");
      setEditPreco(item.preco || "");
    }
  }

  // Cancela a edição e volta para a busca
  function cancelar() {
    setModo("busca");
    setEditingItem(null);
  }

  // =====================================================
  // SALVA ALTERAÇÕES
  // =====================================================

  async function salvarEdicao() {
    const endpoint = categoria === "clientes" ? "pessoafisica" : categoria;

    try {
      if (categoria === "clientes") {
        await api.put(`/${endpoint}/${editingItem.id}`, {
          nome: editNome,
          telefone: editTelefone,
          endereco: editEndereco,
          numero: editNumero,
          bairro: editBairro,
          cidade: editCidade,
          estado: editEstado
        });
      } else {
        await api.put(`/${endpoint}/${editingItem.id}`, {
          nome: editNome,
          descricao: editDescricao,
          preco: editPreco
        });
      }

      alert("Atualizado com sucesso!");
      abrirPesquisa(categoria);
    } catch {
      alert("Erro ao atualizar");
    }
  }

  // =====================================================
  // EXCLUSÃO DE ITEM
  // =====================================================

  async function excluirItem() {
    if (!window.confirm("Deseja excluir este item definitivamente?")) return;

    try {
      await api.delete(`/${categoria}/${editingItem.id}`);
      alert("Item excluído com sucesso!");
      abrirPesquisa(categoria);
    } catch (err) {
      alert(
        err.response?.data?.erro ||
        "Não pode ser excluído, existe ligação com cliente"
      );
    }
  }

  // =====================================================
  // OCULTAÇÃO DE ITEM
  // =====================================================

  async function ocultarItem() {
    if (!window.confirm("Deseja ocultar este item?")) return;

    try {
      await api.put(`/${categoria}/${editingItem.id}/ocultar`);
      alert("Item ocultado com sucesso!");
      abrirPesquisa(categoria);
    } catch {
      alert("Erro ao ocultar item");
    }
  }

  // =====================================================
  // RENDERIZAÇÃO DA INTERFACE
  // =====================================================

  return (
    <div className="cadastro-geral">
      <h2>Central de Cadastros</h2>

      {/* Lista de categorias disponíveis */}
      <ul className="lista-opcoes">
        {["menu", "lanches", "sucos", "clientes"].map(tipo => (
          <li key={tipo}>
            <Link to={`/cadastro-geral/${tipo}`}>
              Cadastro de {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Link>
            <button
              className={`btn-pesquisar ${categoria === tipo ? "ativo" : ""}`}
              onClick={() => abrirPesquisa(tipo)}
            >
              Pesquisar
            </button>
          </li>
        ))}
      </ul>

      {/* Área de busca */}
      {modo === "busca" && (
        <div className="area-pesquisa">
          {categoria === "clientes" && <strong>Pesquisa por CPF</strong>}

          <input
            className="input-pesquisa"
            placeholder={categoria === "clientes" ? "Digite o CPF" : "Digite o nome"}
            value={busca}
            onChange={e => pesquisar(e.target.value)}
          />

          {resultados.length > 0 && (
            <div className="resultados-container">
              {resultados.map(item => (
                <div
                  key={item.id}
                  className="resultado-item"
                  onClick={() => selecionarItem(item)}
                >
                  {categoria === "clientes"
                    ? `${item.nome} - CPF: ${item.cpf}`
                    : item.nome}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Área de edição */}
      {modo === "edicao" && editingItem && (
        <div className="card-edicao">
          <h3>Editar</h3>

          <input value={editNome} onChange={e => setEditNome(e.target.value)} />

          {categoria === "clientes" ? (
            <>
              <input value={editTelefone} onChange={e => setEditTelefone(e.target.value)} />
              <input value={editEndereco} onChange={e => setEditEndereco(e.target.value)} />
              <input value={editNumero} onChange={e => setEditNumero(e.target.value)} />
              <input value={editBairro} onChange={e => setEditBairro(e.target.value)} />
              <input value={editCidade} onChange={e => setEditCidade(e.target.value)} />
              <input value={editEstado} onChange={e => setEditEstado(e.target.value)} />
            </>
          ) : (
            <>
              <input value={editDescricao} onChange={e => setEditDescricao(e.target.value)} />
              <input value={editPreco} onChange={e => setEditPreco(e.target.value)} />
            </>
          )}

          <div className="botoes-edicao">
            <button onClick={salvarEdicao}>Salvar</button>
            <button onClick={cancelar}>Cancelar</button>

            {["menu", "lanches", "sucos"].includes(categoria) && (
              <>
                <button onClick={ocultarItem}>Ocultar</button>
                <button onClick={excluirItem}>Excluir</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
