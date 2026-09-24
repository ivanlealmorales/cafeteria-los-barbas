// Importa o arquivo de estilos específico da página Home
// Responsável pelas cores, espaçamentos e layout visual
import "./Home.css";

// =====================================================
// COMPONENTE HOME
// =====================================================
// Este componente representa a página inicial do sistema.
// Ele é totalmente estático (não possui estado nem lógica),
// sendo usado apenas para exibição de conteúdo institucional
// e informativo sobre a cafeteria.
export default function Home() {
  return (
    // Container principal da página Home
    <div className="home">

      {/* ================================================= */}
      {/* SEÇÃO: HISTÓRIA DO CAFÉ */}
      {/* ================================================= */}
      <div className="historia-cafe">
        <h3>História do Café</h3>

        {/* Texto informativo sobre a origem histórica do café */}
        <p>
          O café tem origem nas montanhas da Etiópia, no século IX. Conta-se que o pastor
          Kaldi percebeu o vigor de suas cabras após comerem frutos vermelhos de um
          arbusto. Curioso, levou os grãos a um monge, que os utilizou para preparar uma
          bebida que o ajudava a permanecer desperto durante as longas orações noturnas.
        </p>

        {/* Expansão do café pelo mundo e chegada à Europa e ao Brasil */}
        <p>
          A partir daí, o café se espalhou pelo mundo árabe, tornando-se um elemento
          importante na vida social e religiosa. No século XVII, chegou à Europa, onde os
          cafés se transformaram em locais de debates e encontros culturais. No século XVIII,
          o cultivo chegou ao Brasil, tornando-se base da economia por décadas.
        </p>

        {/* Contexto atual do café como símbolo cultural */}
        <p>
          Atualmente, o café é símbolo de energia e convivência, presente em lares,
          escritórios e cafeterias de todo o planeta. Ele continua representando tradição,
          acolhimento e um ritual diário de pausa e prazer.
        </p>

        {/* Espaçamento visual entre seções */}
        <br></br>
      </div>

      {/* ================================================= */}
      {/* SEÇÃO: PRODUÇÃO E CULTURA DO CAFÉ */}
      {/* ================================================= */}
      <div className="historia-cafe">
        <h3>Produção e Cultura do Café</h3>

        {/* Informações sobre o cultivo e regiões produtoras */}
        <p>
          O cultivo do café exige clima tropical e altitude elevada, fatores que favorecem
          regiões como Minas Gerais, São Paulo e Espírito Santo. Cada etapa — do plantio à
          torrefação — influencia diretamente o aroma e o sabor final da bebida.
        </p>

        {/* Processo de colheita, secagem e torra */}
        <p>
          A colheita pode ser manual ou mecanizada, e os grãos passam por processos de
          secagem, torra e moagem. A torra, em especial, define notas de sabor que variam do
          doce e achocolatado ao amargo e intenso, refletindo o estilo de cada produtor.
        </p>

        {/* Importância cultural do café no Brasil */}
        <p>
          Além de sua importância econômica, o café faz parte da cultura brasileira. Está
          presente em expressões populares, em reuniões de trabalho e no cotidiano das
          famílias, simbolizando hospitalidade, afeto e tradição nacional.
        </p>

        {/* Mensagem de encerramento da seção */}
        <p> Portanto, sinta prazer em tomar nosso café</p>
      </div>

      {/* ================================================= */}
      {/* SEÇÃO PRINCIPAL DE BOAS-VINDAS */}
      {/* ================================================= */}
      <div className="conteudo-principal">
        <h2>Bem-vindo à Cafeteria Aroma</h2>

        {/* Mensagens institucionais */}
        <p>Desfrute do melhor café da cidade.</p>
        <p>Feito com amor e grãos selecionados.</p>

        {/* Imagem ilustrativa de café servido */}
        <img
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
          alt="Café em xícara"
        />

        {/* Imagem ilustrativa de grãos de café */}
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800"
          alt="Grãos de café torrados"
        />
      </div>
    </div>
  );
}
