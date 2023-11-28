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

module.exports = router;
