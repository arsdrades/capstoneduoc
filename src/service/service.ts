import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: 'usuario',
  host: 'localhost',
  database: 'nombre_bd',
  password: 'contraseña',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

interface Pedido {
  totalCostRuta: number;
  totalPedido: number;
  total: number;
  startCoords: { lat: number; lng: number };
  endCoords: { lat: number; lng: number };
  alto: string;
  ancho: string;
  largo: string;
  cantidad: string;
}

// Endpoint para registrar pedidos
app.post('/api/pedidos', async (req: Request, res: Response) => {
  const { totalCostRuta, totalPedido, total, startCoords, endCoords, alto, ancho, largo, cantidad } = req.body as Pedido;

  try {
    await pool.query(
      'INSERT INTO pedidos (total_cost_ruta, total_pedido, total, start_coords, end_coords, alto, ancho, largo, cantidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [totalCostRuta, totalPedido, total, JSON.stringify(startCoords), JSON.stringify(endCoords), alto, ancho, largo, cantidad]
    );
    res.status(200).json({ message: 'Pedido registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el pedido:', error);
    res.status(500).json({ error: 'Error al registrar el pedido' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});