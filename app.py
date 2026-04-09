import sqlite3

def conectar():
    return sqlite3.connect('sistema_vendas.db')

def criar_tabelas():
    conn = conectar()
    cursor = conn.cursor()
    
    # Tabela de Produtos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            estoque INTEGER NOT NULL
        )
    ''')
    
    # Tabela de Vendas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER,
            quantidade INTEGER,
            total REAL,
            data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (produto_id) REFERENCES produtos (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def cadastrar_produto(nome, preco, estoque):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', (nome, preco, estoque))
    conn.commit()
    conn.close()
    print(f"Produto '{nome}' cadastrado com sucesso!")

def listar_produtos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM produtos')
    produtos = cursor.fetchall()
    conn.close()
    
    print("\n--- Inventário ---")
    for p in produtos:
        print(f"ID: {p[0]} | Nome: {p[1]} | Preço: R${p[2]:.2f} | Estoque: {p[3]}")
    print("------------------\n")

def realizar_venda(produto_id, qtd):
    conn = conectar()
    cursor = conn.cursor()
    
    # Verifica se produto existe e tem estoque
    cursor.execute('SELECT nome, preco, estoque FROM produtos WHERE id = ?', (produto_id,))
    produto = cursor.fetchone()
    
    if produto and produto[2] >= qtd:
        total = produto[1] * qtd
        novo_estoque = produto[2] - qtd
        
        # Registra a venda
        cursor.execute('INSERT INTO vendas (produto_id, quantidade, total) VALUES (?, ?, ?)', 
                       (produto_id, qtd, total))
        
        # Atualiza estoque
        cursor.execute('UPDATE produtos SET estoque = ? WHERE id = ?', (novo_estoque, produto_id))
        
        conn.commit()
        print(f"Venda realizada! Total: R${total:.2f}")
    else:
        print("Erro: Produto não encontrado ou estoque insuficiente.")
    
    conn.close()

# --- Fluxo Principal ---
criar_tabelas()

# Exemplo de uso:
# cadastrar_produto("Teclado Mecânico", 150.00, 10)
# cadastrar_produto("Mouse Gamer", 80.00, 20)

listar_produtos()

# Simulando uma venda do produto ID 1
id_compra = int(input("Digite o ID do produto que deseja vender: "))
quantidade = int(input("Quantidade: "))
realizar_venda(id_compra, quantidade)

listar_produtos()
