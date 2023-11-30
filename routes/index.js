var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* GET home page. */
router.get('/', async function (req, res, next) {
  const rq_categoria_id = req.query.id
  const rq_buscar = req.query.buscar

  // Realizar la primera consulta a la base de datos
  const categorias_result = await listarCategorias();



  // Realizar la segunda consulta a la base de datos
  const productos_result = await listarProductos(rq_categoria_id,rq_buscar);
  const categoria_selecionada = categorias_result.length ? categorias_result.find(d => d.id == rq_categoria_id) || {} : {};
  // Renderizar la vista 'miVista' y enviar los resultados como variables
  res.render('index', { categoria_name: categoria_selecionada.nombre, categorias: categorias_result, productos: productos_result, title: "Sistema de ventas" });

});
// Función para simular la primera consulta a la base de datos
async function listarCategorias() {
  return new Promise((resolve, reject) => {
    dbConn.query('SELECT * FROM categorias', function (err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Función para simular la segunda consulta a la base de datos
async function listarProductos(catergoria_id, buscar) {
  return new Promise((resolve, reject) => {
    let sqlQuery = 'SELECT * FROM productos';
    if (buscar) {
      sqlQuery = ` SELECT * FROM productos WHERE nombre LIKE '%${buscar}%' OR descripcion LIKE '%${buscar}%'` ;
    }
    else if (catergoria_id) {
      sqlQuery = ' SELECT * FROM productos WHERE CATEGORIAS_id =' + catergoria_id;
    }
    dbConn.query(sqlQuery,function (err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

/* POST login page. */
router.post('/dashboard', function (req, res, next) {
  email = req.body.email;
  password = req.body.password;
  dbConn.query("SELECT * FROM usuarios WHERE email='" + email + "' AND password='" + password + "' ", function (err, rows) {
    console.log(rows);
    if (err) {
      req.flash('error', err);
      console.log(err);
    } else {
      if (rows.length) {
        req.session.idu = rows[0]["id"];
        req.session.email = rows[0]["email"];
        req.session.loggedin = true;
        res.redirect('/dashboard');
      } else {
        req.flash('error', 'El usuario no existe...');
        res.redirect('/')
      }
    }
  });
});

/* GET login page. */

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect("/");
});
/* GET registro page. */
router.get('/registro', function (req, res, next) {
  res.render('registro');
});

/* INSERTAR EN BASE DE DATOS*/
router.post('/registro', function(req, res, next) {    

  let email = req.body.email;
  let password = req.body.password;
  let errors = false;

  if(email.length === 0 || password.length === 0  ) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('registro', {
          email: email,
          password: password,
         
      })
  }
   // if no error
   if(!errors) {
  
    var form_data = {
        email: email,
        password: password,
        
    }
    
    // insert query
    dbConn.query('INSERT INTO usuarios SET ?', form_data, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
             
            // render to add.ejs
            res.render('registro', {
                email: form_data.email,
                password: form_data.password,
              
            })
        } else {                
            req.flash('success', 'Book successfully added');
            res.redirect('/ingresar');
        }
    })
}
})

/* GET login page. */

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
