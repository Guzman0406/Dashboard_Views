# Proyecto: Next.js + PostgreSQL Dashboard

El repositorio de este proyecto se trata de un Dashboard utilizando **Next.js ** y **PostgreSQL**, todo esto contenido en **Docker Compose**. La aplicación visualiza la información de una base de datos sobre ventas consumiendo Vistas SQL.


El proyecto está diseñado para ejecutarse con un solo comando. 

1.  PASO 1: Clonar el repositorio
2.  Paso 2: Ejecuta el siguiente comando en la terminal:

```bash
docker compose up --build
```

Esto ejecutará:
*   **Base de Datos**: Contenedor PostgreSQL.
*   **Pagina Web**: Contenedor Next.js en `http://localhost:3000`.

La base de datos se inicializará automáticamente con los datos de prueba definidos en la carpeta `db/`.

## Vistas y Reportes

La aplicación visualiza 5 reportes basados en Vistas SQL:

1.  **Clientes VIP**: Usuarios que han tenido un gasto elevado.
2.  **Ventas por Categoría**: Muestra el total de ventas por categoría.
3.  **Top Productos**: Ranking de artículos más vendidos.
4.  **Salud de Órdenes**: Muestra el estado de las órdenes (Completadas vs. Devueltas).
5.  **Ranking Global**: Clasificación de usuarios por gastos realizados.

## Índices

Justificación de los índices realizados dentro del archivo `db/04_indexes.sql` :

*   **`idx_orders_user_id`** (orders.user_id):
    *   Optimiza la operación de **JOIN** entre las tablas `users` y `orders`. lo cual es vital para vistas agregadas por usuario como `v_vip_customers`, evitando así un escaneo de la base de datos completo.

*   **`idx_products_category_id`** (products.category_id):
    *   Optimiza el **JOIN** en la vista `v_sales_by_category`, lo que nos permite cruzar productos con sus categorías de manera más rápida.

*   **`idx_orders_status`** (orders.status):
    *   Optimiza el filtrado, ya que la mayoría de los reportes incluyen `WHERE status = 'completed'`. Reduciendo asi el conjunto de datos a procesar al no incluir órdenes pendientes, canceladas o en devolucion.

*   **Índices Compuestos** (`idx_orders_user_status`, `idx_orders_product_status`):
    *  Hechos con la finalidad de poder optimizar las consultas que realizan un filtrado y agrupamiento en base a las mismas columnas.
