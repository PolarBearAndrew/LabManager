/**
 *
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Promise = require('es6-promise').Promise;

var IPaddress = 'localhost:8080';
//var IPaddress = '192.168.2.24:8080';

// 就是個單純的 hash table
// 因此下面所有指令皆可視為 Action static method
var AppActionCreators = {

    /**
     * app init, first load
     */
    load: function(){

        $.ajax('http://' + IPaddress + '/api/log/',
        {
            type:"GET",
            //
            success: function(data, status, jqxhr){

                // console.log( 'xhr 取回資料: ', data );
                AppDispatcher.handleViewAction({

                    // type 是為了方便將來所有 Store 內部判斷是否要處理這個 action
                    actionType: AppConstants.TODO_LOAD,

                    // 這裏是真正要傳出去的值
                    items: data
                });

            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr錯誤: ', xhr.responseText );
            }

        })
				
    },
	
		logIn: function( postData ){
			

        //$.ajax('http://' + IPaddress + '/users/session/manager',
        $.ajax('http://' + IPaddress + '/users/api/check',
        {
            type:"POST",
						data: { userId : postData.userId, pwd : postData.pwd },
            //
            success: function(data, status, jqxhr){
							//do nothing
							//console.log('[POST] set session');
							
							if(data.isManager){
								AppDispatcher.handleViewAction({
											actionType: AppConstants.JUST_REFRESH,
											item: data
								});
								AppDispatcher.handleViewAction({ actionType: AppConstants.SWITCH_LOGINBOX });
								
							}else{
								
								AppDispatcher.handleViewAction({ actionType: AppConstants.LOGIN_FAIL });
							}
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr錯誤: ', xhr.responseText );
            }

        })
				
    },
	
		logOut: function(){

        $.ajax('http://' + IPaddress + '/users/session/manager/signout',
        {
            type:"DELETE",
            //
            success: function(data, status, jqxhr){
							
							//console.log('[DELETE] sign out');
							
							AppDispatcher.handleViewAction({
										actionType: AppConstants.JUST_REFRESH,
										item: data
							});
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr錯誤: ', xhr.responseText );
            }

        })
				
    },
	
		CheckIsManger: function(){

        $.ajax('http://' + IPaddress + '/users/session/manager',
        {
            type:"GET",
            //
            success: function(data, status, jqxhr){
							//do nothing
							if(!data.isManager){
								data.isManager = false;
							}else{
								AppDispatcher.handleViewAction({
										actionType: AppConstants.JUST_REFRESH,
										item: data
								});
							}
							
							//console.log('[GET] get session -->', data.isManager);
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr錯誤: ', xhr.responseText );
            }

        })
				
    },
	
		selectRoomID: function( roomID ) {

				//console.log('select action', roomID);
			
        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_SELECT,
            roomID: roomID
        });

    },

    /* 
		 *
     */
    askForJoin: function( newlog ) {

        // 1. 廣播給 store 知道去 optimistic 更新 view
        AppDispatcher.handleViewAction({

            actionType: AppConstants.TODO_CREATE,
            item: newlog
        });
			

        $.ajax('http://' + IPaddress + '/api/log/join',
        {

            type:"POST",

            // 注意要正確設定 header 資料型別
            dataType: "json",
            contentType: "application/json",

            // 然後將 item 轉成 json string 再送出
            // 這樣可確保 Number 與 Boolean 值到 server 後能正確保留型別
            data: JSON.stringify(newlog),

            //
            success: function(data, status, jqxhr){
                //console.log( '新增資料結果: ', data.id );
                // 將 server 生成的 id 更新到早先建立的物件，之後資料才會一致
                newlog._id = data.id;
								$('input[type="text"]').val('');
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },

    /**
     *
     */
    askForLeave: function( log ) {
			
        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_UPDATE,
            item: log
        });

        $.ajax('http://' + IPaddress + '/api/log/ckeckOut/' + log._id,
        {

            type:"PUT",

            data: log,

            //
            success: function(data, status, jqxhr){

                // console.log( '編輯資料結果: ', data );

                // 將 server 生成的 uid 更新到早先建立的物件，之後資料才會一致
                //item.id = data.id;
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },

		checkIn: function( log ) {
			
			console.log(log._id);

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_UPDATE,
            item: log
        });

        $.ajax('http://' + IPaddress + '/api/log/ckeckIn/assent/' + log._id,
        {

            type:"PUT",

            data: log,

            //
            success: function(data, status, jqxhr){

							//console.log('ajax-/api/ckeckOut/assent/- SUCCESS');
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },
	
		checkOut: function( log ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_UPDATE,
            item: log
        });

        $.ajax('http://' + IPaddress + '/api/log/ckeckOut/assent/' + log._id,
        {

            type:"PUT",

            data: log,

            //
            success: function(data, status, jqxhr){

                // console.log( '編輯資料結果: ', data );

                // 將 server 生成的 uid 更新到早先建立的物件，之後資料才會一致
                //item.id = data.id;
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },
	
		checkInIgnore: function( log ) {
			
			console.log(log._id);

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_REMOVE,
            item: log
        });

        $.ajax('http://' + IPaddress + '/api/log/ckeckIn/ignore/' + log._id,
        {

            type:"DELETE",

            data: log,

            //
            success: function(data, status, jqxhr){

            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },
	
		switchLogInBox: function(){
			AppDispatcher.handleViewAction({ actionType: AppConstants.SWITCH_LOGINBOX });
		},
	
		changeInputID: function( inputID ){
			
			
			AppDispatcher.handleViewAction({ 
				actionType: AppConstants.CHANGE_INPUTID,
				inputID: inputID
			});
		},
	
    // dummy
    noop: function(){}
};

module.exports = AppActionCreators;
