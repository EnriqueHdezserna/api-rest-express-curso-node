import express from 'express';
import config from 'config';
import Joi from 'joi';
import morgan from 'morgan';
import debug from 'debug';

const debug = debug('app:inicio');
const dbDebug = debug('app:database');


import { logger } from './logger.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//configuration

console.log('Aplicacion ' + config.get('nombre'));
console.log('BD Server ' + config.get('configDB.host'));

//Uso de un middleware de 3ro

//podemos hacer validaciones para que dependiendo del entorno de trabajo se usen ciertos modulos
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
 
 debug('Morgan habilitado')
}

//* Trabajos con la base de datos
debug('Trabajando con la base de datos')

//app.use(logger);

//método post, creamos middleware
/* app.use(function (req, res, next) {
  console.log('Autenticando ...');
  next();
});
 */
const usuarios = [
  { id: 1, nombre: 'Juans', apellido: 'Perez' },
  { id: 2, nombre: 'Ana', apellido: 'Garcia' },
  { id: 3, nombre: 'Pedro', apellido: 'Lopez' },
];
app.get('/', (req, res) => {
  res.send('Hola Mundo desde Express!');
});

app.get('/api/usuarios', (req, res) => {
  res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);

  if (!usuario) {
    res.status(404).send('Usuario no encontrado');
    return;
  }
  res.send(usuario);
});

//uso de post

app.post('/api/usuarios', (req, res) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
    apellido: Joi.string().min(3).required(),
  });
  const { error, value } = validarUsuario(req.body.nombre, req.body.apellido);

  if (!error) {
    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: value.nombre,
      apellido: value.apellido,
    };

    usuarios.push(nuevoUsuario);
    res.send(nuevoUsuario);
  } else {
    let message = error.details[0].message;
    res.status(400).send(message);
  }
});

app.put('/api/usuarios/:id', (req, res) => {
  //encontrar si existe el objeto usuario
  //let usuario = usuarios.find((user) => user.id === parseInt(req.params.id));
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    return res.status(404).send('Usuario no encontrado');
  }

  const { error, value } = validarUsuario(req.body.nombre, req.body.apellido);

  if (error) {
    let message = error.details[0].message;
    res.status(400).send(message);
  }

  //validmos el usuario
  usuario.nombre = value.nombre;
  usuario.apellido = value.apellido;

  res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    return res.status(404).send('Usuario no encontrado');
  }
  const index = usuarios.indexOf(usuario);
  if (index !== -1) {
    usuarios.splice(index, 1);
  }

  res.send(usuario);
});

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log(`'Escuchando en el puerto ${port}..'`);
});

function existeUsuario(id) {
  return usuarios.find((user) => user.id === parseInt(id));
}

function validarUsuario(nom, apel) {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
    apellido: Joi.string().min(3).required(),
  });

  return schema.validate({
    nombre: nom,
    apellido: apel,
  });
}
