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
// =====================================================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cafeteria"
});

db.connect(err => {
  if (err) console.error("❌ Erro banco:", err);
  else console.log("✅ Banco conectado");
});

// =====================================================
// ARQUIVOS ESTÁTICOS (UPLOADS)
// =====================================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================================================
// CONFIGURAÇÃO DO MULTER
// =====================================================

function criarStorage(pasta) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "uploads", pasta);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
}

const uploadMenu = multer({ storage: criarStorage("menu") });
const uploadLanches = multer({ storage: criarStorage("lanches") });
const uploadSucos = multer({ storage: criarStorage("sucos") });

// =====================================================
// MENU
// =====================================================

app.get("/menu", (req, res) => {
  db.query("SELECT * FROM menu WHERE ativo = 1",
    (err, rows) => err ? res.status(500).json(err) : res.json(rows)
  );
});

app.post("/menu", uploadMenu.single("imagem"), (req, res) => {
  const { nome, descricao, preco } = req.body;
  if (!nome || !descricao || !preco || !req.file)
    return res.status(400).json({ erro: "Dados incompletos" });

  const imagem = `/uploads/menu/${req.file.filename}`;

  db.query(
    `INSERT INTO menu (nome, descricao, preco, imagem, ativo)
     VALUES (?, ?, ?, ?, 1)`,
    [nome, descricao, preco, imagem],
    err => err
      ? res.status(500).json(err)
      : res.json({ mensagem: "Menu cadastrado com sucesso" })
  );
});

// 🔹 UPDATE MENU (ADIÇÃO NECESSÁRIA – FRONTEND JÁ USA)
app.put("/menu/:id", (req, res) => {
  const { nome, descricao, preco } = req.body;
  db.query(
    "UPDATE menu SET nome=?, descricao=?, preco=? WHERE id=?",
    [nome, descricao, preco, req.params.id],
    err => err
      ? res.status(500).json({ erro: "Erro ao atualizar menu" })
      : res.json({ sucesso: true })
  );
});

// 🔹 OCULTAR MENU (JÁ EXISTIA NO PROJETO)
app.put("/menu/:id/ocultar", (req, res) => {
  db.query(
    "UPDATE menu SET ativo = 0 WHERE id = ?",
    [req.params.id],
    err => err
      ? res.status(500).json({ erro: "Erro ao ocultar menu" })
      : res.json({ sucesso: true })
  );
});

// =====================================================
// LANCHES
// =====================================================

app.get("/lanches", (req, res) => {
  db.query("SELECT * FROM lanches WHERE ativo = 1",
    (err, rows) => err ? res.status(500).json(err) : res.json(rows)
  );
});

app.post("/lanches", uploadLanches.single("imagem"), (req, res) => {
  const { nome, descricao, preco } = req.body;
  if (!nome || !descricao || !preco || !req.file)
    return res.status(400).json({ erro: "Dados incompletos" });

  const imagem = `/uploads/lanches/${req.file.filename}`;

  db.query(
    `INSERT INTO lanches (nome, descricao, preco, imagem, ativo)
     VALUES (?, ?, ?, ?, 1)`,
    [nome, descricao, preco, imagem],
    err => err
      ? res.status(500).json(err)
      : res.json({ mensagem: "Lanche cadastrado" })
  );
});

// 🔹 UPDATE LANCHES
app.put("/lanches/:id", (req, res) => {
  const { nome, descricao, preco } = req.body;
  db.query(
    "UPDATE lanches SET nome=?, descricao=?, preco=? WHERE id=?",
    [nome, descricao, preco, req.params.id],
    err => err
      ? res.status(500).json({ erro: "Erro ao atualizar lanche" })
      : res.json({ sucesso: true })
  );
});

app.put("/lanches/:id/ocultar", (req, res) => {
  db.query(
    "UPDATE lanches SET ativo = 0 WHERE id = ?",
    [req.params.id],
    err => err
      ? res.status(500).json({ erro: "Erro ao ocultar lanche" })
      : res.json({ sucesso: true })
  );
});

// =====================================================
// SUCOS
// =====================================================

app.get("/sucos", (req, res) => {
  db.query("SELECT * FROM sucos WHERE ativo = 1",
    (err, rows) => err ? res.status(500).json(err) : res.json(rows)
  );
});

