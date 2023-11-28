var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET PROVEEDORES listing. */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM proveedores ORDER BY id desc',function(err,rows) {
        if(err) {
            req.flash('error', err);
            res.render('suppliers/index',{data:''});
        } else {
            res.render('suppliers/index',{data:rows});
        }
    });
});
/* VER FORMULARIO ADD*/
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('suppliers/add', {
        razonsocial: '',  
        ruc: '', 
        celular: '', 
        email: '', 
        direccion: '',    
    })
  })

/* INSERTAR EN BASE DE DATOS*/
router.post('/add', function(req, res, next) {    

    let razonsocial = req.body.razonsocial;
    let ruc = req.body.ruc;
    let celular = req.body.celular;
    let email = req.body.email;
    let direccion = req.body.direccion;
    let errors = false;
  
    if(razonsocial.length === 0 || ruc.length === 0 || celular.length === 0 || email.length === 0 || direccion.length === 0  ) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('suppliers/add', {
            razonsocial: razonsocial,
            ruc: ruc,
            celular: celular,
            email: email,
            direccion: direccion,
        })
    }
  
    // if no error
    if(!errors) {
  
        var form_data = {
            razonsocial: razonsocial,
            ruc: ruc,
            celular: celular,
            email: email,
            direccion: direccion,
        }
        
        // insert query
        dbConn.query('INSERT INTO proveedores SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('suppliers/add', {
                    razonsocial: form_data.razonsocial,
                    ruc: form_data.ruc,
                    celular: form_data.celular,
                    email: form_data.email,
                    direccion: form_data.direccion,
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/suppliers');
            }
        })
    }
  })
  /* VER FORMULARIO EDITAR*/
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM proveedores WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Registro not found with id = ' + id)
            res.redirect('/suppliers')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('suppliers/edit', {
                id: rows[0].id,
                razonsocial: rows[0].razonsocial,
                ruc: rows[0].ruc,
                celular: rows[0].celular,
                email: rows[0].email,
                direccion: rows[0].direccion,
            })
        }
    })
  })
  
  
  /* ACTUALIZAR FORMULARIO DE BASE DE DATOS*/
  router.post('/update/:id', function(req, res, next) {
  
    let id = req.params.id;
    let razonsocial = req.body.razonsocial;
    let ruc = req.body.ruc;
    let celular = req.body.celular;
    let email = req.body.email;
    let direccion = req.body.direccion;
    let errors = false;
  
    if(razonsocial.length === 0 || ruc.length === 0 || celular.length === 0 || email.length === 0 || direccion.length === 0  ) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name ");
        // render to add.ejs with flash message
        res.render('suppliers/edit', {
            id: req.params.id,
            razonsocial: razonsocial,
            ruc: ruc,
            celular: celular,
            email: email,
            direccion: direccion,

        })
    }
  
    // if no error
    if( !errors ) {   
  
        var form_data = {
            razonsocial: razonsocial,
            ruc: ruc,
            celular: celular,
            email: email,
            direccion: direccion,
        }
        // update query
        dbConn.query('UPDATE proveedores SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('suppliers/edit', {
                    id: req.params.id,
                    razonsocial: form_data.razonsocial,
                    ruc: form_data.ruc,
                    celular: form_data.celular,
                    email: form_data.email,
                    direccion: form_data.direccion,
                })
            } else {
                req.flash('success', 'Registro successfully updated');
                res.redirect('/suppliers');
            }
        })
    }
  })
/* ELIMINAR REGISTRO DE BASE DE DATOS*/
router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM proveedores WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/suppliers')
        } else {
            req.flash('success', 'Registro successfully deleted! ID = ' + id)
            res.redirect('/suppliers')
        }
    })
  })

module.exports = router;
