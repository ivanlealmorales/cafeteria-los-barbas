// =====================================================
// IMPORTAÇÕES PRINCIPAIS DO REACT
// =====================================================

// StrictMode é um recurso do React que ajuda a identificar
// problemas no código durante o desenvolvimento.
// Ele NÃO afeta o funcionamento em produção.
import { StrictMode } from 'react'

// createRoot é a nova API do React 18 para renderização
// mais eficiente e preparada para concorrência.
import { createRoot } from 'react-dom/client'

// Importação do CSS global da aplicação.
// Aqui ficam estilos que afetam todo o sistema.
import './index.css'

// Importa o componente principal da aplicação.
// Todo o frontend parte deste componente.
import App from './App.jsx'

// =====================================================
// RENDERIZAÇÃO DA APLICAÇÃO
// =====================================================

// createRoot seleciona o elemento HTML com id="root"
// que está definido no arquivo index.html.
createRoot(document.getElementById('root')).render(

  // StrictMode envolve a aplicação inteira
  // Ele executa verificações extras em desenvolvimento,
  // como renderizações duplicadas para detectar erros.
  <StrictMode>

    {/* 
      App é o componente raiz do sistema.
      Dentro dele estão:
      - rotas
      - layout geral
      - páginas
      - componentes principais
    */}
    <App />

  </StrictMode>
)
