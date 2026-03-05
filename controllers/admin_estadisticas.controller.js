//Accede al panel de estadísticas
exports.getEstadisticas = (request, response) => {
    if (!request.session.usuario) {
        return response.redirect('/login');
    }

    response.render('admin_estadisticas', { usuario: request.session.usuario });
};
