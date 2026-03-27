const Producto = require('../models/producto.model');

//Obtener todos los productos (admin)
exports.getProductos = async (request, response) => {
    try {
        const productos = await Producto.fetchAll();
        // Render or send based on requirements (currently empty in file)
    } catch (error) {
        console.error('Error fetching products for admin:', error);
        response.status(500).send('Error interno del servidor');
    }
};

//Ver producto especifico (admin)
exports.getProductoAdmin = async (request, response) => {
    try {
        const { id } = request.params;
        const productoRaw = await Producto.findById(id);

        if (!productoRaw) {
            return response.status(404).send('Producto no encontrado');
        }

        // Mapping DB fields to view structure
        const producto = {
            id: productoRaw.id_producto,
            nombre: productoRaw.nombre,
            precio: productoRaw.precio_unitario,
            peso: productoRaw.peso || 'N/A',
            volumen: productoRaw.volumen || 'N/A',
            unidadVenta: productoRaw.unidad_venta || 'N/A',
            unidadMedida: productoRaw.unidad_medida || 'N/A',
            descripcion: productoRaw.descripcion ? [productoRaw.descripcion] : ['Sin descripción disponible'],
            imagen: productoRaw.url_imagen || '/img/botePintura.png',
            similars: [
                '/img/botePintura.png',
                '/img/botePintura.png',
                '/img/botePintura.png',
                '/img/botePintura.png'
            ]
        };

        response.render('admin/product', {
            usuario: request.session.usuario,
            productoId: id,
            producto
        });
    } catch (error) {
        console.error('Error in getProductoAdmin:', error);
        response.status(500).send('Error interno del servidor');
    }
};

//Ver producto especifico (cliente)
exports.getProductoCliente = async (request, response) => {
    try {
        const { id } = request.params;
        const productoRaw = await Producto.findById(id);

        if (!productoRaw) {
            return response.status(404).send('Producto no encontrado');
        }

        const producto = {
            id: productoRaw.id_producto,
            nombre: productoRaw.nombre,
            precio: productoRaw.precio_unitario,
            peso: productoRaw.peso || 'N/A',
            volumen: productoRaw.volumen || 'N/A',
            unidadVenta: productoRaw.unidad_venta || 'N/A',
            unidadMedida: productoRaw.unidad_medida || 'N/A',
            descripcion: productoRaw.descripcion ? [productoRaw.descripcion] : ['Sin descripción disponible'],
            imagen: productoRaw.url_imagen || '/img/botePintura.png',
            similars: [
                '/img/botePintura.png',
                '/img/botePintura.png',
                '/img/botePintura.png',
                '/img/botePintura.png'
            ]
        };

        response.render('cliente/product', {
            usuario: request.session.usuario,
            productoId: id,
            producto
        });
    } catch (error) {
        console.error('Error in getProductoCliente:', error);
        response.status(500).send('Error interno del servidor');
    }
};
