/**
 * TodoStore
 */

//========================================================================
//
// IMPORT

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var actions = require('../actions/AppActionCreator');

var RoomInfo = require('./RoomInfo.js');

var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter; // 取得一個 pub/sub 廣播器

//========================================================================
//
// Public API

// 等同於 TodoStore extends EventEmitter
// 從此取得廣播的能力
// 由於將來會返還 TodoStore 出去，因此下面寫的會全變為 public methods
var Store = {};

// 所有 log 資料
var arrLog = [];

// 目前選取的 room ID
var selectedRoomID = 'all';
var selectedRoomIDinput = '801';

// 是否為manager
var manager = {
	isManager : false,
	name : 'guest'
}

//login input box
var loginBox = {
	isShow : false,
	isFail : false
};

//room info
var roomInfo = RoomInfo;

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

	getSelectedRoomIDinput: function(){
		return selectedRoomIDinput;
	},

	getLoginBoxShowCtrl: function(){
		return loginBox;
	},

	getRoomInfo: function(){
		return roomInfo;
	},

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

            renewRoomInfo_multi( arrLog );

			//reverse
			arrLog.reverse();

            //console.log( 'Store 收到資料: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.TODO_CREATE:

            arrLog.unshift( action.item );

			renewRoomInfo( action.item );

            //console.log( 'Store 新增: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.TODO_REMOVE:

            arrLog = arrLog.filter( function(item){
                return item != action.item;
            })

			//renewRoomInfo( action.item );

            //console.log( 'Store 刪完: ', arrLog );

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

			//renewRoomInfo( action.item );

            //console.log( 'Store 更新: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

		/**
         *
         */
		case AppConstants.TODO_SELECT:

            //console.log( 'Store 選取: ', action.roomID );

            if( selectedRoomID != action.roomID ){

                //change id
                selectedRoomID = action.roomID;
                selectedRoomIDinput = action.roomID;
                Store.emit( AppConstants.CHANGE_EVENT );
            }

            break;

        /**
         *
         */
        case AppConstants.JUST_REFRESH:

            //console.log( 'Store Just Refresh');

            manager = action.item;

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

	    /**
         *
         */
        case AppConstants.SWITCH_LOGINBOX:

            //console.log( 'Store switch login box');

			loginBox.isShow = !loginBox.isShow;
			loginBox.isFail = false;

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

		/**
         *
         */
        case AppConstants.LOGIN_FAIL:

            //console.log( 'login fail');

			loginBox.isFail = true;

            Store.emit( AppConstants.CHANGE_EVENT );

            break;


        /**
         *
         */
        case AppConstants.CHANGE_INPUTID:

           // console.log( 'change input id');

			selectedRoomIDinput = action.inputID;

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        case AppConstants.SOCKET_UPDATE:

            for (var i = arrLog.length - 1; i >= 0; i--) {
                if(arrLog[i]._id == action.item._id){
                    arrLog[i] = action.item;
                    break;
                }
            };

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        case AppConstants.SOCKET_CHECKOUT:

            for (var i = arrLog.length - 1; i >= 0; i--) {
                if(arrLog[i]._id == action.item._id){
                    arrLog[i] = action.item;

                    break;
                }
            };

            renewRoomInfo( action.item );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;


        case AppConstants.SOCKET_REMOVE:

            var ctrl = false;

            for (var i = 0; i < arrLog.length -1; i++) {

                if(arrLog[i]._id == action.item._id || ctrl == true){
                    arrLog[i] = arrLog[ i + 1];
                    ctrl = true;
                    break;
                }
            };

            if(ctrl){
                arrLog.pop();
            }
            renewRoomInfo( action.item );


            //console.log( 'Store 新增: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;



        default:
    }
})


//-----renew roomInfo func
function renewRoomInfo(data){

	//console.log('start : ', data);

	for(var i = 0; i < roomInfo.length; i++){

		if( roomInfo[i].name == data.room ){

			for(var j = 0; j < roomInfo[i].posi.length; j++){

				if( roomInfo[i].posi[j].name == data.posi ){
					roomInfo[i].posi[j].occupancy = !roomInfo[i].posi[j].occupancy;

					//console.log('roomInfo[i].posi[j].occupancy', roomInfo[i].posi[j].occupancy);
					break;
				}
			}
			break;
		}
	}
}

function renewRoomInfo_multi(data){

    //console.log('start : ', data);

    for (var row = data.length - 1; row >= 0; row--) {

        for(var i = 0; i < roomInfo.length; i++){

            if( roomInfo[i].name == data[row].room ){

                for(var j = 0; j < roomInfo[i].posi.length; j++){

                    if( roomInfo[i].posi[j].name == data[row].posi && data[row].outTime.length < 5){
                        roomInfo[i].posi[j].occupancy = !roomInfo[i].posi[j].occupancy;

                        //console.log('roomInfo[i].posi[j].occupancy', i, j, roomInfo[i].posi[j].occupancy);
                        break;
                    }
                }
                break;
            }
        }
    };
}


//
module.exports = Store;
