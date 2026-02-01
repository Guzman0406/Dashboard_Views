-- VISTA 1: CLIENTES VIP
/*
 View: v_vip_customers
 Grain: 1 fila por Usuario.
 Metricas: total_spent (Suma de montos).
 Group By: Para agrupar múltiples órdenes en un solo total por usuario.
 Having: Para mostrar solo usuarios que han comprado algo (gasto > 0).
 Verify: SELECT * FROM v_vip_customers WHERE status = 'VIP';
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
GROUP BY u.id, u.name
HAVING COALESCE(SUM(o.total_amount), 0) > 0;

-- VISTA 2: VENTAS POR CATEGORÍA
/*
 View: v_sales_by_category
 Grain: 1 fila por Categoría.
 Metricas: Total_ordenes, Ganancias.
 Group By: Para acumular ventas de productos dentro de su categoría
 Having: Solo mostramos las categorías con ventas (Ganancias > 0).
 Verify: SELECT * FROM v_sales_by_category ORDER BY Ganancias DESC;
*/
CREATE OR REPLACE VIEW v_sales_by_category AS
SELECT 
    c.name AS Nombre_categoria,
    COUNT(o.id) AS Total_ordenes,
    SUM(o.total_amount) AS Ganancias,
    ROUND((SUM(o.total_amount) / NULLIF(COUNT(o.id), 0)), 2) AS Ticket_promedio
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN orders o ON p.id = o.product_id
WHERE o.status = 'completed'
GROUP BY c.name
HAVING SUM(o.total_amount) > 0;

-- VISTA 3: PRODUCTOS MÁS VENDIDOS
/*
 View: v_productos_mas_vendidos
 Grain: 1 fila por Producto.
 Metricas: Veces_vendido, Total_cantidad_vendida.
 Why Group By: Agrupar órdenes por producto.
 Uses CTE: 'SalesSummary' pre-calcula los conteos antes del JOIN.
 Verify: SELECT * FROM v_productos_mas_vendidos LIMIT 5;
*/
CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
WITH SalesSummary AS (
    SELECT 
        product_id,
        COUNT(id) AS sales_count, 
        SUM(quantity) AS quantity_sum
    FROM orders 
    WHERE status = 'completed'
    GROUP BY product_id
)
SELECT
    p.name AS Nombre_producto,
    COALESCE(s.sales_count, 0) AS Veces_vendido,
    COALESCE(s.quantity_sum, 0) AS Total_cantidad_vendida
FROM products p
JOIN SalesSummary s ON p.id = s.product_id
ORDER BY s.sales_count DESC;    

-- VISTA 4: RESUMEN DE ÓRDENES POR ESTADO
/*
 View: v_resumen_ordenes_por_estado
 Grain: 1 fila por Estado (pending, completed, etc).
 Metricas: Total_ordenes, Ingresos_totales.
 Group By: Para sumar las métricas por estado.
 Verify: SELECT * FROM v_resumen_ordenes_por_estado;
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
 View: v_ranking_usuarios_por_gasto
 Grain: 1 fila por Usuario.
 Metricas: Total_gastado, Rank_global.
 Group By: Obtener el total gastado por usuario único.
 Window Function: RANK() para generar la posición numérica explícita.
 Verify: SELECT * FROM v_ranking_usuarios_por_gasto WHERE Rank_global <= 3;
*/  
CREATE OR REPLACE VIEW v_ranking_usuarios_por_gasto AS
SELECT
    u.name AS Nombre_usuario,
    SUM(o.total_amount) AS Total_gastado,
    RANK() OVER (ORDER BY SUM(o.total_amount) DESC) as Rank_global
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.name;
