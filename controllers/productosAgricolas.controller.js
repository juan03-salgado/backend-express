import db from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

export const upload = multer({ storage });
const base_url = process.env.BASE_URL || "http://localhost:3000";

const urlImagen = (archivo) => {
  return archivo ? `${base_url}/uploads/${archivo}` : null;
};

const formatoProducto = (p) => ({
  ...p, imagenUrl: urlImagen(p.imagen), imagen: p.imagen
});

export const getProductos = async (req, res) => {
    try{
        const [resultado] = await db.query(`SELECT p.id, p.tipo_producto, p.nombre, p.descripcion, p.unidades, p.precio_unidad, p.finca_id, f.nombre AS fincaNombre, p.imagen
        FROM productosagricolas p
        LEFT JOIN fincas f ON p.finca_id = f.id
    `);
      const productos = resultado.map(formatoProducto);
      res.json(productos);

    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
};

export const getProductosId = async (req, res) => {
    try {
        const {id} = req.params;
        const [resultado] = await db.query(`SELECT p.id, p.tipo_producto, p.nombre, p.descripcion, p.unidades, p.precio_unidad, p.finca_id, f.nombre AS fincaNombre, p.imagen
        FROM productosagricolas p
        LEFT JOIN fincas f ON p.finca_id = f.id
        WHERE p.id = ?`, 
        [id]
    );

      if (resultado.length === 0){
          return res.status(404).json({ error : "producto no encontrado"})
      };

      const producto = formatoProducto(resultado[0]);
      res.json(producto);

    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const crearProductos = async (req, res) => {
  try {
    const { tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const [resultado] = await db.query(
      "INSERT INTO productosagricolas (tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagen]
    );

    res.json({ id: resultado.insertId, tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagen: urlImagen(imagen)});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagenAnterior } = req.body;
    
    const [productoActual] = await db.query("SELECT * FROM productosagricolas WHERE id = ?", [id]);
    
    if (productoActual.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const imagenExistente = productoActual[0].imagen;
    const imagenBorrar = imagenAnterior || imagenExistente;
    let nuevaImagen = imagenExistente;

    if(req.file){
      nuevaImagen = req.file.filename;

    if (imagenBorrar) {
    const rutaVieja = path.join(process.cwd(), "uploads", imagenExistente);
      if(fs.existsSync(rutaVieja)){
        fs.unlinkSync(rutaVieja);
    }
  }
}

    const [resultado] = await db.query(
      "UPDATE productosagricolas SET tipo_producto = ?, nombre = ?, descripcion = ?, unidades = ?, precio_unidad = ?, finca_id = ?, imagen = ? WHERE id = ?",
      [tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, nuevaImagen, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "producto no encontrado" });
    }

    res.json({ id, tipo_producto, nombre, descripcion, unidades, precio_unidad, finca_id, imagen: urlImagen(nuevaImagen)});
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
          const ruta = path.join(process.cwd(), "uploads", imagen);

          if(fs.existsSync(ruta)){
            fs.unlinkSync(ruta);
          }
        }

        res.json({message: "producto eliminado con exito"});
        
    } catch (error){
        res.status(500).json({error: error.message});
    }
};