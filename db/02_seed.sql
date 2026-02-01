-- Usuarios
INSERT INTO users (name, email, role) VALUES
('Ana García', 'ana@test.com', 'admin'),
('Carlos López', 'carlos@test.com', 'customer'),
('María Rodriguez', 'maria@test.com', 'customer'),
('Juan Pérez', 'juan@test.com', 'customer'),
('Luisa Martínez', 'luisa@test.com', 'customer');

-- Categorías 
INSERT INTO categories (name, description) VALUES
('Electrónica', 'Gadgets, computadoras y periféricos'),
('Muebles', 'Mobiliario de oficina y ergonomía'),
('Alimentos', 'Bebidas y snacks para programadores');

-- Productos 
INSERT INTO products (name, category_id, price, stock) VALUES
('Laptop Pro', 1, 1200.00, 15),          -- 1 es Electrónica
('Mouse Inalámbrico', 1, 25.50, 50),     -- 1 es Electrónica
('Monitor 24"', 1, 180.00, 20),          -- 1 es Electrónica
('Silla Ergonómica', 2, 150.00, 10),     -- 2 es Muebles
('Escritorio de Pie', 2, 300.00, 5),     -- 2 es Muebles
('Café en Grano', 3, 15.00, 100);        -- 3 es Alimentos

-- Órdenes
INSERT INTO orders (user_id, product_id, quantity, total_amount, status, created_at) VALUES
(2, 1, 1, 1200.00, 'completed', NOW() - INTERVAL '10 days'),
(2, 2, 2, 51.00, 'completed', NOW() - INTERVAL '9 days'),
(3, 4, 1, 150.00, 'refunded', NOW() - INTERVAL '5 days'),
(3, 6, 5, 75.00, 'completed', NOW() - INTERVAL '2 days'),
(4, 2, 1, 25.50, 'pending', NOW()),
(4, 6, 2, 30.00, 'completed', NOW() - INTERVAL '1 day'),
(5, 1, 1, 1200.00, 'completed', NOW() - INTERVAL '20 days');