// Hooks do React:
// useState → controle de estados
// useRef   → referência direta ao input file
import { useState, useRef } from "react";

// Instância central da API (Axios)
import { api } from "../../services/api";

// Estilos visuais padrão
import "./Padrao.css";

// =====================================================
// COMPONENTE CADASTRO DE MENU
// =====================================================

// Este componente permite cadastrar novos produtos
// no menu principal da cafeteria
export default function CadastroMenu() {

  // -------------------------------
  // ESTADOS DOS CAMPOS DO FORMULÁRIO
  // -------------------------------

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);

  // Nome do arquivo selecionado (feedback visual)
  const [nomeArquivo, setNomeArquivo] = useState("Nenhum arquivo selecionado");

  // Último produto cadastrado
  const [ultimo, setUltimo] = useState(null);

  // Referência direta ao input type="file"
  const inputFile = useRef(null);

  // =====================================================
  // SELEÇÃO DE ARQUIVO
  // =====================================================

  // Abre o seletor de arquivos manualmente
  function escolherArquivo() {
    inputFile.current.click();
  }

  // =====================================================
  // SALVAR PRODUTO
  // =====================================================

  function salvar(e) {
    e.preventDefault();

    // Validação básica dos campos obrigatórios
    if (!nome.trim() || !descricao.trim() || !preco || !imagem) {
      alert("Preencha todos os campos!");
      return;
    }

    // Criação do FormData para envio de dados + imagem
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);

    // Padroniza preço para formato aceito pelo backend
    const precoFormatado = preco.replace(",", ".");
    formData.append("preco", precoFormatado);

    // Anexa imagem ao formulário
    formData.append("imagem", imagem);

    // Envia dados para o backend
    api.post("/menu", formData)
      .then(() => {
        alert("Produto do menu cadastrado!");

        // Busca os produtos atualizados no banco
        return api.get("/menu");
      })
      .then(res => {
        // Armazena o último produto cadastrado
        if (res.data.length > 0) {
          setUltimo(res.data[res.data.length - 1]);
        }

        // Limpa formulário após sucesso
        setNome("");
        setDescricao("");
        setPreco("");
        setImagem(null);
        setNomeArquivo("Nenhum arquivo selecionado");
        inputFile.current.value = "";
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao cadastrar produto do menu");
      });
  }

  // =====================================================
  // RENDERIZAÇÃO DA INTERFACE
  // =====================================================

  return (
    <div className="container">
      <h1>Cadastrar Produto do Menu</h1>

      {/* Formulário de cadastro */}
      <form onSubmit={salvar} className="card form-lanche">

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        {/* Input file oculto (controlado via botão) */}
        <input
          type="file"
          accept="image/*"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={(e) => {
            setImagem(e.target.files[0]);
            setNomeArquivo(e.target.files[0]?.name || "Nenhum arquivo selecionado");
          }}
        />

        {/* Área de upload personalizada */}
        <div className="upload-area">
          <button type="button" className="btn-upload" onClick={escolherArquivo}>
            Selecionar imagem
          </button>
          <span className="nome-arquivo">{nomeArquivo}</span>
        </div>

        <button type="submit" className="btn-primary">Salvar</button>
      </form>

      {/* Exibição do último produto cadastrado */}
      {ultimo && (
        <>
          <h2>Último produto cadastrado</h2>

          <div className="lista-grid">
            <div className="card">
              <img
                className="menu-img"
                src={`http://localhost:3001${ultimo.imagem}`}
                alt={ultimo.nome}
              />
              <h3>{ultimo.nome}</h3>
              <p>{ultimo.descricao}</p>

              {/* Proteção contra valor inválido */}
              <strong>
                R$ {ultimo.preco ? Number(ultimo.preco).toFixed(2) : "0.00"}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
