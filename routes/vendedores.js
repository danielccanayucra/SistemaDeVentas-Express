var express = require('express');
var router = express.Router();
var dbConn=require('../lib/db');

/* listar*/
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM vendedores ORDER BY id desc',function(err,rows)     {
      if(err) {
          req.flash('error', err);
         res.render('vendedores/index',{data:''});   
      } else {
          res.render('vendedores/index',{data:rows});
      }
    });
    
  });
/* VER FORMULARIO ADD*/
router.get('/add', function(req, res, next) {    
  // render to add.ejs
  res.render('vendedores/add', {
      nombres: '',  
      apellidos: '', 
      dni: '', 
      celular: '', 
      email: '',    
      fecnac: '', 
      direccion: '', 
      USUARIOS_id: '', 
  })
})
/* INSERTAR EN BASE DE DATOS*/
router.post('/add', function(req, res, next) {    

  let nombres = req.body.nombres;
  let apellidos = req.body.apellidos;
  let dni = req.body.dni;
  let celular = req.body.celular;
  let email = req.body.email;
  let fecnac = req.body.fecnac;
  let direccion = req.body.direccion;
  let USUARIOS_id = req.body.USUARIOS_id;
  let errors = false;

  if(nombres.length === 0 || apellidos.length === 0 || dni.length === 0 || celular.length === 0 || email.length === 0 || fecnac.length === 0  || direccion.length === 0  || USUARIOS_id.length === 0  ) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('vendedores/add', {
          nombres: nombres,
          apellidos: apellidos,
          dni: dni,
          celular: celular,
          email: email,
          fecnac: fecnac,
          direccion: direccion,
          USUARIOS_id: USUARIOS_id,
      })
  }
   // if no error
   if(!errors) {
  
    var form_data = {
        nombres: nombres,
        apellidos: apellidos,
        dni: dni,
        celular: celular,
        email: email,
        fecnac: fecnac,
        direccion: direccion,
        USUARIOS_id: USUARIOS_id,
    }
    
    // insert query
    dbConn.query('INSERT INTO vendedores SET ?', form_data, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
             
            // render to add.ejs
            res.render('vendedores/add', {
                nombres: form_data.nombres,
                apellidos: form_data.apellidos,
                dni: form_data.dni,
                celular: form_data.celular,
                email: form_data.email,
                fecnac: form_data.fecnac,
                direccion: form_data.direccion,
                USUARIOS_id: form_data.USUARIOS_id,
            })
        } else {                
            req.flash('success', 'Book successfully added');
            res.redirect('/vendedores');
        }
    })
}
})
/* VER FORMULARIO EDITAR*/
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM vendedores WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Registro not found with id = ' + id)
            res.redirect('/vendedores')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('vendedores/edit', {
                id: rows[0].id,
                nombres: rows[0].nombres,
                apellidos: rows[0].apellidos,
                dni: rows[0].dni,
                celular: rows[0].celular,
                email: rows[0].email,
                fecnac: rows[0].fecnac,
                direccion: rows[0].direccion,
                USUARIOS_id: rows[0].USUARIOS_id,
            })
        }
    })
  })
  
  
  /* ACTUALIZAR FORMULARIO DE BASE DE DATOS*/
  router.post('/update/:id', function(req, res, next) {
  
    let id = req.params.id;
    let nombres = req.body.nombres;
    let apellidos = req.body.apellidos;
    let dni = req.body.dni;
    let celular = req.body.celular;
    let email = req.body.email;
    let fecnac = req.body.fecnac;
    let direccion = req.body.direccion;
    let USUARIOS_id = req.body.USUARIOS_id;
    let errors = false;
  
    if(nombres.length === 0 || apellidos.length === 0 || dni.length === 0 || celular.length === 0 || email.length === 0 || fecnac.length === 0  || direccion.length === 0  || USUARIOS_id.length === 0  ) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name ");
        // render to add.ejs with flash message
        res.render('vendedores/edit', {
            id: req.params.id,
            nombres: nombres,
            apellidos: apellidos,
            dni: dni,
            celular: celular,
            email: email,
            fecnac: fecnac,
            direccion: direccion,
            USUARIOS_id: USUARIOS_id,
        })
    }
    // if no error
    if( !errors ) {   
  
        var form_data = {
            nombres: nombres,
            apellidos: apellidos,
            dni: dni,
            celular: celular,
            email: email,
            fecnac: fecnac,
            direccion: direccion,
            USUARIOS_id: USUARIOS_id,
        }
        // update query
        dbConn.query('UPDATE vendedores SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('vendedores/edit', {
                    id: req.params.id,
                    nombres: form_data.nombres,
                    apellidos: form_data.apellidos,
                    dni: form_data.dni,
                    celular: form_data.celular,
                    email: form_data.email,
                    fecnac: form_data.fecnac,
                    direccion: form_data.direccion,
                    USUARIOS_id: form_data.USUARIOS_id,
                })
            } else {
                req.flash('success', 'Registro successfully updated');
                res.redirect('/vendedores');
            }
        })
    }
  })
/* ELIMINAR REGISTRO DE BASE DE DATOS*/
router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM vendedores WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/vendedores')
        } else {
            req.flash('success', 'Registro successfully deleted! ID = ' + id)
            res.redirect('/vendedores')
        }
    })
  })
module.exports = router;
