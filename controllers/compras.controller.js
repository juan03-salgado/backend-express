import db from "../db.js";

export const getCompras = async (req, res) => {

    try{
        const [resultado] = await db.query("SELECT * FROM compras_realizadas");
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getComprasId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query("SELECT * FROM compras_realizadas WHERE id = ?", 
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

export const crearCompras = async (req, res) => {
    try {
        const { id_carrito } = req.body;
        const [resultado] = await db.query("INSERT INTO compras_realizadas (id_carrito) VALUE (?)",
        [id_carrito]
    );
        res.json({ id: resultado.insertId, id, id_carrito});

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

