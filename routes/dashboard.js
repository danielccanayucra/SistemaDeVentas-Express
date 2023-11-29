var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');

/* mostrar*/
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM categorias ORDER BY id desc',function(err,rows)     {
      if(err) {
          req.flash('error', err);
          res.render('dashboard/index',{categorias_data:''});   
      } else {
          res.render('dashboard/index',{
            categorias_data:rows,
            user_name:"Josue DANIEL",
            user:{
            name:"Daniel",
            edad: 20,
            talla: 1.60,
            sexo:"masculino"
            }
        });
          
      }
    });
  });
/* VER FORMULARIO EDITAR*/
router.get('/(:categoria_name)/productos', function(req, res, next) {

    let categoria_name = req.params.categoria_name;
    let categoria_id= req.query.id
    dbConn.query('SELECT * FROM productos WHERE CATEGORIAS_id  = ' + categoria_id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Registro not found with id = ' + categoria_id)
            res.redirect('/dashboard')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('dashboard/productos_por_categoria', {
                productos_datas:rows,
                categoria_name:categoria_name,
                categoria_id:categoria_id
                
            })
        }
    })
  })

module.exports = router;