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
        cb(null, 'public\\videos');
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
    storage:storage
}).single('video');  //表單中的檔案名稱


/* GET home page. */
router.post('/', function(req, res){

    upload(req, res, function (err) {
        //如果失敗
        if (err) {
            res.render('picFileSizeFail',{});
            return
        }     

    //取得使用者傳來的參數
    var classFileNo=req.param("classFileNo");
    var word=req.param("word");
    var video='';
   
	if (typeof req.file != 'undefined'){
        video=req.file.filename;   //取得上傳照片新名稱             
    }
    //建立一個新資料物件
    var newData={
        classFileNo:classFileNo,
        word:word,
        video:video
       
    }	
	
    pool.query('INSERT INTO cfvid SET ?', newData, function(err, rows, fields) {
        if (err){
            //刪除先前已上傳的影片
            video='public/videos/' + video;
				fs.unlink(video, (err) => {
					if (err) console.log('影片檔尚未上傳');
					console.log('已刪除影片檔');
				});		
            res.render('addFail', {});     //新增失敗
        }else{
            res.render('addSuccess', {});  //新增成功
        }
    });
})
});

module.exports = router;