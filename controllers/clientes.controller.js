import db from "../db.js";

export const getClientes = async (req, res) => {
    try{
        const [resultado] = await db.query("SELECT * FROM clientes");
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getClienteId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query("SELECT * FROM clientes WHERE id = ?", 
        [id]
    );

        if (resultado.length === 0){
            return res.status(404).json({ error : "cliente no encontrado"})
        }
        res.json(resultado);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const crearCliente = async (req, res) => {
    try {
        const { nombre, direccion, telefono, id_user } = req.body;
        const [resultado] = await db.query("INSERT INTO clientes (nombre, direccion, telefono, id_user) VALUE (?, ?, ?, ?)",
        [nombre, direccion, telefono, id_user]
    );
        res.json({ id: resultado.insertId, nombre, direccion, telefono, id_user});

    } catch (error) {
        res.status(500).json({ error: error.message})

    }
};

export const actualizarCliente = async(req, res) => {
    try {
        const {id} = req.params;
        const { nombre, direccion, telefono, id_user } = req.body;

        const [resultado] = await db.query("UPDATE clientes SET nombre = ?, direccion = ?, telefono = ?, id_user = ? WHERE id = ?",
        [nombre, direccion, telefono, id_user, id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({ error : "cliente no encontrado"})
    }
    res.json({id, nombre, email, contraseña})

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const eliminarCliente = async(req, res) => {
    try {
        const {id} = req.params;

        const [resultado] = await db.query("DELETE FROM clientes WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "cliente no encontrado"})
        }

        res.json({message: "Cliente eliminado con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};