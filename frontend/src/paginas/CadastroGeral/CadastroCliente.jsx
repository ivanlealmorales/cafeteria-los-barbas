// Hooks do React para controle de estado e ciclo de vida
import { useEffect, useState } from "react";

// Instância central da API (Axios)
import { api } from "../../services/api";

// Estilo visual padrão reutilizado
import "./Padrao.css";

// =====================================================
// COMPONENTE CADASTRO DE CLIENTES
// =====================================================

// Este componente permite:
// - Pesquisar clientes pelo CPF
// - Reutilizar dados existentes
// - Cadastrar novos clientes no sistema
export default function CadastroClientes() {

  // CPF digitado no campo de busca
  const [cpfBusca, setCpfBusca] = useState("");

  // Lista completa de clientes carregados do backend
  const [clientes, setClientes] = useState([]);

  // Sugestões filtradas conforme a digitação do CPF
  const [sugestoes, setSugestoes] = useState([]);

  // -------------------------------
  // DADOS DO CLIENTE
  // -------------------------------

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // CPF exibido apenas como confirmação visual
  const [cpfSelecionado, setCpfSelecionado] = useState("");

  // Último cliente cadastrado
  const [ultimo, setUltimo] = useState(null);

  // =====================================================
  // CARREGAMENTO INICIAL DOS CLIENTES
  // =====================================================

  // Executado ao montar o componente
  // Busca todos os clientes cadastrados
  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const res = await api.get("/pessoafisica");
      setClientes(res.data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  }

  // =====================================================
  // FILTRO DE SUGESTÕES POR CPF
  // =====================================================

  useEffect(() => {
    // Só inicia a busca a partir de 3 caracteres
    if (cpfBusca.length < 3) {
      setSugestoes([]);
      return;
    }

    // Filtra clientes cujo CPF começa com o texto digitado
    const filtrados = clientes.filter(c =>
      c.cpf.startsWith(cpfBusca.replace(/\D/g, ""))
    );

    setSugestoes(filtrados);
  }, [cpfBusca, clientes]);

  // =====================================================
  // SELEÇÃO DE CLIENTE EXISTENTE
  // =====================================================

  function selecionarCliente(cliente) {
    // Exibe CPF selecionado como confirmação visual
    setCpfSelecionado(cliente.cpf);

    // Preenche os campos do formulário
    setNome(cliente.nome);
    setCpf(cliente.cpf);
    setTelefone(cliente.telefone || "");
    setEndereco(cliente.endereco || "");
    setNumero(cliente.numero || "");
    setBairro(cliente.bairro || "");
    setCidade(cliente.cidade || "");
    setEstado(cliente.estado || "");

    // Atualiza campo de busca e limpa sugestões
    setCpfBusca(cliente.cpf);
    setSugestoes([]);
  }

  // =====================================================
  // SALVAR NOVO CLIENTE
  // =====================================================

  async function salvarCliente(e) {
    e.preventDefault();

    try {
      // Envia dados do cliente para o backend
      await api.post("/pessoafisica", {
        nome,
        cpf,
        telefone,
        endereco,
        numero,
        bairro,
        cidade,
        estado
      });

      alert("Cliente cadastrado com sucesso!");

      // Recarrega lista de clientes
      const res = await api.get("/pessoafisica");
      setClientes(res.data);

      // Guarda o último cliente cadastrado
      if (res.data.length > 0) {
        setUltimo(res.data[res.data.length - 1]);
      }

      // Limpa todos os campos do formulário
      setCpfBusca("");
      setCpfSelecionado("");
      setNome("");
      setCpf("");
      setTelefone("");
      setEndereco("");
      setNumero("");
      setBairro("");
      setCidade("");
      setEstado("");
      setSugestoes([]);

    } catch (err) {
      // Tratamento de erro de CPF duplicado
      if (err.response?.status === 409) {
        alert("CPF já cadastrado");
      } else {
        alert("Erro ao cadastrar cliente");
      }
    }
  }

  // =====================================================
  // RENDERIZAÇÃO DA INTERFACE
  // =====================================================

  return (
    <div className="container">
      <h2>Cadastrar Cliente</h2>

      {/* Campo de busca por CPF */}
      <input
        placeholder="Pesquisar CPF"
        value={cpfBusca}
        onChange={e => setCpfBusca(e.target.value)}
      />

      {/* Lista de sugestões de clientes */}
      {sugestoes.length > 0 && (
        <ul className="lista-sugestoes">
          {sugestoes.map(c => (
            <li key={c.id} onClick={() => selecionarCliente(c)}>
              {c.cpf} — {c.nome}
            </li>
          ))}
        </ul>
      )}

      {/* Formulário de cadastro */}
      <form onSubmit={salvarCliente}>

        {/* Confirmação visual do CPF selecionado */}
        {cpfSelecionado && (
          <div style={{ marginBottom: "10px" }}>
            <label>CPF selecionado</label>
            <input value={cpfSelecionado} disabled />
          </div>
        )}

        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
        <input placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} />
        <input placeholder="Número" value={numero} onChange={e => setNumero(e.target.value)} />
        <input placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
        <input placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
        <input placeholder="Estado" value={estado} onChange={e => setEstado(e.target.value)} />

        <button type="submit">Salvar</button>
      </form>

      {/* Exibição do último cliente cadastrado */}
      {ultimo && (
        <>
          <h2>Último cliente cadastrado</h2>

          <div className="lista-grid">
            <div className="card">
              <h3>{ultimo.nome}</h3>
              <p><strong>CPF:</strong> {ultimo.cpf}</p>
              <p><strong>Telefone:</strong> {ultimo.telefone}</p>
              <p>
                <strong>Endereço:</strong> {ultimo.endereco}, {ultimo.numero} – {ultimo.bairro}
              </p>
              <p>
                <strong>Cidade:</strong> {ultimo.cidade} / {ultimo.estado}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