app.post("/sucos", uploadSucos.single("imagem"), (req, res) => {
  const { nome, descricao, preco } = req.body;
  if (!nome || !descricao || !preco || !req.file)
    return res.status(400).json({ erro: "Dados incompletos" });

  const imagem = `/uploads/sucos/${req.file.filename}`;

  db.query(
    `INSERT INTO sucos (nome, descricao, preco, imagem, ativo)
     VALUES (?, ?, ?, ?, 1)`,
    [nome, descricao, preco, imagem],
    err => err
      ? res.status(500).json(err)
      : res.json({ mensagem: "Suco cadastrado" })
  );
});

// 🔹 UPDATE SUCOS
app.put("/sucos/:id", (req, res) => {
  const { nome, descricao, preco } = req.body;
  db.query(
    "UPDATE sucos SET nome=?, descricao=?, preco=? WHERE id=?",
    [nome, descricao, preco, req.params.id],
    err => err
      ? res.status(500).json({ erro: "Erro ao atualizar suco" })
      : res.json({ sucesso: true })
  );
});

app.put("/sucos/:id/ocultar", (req, res) => {
  db.query(
    "UPDATE sucos SET ativo = 0 WHERE id = ?",
    [req.params.id],
    err => err
      ? res.status(500).json({ erro: "Erro ao ocultar suco" })
      : res.json({ sucesso: true })
  );
});

// =====================================================
// CLIENTES
// =====================================================

app.get("/pessoafisica", (req, res) => {
  db.query("SELECT * FROM pessoafisica",
    (err, rows) => err ? res.status(500).json(err) : res.json(rows)
  );
});

app.post("/pessoafisica", (req, res) => {
  let { nome, cpf, telefone, endereco, numero, bairro, cidade, estado } = req.body;
  if (!cpf) return res.status(400).json({ erro: "CPF é obrigatório" });
  cpf = cpf.replace(/\D/g, "");

  db.query(
    `INSERT INTO pessoafisica
     (nome, cpf, telefone, endereco, numero, bairro, cidade, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, cpf, telefone, endereco, numero, bairro, cidade, estado],
    err => err
      ? res.status(500).json(err)
      : res.json({ mensagem: "Cliente cadastrado" })
  );
});

// 🔹 UPDATE CLIENTE (JÁ CORRIGIDO ANTES)
app.put("/pessoafisica/:id", (req, res) => {
  const { nome, telefone, endereco, numero, bairro, cidade, estado } = req.body;
  db.query(
    `UPDATE pessoafisica
     SET nome=?, telefone=?, endereco=?, numero=?, bairro=?, cidade=?, estado=?
     WHERE id=?`,
    [nome, telefone, endereco, numero, bairro, cidade, estado, req.params.id],
    err => err
      ? res.status(500).json({ erro: "Erro ao atualizar cliente" })
      : res.json({ sucesso: true })
  );
});

// Validação CPF
app.get("/clientes/cpf/:cpf", (req, res) => {
  const cpf = req.params.cpf.replace(/\D/g, "");
  db.query(
    "SELECT * FROM pessoafisica WHERE cpf = ?",
    [cpf],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0) return res.json({ existe: false });
      res.json({ existe: true, cliente: rows[0] });
    }
  );
});

// =====================================================
// PEDIDOS
// =====================================================

app.post("/pedidos", (req, res) => {
  let { cpf, menu_id, produto_nome, preco, quantidade, total } = req.body;
  if (!cpf) return res.status(400).json({ erro: "CPF obrigatório" });
  cpf = cpf.replace(/\D/g, "");

  db.query(
    `INSERT INTO pedido
     (cpf, menu_id, produto_nome, preco, quantidade, total, concluido)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [cpf, menu_id, produto_nome, preco, quantidade, total],
    err => err
      ? res.status(500).json(err)
      : res.json({ sucesso: true })
  );
});

app.get("/pedido", (req, res) => {
  db.query(
    "SELECT * FROM pedido WHERE concluido = 0 ORDER BY data_pedido DESC",
    (err, rows) => err ? res.status(500).json(err) : res.json(rows)
  );
});

app.put("/pedido/:id/concluir", (req, res) => {
  db.query(
    "UPDATE pedido SET concluido = 1 WHERE id = ?",
    [req.params.id],
    err => err
      ? res.status(500).json(err)
      : res.json({ mensagem: "Pedido concluído" })
  );
});

// =====================================================
// INICIALIZAÇÃO FINAL
// =====================================================

console.log("ROTAS REGISTRADAS:", app._router.stack.length);

// =====================================================
// INICIALIZAÇÃO FINAL DO SERVIDOR
// =====================================================

// Utiliza a porta da hospedagem.
// Se estiver executando localmente, utiliza a porta 3001.

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});