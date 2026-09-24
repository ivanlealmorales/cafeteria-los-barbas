// =====================================================
// IMPORTAÇÕES
// =====================================================

import express from "express";
import cors from "cors";
import mysql from "mysql2";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// =====================================================
// CONFIGURAÇÃO DE DIRETÓRIOS
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// INICIALIZAÇÃO DO SERVIDOR
// =====================================================

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// CONEXÃO COM BANCO DE DADOS
// Compatível com XAMPP local e Aiven no Render
// =====================================================

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cafeteria",

  ssl: process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
    : undefined
});

// =====================================================
// CONECTAR AO BANCO
// =====================================================

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
  } else {
    console.log("✅ Banco de dados conectado com sucesso!");
  }
});

// =====================================================
// ARQUIVOS ESTÁTICOS (UPLOADS)
// =====================================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// CONFIGURAÇÃO DO MULTER
// =====================================================

function criarStorage(pasta) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "uploads", pasta);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },

    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
}

const uploadMenu = multer({
  storage: criarStorage("menu")
});

const uploadLanches = multer({
  storage: criarStorage("lanches")
});

const uploadSucos = multer({
  storage: criarStorage("sucos")
});

// =====================================================
// MENU
// =====================================================

// LISTAR MENU
app.get("/menu", (req, res) => {
  db.query(
    "SELECT * FROM menu WHERE ativo = 1",
    (err, rows) => {
      if (err) {
        console.error("Erro ao listar menu:", err.message);
        return res.status(500).json({ erro: "Erro ao listar menu" });
      }

      res.json(rows);
    }
  );
});

// CADASTRAR MENU
app.post("/menu", uploadMenu.single("imagem"), (req, res) => {
  const { nome, descricao, preco } = req.body;

  if (!nome || !descricao || !preco || !req.file) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  const imagem = `/uploads/menu/${req.file.filename}`;

  db.query(
    `INSERT INTO menu (nome, descricao, preco, imagem, ativo)
     VALUES (?, ?, ?, ?, 1)`,
    [nome, descricao, preco, imagem],
    (err) => {
      if (err) {
        console.error("Erro ao cadastrar menu:", err.message);
        return res.status(500).json({ erro: "Erro ao cadastrar menu" });
      }

      res.json({ mensagem: "Menu cadastrado com sucesso" });
    }
  );
});

// ATUALIZAR MENU
app.put("/menu/:id", (req, res) => {
  const { nome, descricao, preco } = req.body;

  db.query(
    "UPDATE menu SET nome=?, descricao=?, preco=? WHERE id=?",
    [nome, descricao, preco, req.params.id],
    (err) => {
      if (err) {
        console.error("Erro ao atualizar menu:", err.message);
        return res.status(500).json({ erro: "Erro ao atualizar menu" });
      }

      res.json({ sucesso: true });
    }
  );
});

// OCULTAR MENU
app.put("/menu/:id/ocultar", (req, res) => {
  db.query(
    "UPDATE menu SET ativo = 0 WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Erro ao ocultar menu:", err.message);
        return res.status(500).json({ erro: "Erro ao ocultar menu" });
      }

      res.json({ sucesso: true });
    }
  );
});

// =====================================================
// LANCHES
// =====================================================

// LISTAR LANCHES
app.get("/lanches", (req, res) => {
  db.query(
    "SELECT * FROM lanches WHERE ativo = 1",
    (err, rows) => {
      if (err) {
        console.error("Erro ao listar lanches:", err.message);
        return res.status(500).json({ erro: "Erro ao listar lanches" });
      }

      res.json(rows);
    }
  );
});

