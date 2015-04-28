/**
 * TodoStore
 */

//========================================================================
//
// IMPORT

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var actions = require('../actions/AppActionCreator');

var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter; // 取得一個 pub/sub 廣播器

//========================================================================
//
// Public API

// 等同於 TodoStore extends EventEmitter
// 從此取得廣播的能力
// 由於將來會返還 TodoStore 出去，因此下面寫的會全變為 public methods
var Store = {};

// 所有 todo 資料
var arrLog = [];

// 目前選取的 room ID
var selectedRoomID = 'all';

// 是否為manager
var manager = {
	isManager : false,
	name : 'guest'
}

//login input box
var loginBox = false; 

/**
 * 建立 Store class，並且繼承 EventEMitter 以擁有廣播功能
 */
objectAssign( Store, EventEmitter.prototype, {

    /**
     * Public API
     * 供外界取得 store 內部資料
     */
    getLog: function(){
        return arrLog;
    },

    getSelectedRoomID: function(){
        return selectedRoomID;
    },
	
		getLoginBoxShowCtrl: function(){
				return loginBox;
		},
	
//		switchLoginBoxShowCtrl: function(){
//				loginBox = !loginBox;
//		},
//	
		getIsManager: function(){
				return manager;
		},
	
		setManager: function(info){
				manager = info;
		},
	
    //
    noop: function(){}
});

//========================================================================
//
// event handlers

Store.dispatchToken = AppDispatcher.register( function eventHandlers(evt){

    // evt .action 就是 view 當時廣播出來的整包物件
    // 它內含 actionType
    var action = evt.action;

    switch (action.actionType) {

        /**
         *
         */
        case AppConstants.TODO_LOAD:

            arrLog = action.items;

            console.log( 'Store 收到資料: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.TODO_CREATE:

            arrLog.push( action.item );

            console.log( 'Store 新增: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.TODO_REMOVE:

            arrLog = arrLog.filter( function(item){
                return item != action.item;
            })

            console.log( 'Store 刪完: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.TODO_UPDATE:
				
						arrLog = arrLog.filter( function(item){
							if(item._id == action.item._id){
								item = action.item;
							}
              return item ;
            })

            console.log( 'Store 更新: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.TODO_SELECT:

            console.log( 'Store 選取: ', action.roomID );

            // 選取同樣的 item 就不用處理下去了
            if( selectedRoomID != action.roomID ){
                selectedRoomID = action.roomID;
                Store.emit( AppConstants.CHANGE_EVENT );
            }


            break;
				
				/**
         *
         */
        case AppConstants.JUST_REFRESH:

            console.log( 'Store Just Refresh');
				
						manager = action.item;

            Store.emit( AppConstants.CHANGE_EVENT );

            break;
				
				/**
         *
         */
        case AppConstants.SWITCH_LOGINBOX:

            console.log( 'Store switch login box');
            console.log( 'this.loginBox', loginBox);
				
						loginBox = !loginBox;

            Store.emit( AppConstants.CHANGE_EVENT );

            break;
				

        default:
            //
    }

})

//
module.exports = Store;
