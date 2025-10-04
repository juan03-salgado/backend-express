import db from "../db.js";

export const getCarritoProducto = async (req, res) => {

    try{
        const [resultado] = await db.query("SELECT * FROM carrito_producto");
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getCarritoProductoId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query("SELECT * FROM carrito_producto WHERE id = ?", 
        [id]
    );

        if (resultado.length === 0){
            return res.status(404).json({ error : "Carrito no encontrado"})
        }
        res.json(resultado);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const añadirCarrito = async (req, res) => {
    try {
        const { id_producto, unidades, id_carrito } = req.body;

        const [producto] = await db.query("SELECT precio_unidad FROM productosagricolas WHERE id = ?", [id_producto]);

        if(producto.length === 0){
            return res.status(404).json({error: "Producto no encontrado"})
        }

        const precio_total = producto[0].precio_unidad * unidades;

        const [resultado] = await db.query("INSERT INTO carrito_producto (id_producto, unidades, precio_total, id_carrito) VALUE (?, ?, ?, ?)",
        [id_producto, unidades, precio_total, id_carrito]
    );
        res.json({ id: resultado.insertId, id_producto, unidades, precio_total, id_carrito});

    } catch (error) {
        res.status(500).json({ error: error.message})

    }
};

export const actualizarCarritoProductos = async(req, res) => {
    try {
        const {id} = req.params;
        const { id_producto, unidades, id_carrito } = req.body;

        const [producto] = await db.query("SELECT precio_unidad FROM productosagricolas WHERE id = ?", [id_producto]);

        if (producto.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const precio_total = producto[0].precio_unidad * unidades;

        const [resultado] = await db.query("UPDATE carrito_producto SET id_producto = ?, unidades = ?, precio_total = ?, id_carrito = ? WHERE id = ?",
        [id_producto, unidades, precio_total, id_carrito, id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({ error : "Carrito no encontrado"})
    }
    res.json({id_producto, unidades, precio_total, id_carrito})

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const eliminarCarritoProductos = async(req, res) => {
    try {
        const {id} = req.params;

        const [resultado] = await db.query("DELETE FROM carrito_producto WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "Carrito no encontrada"})
        }

        res.json({message: "Carrito eliminada con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

