var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');

//-----------------
// 引用multer外掛
//----------------- 
var multer  = require('multer');
//---------------------------------
// 宣告上傳存放空間及檔名更改
//---------------------------------
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
         //檔案存在<public>內的<images>中.
        cb(null, 'public\\images');
    },

    filename: function (req, file, cb) {
        //將檔名前增加時間標記, 避免圖名重覆而被覆蓋. 
        cb(null, Date.now()+"--"+file.originalname);    
    }   
})

//-----------------------------------------------
// 產生multer的上傳物件
//-----------------------------------------------
var maxSize=800*1024;  //設定最大可接受圖片大小(800K)

var upload = multer({
    storage:storage,
    limits:{ fileSize: maxSize }
}).single('picture');  //表單中的檔案名稱

/* POST home page. */
router.post('/', function(req, res) {
  //上傳檔案
  upload(req, res, function (err) {
    //如果失敗
    if (err) {
        res.render('picFileSizeFail',{});
        return
    }     
    
   //上傳成功, 接著取得使用者傳來的參數
    var memNo=req.param("memNo");
    var memName=req.param("memName");
    var memEmail=req.param("memEmail");
    var memPhone=req.param("memPhone");
    var memTitle=req.param("memTitle");
    var picture='';
    var memSchool=req.param("memSchool");
    var memMajor=req.param("memMajor");

	// 如果有選擇圖片
    if (typeof req.file != 'undefined'){
        picture=req.file.filename;   //取得上傳照片新名稱             
    }
    //建立一個新資料物件
    var newData={
        memNo:memNo,
        memName:memName,
        memEmail:memEmail,
        memPhone:memPhone,
        memTitle:memTitle,
        picture:picture,
        memSchool:memSchool,
        memMajor:memMajor
    }	
	
    pool.query('INSERT INTO tmember SET ?', newData, function(err, rows, fields) {
        if (err){
            //刪除先前已上傳的圖片
            picture='public/images/' + picture;
				fs.unlink(picture, (err) => {
					if (err) console.log('圖片檔尚未上傳');
					console.log('已刪除圖片檔');
				});		
            res.render('addFail', {});     //新增失敗
        }else{
            res.render('addSuccess', {});  //新增成功
        }
        });
    })
});

module.exports = router;