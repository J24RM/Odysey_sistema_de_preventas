--- Stored Procedures

-- Estadisticas Productos

-- Stats Productos (General)

CREATE FUNCTION stats_productos(fecha_inicio DATE, fecha_fin DATE)
RETURNS TABLE (
  id_producto INT,
  nombre TEXT,
  url_imagen TEXT,
  cantidad BIGINT,
  ventas NUMERIC
)
AS $$
SELECT 
  p.id_producto,
  p.nombre,
  p.url_imagen,
  SUM(d.cantidad) AS cantidad,
  SUM(d.cantidad * p.precio_unitario) AS ventas
FROM detalle_orden d
JOIN producto p ON p.id_producto = d.id_producto
JOIN orden o ON o.id_orden = d.id_orden
WHERE 
  o.estado = 'confirmada'
  AND o.fecha_realizada BETWEEN fecha_inicio AND fecha_fin
GROUP BY p.id_producto, p.nombre, p.url_imagen;
$$ LANGUAGE SQL;

-- Stats Productos por ID

CREATE FUNCTION stats_producto_by_id(
  p_id_producto INT,
  fecha_inicio DATE,
  fecha_fin DATE
)
RETURNS TABLE (
  id_producto INT,
  nombre TEXT,
  url_imagen TEXT,
  cantidad BIGINT,
  ventas NUMERIC
)
AS $$
SELECT 
  p.id_producto,
  p.nombre,
  p.url_imagen,
  COALESCE(SUM(d.cantidad), 0) AS cantidad,
  COALESCE(SUM(d.cantidad * p.precio_unitario), 0) AS ventas
FROM producto p
JOIN detalle_orden d ON d.id_producto = p.id_producto
JOIN orden o ON o.id_orden = d.id_orden
WHERE 
  p.id_producto = p_id_producto
  AND o.estado = 'confirmada'
  AND o.fecha_realizada BETWEEN fecha_inicio AND fecha_fin
GROUP BY p.id_producto, p.nombre, p.url_imagen;
$$ LANGUAGE SQL;


-- Stats Productos por Semana

CREATE FUNCTION ordenes_por_dia_semana(
  fecha_inicio DATE,
  fecha_fin DATE,
  p_id_producto INT
)
RETURNS TABLE (
  dia TEXT,
  cantidad BIGINT,
  orden INT
)
AS $$
SELECT 
  TRIM(TO_CHAR(o.fecha_realizada, 'Day')) AS dia,
  SUM(d.cantidad) AS cantidad,
  EXTRACT(DOW FROM o.fecha_realizada) AS orden
FROM detalle_orden d
JOIN orden o ON o.id_orden = d.id_orden
WHERE 
  d.id_producto = p_id_producto
  AND o.estado = 'confirmada'
  AND o.fecha_realizada BETWEEN fecha_inicio AND fecha_fin
GROUP BY dia, orden
ORDER BY orden;
$$ LANGUAGE SQL;

-- Stats Productos por Mes

CREATE FUNCTION ordenes_por_dia_mes(
  fecha_inicio DATE,
  fecha_fin DATE,
  p_id_producto INT
)
RETURNS TABLE (
  dia INT,
  cantidad BIGINT
)
AS $$
WITH dias AS (
  SELECT generate_series(fecha_inicio, fecha_fin, interval '1 day') AS fecha
)
SELECT 
  EXTRACT(DAY FROM dias.fecha) AS dia,
  COALESCE(SUM(d.cantidad), 0) AS cantidad
FROM dias
LEFT JOIN orden o 
  ON DATE(o.fecha_realizada) = dias.fecha
  AND o.estado = 'confirmada'
LEFT JOIN detalle_orden d 
  ON d.id_orden = o.id_orden
  AND d.id_producto = p_id_producto
GROUP BY dias.fecha
ORDER BY dias.fecha;
$$ LANGUAGE SQL;