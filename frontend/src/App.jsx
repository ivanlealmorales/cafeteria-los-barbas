// =====================================================
// IMPORTAÇÕES DO REACT ROUTER
// =====================================================

// BrowserRouter (Router) controla a navegação da aplicação
// Routes agrupa todas as rotas
// Route define cada caminho (URL) da aplicação
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// =====================================================
// COMPONENTES ESTRUTURAIS (LAYOUT)
// =====================================================

// Cabeçalho fixo exibido em todas as páginas
import Header from "./cabecalho/Header";

// Rodapé fixo exibido em todas as páginas
import Footer from "./rodape/Footer";

// =====================================================
// PÁGINAS PÚBLICAS
// =====================================================

// Página inicial do sistema
import Home from "./paginas/Home";

// Página de exibição do menu principal
import Menu from "./paginas/Menu";

// Página de exibição de lanches
import Lanches from "./paginas/Lanches";

// Página de exibição de sucos
import Sucos from "./paginas/Sucos";

// Página de receitas (informativa)
import Receitas from "./paginas/Receitas";

// Página que lista pedidos em aberto
import Pedidos from "./paginas/Pedidos";

// =====================================================
// TELAS DE CADASTROS GERAIS
// =====================================================

// Tela central de manutenção (pesquisa, edição, ocultação, exclusão)
import CadastroGeral from "./paginas/CadastroGeral/CadastroGeral";

// Telas específicas de cadastro
import CadastroMenu from "./paginas/CadastroGeral/CadastroMenu";
import CadastroClientes from "./paginas/CadastroGeral/CadastroCliente";
import CadastroLanches from "./paginas/CadastroGeral/CadastroLanches";
import CadastroSucos from "./paginas/CadastroGeral/CadastroSucos";
import CadastroReceitas from "./paginas/CadastroGeral/CadastroReceitas";
import CadastroFornecedores from "./paginas/CadastroGeral/CadastroFornecedores";

// =====================================================
// ESTILOS GLOBAIS
// =====================================================

// CSS global reutilizado em todo o frontend
import "./index.css";

// =====================================================
// COMPONENTE PRINCIPAL DA APLICAÇÃO
// =====================================================

function App() {
  return (
    // Router envolve toda a aplicação
    // Ele permite navegação sem recarregar a página
    <Router>

      {/* Cabeçalho sempre visível */}
      <Header />

      {/* Container principal das páginas */}
      <div className="container">
        <Routes>

          {/* ========================================= */}
          {/* ROTAS PÚBLICAS (CLIENTE) */}
          {/* ========================================= */}

          {/* Página inicial */}
          <Route path="/" element={<Home />} />

          {/* Cardápio */}
          <Route path="/menu" element={<Menu />} />

          {/* Lanches */}
          <Route path="/lanches" element={<Lanches />} />

          {/* Sucos */}
          <Route path="/sucos" element={<Sucos />} />

          {/* Receitas (conteúdo informativo) */}
          <Route path="/receitas" element={<Receitas />} />

          {/* ========================================= */}
          {/* PEDIDOS */}
          {/* ========================================= */}

          {/* Página de pedidos em aberto */}
          <Route path="/pedidos" element={<Pedidos />} />

          {/* ========================================= */}
          {/* TELA PRINCIPAL DE CADASTROS */}
          {/* ========================================= */}

          {/* Central de cadastros e manutenção */}
          <Route path="/cadastro-geral" element={<CadastroGeral />} />

          {/* ========================================= */}
          {/* SUBTELAS DE CADASTRO */}
          {/* ========================================= */}

          {/* Cadastro de produtos do menu */}
          <Route path="/cadastro-geral/menu" element={<CadastroMenu />} />

          {/* Cadastro de lanches */}
          <Route path="/cadastro-geral/lanches" element={<CadastroLanches />} />

          {/* Cadastro de sucos */}
          <Route path="/cadastro-geral/sucos" element={<CadastroSucos />} />

          {/* Cadastro de receitas */}
          <Route path="/cadastro-geral/receitas" element={<CadastroReceitas />} />

          {/* Cadastro de clientes */}
          <Route path="/cadastro-geral/clientes" element={<CadastroClientes />} />

          {/* Cadastro de fornecedores */}
          <Route path="/cadastro-geral/fornecedores" element={<CadastroFornecedores />} />

        </Routes>
      </div>

      {/* Rodapé sempre visível */}
      <Footer />

    </Router>
  );
}

// Exporta o componente App para ser usado no main.jsx
export default App;