// CADASTRAR LANCHE
app.post("/lanches", uploadLanches.single("imagem"), (req, res) => {
  const { nome, descricao, preco } = req.body;

  if (!nome || !descricao || !preco || !req.file) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  const imagem = `/uploads/lanches/${req.file.filename}`;

  db.query(
    `INSERT INTO lanches (nome, descricao, preco, imagem, ativo)
     VALUES (?, ?, ?, ?, 1)`,
    [nome, descricao, preco, imagem],
    (err) => {
      if (err) {
        console.error("Erro ao cadastrar lanche:", err.message);
        return res.status(500).json({ erro: "Erro ao cadastrar lanche" });
      }

      res.json({ mensagem: "Lanche cadastrado" });
    }
  );
});

// ATUALIZAR LANCHE
app.put("/lanches/:id", (req, res) => {
  const { nome, descricao, preco } = req.body;

  db.query(
    "UPDATE lanches SET nome=?, descricao=?, preco=? WHERE id=?",
    [nome, descricao, preco, req.params.id],
    (err) => {
      if (err) {
        console.error("Erro ao atualizar lanche:", err.message);
        return res.status(500).json({ erro: "Erro ao atualizar lanche" });
      }

      res.json({ sucesso: true });
    }
  );
});

// OCULTAR LANCHE
app.put("/lanches/:id/ocultar", (req, res) => {
  db.query(
    "UPDATE lanches SET ativo = 0 WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Erro ao ocultar lanche:", err.message);
        return res.status(500).json({ erro: "Erro ao ocultar lanche" });
      }

      res.json({ sucesso: true });
    }
  );
});

// =====================================================
// SUCOS
// =====================================================

// LISTAR SUCOS
app.get("/sucos", (req, res) => {
  db.query(
    "SELECT * FROM sucos WHERE ativo = 1",
    (err, rows) => {
      if (err) {
        console.error("Erro ao listar sucos:", err.message);
        return res.status(500).json({ erro: "Erro ao listar sucos" });
      }

      res.json(rows);
    }
  );
});

// CADASTRAR SUCO
app.post("/sucos", uploadSucos.single("imagem"), (req, res) => {
  const { nome, descricao, preco } = req.body;

  if (!nome || !descricao || !preco || !req.file) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  const imagem = `/uploads/sucos/${req.file.filename}`;

  db.query(
    `INSERT INTO sucos (nome, descricao, preco, imagem, ativo)
     VALUES (?, ?, ?, ?, 1)`,
    [nome, descricao, preco, imagem],
    (err) => {
      if (err) {
        console.error("Erro ao cadastrar suco:", err.message);
        return res.status(500).json({ erro: "Erro ao cadastrar suco" });
      }

      res.json({ mensagem: "Suco cadastrado" });
    }
  );
});

// ATUALIZAR SUCO
app.put("/sucos/:id", (req, res) => {
  const { nome, descricao, preco } = req.body;

  db.query(
    "UPDATE sucos SET nome=?, descricao=?, preco=? WHERE id=?",
    [nome, descricao, preco, req.params.id],
    (err) => {
      if (err) {
        console.error("Erro ao atualizar suco:", err.message);
        return res.status(500).json({ erro: "Erro ao atualizar suco" });
      }

      res.json({ sucesso: true });
    }
  );
});

// OCULTAR SUCO
app.put("/sucos/:id/ocultar", (req, res) => {
  db.query(
    "UPDATE sucos SET ativo = 0 WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Erro ao ocultar suco:", err.message);
        return res.status(500).json({ erro: "Erro ao ocultar suco" });
      }

      res.json({ sucesso: true });
    }
  );
});

// =====================================================
// CLIENTES - PESSOA FÍSICA
// =====================================================

// LISTAR CLIENTES
app.get("/pessoafisica", (req, res) => {
  db.query(
    "SELECT * FROM pessoafisica",
    (err, rows) => {
      if (err) {
        console.error("Erro ao listar clientes:", err.message);
        return res.status(500).json({ erro: "Erro ao listar clientes" });
      }

      res.json(rows);
    }
  );
});

