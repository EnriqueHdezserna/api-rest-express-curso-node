import express from 'express';
import config from 'config';

import usuarios from './routes/usuarios.js';
import morgan from 'morgan';
import debug from 'debug';

const debugg = debug('app:inicio');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);


console.log('Aplicacion ' + config.get('nombre'));
console.log('BD Server ' + config.get('configDB.host'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));

  debugg('Morgan habilitado');
}

//* Trabajos con la base de datos
debugg('Trabajando con la base de datos');


app.get('/', (req, res) => {
  res.send('Hola Mundo desde Express!');
});

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log(`'Escuchando en el puerto ${port}..'`);
});
