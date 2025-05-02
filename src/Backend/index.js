const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// Configuración de multer para manejar la subida de archivos
const upload = multer({ dest: 'uploads/' });

// Middleware para permitir CORS (necesario para que el frontend se comunique con el servidor)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta para recibir el archivo y procesar las bombas
app.post('/ingresar', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  // Leer el archivo subido
  const filePath = req.file.path;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }

    // Procesar el contenido del archivo
    const lines = data.split('\n');
    const bombs = [];

    for (let line of lines) {
      line = line.trim();
      // Ignorar comentarios y líneas vacías
      if (line.startsWith('//') || line === '' || line === 'conf_ini' || line === 'conf_fin') {
        continue;
      }

      // Buscar líneas que comiencen con "ADD"
      if (line.startsWith('ADD')) {
        const parts = line.split(/[\s,:]+/);
        const x = parseInt(parts[2]);
        const y = parseInt(parts[4]);
        // Validar coordenadas para un tablero 4x4
        if (x >= 0 && x < 4 && y >= 0 && y < 4) {
          bombs.push({ x, y });
        }
      }
    }

    // Eliminar el archivo temporal
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error al eliminar el archivo temporal:', err);
    });

    // Enviar las posiciones de las bombas al frontend
    res.json({ bombs });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});