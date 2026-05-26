const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist/gamehub-frontend/browser');

app.use(express.static(distPath));

// Redirige todas las rutas al index.html para que Angular Router funcione
app.get('/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
