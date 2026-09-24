// Hooks do React:
// useState → controle de estados
// useRef   → referência direta ao input file
import { useState, useRef } from "react";

// Instância central da API (Axios)
import { api } from "../../services/api";

// Estilo visual padrão reutilizado
import "./Padrao.css";

// =====================================================
// COMPONENTE CADASTRO DE SUCOS
// =====================================================

// Este componente permite cadastrar novos sucos,
// seguindo o mesmo padrão visual e funcional
// do cadastro de Menu e Lanches
export default function CadastroSucos() {

  // -------------------------------
  // ESTADOS DOS CAMPOS DO FORMULÁRIO
  // -------------------------------

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);

  // Nome do arquivo selecionado (feedback visual)
  const [nomeArquivo, setNomeArquivo] = useState("Nenhum arquivo selecionado");

  // Último suco cadastrado (confirmação visual)
  const [ultimo, setUltimo] = useState(null);

  // Referência direta ao input type="file"
  const inputFile = useRef(null);

  // =====================================================
  // SELEÇÃO DE ARQUIVO
  // =====================================================

  // Dispara manualmente o seletor de arquivos
  function escolherArquivo() {
    inputFile.current.click();
  }

  // =====================================================
  // SALVAR SUCO
  // =====================================================

  async function salvar(e) {
    e.preventDefault();

    // Validação básica dos campos obrigatórios
    if (!nome || !descricao || !preco || !imagem) {
      alert("Preencha todos os campos!");
      return;
    }

    // Criação do FormData para envio de dados + imagem
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);

    // Padroniza o preço para formato aceito pelo backend
    formData.append("preco", String(preco).replace(",", "."));

    // Anexa a imagem selecionada
    formData.append("imagem", imagem);

    try {
      // Envia os dados para o backend
      await api.post("/sucos", formData);

      alert("Suco cadastrado com sucesso!");

      // Busca os sucos atualizados para obter o último cadastrado
      const res = await api.get("/sucos");
      if (res.data.length > 0) {
        setUltimo(res.data[res.data.length - 1]);
      }

      // Limpa o formulário após sucesso
      setNome("");
      setDescricao("");
      setPreco("");
      setImagem(null);
      setNomeArquivo("Nenhum arquivo selecionado");
      if (inputFile.current) inputFile.current.value = "";

    } catch (err) {
      // Tratamento de erro de cadastro
      console.error("Erro ao cadastrar suco:", err);
      alert(
        err.response?.data?.erro ||
        "Erro ao cadastrar suco"
      );
    }
  }

  // =====================================================
  // RENDERIZAÇÃO DA INTERFACE
  // =====================================================

  return (
    <div className="container">
      <h1>Cadastrar Suco</h1>

      {/* Formulário de cadastro */}
      <form onSubmit={salvar} className="card form-lanche">

        <input
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={preco}
          onChange={e => setPreco(e.target.value)}
        />

        {/* Input file oculto, acionado por botão */}
        <input
          type="file"
          accept="image/*"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files[0];
            setImagem(file || null);
            setNomeArquivo(file ? file.name : "Nenhum arquivo selecionado");
          }}
        />

        {/* Área personalizada de upload */}
        <div className="upload-area">
          <button
            type="button"
            className="btn-upload"
            onClick={escolherArquivo}
          >
            Selecionar imagem
          </button>
          <span className="nome-arquivo">{nomeArquivo}</span>
        </div>

        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </form>

      {/* Confirmação visual do último suco cadastrado */}
      {ultimo && (
        <>
          <h2>Último suco cadastrado</h2>

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
