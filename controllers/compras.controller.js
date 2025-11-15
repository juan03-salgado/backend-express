import db from "../db.js";

export const getCompras = async (req, res) => {

    try{
        const [resultado] = await db.query(`SELECT cr.id AS id_compra, cr.id_carrito, cr.referencia_pago, cl.nombre AS cliente,
        JSON_ARRAYAGG(
          JSON_OBJECT('id_producto', p.id,'producto', p.nombre,'tipo_producto', p.tipo_producto,'cantidad', dc.cantidad,'precio_total', dc.precio_total)
        ) AS productos
        FROM compras_realizadas cr
        INNER JOIN carrito c ON cr.id_carrito = c.id
        INNER JOIN clientes cl ON c.id_cliente = cl.id
        INNER JOIN detalle_compra dc ON dc.id_compra = cr.id
        INNER JOIN productosagricolas p ON dc.id_producto = p.id
        GROUP BY cr.id, cr.id_carrito, cl.nombre, cr.referencia_pago
        ORDER BY cr.id;
    `);
        res.json(resultado);
    
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComprasId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query(`SELECT cr.id AS id_compra, cr.id_carrito, cr.referencia_pago, cl.nombre AS cliente,
        JSON_ARRAYAGG(
          JSON_OBJECT('id_producto', p.id, 'producto', p.nombre, 'tipo_producto', p.tipo_producto, 
          'cantidad', dc.cantidad,'precio_total', dc.precio_total)
        ) AS productos
        FROM compras_realizadas cr
        INNER JOIN carrito c ON cr.id_carrito = c.id
        INNER JOIN clientes cl ON c.id_cliente = cl.id
        INNER JOIN detalle_compra dc ON dc.id_compra = cr.id
        INNER JOIN productosagricolas p ON dc.id_producto = p.id
        WHERE cr.id = ?
        GROUP BY cr.id, cr.id_carrito, cl.nombre, cr.referencia_pago
    `, 
        [id]
    );
        if (resultado.length === 0){
            return res.status(404).json({ error : "Compra no encontrada"})
        }
        res.json(resultado);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const realizarCompras = async (req, res) => {
    try {
        const { id_carrito } = req.body;
        
        const [productoCarrito] = await db.query(`SELECT cp.id_producto, p.nombre, cp.cantidad, cp.precio_total, p.precio_unidad, p.tipo_producto
        FROM carrito_producto cp
        INNER JOIN productosagricolas p ON cp.id_producto = p.id
        WHERE cp.id_carrito = ?`, 
            [id_carrito]
        );
        
        if (productoCarrito.length === 0){
            return res.status(400).json({ message: "El carrito esta vacio"})
        }

        const referenciaPago = 'REF-' + Math.floor(100000 + Math.random() * 900000);

        const [resultado] = await db.query("INSERT INTO compras_realizadas (id_carrito, referencia_pago) VALUES (?, ?)",
            [id_carrito, referenciaPago]
        );

        const id_compra = resultado.insertId;

        for(const p of productoCarrito){
            await db.query("INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_total) VALUES (?, ?, ?, ?)",
                [id_compra, p.id_producto, p.cantidad, p.precio_total]);

            await db.query(`UPDATE productosagricolas SET unidades = unidades - ? WHERE id = ?`, 
            [p.cantidad, p.id_producto]);
        }

        await db.query("DELETE FROM carrito_producto WHERE id_carrito = ?", 
            [id_carrito]
        );

        res.json({message: "Compra realizada con exito", id_compra: resultado.insertId, referenciaPago, productos: productoCarrito})

    } catch (error) {
        res.status(500).json({ error: error.message})
    }
};

export const actualizarCompra = async(req, res) => {
    try {
        const {id} = req.params;
        const { id_carrito } = req.body;

        const [resultado] = await db.query("UPDATE compras_realizadas SET id_carrito = ? WHERE id = ?",
        [id_carrito, id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({ error : "Compra no encontrada"})
    }
    res.json({id_compra, id_carrito})

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const eliminarCompra = async(req, res) => {
    try {
        const {id} = req.params;

        await db.query("DELETE FROM detalle_compra WHERE id_compra = ?", [id])

        const [resultado] = await db.query("DELETE FROM compras_realizadas WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "Compra no encontrada"})
        }

        res.json({message: "Compra eliminada con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

