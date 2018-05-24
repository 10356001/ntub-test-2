$(function(){
    //===================================================
    // 設定選單功能(被點擊)
    //===================================================
    // 設定子項目初始為收合
    var prevSubMenu=null;
    var thisSubMenu=null;
    var prevItemName=null;
    var thisItemName=null;
    var itemHit=false;
    $('.dropdown-menu').toggle();
	
	
    // 如果母項目被點擊
    $('.dropdown-toggle').click(function(event) {		
        thisSubMenu=$(this).siblings();
        thisItemName=$(this).text();
        itemHit=true;
		
        if(prevSubMenu==null){
            expandNewMenu();
        }else{
            if(thisItemName==prevItemName){
                closePrevMenu();
            }else{
                closePrevMenu();
                expandNewMenu();
            }
        }
    });
	

    // 判斷是否該收合已開啟的子選單
    $('html').click(function(event) {
        if(!itemHit && prevSubMenu!=null){
            closePrevMenu();
        }
        itemHit=false;
    })

	
    // 如果按了ESC鍵
    $(document).keyup(function(e) {
        if (e.keyCode == 27 && prevSubMenu!=null) {
            closePrevMenu();
        }
    });
	
    // 收合前次選單
    function closePrevMenu(){
        prevSubMenu.toggle();
        prevSubMenu=null;
        prevItemName=null;
    }
	
    // 開啟本次選單
    function expandNewMenu(){
        thisSubMenu.toggle(100);
        prevSubMenu=thisSubMenu;
        prevItemName=thisItemName;
    }
    //---------------------------------------------------
});