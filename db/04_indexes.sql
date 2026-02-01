-- VISTAS: clientes_vip, v_ranking_usuarios_por_gasto
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);

-- VISTAS: v_ventas_por_categorias
CREATE INDEX idx_products_category_id ON products (category_id);

-- VISTAS: v_productos_mas_vendidos
CREATE INDEX idx_orders_product_id ON orders (product_id);

-- COMPOSITE INDEXES: Para consultas que filtran y agrupan por las mismas columnas.
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
CREATE INDEX idx_orders_product_status ON orders (product_id, status);

