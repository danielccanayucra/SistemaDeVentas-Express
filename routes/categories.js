var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');
var multer=require('multer')
const path = require('path');


/* listar*/
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM categorias ORDER BY id desc',function(err,rows)     {
    if(err) {
        req.flash('error', err);
        res.render('categories/index',{data:''});   
    } else {
        res.render('categories/index',{data:rows});
    }
  });
});


/* VER FORMULARIO ADD*/
router.get('/add', function(req, res, next) {    
  // render to add.ejs
  res.render('categories/add', {
      nombre: '',     
  })
})
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

/* INSERTAR EN BASE DE DATOS*/
router.post('/add', upload.single('logo'), function(req, res, next) {    
  let nombre = req.body.nombre;
  let errors = false;

  if(nombre.length === 0 ) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('categories/add', {
          nombre: nombre,
      })
  }
  

  // if no error
  if(!errors) {
    if (req.file === undefined) {
        return res.status(400).send('No se ha seleccionado ningún archivo');
      } else {
        console.log(req.file); // Verifica el contenido de req.file para asegurarte de que contiene la información del archivo
        const filename = req.file.filename; // Ruta donde se ha guardado la imagen
    
            // Guarda la referencia de la imagen y la descripción en la base de datos
            dbConn.query('INSERT INTO categorias SET ?', {nombre,logo:filename}, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                     
                    // render to add.ejs
                    res.render('categories/add', {
                        nombre:nombre,
                    })
                } else {                
                    req.flash('success', 'Book successfully added');
                    res.redirect('/categories');
                }
            })
      }

      
  }
})

/* VER FORMULARIO EDITAR*/
router.get('/edit/(:id)', function(req, res, next) {

  let id = req.params.id;
 
  dbConn.query('SELECT * FROM categorias WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err
       
      // if user not found
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/categories')
      }
      // if book found
      else {
          // render to edit.ejs
          res.render('categories/edit', {
              id: rows[0].id,
              nombre: rows[0].nombre,
          })
      }
  })
})


/* ACTUALIZAR FORMULARIO DE BASE DE DATOS*/
router.post('/update/:id', upload.single('logo'), function(req, res, next) {

  let id = req.params.id;
  let nombre = req.body.nombre;
  let errors = false;

  if(nombre.length === 0 ) {
      errors = true;
      
      // set flash message
      req.flash('error', "Please enter name ");
      // render to add.ejs with flash message
      res.render('categories/edit', {
          id: req.params.id,
          nombre: nombre,
      })
  }

  // if no error
  if(!errors) {
    if (req.file === undefined) {
        return res.status(400).send('No se ha seleccionado ningún archivo');
      } else {
        console.log(req.file); // Verifica el contenido de req.file para asegurarte de que contiene la información del archivo
        const filename = req.file.filename; // Ruta donde se ha guardado la imagen
    
            // Guarda la referencia de la imagen y la descripción en la base de datos
            dbConn.query('UPDATE categorias SET ? WHERE id ='+id, {nombre,logo:filename}, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('categorias/edit', {
                        id: req.params.id,
                        nombre:nombre,
                    })
                } else {
                    req.flash('success', 'Registro successfully updated');
                    res.redirect('/categories');
                }
            })
      }
    }
})
/* ELIMINAR REGISTRO DE BASE DE DATOS*/
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM categorias WHERE id = ' + id, function(err, result) {
      if (err) {
          req.flash('error', err)
          res.redirect('/categories')
      } else {
          req.flash('success', 'Registro successfully deleted! ID = ' + id)
          res.redirect('/categories')
      }
  })
})

module.exports = router;