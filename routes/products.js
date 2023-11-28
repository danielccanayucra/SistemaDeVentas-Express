var express = require('express');
var router = express.Router();
var dbConn=require('../lib/db');

/* listar*/
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM productos ORDER BY id desc',function(err,rows)     {
      if(err) {
          req.flash('error', err);
         res.render('products/index',{data:''});   
      } else {
          res.render('products/index',{data:rows});
      }
    });
    
  });
/* VER FORMULARIO ADD*/
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('products/add', {
        nombre: '',  
        descripcion: '', 
        modelo: '', 
        stock: '', 
        precio: '',    
        imagen: '',  
        CATEGORIAS_id: '', 
        PROVEEDORES_id: '', 
    })
  })

  /* INSERTAR EN BASE DE DATOS*/
router.post('/add', function(req, res, next) {    

    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    let modelo = req.body.modelo;
    let stock = req.body.stock;
    let precio = req.body.precio;
    let imagen = req.body.imagen;
    let CATEGORIAS_id = req.body.CATEGORIAS_id;
    let PROVEEDORES_id = req.body.PROVEEDORES_id;
    let errors = false;
  
    if(nombre.length === 0 || descripcion.length === 0 || modelo.length === 0 || stock.length === 0 || precio.length === 0 || imagen.length === 0 || CATEGORIAS_id.length === 0 || PROVEEDORES_id.length === 0 ) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('products/add', {
            nombre: nombre,
            descripcion: descripcion,
            modelo: modelo,
            stock: stock,
            precio: precio,
            imagen: imagen,
            CATEGORIAS_id: CATEGORIAS_id,
            PROVEEDORES_id: PROVEEDORES_id,
        })
    }
     // if no error
     if(!errors) {
    
      var form_data = {
        nombre: nombre,
        descripcion: descripcion,
        modelo: modelo,
        stock: stock,
        precio: precio,
        imagen: imagen,
        CATEGORIAS_id: CATEGORIAS_id,
        PROVEEDORES_id: PROVEEDORES_id,
      }
      
      // insert query
      dbConn.query('INSERT INTO productos SET ?', form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              req.flash('error', err)
               
              // render to add.ejs
              res.render('products/add', {
                nombre: form_data.nombre,
                descripcion: form_data.descripcion,
                modelo: form_data.modelo,
                stock: form_data.stock,
                precio: form_data.precio,
                imagen: form_data.imagen,
                CATEGORIAS_id: form_data.CATEGORIAS_id,
                PROVEEDORES_id: form_data.PROVEEDORES_id,
              })
          } else {                
              req.flash('success', 'Book successfully added');
              res.redirect('/products');
          }
      })
  }
  })
module.exports = router;
