import http from 'http';
import mysql from 'mysql';
import cors from 'cors'; // Importar o CORS

// Criar conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sisnidtardelli',
    database: 'loja'
});

db.connect(err => {
    if (err) console.error('Erro ao conectar ao MySQL:', err);
    else console.log('Conectado ao MySQL');
});

// Criar o servidor HTTP
const server = http.createServer((req, res) => {
    // Adicionar as configurações do CORS
    cors()(req, res, () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'GET' && req.url === '/produtos') {
            // Listar produtos
            db.query('SELECT * FROM produtos', (err, result) => {
                if (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ erro: 'Erro no servidor' }));
                } else {
                    res.writeHead(200);
                    res.end(JSON.stringify(result));
                }
            });
        } else if (req.method === 'POST' && req.url === '/produtos') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    const { nome, preco } = JSON.parse(body);
                    
                    // Verifica se os dados são válidos
                    if (!nome || !preco) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ erro: "Nome e preço são obrigatórios." }));
                        return;
                    }
        
                    const query = 'INSERT INTO produtos (nome, preco) VALUES (?, ?)';
                    db.query(query, [nome, preco], (err, result) => {
                        if (err) {
                            console.error("Erro no MySQL:", err.sqlMessage);
                            res.writeHead(500);
                            res.end(JSON.stringify({ erro: err.sqlMessage }));
                        } else {
                            res.writeHead(201);
                            res.end(JSON.stringify({ mensagem: "Produto cadastrado!", id: result.insertId }));
                        }
                    });
                } catch (error) {
                    console.error("Erro ao processar JSON:", error);
                    res.writeHead(500);
                    res.end(JSON.stringify({ erro: "Erro ao processar JSON." }));
                }
            });
        
            
        
        } else if (req.method === 'DELETE' && req.url.startsWith('/produtos/')) {
            // Deletar produto
            const id = req.url.split('/')[2];
            db.query('DELETE FROM produtos WHERE id = ?', [id], err => {
                if (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ erro: 'Erro ao deletar produto' }));
                } else {
                    res.writeHead(200);
                    res.end(JSON.stringify({ mensagem: 'Produto removido!' }));
                }
            });

        } else if (req.method === 'PUT' && req.url.startsWith('/produtos/')) {
            // Atualizar produto
            const id = req.url.split('/')[2];
            let body = '';
        
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    const { nome, preco } = JSON.parse(body);
        
                    // Verifica se os dados são válidos
                    if (!nome || !preco) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ erro: "Nome e preço são obrigatórios." }));
                        return;
                    }
        
                    const query = 'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?';
                    db.query(query, [nome, preco, id], (err, result) => {
                        if (err) {
                            console.error("Erro no MySQL:", err.sqlMessage);
                            res.writeHead(500);
                            res.end(JSON.stringify({ erro: err.sqlMessage }));
                        } else {
                            res.writeHead(200);
                            res.end(JSON.stringify({ mensagem: "Produto atualizado com sucesso!" }));
                        }
                    });
                } catch (error) {
                    console.error("Erro ao processar JSON:", error);
                    res.writeHead(500);
                    res.end(JSON.stringify({ erro: "Erro ao processar JSON." }));
                }
            });

            
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
        }
    });
});

// Iniciar o servidor na porta 3001
server.listen(3001, () => console.log('API rodando na porta 3001'));
