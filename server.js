const ngrok = require('ngrok');
(async function () {
    const url = await ngrok.connect(3000);
    console.log(` Servidor corriendo en la URL ${url} `);
   })();