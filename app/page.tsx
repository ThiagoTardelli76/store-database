'use client'

import { useState, useEffect } from "react";

type Produto = {
  id: number;
  nome: string;
  preco: number;
};


const Produtos = () => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [editando, setEditando] = useState<number | null>(null); // Permitindo tanto number quanto null
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/produtos")
      .then((res) => res.json())
      .then((data) => {
        // Verifica se todos os produtos têm o campo preco definido
        const produtosComPrecoValido = data.filter((produto: Produto) => produto.preco != null);
        setProdutos(produtosComPrecoValido);
      });
  }, []);

  // Adicionar um produto
  const adicionarProduto = async () => {
    const novoProduto = { nome, preco: parseFloat(preco) };

    const response = await fetch("http://localhost:3001/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoProduto),
    });

    if (response.ok) {
      // Força o recarregamento da página após adicionar
      window.location.reload();
    }
  };

  // Deletar um produto
  const deletarProduto = async (id: number) => {
    await fetch(`http://localhost:3001/produtos/${id}`, { method: "DELETE" });

    // Força o recarregamento da página após deletar
    window.location.reload();
  };

  // Atualizar um produto
  const atualizarProduto = async (id: number) => {
    const response = await fetch(`http://localhost:3001/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco: parseFloat(preco) }),
    });

    if (response.ok) {
      // Força o recarregamento da página após editar
      window.location.reload();
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-10 font-sans text-black">
      <h1 className="text-3xl font-bold text-center mb-8">Nossos Produtos</h1>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold">{p.nome}</h3>
            <p className="text-gray-700 text-lg font-bold">{p.preco ? p.preco.toFixed(2) : '0.00'} €</p>

            <div className="flex gap-2 mt-3">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  setEditando(p.id);
                  setNome(p.nome);
                  setPreco(p.preco.toString());
                }}
              >
                Alterar
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => deletarProduto(p.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulário para adicionar/editar produtos */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-black">
        <h2 className="text-xl font-bold text-center mb-4">
          {editando ? "Editar Produto" : "Adicionar Produto"}
        </h2>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={editando ? () => atualizarProduto(editando) : adicionarProduto}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editando ? "Salvar Alteração" : "Adicionar Produto"}
        </button>
      </div>
    </div>
  );
};

export default Produtos;
