import { useEffect, useState } from "react";
import { api } from "../services/api";
import "./Menu.css";

export default function Sucos() {
  const [sucos, setSucos] = useState([]);

  // controle de compra
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [cpf, setCpf] = useState("");
  const [etapa, setEtapa] = useState(null); // null | qtd | cpf

  useEffect(() => {
    api.get("/sucos")
      .then(res => setSucos(res.data))
      .catch(err => console.error(err));
  }, []);

  function abrirQuantidade(item) {
    setProduto(item);
    setQuantidade(1);
    setEtapa("qtd");
  }

  function confirmarQuantidade() {
    setEtapa("cpf");
  }

  async function confirmarPedido() {
    try {
      const cpfLimpo = cpf.replace(/\D/g, "");

      if (cpfLimpo.length !== 11) {
        alert("CPF inválido");
        return;
      }

      // ✅ MESMA VERIFICAÇÃO DO MENU E LANCHES
      const resCpf = await api.get(`/clientes/cpf/${cpfLimpo}`);

      if (!resCpf.data.existe) {
        alert("CPF não cadastrado!");
        return;
      }

      await api.post("/pedidos", {
        cpf: cpfLimpo,
        menu_id: 8,
        produto_nome: produto.nome,
        preco: produto.preco,
        quantidade,
        total: produto.preco * quantidade
      });

      alert("Pedido realizado com sucesso!");

      setProduto(null);
      setCpf("");
      setEtapa(null);

    } catch (err) {
      console.error(err);
      alert("Erro ao realizar pedido");
    }
  }

  return (
    <div className="conteudo">
      <h1>Sucos</h1>

      <div className="lista-grid">
        {sucos.map(item => (
          <div key={item.id} className="card">
            <img
              src={`http://localhost:3001${item.imagem}`}
              alt={item.nome}
              className="menu-img"
            />
            <h3>{item.nome}</h3>
            <p>{item.descricao}</p>
            <strong>R$ {item.preco}</strong>

            <button onClick={() => abrirQuantidade(item)}>
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* MODAL QUANTIDADE */}
      {etapa === "qtd" && (
        <div className="modal">
          <div className="modal-box">
            <h3>{produto.nome}</h3>

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

      {/* MODAL CPF */}
      {etapa === "cpf" && (
        <div className="modal">
          <div className="modal-box">
            <h3>Digite o CPF</h3>

            <input
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              placeholder="CPF"
            />

            <button onClick={confirmarPedido}>Finalizar Pedido</button>
            <button onClick={() => setEtapa(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
