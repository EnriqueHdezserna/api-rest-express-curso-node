import express from 'express';
import Joi from 'joi';
const ruta = express.Router();

//data
const usuarios = [
  { id: 1, nombre: 'Juans', apellido: 'Perez' },
  { id: 2, nombre: 'Ana', apellido: 'Garcia' },
  { id: 3, nombre: 'Pedro', apellido: 'Lopez' },
];

ruta.get('/', (req, res) => {
  res.send(usuarios);
});

ruta.get('/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);

  if (!usuario) {
    res.status(404).send('Usuario no encontrado');
    return;
  }
  res.send(usuario);
});

//uso de post

ruta.post('/', (req, res) => {
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

ruta.put('/:id', (req, res) => {

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

ruta.delete('/:id', (req, res) => {
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
//funciones

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

export default ruta;
