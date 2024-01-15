const express = require('express');
const router = require('./router');
const path = require('path');

const app = express();

app.use(router)
app.use(express.static(path.join(__dirname, './uploads/')))

// 监听端口
app.listen(8088, (err) => {
  if (err) return console.error(err);
  console.log('run on http://localhost:8088')
})