import db from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

export const upload = multer({ storage });

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
    const imagen = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

    const [resultado] = await db.query(
      "INSERT INTO productosagricolas (tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagen]
    );

    res.json({ id: resultado.insertId, tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagen});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id } = req.body;
    
    const [productoActual] = await db.query("SELECT * FROM productosagricolas WHERE id = ?", [id]);
    
    if (productoActual.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const imagenExistente = productoActual[0].imagen;
    let nuevaImagen = imagenExistente;

    if(req.file){
      nuevaImagen = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    if (req.file && imagenExistente) {
    const archivoViejo = imagenExistente.split("/").pop();
    const rutaVieja = path.join(process.cwd(), "uploads", archivoViejo);

    if(fs.existsSync(rutaVieja)){
      fs.unlinkSync(rutaVieja);
    }
  }

    const [resultado] = await db.query(
      "UPDATE productosagricolas SET tipo_producto = ?, nombre = ?, descripcion = ?, unidades = ?, precio_unidad = ?, finca_id = ?, imagen = ? WHERE id = ?",
      [tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, nuevaImagen, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "producto no encontrado" });
    }

    res.json({ id, tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagen:nuevaImagen});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarProductos = async(req, res) => {
    try {
        const {id} = req.params;

        const [producto] = await db.query("SELECT imagen FROM productosagricolas WHERE id = ?", 
          [id]
        );

        if(producto.length === 0){
          return res.status(404).json({ error: "Producto no encontrado"});
        }

        const imagen = producto[0].imagen;

        const [resultado] = await db.query("DELETE FROM productosagricolas WHERE id = ?",
            [id]
        );

        if(resultado.affectedRows === 0){
            return res.status(404).json({ error : "producto no encontrado"})
        }

        if(imagen){
          const archivo = imagen.split("/").pop();
          const ruta = path.join(process.cwd(), "uploads", archivo);

          if(fs.existsSync(ruta)){
            fs.unlinkSync(ruta);
          }
        }

        res.json({message: "producto eliminado con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};