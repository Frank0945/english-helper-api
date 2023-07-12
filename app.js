
/**
 * The project structure refers to https://github.com/geshan/expressjs-structure
 * 
 * Todo:
 * - Link with database
 * - Add test.model.js
 */

const express = require('express')
const app = express()
const port = 3000
const testRouter = require('./src/routes/test.route');

app.get('/', (req, res) => {
  res.json({ 'message': 'ok' });
})

app.use('/test', testRouter);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})