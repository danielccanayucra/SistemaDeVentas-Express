var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM productos ', function(err, rows, fields) {
    if(err) throw err
   
    else {
        // render to edit.ejs
        res.render('index', {
            title: 'Express',
            productos_datas:rows,
            
        })
    }
});
});


/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* POST login page. */
router.post('/dashboard', function(req, res, next) {
  email=req.body.email;
  password=req.body.password;
  dbConn.query("SELECT * FROM usuarios WHERE email='"+email+"' AND password='"+password+"' ",function(err,rows){
    console.log(rows);
    if(err){
      req.flash('error',err);
      console.log(err);
    }else{
      if(rows.length){
        req.session.idu=rows[0]["id"];
        req.session.email=rows[0]["email"];
        req.session.loggedin=true;
        res.redirect('/dashboard');
      }else{
        req.flash('error','El usuario no existe...');
        res.redirect('/')
      }
    }
  });
});

/* GET login page. */

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
