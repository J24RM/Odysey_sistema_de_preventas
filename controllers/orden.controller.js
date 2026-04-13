const OrdenModel = require('../models/orden.model');
const configuracionModel = require('../models/configuracion.model')
const supabase = require('../utils/supabase');

exports.getOrdenes = async (req, res) => {

};

exports.postRegistrarOrden = async (req, res) => {
    try {
        const { id_orden } = req.params;
        await OrdenModel.registrarOrden(id_orden);
        res.redirect('/cliente/mis-pedidos');
    } catch (error) {
        console.error('Error al registrar orden:', error);
        res.redirect('/cart?error=' + encodeURIComponent(error.message));
    }
};

exports.postCancelarOrden = async (req, res) => {
    try {
        const orden = await OrdenModel.ObtenerOrdenPorId(req.params.id_orden);

        const configuracion = await configuracionModel.ObtenerConfiguracionActiva();
        console.log(configuracion)

        // Tiempo actual en México
        const ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));

        console.log(ahora)


        // Convertir fecha_realizada a Date 
        const fechaOrden = new Date(orden[0].fecha_realizada.replace(" ", "T"));

        console.log(fechaOrden)

        // Diferencia en minutos, le agregamos 20 segundos mas
        const diferenciaMinutos = (ahora.getTime() + 20000 - fechaOrden.getTime()) / (1000 * 60);

        console.log(diferenciaMinutos)

        const esCancelable = diferenciaMinutos <= configuracion.tiempo_de_cancelacion;

        console.log(esCancelable)

        if(esCancelable){
            await OrdenModel.CancelarOrden(req.params.id_orden)
        }
        else{
            req.session.error = "No se puede cancelar"
        }
        return res.redirect('/cliente/mis-pedidos')

    } catch (error) {
        console.error("❌ Error:", error.message, error.stack);
        return res.status(500).json({ ok: false, mensaje: error.message });
    }
};

exports.getDetalleOrden = async (req, res) => {
    try {
        const { id_orden } = req.params;
        const { data: orden, error } = await supabase
            .from('orden').select('*').eq('id_orden', id_orden).single();
        if (error) throw error;

        const detalles = await OrdenModel.obtenerDetalleOrden(id_orden);

        orden.cancelar = true;
        
        res.json({ orden, detalles });
    } catch (error) {
        console.error('Error al obtener detalle:', error);
        res.status(500).json({ error: error.message });
    }
};
