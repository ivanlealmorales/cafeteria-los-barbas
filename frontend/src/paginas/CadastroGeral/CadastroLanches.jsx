import { useState, useRef } from "react";
import { api } from "../../services/api";
import "./Padrao.css";

export default function CadastroLanches() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState("Nenhum arquivo selecionado");

  // ✅ mesmo padrão do Menu
  const [ultimo, setUltimo] = useState(null);

  const inputFile = useRef(null);

  function escolherArquivo() {
    inputFile.current.click();
  }

  async function salvar(e) {
    e.preventDefault();

    if (!nome || !descricao || !preco || !imagem) {
      alert("Preencha todos os campos!");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    formData.append("imagem", imagem);

    try {
      await api.post("/lanches", formData);

      alert("Lanche cadastrado com sucesso!");

      // ✅ busca o último lanche real no banco
      const res = await api.get("/lanches");
      if (res.data.length > 0) {
        setUltimo(res.data[res.data.length - 1]);
      }

      // limpa formulário
      setNome("");
      setDescricao("");
      setPreco("");
      setImagem(null);
      setNomeArquivo("Nenhum arquivo selecionado");
      inputFile.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar lanche");
    }
  }

  return (
    <div className="container">
      <h1>Cadastrar Lanche</h1>

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

        <input
          type="file"
          accept="image/*"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={(e) => {
            setImagem(e.target.files[0]);
            setNomeArquivo(
              e.target.files[0]?.name || "Nenhum arquivo selecionado"
            );
          }}
        />

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

      {/* ✅ MESMO PADRÃO DO MENU */}
      {ultimo && (
        <>
          <h2>Último lanche cadastrado</h2>

          <div className="lista-grid">
            <div className="card">
              <img
                className="menu-img"
                src={`http://localhost:3001${ultimo.imagem}`}
                alt={ultimo.nome}
              />
              <h3>{ultimo.nome}</h3>
              <p>{ultimo.descricao}</p>
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
