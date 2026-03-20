//Ver carrito
exports.getCarrito = (request, response) => {
    response.render('cliente/cart', { usuario: request.session.usuario });
};

//Agregar producto al carrito
exports.agregarItem = (request, response) => {
    response.render('cliente/cart', { usuario: request.session.usuario });
};

//Modificar cantidad
exports.actulizarItem = (request, response) => {
    response.render('cliente/cart', { usuario: request.session.usuario });
};

//Eliminar producto
exports.eliminarItem = (request, response) => {
    response.render('cliente/cart', { usuario: request.session.usuario });
};