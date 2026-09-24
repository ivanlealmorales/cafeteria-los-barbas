// =====================================================
// IMPORTAÇÕES
// =====================================================

// Link é usado para navegação sem recarregar a página
// useLocation permite saber qual rota está ativa no momento
import { Link, useLocation } from "react-router-dom";

// Estilos específicos do cabeçalho
import "./Header.css";

// =====================================================
// COMPONENTE HEADER
// =====================================================

export default function Header() {

  // Hook que retorna informações da rota atual
  // Usado aqui para destacar o item de menu ativo
  const location = useLocation();

  // Lista centralizada de itens do menu de navegação
  // Facilita manutenção e evita repetição de código
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/lanches", label: "Lanches" },
    { path: "/sucos", label: "Sucos" },
    { path: "/receitas", label: "Receitas" },
    { path: "/pedidos", label: "Pedidos" },
    { path: "/cadastro-geral", label: "Cadastros" }
  ];

  return (
    // Elemento semântico de cabeçalho
    <header className="header">

      {/* Logo/título fixo do sistema */}
      <h1 className="logo">☕ Cafeteria</h1>

      {/* Navegação principal */}
      <nav>
        <ul className="nav-list">

          {/* Gera os links dinamicamente a partir do array navItems */}
          {navItems.map(item => (

            <li
              key={item.path}

              // Aplica a classe "ativo" quando a rota atual
              // corresponde ao caminho do item
              className={location.pathname === item.path ? "ativo" : ""}
            >
              {/* Link do React Router evita reload da página */}
              <Link to={item.path}>
                {item.label}
              </Link>
            </li>

          ))}
        </ul>
      </nav>
    </header>
  );
}
