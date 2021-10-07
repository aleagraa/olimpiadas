var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var bd=require('./bd');

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(request, res) {
	var dni_paciente = request.body.dni_paciente;
	var password = request.body.password;
	bd.query('SELECT dni_paciente, dni_paciente FROM paciente WHERE dni_paciente = ? AND password = ? ', [dni_paciente, password], function(error, results, fields){
  if (error) {            
    console.log('error en la consulta');
    return;
}
if (results.length > 0) {
        res.render('perfilc');
        
			}
       else {
        res.render('mensajes',{mensaje:'numero o contraseña incorrecta'});
			}
        });
      
  

});

//Registrar pacientes
router.get('/perfilc', function(req, res, next) {
  res.render('perfilc');
});

//Registrar pacientes
router.get('/registrar', function(req, res, next) {
  res.render('registrarse');
});

router.post('/registrar', function(req, res, next) {
      var registro={
        nya_paciente:req.body.nya_paciente,
        dni_paciente:req.body.dni_paciente
       };
      bd.query('insert into paciente set ?',registro, function (error,resultado){
          if (error){
              console.log(error);
              return;
          }
      });    
  res.render('mensajes',{mensaje:'La carga se efectuo correctamente'});
});

//Ayuda
router.get('/ayuda', function(req, res, next) {
  res.render('ayuda');
});

//Registrar doctor
router.get('/registrard', function(req, res, next) {
  res.render('registrard');
});
router.post('/registrard', function(req, res, next) {
  var registro={
    nya_medico:req.body.nya_medico,
    nmatricula_medico:req.body.nmatricula_medico,
    especialidad_medico:req.body.especialidad_medico,
    password:req.body.password
   };
  bd.query('insert into medico set ?',registro, function (error,resultado){
      if (error){
          console.log(error);
          return;
      }
  });    
res.render('mensajes',{mensaje:'La carga se efectuo correctamente'});
});

//Index doctor
router.get('/indexd', function(req, res, next) {
  res.render('indexd');
});

//Pacientes
router.get('/pacientes', function(req, res, next) {
  res.render('pacientes');
});


//Index doctor
router.get('/perfild', function(req, res, next) {
  res.render('perfild');
});

//Turnos
router.get('/turnos', function(req, res, next) {
  res.render('turnos');
});

router.get('/reservart', function(req, res, next) {
  var especialidad =req.body.especialidad_turno;
  var turno=req.body.medico_turno;
  var fecha=req.body.fecha_turnos;
  
  bd.query('select `especialidad_turno`,`medico_turno`,`fecha_turnos` from turnos inner join medico on `especialidad_turno` = `especialidad_medico`', function(error,filas){
        if (error) {            
            console.log('error en el listado');
            return;
        }    
        res.render('reservart',{turnos:filas});
        bd.query('insert into turnos set ?',(especialidad,turno,fecha), function (error,resultado){
          if (error){
              res.render('login');
              return;
        };
      
          res.render('mensajes',{mensaje:'La carga se efectuo correctamente'});
      });
  
});
});
      module.exports = router;
