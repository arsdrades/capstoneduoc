import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3001;

// Reemplaza con tu API Key de OpenRouteService
const apiKey = "5b3ce3597851110001cf62485a1eb994cc374ba49c1aa6e890c23343";

// Configura CORS para permitir solicitudes desde cualquier origen (solo para desarrollo)
app.use(
  cors({
    origin: "*", // Permite todos los orígenes
    methods: ["GET", "POST"], // Métodos permitidos
    allowedHeaders: ["Content-Type"], // Cabeceras permitidas
  })
);

// Proxy para la geocodificación con Nominatim
app.get("/api/geocode", async (req, res) => {
  const { address } = req.query;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error en el proxy de geocodificación:", error);
    res.status(500).json({ error: "Error fetching data from Nominatim" });
  }
});

// Proxy para obtener rutas con OpenRouteService
app.get("/api/directions", async (req, res) => {
  const { start, end } = req.query;
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error en el proxy de direcciones:", error);
    res.status(500).json({ error: "Error fetching directions" });
  }
});

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
