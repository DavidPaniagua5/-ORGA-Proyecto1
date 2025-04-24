const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const { SerialPort } = require('serialport');


const app = express();
const PORT = 5000;
/*
const serialPortPath = ''; // Reemplazar con serial de Arduino

const serialPort = new SerialPort({
    path: serialPortPath,
    baudRate: 9600, // Reemplazar la velocidad con la configuración de Arduino
  });

  // Abre el puerto serial
serialPort.open((err) => {
    if (err) {
      return console.log('Error al abrir el puerto serial:', err.message);
    }
    console.log('Puerto serial abierto correctamente');
  });
*/

app.use(morgan('dev')); // para poder visualizar los estados de nuestro servidor
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Home Page');
  });
  //Ruta para enviar datos al Arduino
/*app.get('/enviar/:dato', (req, res) => {
    const datoEnviar = req.params.dato;
    serialPort.write(datoEnviar + '\n', (err) => {
      if (err) {
        return res.status(500).send('Error al enviar datos por el puerto serial: ' + err.message);
      }
      console.log('Dato enviado al Arduino:', datoEnviar);
      res.send('Dato enviado al Arduino: ' + datoEnviar);
    });
  });

// Define una forma de leer datos desde el Arduino
serialPort.on('data', (data) => {
  console.log('Datos recibidos del Arduino:', data.toString());
  // Aquí podrías procesar los datos recibidos y, por ejemplo, enviarlos a través de websockets a un cliente web.
});

// Maneja errores del puerto serial
serialPort.on('error', (err) => {
  console.error('Error en el puerto serial:', err);
});

  */

app.post("/ingresar", (req, res) => {
    console.log(req.body.texto);
    const texto = req.body.texto;
    
    texto.split("\n").forEach((dato) => {
        console.log(dato);
        
        // serialPort.write(dato + '\n', (err) => {
        //   if (err) {
        //     return console.log('Error al enviar datos por el puerto serial:', err.message);
        //   }
        //   console.log('Dato enviado al Arduino:', dato);
        // });
      });
    res.send("Datos recibidos correctamente:");  
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
  