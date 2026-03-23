//Obtener todos los productos (admin)
exports.getProductos = async (request, response) => {
    // Limitar 20 productos por pagina
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 20;

        const offset = (page - 1) * limit;

        const productos = await Producto.getAll(limit, offset);
        const total = await Producto.getTotal();

        response.json({
            data: productos,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        response.status(500).json({ error: 'Error al obtener productos' });
    }
};

//Ver producto especifico (admin)
exports.getProductoAdmin = (request, response) => {
    const { id } = request.params;

    const productosDemo = {
        sellador_1: {
            id,
            nombre: 'Sellador Comex 5×1 Clásico Preparación de Superficies PPG Silicona o Poliuretano 4000 ml Sellador',
            precio: '800',
            peso: '2Kg',
            volumen: '0.3 m3',
            unidadVenta: 'Pieza',
            unidadMedida: 'Mililitros',
            descripcion: [
                'Alta calidad y rendimiento profesional: Fórmula acrílica premium para superficies interiores y exteriores, con gran durabilidad',
                'Excelente cobertura: Cubre fácilmente imperfecciones con una sola mano en la mayoría de las superficies'
            ],
            imagen: '/img/botePintura.png',
            similars: [
                '/img/botePintura.png',
                '/img/botePintura.png',
                '/img/botePintura.png',
                '/img/botePintura.png'
            ]
        }
    };

    const producto = productosDemo[id] || productosDemo.sellador_1;

    response.render('admin/product', {
        usuario: request.session.usuario,
        productoId: id,
        producto
    });
};

//Ver producto especifico (cliente)
exports.getProductoCliente = (request, response) => {
    const { id } = request.params;
    response.render('cliente/product', {
        usuario: request.session.usuario,
        productoId: id
    });
};
