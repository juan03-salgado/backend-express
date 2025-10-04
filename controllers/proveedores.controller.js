import db from "../db.js";

export const getProveedores = async (req, res) => {
    try{
        const [resultado] = await db.query("SELECT * FROM proveedores");
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getProveedoresId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query("SELECT * FROM proveedores WHERE id = ?", 
        [id]
    );

        if (resultado.length === 0){
            return res.status(404).json({ error : "proveedor no encontrado"})
        }
        res.json(resultado);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const crearProveedores = async (req, res) => {
    try {
        const { nombre, email, telefono, direccion } = req.body;
        const [resultado] = await db.query("INSERT INTO proveedores (nombre, email, telefono, direccion) VALUE (?, ?, ?, ?)",
        [nombre, email, telefono, direccion]
    );
        res.json({ id: resultado.insertId, nombre, email, telefono, direccion});

    } catch (error) {
        res.status(500).json({ error: error.message})

    }
};

export const actualizarProveedores = async(req, res) => {
    try {
        const {id} = req.params;
        const { nombre, email, telefono, direccion } = req.body;

        const [resultado] = await db.query("UPDATE proveedores SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?",
        [nombre, email, telefono, direccion, id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({ error : "proveedor no encontrado"})
    }
    res.json({id, nombre, email, telefono, direccion})

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const eliminarProveedores = async(req, res) => {
    try {
        const {id} = req.params;

        const [resultado] = await db.query("DELETE FROM proveedores WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "proveedor no encontrado"})
        }

        res.json({message: "proveedor eliminado con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};