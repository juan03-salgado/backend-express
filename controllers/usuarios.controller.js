import db from "../db.js";

export const getUsuarios = async (req, res) => {
    try{
        const [resultado] = await db.query("SELECT * FROM usuarios");
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getUsuarioId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query("SELECT * FROM usuarios WHERE id = ?", 
        [id]
    );

        if (resultado.length === 0){
            return res.status(404).json({ error : "Usuario no encontrado"})
        }
        res.json(resultado);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const { nombre_user, email, contrasena, id_rol } = req.body;
        const [resultado] = await db.query("INSERT INTO usuarios (nombre_user, email, contrasena, id_rol) VALUE (?, ?, ?, ?)",
        [nombre_user, email, contrasena, id_rol]
    );
        res.json({ id: resultado.insertId, nombre_user, email, contrasena, id_rol});

    } catch (error) {
        res.status(500).json({ error: error.message})

    }
};

export const actualizarUsuario = async(req, res) => {
    try {
        const {id} = req.params;
        const { nombre_user, email, contrasena, id_rol } = req.body;

        const [resultado] = await db.query("UPDATE usuarios SET nombre_user = ?, email = ?, contrasena = ?, id_rol = ? WHERE id = ?",
        [nombre_user, email, contrasena, id_rol, id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({ error : "Usuario no encontrado"})
    }
    res.json({nombre_user, email, contrasena, id_rol})

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const eliminarUsuario = async(req, res) => {
    try {
        const {id} = req.params;

        const [resultado] = await db.query("DELETE FROM usuarios WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "Usuario no encontrado"})
        }

        res.json({message: "Usuario eliminado con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

export const loginUsuario = async(req, res) => {
    try {
        const {nombre_user, contrasena} = req.params;
        
        const [resultado] = await db.query("SELECT FROM usuarios WHERE nombre_user = ? AND contrasena = ?",
            [nombre_user, contrasena]
        );
        if(resultado.affectedRows === null){
            return res.status(404).json({ error: "El usuario o la contraseña son incorrectos"})
        } 
        res.json({nombre_user, contrasena})
    } catch(error){
        res.status(500).json({error: error.message})
    }
};