// CADASTRAR CLIENTE
app.post("/pessoafisica", (req, res) => {
  let {
    nome,
    cpf,
    telefone,
    endereco,
    numero,
    bairro,
    cidade,
    estado
  } = req.body;

  if (!cpf) {
    return res.status(400).json({ erro: "CPF é obrigatório" });
  }

  cpf = cpf.replace(/\D/g, "");

  db.query(
    `INSERT INTO pessoafisica
     (nome, cpf, telefone, endereco, numero, bairro, cidade, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, cpf, telefone, endereco, numero, bairro, cidade, estado],
    (err) => {
      if (err) {
        console.error("Erro ao cadastrar cliente:", err.message);
        return res.status(500).json({ erro: "Erro ao cadastrar cliente" });
      }

      res.json({ mensagem: "Cliente cadastrado" });
    }
  );
});

// ATUALIZAR CLIENTE
app.put("/pessoafisica/:id", (req, res) => {
  const {
    nome,
    telefone,
    endereco,
    numero,
    bairro,
    cidade,
    estado
  } = req.body;

  db.query(
    `UPDATE pessoafisica
     SET nome=?, telefone=?, endereco=?, numero=?, bairro=?, cidade=?, estado=?
     WHERE id=?`,
    [
      nome,
      telefone,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      req.params.id
    ],
    (err) => {
      if (err) {
        console.error("Erro ao atualizar cliente:", err.message);
        return res.status(500).json({ erro: "Erro ao atualizar cliente" });
      }

      res.json({ sucesso: true });
    }
  );
});

// VALIDAR CPF
app.get("/clientes/cpf/:cpf", (req, res) => {
  const cpf = req.params.cpf.replace(/\D/g, "");

  db.query(
    "SELECT * FROM pessoafisica WHERE cpf = ?",
    [cpf],
    (err, rows) => {
      if (err) {
        console.error("Erro ao consultar CPF:", err.message);
        return res.status(500).json({ erro: "Erro ao consultar CPF" });
      }

      if (rows.length === 0) {
        return res.json({ existe: false });
      }

      res.json({
        existe: true,
        cliente: rows[0]
      });
    }
  );
});

// =====================================================
// PEDIDOS
// =====================================================

// CADASTRAR PEDIDO
app.post("/pedidos", (req, res) => {
  let {
    cpf,
    menu_id,
    produto_nome,
    preco,
    quantidade,
    total
  } = req.body;

  if (!cpf) {
    return res.status(400).json({ erro: "CPF obrigatório" });
  }

  cpf = cpf.replace(/\D/g, "");

  db.query(
    `INSERT INTO pedido
     (cpf, menu_id, produto_nome, preco, quantidade, total, concluido)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [cpf, menu_id, produto_nome, preco, quantidade, total],
    (err) => {
      if (err) {
        console.error("Erro ao cadastrar pedido:", err.message);
        return res.status(500).json({ erro: "Erro ao cadastrar pedido" });
      }

      res.json({ sucesso: true });
    }
  );
});

// LISTAR PEDIDOS NÃO CONCLUÍDOS
app.get("/pedido", (req, res) => {
  db.query(
    "SELECT * FROM pedido WHERE concluido = 0 ORDER BY data_pedido DESC",
    (err, rows) => {
      if (err) {
        console.error("Erro ao listar pedidos:", err.message);
        return res.status(500).json({ erro: "Erro ao listar pedidos" });
      }

      res.json(rows);
    }
  );
});

// CONCLUIR PEDIDO
app.put("/pedido/:id/concluir", (req, res) => {
  db.query(
    "UPDATE pedido SET concluido = 1 WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Erro ao concluir pedido:", err.message);
        return res.status(500).json({ erro: "Erro ao concluir pedido" });
      }

      res.json({ mensagem: "Pedido concluído" });
    }
  );
});

// =====================================================
// ROTA INICIAL PARA TESTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    mensagem: "API Cafeteria Los Barbas está funcionando!"
  });
});

// =====================================================
// INICIALIZAÇÃO DO SERVIDOR
// =====================================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});