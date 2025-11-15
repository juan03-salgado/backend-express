import express from "express";
import cors from "cors";
import path from "path";
import fincasRoutes from "./routes/fincasRoutes.js";
import clientesRoutes from "./routes/clientesRoutes.js";
import productosRoutes from "./routes/productosRoutes.js";
import proveedoresRoutes from "./routes/proveedoresRoutes.js";
import insumosRoutes from "./routes/insumosRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import carritoRoutes from "./routes/carritoRoutes.js";
import carritoProductosRoutes from "./routes/carritoProductosRoutes.js";
import comprasRoutes from "./routes/comprasRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/fincas", fincasRoutes);
app.use("/clientes", clientesRoutes);
app.use("/uploads", express.static(path.join(process.cwd(),"uploads")));
app.use("/productos", productosRoutes);
app.use("/proveedores", proveedoresRoutes);
app.use("/insumos", insumosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productosCarrito", carritoProductosRoutes);
app.use("/carrito", carritoRoutes);
app.use("/compras", comprasRoutes);

app.listen(3000, () => {
    console.log("El servidor esta escuchando en el puerto 3000");
});

