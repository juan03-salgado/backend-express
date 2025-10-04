import db from "../db.js";

export const getInsumos = async (req, res) => {
    try{
        const [resultado] = await db.query(`SELECT i.id, i.nombre, i.descripcion, i.cantidad_disponible AS cantidadDisponible, i.precio_unitario AS precioUnitario,
        i.proveedor_id AS proveedorId,
        p.nombre AS proveedorNombre
        FROM insumo i
        LEFT JOIN proveedores p ON i.proveedor_id = p.id`
    );
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getInsumoId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query("SELECT * FROM insumo WHERE id = ?", 
        [id]
    );
 
        if (resultado.length === 0){
            return res.status(404).json({ error : "insumo no encontrado"})
        }
        res.json(resultado);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const crearInsumos = async (req, res) => {
  try {
    const { nombre, descripcion, cantidadDisponible, precioUnitario, proveedorId } = req.body;

    const [resultado] = await db.query(
      "INSERT INTO insumo (nombre, descripcion, cantidad_disponible, precio_unitario, proveedor_id) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion, cantidadDisponible, precioUnitario, proveedorId]
    );

    res.json({ id: resultado.insertId, nombre, descripcion, cantidadDisponible, precioUnitario, proveedorId });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarInsumos = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, cantidadDisponible, precioUnitario, proveedorId } = req.body;

    const [resultado] = await db.query(
      "UPDATE insumo SET nombre = ?, descripcion = ?, cantidad_disponible = ?, precio_unitario = ?, proveedor_id = ? WHERE id = ?",
      [nombre, descripcion, cantidadDisponible, precioUnitario, proveedorId, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "insumo no encontrado" });
    }

    res.json({ id, nombre, descripcion, cantidadDisponible, precioUnitario, proveedorId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarInsumos = async(req, res) => {
    try {
        const {id} = req.params;

        const [resultado] = await db.query("DELETE FROM insumo WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "insumo no encontrado"})
        }

        res.json({message: "insumo eliminado con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};