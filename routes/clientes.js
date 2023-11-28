var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');

/* listar*/
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM clientes ORDER BY id desc',function(err,rows)     {
    if(err) {
        req.flash('error', err);
        res.render('clientes/index',{data:''});   
    } else {
        res.render('clientes/index',{data:rows});
    }
  });
  
});
/* VER FORMULARIO ADD*/
router.get('/add', function(req, res, next) {    
  // render to add.ejs
  res.render('clientes/add', {
      nombres: '',  
      apellidos: '', 
      dni: '', 
      direccion: '', 
      email: '',    
  })
})
/* INSERTAR EN BASE DE DATOS*/
router.post('/add', function(req, res, next) {    

  let nombres = req.body.nombres;
  let apellidos = req.body.apellidos;
  let dni = req.body.dni;
  let direccion = req.body.direccion;
  let email = req.body.email;
  let errors = false;

  if(nombres.length === 0 || apellidos.length === 0 || dni.length === 0 || direccion.length === 0 || email.length === 0  ) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('clientes/add', {
          nombres: nombres,
          apellidos: apellidos,
          dni: dni,
          direccion: direccion,
          email: email,
      })
  }
   // if no error
   if(!errors) {
  
    var form_data = {
        nombres: nombres,
        apellidos: apellidos,
        dni: dni,
        direccion: direccion,
        email: email,
    }
    
    // insert query
    dbConn.query('INSERT INTO clientes SET ?', form_data, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
             
            // render to add.ejs
            res.render('clientes/add', {
                nombres: form_data.nombres,
                apellidos: form_data.apellidos,
                DNI: form_data.dni,
                direccion: form_data.direccion,
                email: form_data.email,
            })
        } else {                
            req.flash('success', 'Book successfully added');
            res.redirect('/clientes');
        }
    })
}
})
/* VER FORMULARIO EDITAR*/
router.get('/edit/(:id)', function(req, res, next) {

  let id = req.params.id;
 
  dbConn.query('SELECT * FROM clientes WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err
       
      // if user not found
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/clientes')
      }
      // if book found
      else {
          // render to edit.ejs
          res.render('clientes/edit', {
              id: rows[0].id,
              nombres: rows[0].nombres,
              apellidos: rows[0].apellidos,
              dni: rows[0].dni,
              direccion: rows[0].direccion,
              email: rows[0].email,
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
  let direccion = req.body.direccion;
  let email = req.body.email;
  let errors = false;

  if(nombres.length === 0 || apellidos.length === 0 || dni.length === 0 || direccion.length === 0 || email.length === 0  ) {
      errors = true;
      
      // set flash message
      req.flash('error', "Please enter name ");
      // render to add.ejs with flash message
      res.render('clientes/edit', {
          id: req.params.id,
          nombres: nombres,
          apellidos: apellidos,
          dni: dni,
          direccion: direccion,
          email: email,
      })
  }

  // if no error
  if( !errors ) {   

      var form_data = {
          nombres: nombres,
          apellidos: apellidos,
          dni: dni,
          direccion: direccion,
          email: email,
      }
      // update query
      dbConn.query('UPDATE clientes SET ? WHERE id = ' + id, form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              // set flash message
              req.flash('error', err)
              // render to edit.ejs
              res.render('clientes/edit', {
                  id: req.params.id,
                  nombres: form_data.nombres,
                  apellidos: form_data.apellidos,
                  dni: form_data.dni,
                  direccion: form_data.direccion,
                  email: form_data.email,
              })
          } else {
              req.flash('success', 'Registro successfully updated');
              res.redirect('/clientes');
          }
      })
  }
})

/* ELIMINAR REGISTRO DE BASE DE DATOS*/
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM clientes WHERE id = ' + id, function(err, result) {
      if (err) {
          req.flash('error', err)
          res.redirect('/clientes')
      } else {
          req.flash('success', 'Registro successfully deleted! ID = ' + id)
          res.redirect('/clientes')
      }
  })
})
module.exports = router;
