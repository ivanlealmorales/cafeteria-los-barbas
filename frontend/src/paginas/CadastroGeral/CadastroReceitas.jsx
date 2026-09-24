import { Link } from "react-router-dom";
import "./Padrao.css"; // reutiliza estilo

export default function CadastroReceitas() {
  return (
    <div>
      <h2>Cadastro de Receitas</h2>

      <p>Escolha a operação:</p>

      <ul>
        <li><Link to="/cadastro-geral/receitas/cadastrar">Cadastrar</Link></li>
        <li><Link to="/cadastro-geral/receitas/listar">Listar / Alterar / Deletar</Link></li>
      </ul>
    </div>
  );
}
