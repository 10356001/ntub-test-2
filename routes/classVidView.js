var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    var classFileNo =req.param('classFileNo');

	pool.query('select * from cfvid where classFileNo=?', [classFileNo], function(err, rows, fields) {
		if (err) throw err;

		if(rows.length==0){
			res.render('classVidNotFound', {});         
		}else{
			res.render('classVidView', { data: rows });   
		}		
	});
});

module.exports = router;