var express = require('express');
var router = express.Router();
var dbConn=require('../lib/db');
var multer=require('multer')
const path = require('path');

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
  // Configura multer para la subida de archivos
const storage = multer.diskStorage({
    destination: 'uploads', // Ruta para almacenar las imágenes
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) );

    }
  });
  
  const upload = multer({
    storage: storage
  }) // Nombre del campo del formulario

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
router.post('/add' , upload.single('imagen') , function(req, res, next) {    

    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    let modelo = req.body.modelo;
    let stock = req.body.stock;
    let precio = req.body.precio;
    let CATEGORIAS_id = req.body.CATEGORIAS_id;
    let PROVEEDORES_id = req.body.PROVEEDORES_id;
    let errors = false;
  
    if(nombre.length === 0 || descripcion.length === 0 || modelo.length === 0 || stock.length === 0 || precio.length === 0 || CATEGORIAS_id.length === 0 || PROVEEDORES_id.length === 0 ) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('products/add', {
            nombre: nombre,
            descripcion: descripcion,
            modelo: modelo,
            stock: stock,
            precio: precio,
            CATEGORIAS_id: CATEGORIAS_id,
            PROVEEDORES_id: PROVEEDORES_id,
        })
    }
    if(!errors) {
        if (req.file === undefined) {
            return res.status(400).send('No se ha seleccionado ningún archivo');
          } else {
            console.log(req.file); // Verifica el contenido de req.file para asegurarte de que contiene la información del archivo
            const filename = req.file.filename; 
            const data={ nombre: nombre,
                descripcion: descripcion,
                modelo: modelo,
                stock: stock,
                precio: precio,
                imagen:filename,
                CATEGORIAS_id: CATEGORIAS_id,
                PROVEEDORES_id: PROVEEDORES_id,}// Ruta donde se ha guardado la imagen
        
                // Guarda la referencia de la imagen y la descripción en la base de datos
                dbConn.query('INSERT INTO productos SET ?', data, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err)
                         
                        // render to add.ejs
                        res.render('products/add', data)
                    } else {                
                        req.flash('success', 'Book successfully added');
                        res.redirect('/products');
                    }
                })
          }
  }
  })
/* VER FORMULARIO EDITAR*/
router.get('/edit/(:id)', function(req, res, next) {

  let id = req.params.id;
 
  dbConn.query('SELECT * FROM productos WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err
       
      // if user not found
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/products')
      }
      // if book found
      else {
          // render to edit.ejs
          res.render('products/edit', {
              id: rows[0].id,
              nombre: rows[0].nombre,
              descripcion: rows[0].descripcion,
              modelo: rows[0].modelo,
              stock: rows[0].stock,
              precio: rows[0].precio,
              imagen: rows[0].imagen,
              CATEGORIAS_id: rows[0].CATEGORIAS_id,
              PROVEEDORES_id: rows[0].PROVEEDORES_id,
          })
      }
  })
})


/* ACTUALIZAR FORMULARIO DE BASE DE DATOS*/
router.post('/update/:id' , upload.single('imagen'), function(req, res, next) {

  let id = req.params.id;
  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let modelo = req.body.modelo;
  let stock = req.body.stock;
  let precio = req.body.precio;
  let CATEGORIAS_id = req.body.CATEGORIAS_id;
  let PROVEEDORES_id = req.body.PROVEEDORES_id;
  let errors = false;

  if(nombre.length === 0 || descripcion.length === 0 || modelo.length === 0 || stock.length === 0 || precio.length === 0 || CATEGORIAS_id.length === 0 || PROVEEDORES_id.length === 0  ) {
      errors = true;
      
      // set flash message
      req.flash('error', "Please enter name ");
      // render to add.ejs with flash message
      res.render('products/edit', {
          id: req.params.id,
          nombre: nombre,
          descripcion: descripcion,
          modelo: modelo,
          stock: stock,
          precio: precio,
          CATEGORIAS_id: CATEGORIAS_id,
          PROVEEDORES_id: PROVEEDORES_id,
      })
  }
  // if no error
  if( !errors ) {
    if (req.file === undefined) {
        return res.status(400).send('No se ha seleccionado ningún archivo');
      }   

      var form_data = {
          nombre: nombre,
          descripcion: descripcion,
          modelo: modelo,
          stock: stock,
          precio: precio,
          imagen : req.file.filename,
          CATEGORIAS_id: CATEGORIAS_id,
          PROVEEDORES_id: PROVEEDORES_id,
      }
      // update query
      dbConn.query('UPDATE productos SET ? WHERE id = ' + id, form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              // set flash message
              req.flash('error', err)
              // render to edit.ejs
              res.render('products/edit', {
                  id: req.params.id,
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
              req.flash('success', 'Registro successfully updated');
              res.redirect('/products');
          }
      })
  }
})
/* ELIMINAR REGISTRO DE BASE DE DATOS*/
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM productos WHERE id = ' + id, function(err, result) {
      if (err) {
          req.flash('error', err)
          res.redirect('/products')
      } else {
          req.flash('success', 'Registro successfully deleted! ID = ' + id)
          res.redirect('/products')
      }
  })
})
module.exports = router;
