// =====================================================
// IMPORTAÇÃO DE ESTILOS
// =====================================================

// Importa o arquivo CSS responsável pela estilização do rodapé
import "./Footer.css";

// =====================================================
// COMPONENTE FOOTER
// =====================================================

export default function Footer() {
  return (
    // Elemento semântico <footer>, usado para rodapés
    <footer className="footer">
      {/* 
        A classe .footer define:
        - cor de fundo
        - padding
        - borda superior
        - espaçamento geral
      */}
      
      <div className="footer-content">
        {/*
          .footer-content utiliza display:flex
          para distribuir as seções horizontalmente,
          ajustando automaticamente em telas menores
        */}

        {/* ============================= */}
        {/* SEÇÃO: SOBRE A CAFETERIA */}
        {/* ============================= */}
        <div className="footer-section">
          {/* 
            Cada bloco do rodapé utiliza a classe
            .footer-section para padronizar largura e espaçamento
          */}
          <h2 className="footer-title">Sobre Nós</h2>
          {/*
            .footer-title estiliza os títulos do rodapé:
            - cor temática
            - fonte destacada
          */}
          <p>
            A Cafeteria Aroma oferece o melhor café artesanal, em um ambiente
            acolhedor e moderno.
          </p>
        </div>

        {/* ============================= */}
        {/* SEÇÃO: CONTATO */}
        {/* ============================= */}
        <div className="footer-section">
          <h2 className="footer-title">Contato</h2>
          <p>📞 (11) 9999-9999</p>
          <p>✉️ contato@cafearoma.com</p>
        </div>

        {/* ============================= */}
        {/* SEÇÃO: ENDEREÇO */}
        {/* ============================= */}
        <div className="footer-section">
          <h2 className="footer-title">Endereço</h2>
          <p>Rua dos Grãos, 123</p>
          <p>São Paulo - SP</p>
        </div>

        {/* ============================= */}
        {/* SEÇÃO: DESENVOLVIMENTO */}
        {/* ============================= */}
        <div className="footer-section">
          <h2 className="footer-title">Desenvolvimento</h2>
          <p>SENAC - Curso FullStack</p>
          <p>São Paulo - Bauru</p>
        </div>

        {/* ============================= */}
        {/* SEÇÃO: REDES SOCIAIS */}
        {/* ============================= */}
        <div className="footer-section">
          <h2 className="footer-title">Siga-nos</h2>

          <div className="social-links">
            {/*
              .social-links organiza os links de redes sociais,
              normalmente usando flex ou column no CSS
            */}
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
