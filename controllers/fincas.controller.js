import db from "../db.js";

export const getFincas = async (req, res) => {
    try{
        const [resultado] = await db.query("SELECT * FROM fincas");
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getFincaId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query("SELECT * FROM fincas WHERE id = ?", 
        [id]
    );

        if (resultado.length === 0){
            return res.status(404).json({ error : "finca no encontrada"})
        }
        res.json(resultado);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const crearFincas = async (req, res) => {
    try {
        const { nombre, email, telefono, ubicacion } = req.body;
        const [resultado] = await db.query("INSERT INTO fincas (nombre, email, telefono, ubicacion) VALUE (?, ?, ?, ?)",
        [nombre, email, telefono, ubicacion]
    );
        res.json({ id: resultado.insertId, nombre, email, telefono, ubicacion});

    } catch (error) {
        res.status(500).json({ error: error.message})

    }
};

export const actualizarFincas = async(req, res) => {
    try {
        const {id} = req.params;
        const { nombre, email, telefono, ubicacion } = req.body;

        const [resultado] = await db.query("UPDATE fincas SET nombre = ?, email = ?, telefono = ?, ubicacion = ? WHERE id = ?",
        [nombre, email, telefono, ubicacion, id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({ error : "finca no encontrada"})
    }
    res.json({id, nombre, email, telefono, ubicacion})

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const eliminarFincas = async(req, res) => {
    try {
        const {id} = req.params;

        const [resultado] = await db.query("DELETE FROM fincas WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "finca no encontrada"})
        }

        res.json({message: "finca eliminada con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};