const TelegramBot = require('node-telegram-bot-api'); // Dependencia API de telegram
const axios = require('axios'); // Dependencia para enviar peticiones

const fs = require('fs');
const request = require('request');
require('dotenv').config();
const path = require('path');
const fetch = require('node-fetch');

const token = "1267776970:AAHeRbKhB_SgsbJWT8KkKL-_iA33BkWlsWs"; // Token del bot de Telegram

const bot = new TelegramBot(token, {polling: true});

// Se captura el mensaje enviado desde telegram y se envía a la API que luego envía el mensaje a
// Dialogflow

bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  axios.post('http://localhost:3000', { // Dirección del servidor de la API
    query: msg
  }).then(res => {
    bot.sendMessage(chatId, String(res.data.Reply)); // Enviar el mensaje a la API
  });
});

// Se captura la imagen enviada desde telegram y se envía a la API que luego la envía a
// la IA que detecta la imagen


// Para descargar un archivo desde un link
const download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on('close', callback);
  });
};

// Manipular las fotos
bot.on('photo', async (doc) => {
  // obtener el id de la imagen
  const fileId = doc.photo[1].file_id;
  
  // obtener el json del id de la imagen
  const res = await fetch(
    `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
  );
  // obtener ruta de la imagen
  const res2 = await res.json();
  const filePath = res2.result.file_path;

  // generar el link de descarga
  const downloadURL = `https://api.telegram.org/file/bot1267776970:AAHeRbKhB_SgsbJWT8KkKL-_iA33BkWlsWs/${filePath}`;

  axios.post('http://69a6d4bfe72c.ngrok.io', { // Dirección del servidor de la API
    image: downloadURL
  }).then(res => {
    const chatId = doc.chat.id;
    bot.sendMessage(chatId, String(res.data.query)); // Enviar el mensaje a la API
  });
  
  // descargar el archivo
  /*download(downloadURL, path.join(__dirname, `img.jpg`), () => {
    console.log('Descargada la imagen');
    const chatId = doc.chat.id;
    bot.sendMessage(chatId, "Imagen descargada");
  });*/
  console.log(downloadURL);
  
});