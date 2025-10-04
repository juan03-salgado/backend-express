import db from "../db.js";

export const getProductos = async (req, res) => {
    try{
        const [resultado] = await db.query("SELECT * FROM productosagricolas");
        res.json(resultado);

    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getProductosId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query("SELECT * FROM productosagricolas WHERE id = ?", 
        [id]
    );

        if (resultado.length === 0){
            return res.status(404).json({ error : "producto no encontrado"})
        }
        res.json(resultado);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const crearProductos = async (req, res) => {
  try {
    const { tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id } = req.body;

    const [resultado] = await db.query(
      "INSERT INTO productosagricolas (tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id) VALUES (?, ?, ?, ?, ?, ?)",
      [tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id]
    );

    res.json({ id: resultado.insertId, tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id } = req.body;

    const [resultado] = await db.query(
      "UPDATE productosagricolas SET tipo_producto = ?, nombre = ?, descripcion = ?, unidades = ?, precio_unidad = ?, finca_id = ? WHERE id = ?",
      [tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "producto no encontrado" });
    }

    res.json({ id, tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarProductos = async(req, res) => {
    try {
        const {id} = req.params;

        const [resultado] = await db.query("DELETE FROM productosagricolas WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "producto no encontrado"})
        }

        res.json({message: "producto eliminado con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};