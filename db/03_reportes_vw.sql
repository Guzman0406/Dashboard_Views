
/*
/* PASO A (DEFINIR UN BORRADOR DEL PROBLEMA)
    El problema de esta consulta es que trae todas las compras de los usuarios
    si juan compró 2 veces, el resultado aparecera en filas repetidas.
*/
SELECT * FROM users 
JOIN orders ON users.id = orders.user_id;


/* PASO B (DEFINIR LA GRAIN Y AGRUPAR)
    Queremos una fila por usuario, asi que necesitamos agrupar y sumar sus compras. 

    Resultado de la Query: Total de compras por usuario
    Grain: Usuario

          name       | total_gastado
-----------------+---------------
 Juan Pérez      |         55.50
 Luisa Martínez  |       1200.00
 Carlos López    |       1251.00
 María Rodriguez |        225.00
(4 rows)
*/
SELECT u.name AS nombre_usuario,
SUM (o.total_amount) AS total_compras
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name; -- Recordar que en el GROUP BY van las columnas puestas en el SELECT


/* PASO C (lÓGICA DE NEGOCIO - CLASIFICACIÓN)
 nombre_usuario  | total_compras |  tipo_usuario
-----------------+---------------+-----------------
 María Rodriguez |        225.00 | USUARIO REGULAR
 Luisa Martínez  |       1200.00 | USUARIO VIP
 Juan Pérez      |         55.50 | USUARIO REGULAR
 Carlos López    |       1251.00 | USUARIO VIP
(4 rows)
*/

SELECT u.name AS nombre_usuario,
SUM (o.total_amount) AS total_compras,

CASE 
    WHEN SUM(o.total_amount) >= 1000 THEN 'USUARIO VIP'
    ELSE 'USUARIO REGULAR'
END AS tipo_usuario
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

*/


-- VISTA 1: CLIENTES VIP
/*
HAVING y CASE
Filtramos usuarios que han gastado más de 0 con HAVING
y le damos una clasificación con CASE
*/
CREATE OR REPLACE VIEW v_vip_customers AS
SELECT 
    u.id,
    u.name,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    CASE 
        WHEN COALESCE(SUM(o.total_amount), 0) > 1000 THEN 'VIP'
        ELSE 'Regular'
    END as status
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;


-- VISTA 2: VENTAS POR CATEGORÍA
/*
Agregación con SUM y GROUP BY
Grain: Categoría de producto
*/
CREATE OR REPLACE VIEW v_sales_by_category AS
SELECT 
    c.name AS Nombre_categoria,
    COUNT(o.id) AS Total_ordenes,
    SUM(o.total_amount) AS Ganancias
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN orders o ON p.id = o.product_id
WHERE o.status = 'completed'
GROUP BY c.name;


-- VISTA 3: PRODUCTOS MÁS VENDIDOS
/*
Agregación con COUNT y GROUP BY
Grain: Producto
*/
CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
SELECT
    p.name AS Nombre_producto,
    COUNT(o.id) AS Veces_vendido,
    SUM(o.quantity) AS Total_cantidad_vendida
FROM products p
JOIN orders o ON p.id = o.product_id
WHERE o.status = 'completed'
GROUP BY p.name
ORDER BY Veces_vendido DESC;    


-- VISTA 4: RESUMEN DE ÓRDENES POR ESTADO
/*
Agregación con COUNT y GROUP BY
Grain: Estado de la orden
*/      
CREATE OR REPLACE VIEW v_resumen_ordenes_por_estado AS
SELECT
    o.status AS Estado_orden,
    COUNT(o.id) AS Total_ordenes,
    SUM(o.total_amount) AS Ingresos_totales
FROM orders o
GROUP BY o.status;  

-- VISTA 5: RANKING DE USUARIOS POR GASTO
/*
Agregación con SUM y GROUP BY
Grain: Usuario
*/  
CREATE OR REPLACE VIEW v_ranking_usuarios_por_gasto AS
SELECT
    u.name AS Nombre_usuario,
    SUM(o.total_amount) AS Total_gastado
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.name
ORDER BY Total_gastado DESC;
