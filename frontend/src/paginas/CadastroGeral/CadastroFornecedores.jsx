import { Link } from "react-router-dom";

export default function CadastroFornecedores() {
  return (
    <div>
      <h2>Cadastro de Fornecedores</h2>

      <p>Escolha a operação:</p>

      <ul>
        <li><Link to="/cadastro-geral/fornecedores/cadastrar">Cadastrar</Link></li>
        <li><Link to="/cadastro-geral/fornecedores/listar">Listar / Alterar / Deletar</Link></li>
      </ul>
    </div>
  );
}
