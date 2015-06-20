(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 *
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Promise = require('es6-promise').Promise;

var IPaddress = 'localhost:8080';
//var IPaddress = '120.96.75.142:8080';  //at home

var AppActionCreators = {

    /**
     * app init, init load
     */
    load: function(){

        $.ajax('http://' + IPaddress + '/api/log/',
        {
            type:"GET",

            success: function(data, status, jqxhr){

                AppDispatcher.handleViewAction({

                    actionType: AppConstants.TODO_LOAD,
                    items: data
                });

            },

            error: function( err, status, errText ){
                console.error( 'ERROR', err.responseText );
            }

        })

    },

	logIn: function( postData ){

        $.ajax('http://' + IPaddress + '/users/api/check',
        {
            type:"POST",

            data: { userId : postData.userId, pwd : postData.pwd },
            //
            success: function(data, status, jqxhr){

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

            error: function( err, status, errText ){
                console.error( 'ERROR', err.responseText );
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

	checkIsManger: function(){

        $.ajax('http://' + IPaddress + '/users/session/manager',
        {
            type:"GET",

            success: function(data, status, jqxhr){

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

                newlog._id = data._id;

				$('input[type="text"]').val('');//claer all input
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

            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },

    checkOutIgnore: function( log ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_UPDATE,
            item: log
        });

        $.ajax('http://' + IPaddress + '/api/log/ckeckOut/ignore/' + log._id,
        {

            type:"PUT",

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



	checkInIgnore: function( log ) {

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

    socketNew: function( log ){

        //console.log('new', log);

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_CREATE,
            item: log
        });
    },

    socketUpdate: function( log ){

        AppDispatcher.handleViewAction({
            actionType: AppConstants.SOCKET_UPDATE,
            item: log
        });
    },

    socketCheckOut: function( log ){

        AppDispatcher.handleViewAction({
            actionType: AppConstants.SOCKET_CHECKOUT,
            item: log
        });
    },

    socketRemove: function( log ){

        AppDispatcher.handleViewAction({
            actionType: AppConstants.SOCKET_REMOVE,
            item: log
        });
    },

    noop: function(){}
};

module.exports = AppActionCreators;

},{"../constants/AppConstants":3,"../dispatcher/AppDispatcher":4,"es6-promise":20}],2:[function(require,module,exports){
/*
 * 這支是程式進入點，它負責建立 root view (controller view)，
 * 也就是 TodoApp 這個元件
 *
 * boot.js 存在的目地，是因為通常 app 啟動時有許多先期工作要完成，
 * 例如預載資料到 store 內、檢查本地端 db 狀態、切換不同語系字串、
 * 這些工作都先在 boot.js 內做完，再啟動 TodoApp view 建立畫面是比較好的
 *
 */

// v0.12 開始要用 factory 包一次才能直接呼叫
var MainApp = React.createFactory(require('./views/MainApp.jsx'));

var AppConstants = require('./constants/AppConstants');
var actions = require('./actions/AppActionCreator');

$(function(){

	// 拉回第一包資料給畫面用
	actions.load();

	// 啟動 root view 時要傳入假資料
	React.render( MainApp(), document.getElementById('container') );

})

},{"./actions/AppActionCreator":1,"./constants/AppConstants":3,"./views/MainApp.jsx":17}],3:[function(require,module,exports){
/**
 * TodoConstants
 */

var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({

	// SOURCE_VIEW_ACTION: null,
	// SOURCE_SERVER_ACTION: null,
	// SOURCE_ROUTER_ACTION: null,

  	CHANGE_EVENT: null,

    TODO_LOAD: null,
  	TODO_CREATE: null,
  	TODO_REMOVE: null,
  	TODO_UPDATE: null,
  	TODO_SELECT: null,

	JUST_REFRESH: null,
	SWITCH_LOGINBOX: null,
	LOGIN_FAIL: null,
	CHANGE_INPUTID: null,

	//for socket
	SOCKET_CREATE: null,
	SOCKET_UPDATE: null,
	SOCKET_CHECKOUT: null,
	SOCKET_REMOVE: null,

  	noop: null
});


},{"react/lib/keyMirror":36}],4:[function(require,module,exports){

var AppConstants = require('../constants/AppConstants');

var Dispatcher = require('flux').Dispatcher;


/**
 * flux-chat 內最新的 dispatcher
 */
var AppDispatcher = new Dispatcher();

// 注意：這裏等於是繼承 Dispatcher class 身上所有指令，目前是讓此物件俱有廣播能功
// 同樣功能也可用 underscore.extend 或 Object.assign() 做到
// 今天因為有用 jquery 就請它代勞了
$.extend( AppDispatcher, {

    /**
     * @param {object} action The details of the action, including the action's
     * type and additional data coming from the server.
     */
    handleServerAction: function(action) {
        var payload = {
            source: AppConstants.SOURCE_SERVER_ACTION,
            action: action
        };

        this.dispatch(payload);
    },

    /**
     * 
     */
    handleViewAction: function(action) {
        var payload = {
            source: AppConstants.SOURCE_VIEW_ACTION,
            action: action
        };
        
        this.dispatch(payload);
    },

    /**
     * 將來啟用 router 時，這裏處理所有 router event
     */
    handleRouterAction: function(path) {
        this.dispatch({
            source: AppConstants.SOURCE_ROUTER_ACTION,
            action: path
        });
    }

});

module.exports = AppDispatcher;

},{"../constants/AppConstants":3,"flux":31}],5:[function(require,module,exports){
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

},{"../actions/AppActionCreator":1,"../constants/AppConstants":3,"../dispatcher/AppDispatcher":4,"./RoomInfo.js":6,"events":18,"object-assign":34}],6:[function(require,module,exports){
var RoomInfo = [
	{
		name : '801',
		posiInfo : { pc : 24, con : 12},
		posi : []
	},
	{
		name : '802',
		posiInfo : { pc : 12, con : 12},
		posi : []
	},
	{
		name : '804',
		posiInfo : { pc : 12, con : 12},
		posi : []
	},
	{
		name : '806',
		posiInfo : { pc : 12, con : 12},
		posi : []
	},
	{
		name : '813',
		posiInfo : { pc : 12, con : 12},
		posi : []
	},
	{
		name : '800',
		posiInfo : { pc : 0, con : 12},
		posi : []
	}
]

//init array
var posiAry = function(pc, con){
	var tmp = [];
	
	for(var i = 1; i <= pc; i++ ){
		tmp.push({ name: 'PC ' + i, occupancy: false });
	}
	
	for(var i = 1; i <= con; i++ ){
		tmp.push({ name: '討論 ' + i, occupancy: false });
	}
	return tmp
};

for(var i = 0; i < RoomInfo.length; i++){
	RoomInfo[i].posi = posiAry( RoomInfo[i].posiInfo.pc, RoomInfo[i].posiInfo.con);
}

module.exports = RoomInfo;
},{}],7:[function(require,module,exports){
/** @jsx React.DOM *//**
 *
 */
var ReactPropTypes = React.PropTypes;
var actions = require('../actions/AppActionCreator');

var Footer = React.createClass({displayName: 'Footer',

  propTypes: {
  },

    render: function() {

        return (
            React.DOM.footer({className: "footer"}, 

                React.DOM.span({className: "author"}, 
                    "Author | Andrew Chen  ", '( May / 2015 )'
                ), 

                React.DOM.span({className: "author_link"}, 
                    React.DOM.a({href: "https://github.com/PolarBearAndrew/LabManager", target: "_blank"}, 
                        React.DOM.i({className: "fa fa-2x fa-github"}), " "), 
                    React.DOM.a({href: "https://www.facebook.com/profile.php?id=100001317746154", target: "_blank"}, 
                        React.DOM.i({className: "fa fa-2x fa-facebook-official"}), " ")
                )
            )
        );
    },
});

module.exports = Footer;

},{"../actions/AppActionCreator":1}],8:[function(require,module,exports){
/** @jsx React.DOM *//*
 * Views
 */

var ListItem = React.createFactory(require('./ListItem.jsx'));
var ListInput = React.createFactory(require('./ListInput.jsx'));
var ListTitle = React.createFactory(require('./ListTitle.jsx'));

//
var comp = React.createClass({displayName: 'comp',

	propTypes: {
		log: React.PropTypes.shape({
	    id: React.PropTypes.string,
	    name: React.PropTypes.string,
	    room: React.PropTypes.string,
		inTime: React.PropTypes.string,
	    outTime: React.PropTypes.string,
	    inCheck: React.PropTypes.string,
	    outCheck: React.PropTypes.string,
    }),

	// callbacks
    checkOut: React.PropTypes.func,
    checkInIgnore: React.PropTypes.func,
	},
  /**
   *
   */
  	render: function() {

	    // 取出所有要繪製的資料
	    var arrlog = this.props.truth.arrLog;
		var selectedRoomID = this.props.truth.selectedRoomID;
		var manager = this.props.truth.manager;

		//console.log(this.props.checkInAssent);


		// 跑 loop 一筆筆建成 ListItem 元件
		var arr = arrlog.map(function (log) {

			// 注意每個 item 要有一個獨一無二的 key 值
			return ListItem({
				key:  log.id, 
				logRow: log, 
				manager: manager, 
				checkOut:  this.props.checkOut, 
				selectedRoomID: selectedRoomID, 
				checkInAssent:  this.props.checkInAssent, 
				checkInIgnore:  this.props.checkInIgnore, 
				checkOutAssent:  this.props.checkOutAssent, 
				checkOutIgnore:  this.props.checkOutIgnore}
				)

		}, this);

		var inputTitle = ['Lab', 'Your ID', 'Your Name', 'Posi', 'Check in', '', '', 'Operate'];
		var theadTitle = ['Lab', 'ID', 'Name', 'Posi', 'Check in', 'Check out', 'Checked(in)', 'Checked(out)'];


	    return (
				React.DOM.form(null, 
			      	React.DOM.table({className: "table table-hover"}, 
						ListTitle({
							titles: inputTitle, 
							listTitle: false }
							), 
						ListInput({
							join:  this.props.join, 
							inputID:  this.props.inputID, 
							roomInfo:  this.props.roomInfo, 
							changeInputID:  this.props.changeInputID}
							), 
						ListTitle({
							titles: theadTitle, 
							listTitle: true }
							), 
						React.DOM.tbody(null, 
		        			arr
						), 
						React.DOM.tfoot(null, 
							React.DOM.td({className: "tableEnd", colSpan: "8"}, "--- [End] ---")
						)
	  				)
				)
    	);
	},
	noop: function(){  }
});

module.exports = comp;

},{"./ListInput.jsx":11,"./ListItem.jsx":12,"./ListTitle.jsx":13}],9:[function(require,module,exports){
/** @jsx React.DOM *//*
 * Views
 */
var List = React.createFactory( require('./List.jsx') );
var Selector = React.createFactory( require('./Selector.jsx') );
var LogInForm = React.createFactory( require('./LogInForm.jsx') );
var ListHeader = React.createFactory( require('./ListHeader.jsx') );

/*
 * Store
 */
var LogStore = require('../../stores/LogStore');
var AppConstants = require('../../constants/AppConstants');

/*
 * Actions
 */
var actions = require('../../actions/AppActionCreator');


//========================================================================
//
// Component

var ListContainer = React.createClass({displayName: 'ListContainer',

    //========================================================================
    //
    // mixin | props | default value

    mixins: [],

    // 這裏列出所有要用到的 property 與其預設值
    // 它在 getInitialState() 前執行，此時 this.state 還是空值
    getDefaultProps: function() {
        return {
            // foo: '__foo__',
            // bar: '__bar__'
        };
    },

    // 這裏列出每個 prop 的型別，但只會在 dev time 檢查
    propTypes: {
        // foo: React.PropTypes.array,
        // bar: React.PropTypes.bool
    },


    //========================================================================
    //
    // mount

    // 這是 component API, 在 mount 前會跑一次，取值做為 this.state 的預設值
    getInitialState: function() {

		return this.getTruth();
    },

    /**
     * 主程式進入點
     */
    componentWillMount: function() {

        LogStore.addListener( AppConstants.CHANGE_EVENT, this._onChange );

        var IPaddress = 'localhost:8080';
        //var IPaddress = '120.96.75.142:8080';


        var socket = io.connect('http://' + IPaddress);

        // socket.emit('notify', { name : 'Andrew' });

        socket.on('newLog', function (data) {

            actions.socketNew(data.log);
        });

        socket.on('update', function (data) {

            actions.socketUpdate(data.log);
        });

        socket.on('checkout', function (data) {

            actions.socketCheckOut(data.log);
        });

        socket.on('remove', function (data) {

            actions.socketRemove(data.log);
        });
    },

    // 重要：root view 建立後第一件事，就是偵聽 store 的 change 事件
    componentDidMount: function() {
        //
    },

    //========================================================================
    //
    // unmount

    componentWillUnmount: function() {

        //TodoStore.removeChangeListener(this._onChange);

    },


    componentDidUnmount: function() {
    },

    //========================================================================
    //
    // update

    // 在 render() 前執行，有機會可先處理 props 後用 setState() 存起來
    componentWillReceiveProps: function(nextProps) {
        //
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    // 這時已不可用 setState()
    componentWillUpdate: function(nextProps, nextState) {
        // console.log( '\tMainAPP > willUpdate' );
    },

    /**
     *
     */
    componentDidUpdate: function(prevProps, prevState) {
        // console.log( '\tMainAPP > didUpdate' );
    },

    //========================================================================
    //
    // render

    render: function() {

				var form = function(ctrl) {
					if(ctrl.isShow){
						return ( LogInForm({
									out: actions.switchLogInBox, 
									loginPost:  actions.logIn, 
									fail:  ctrl.isFail}) );
					}else{
						return null;
					}
				}( this.state.loginBoxCtrl );

        return (
				React.DOM.div({className: "ListContainer"}, 
					form, 
					ListHeader({
                        ID:  this.state.selectedRoomID, 
                        login:  actions.switchLogInBox, 
                        logout:  actions.logOut, 
                        refresh:  actions.load, 
                        manager:  this.state.manager, 
						roomInfo:  this.state.roomInfo, 
                        selectRoomID:  actions.selectRoomID}
                        ), 
					List({
                        join:  actions.askForJoin, 
                        truth:  this.state, 
						inputID:  this.state.selectedInputID, 
                        checkOut: actions.askForLeave, 
                        roomInfo:  this.state.roomInfo, 
                        changeInputID:  actions.changeInputID, 

                        checkInAssent:  actions.checkIn, 
                        checkInIgnore:  actions.checkInIgnore, 
                        checkOutAssent:  actions.checkOut, 
                        checkOutIgnore:  actions.checkOutIgnore}
					)
				)
        )
    },


    //========================================================================
    //
    // private methods - 處理元件內部的事件

    /**
     * Event handler for 'change' events coming from the TodoStore
     *
     * controller-view 偵聽到 model change 後
     * 執行這支，它操作另一支 private method 去跟 model 取最新值
     * 然後操作 component life cycle 的 setState() 將新值灌入元件體系
     * 就會觸發一連串 child components 跟著重繪囉
     */
    _onChange: function(){

        //console.log( '_onChange 重繪: ', this.getTruth() );

        // 重要：從 root view 觸發所有 sub-view 重繪
        this.setState( this.getTruth() );
    },

    /**
     * 為何要獨立寫一支？因為會有兩個地方會用到，因此抽出來
     * 目地：
     *     向各個 store 取回資料，然後統一 setState() 再一層層往下傳遞
     */
    getTruth: function() {

        // 是從 TodoStore 取資料(as the single source of truth)
        return {
            arrLog: LogStore.getLog(),
			selectedRoomID: LogStore.getSelectedRoomID(),
			selectedInputID: LogStore.getSelectedRoomIDinput(),
			manager: LogStore.getIsManager(),
			loginBoxCtrl: LogStore.getLoginBoxShowCtrl(),
			roomInfo: LogStore.getRoomInfo(),
         };
    }



});

module.exports = ListContainer;

},{"../../actions/AppActionCreator":1,"../../constants/AppConstants":3,"../../stores/LogStore":5,"./List.jsx":8,"./ListHeader.jsx":10,"./LogInForm.jsx":14,"./Selector.jsx":16}],10:[function(require,module,exports){
/** @jsx React.DOM */var Selector = React.createFactory( require('./Selector.jsx') );

//========================================================================
//
// Component

var ListHeader = React.createClass({displayName: 'ListHeader',

    //========================================================================


    // 這裏列出每個 prop 的型別，但只會在 dev time 檢查
   propTypes: {
		// callbacks
			selectRoomID: React.PropTypes.func,
			logout: React.PropTypes.func,
		},

    //========================================================================
    //
    // render


    render: function() {

		var roomInfo = [{ name : 'all'}].concat(this.props.roomInfo);

		var showID = '';

		/*
		 * show big room ID
		 */
		if(this.props.ID == 'all'){
			showID = '';
		}else{
			showID = ' - ' + this.props.ID;
		}

		/*
		 * is manager or not
		 */
		var whoAmI = function(mg){

			var show = {};

			if(mg.isManager){

				show.str = '...  I am a manager, my name is ';
				show.name = mg.name;

				return (
					React.DOM.h5({className: "lead"}, 
						 show.str, 
						React.DOM.span({className: "text-success isName"}, " ",  show.name, " "), 
						React.DOM.a({href: "#", onClick:  this.props.logout}, React.DOM.i({className: "fa fa-sign-out"}))
					)
				);

			}else{

				show.str = '... Your are a manager ? ';
				show.name = 'logIn';

				return (
					React.DOM.h5({className: "lead"}, 
						 show.str, 
						React.DOM.a({onClick:  this.props.login}, 
							React.DOM.span({className: "text-primary"}, " ",  show.name, " "), 
							React.DOM.i({className: "fa fa-sign-in"})
						)
					)
				);
			}

		}.bind( this )( this.props.manager );

		/*
		 * return header
		 */
		return (
			React.DOM.div({className: "header"}, 
				React.DOM.h1(null, 
					React.DOM.i({className: "fa fa-users"}), 
					'  Lab Manager  ', 
					showID 
				), 
				React.DOM.h4(null, 
					React.DOM.span(null, "Room ID "), 
					React.DOM.a({className: "btn btn-info refresh", onClick:  this.props.refresh}, 
						React.DOM.i({className: "fa fa-refresh"})
					), 
					Selector({
						myID: "selectID", 
						selectRoomID: this.props.selectRoomID, 
						changeTodo:  this.handleChange, 
						options: roomInfo })
				), 
				whoAmI 
			) )
    },


	handleChange: function(){

		if(this.props.selectRoomID){

			var id = $('#selectID').val();
			this.props.selectRoomID(id);

			//sync input select
			if( id != 'all'){
				$('#inputID').val(id);

			}else{
				$('#inputID').val('801');
			}
		}
	},
});

module.exports = ListHeader;

},{"./Selector.jsx":16}],11:[function(require,module,exports){
/** @jsx React.DOM */
var Selector = React.createFactory( require('./Selector.jsx') );
var Secret = require('./SecretComm.jsx');

var SetIntervalMixin = {

	componentWillMount: function() {
		this.intervals = [];
	},

	setInterval: function() {
		this.intervals.push(setInterval.apply(null, arguments));
	},

	componentWillUnmount: function() {
		this.intervals.map(clearInterval);
	}
};

var ListInput = React.createClass({displayName: 'ListInput',

	mixins: [SetIntervalMixin], // Use the mixin

	getInitialState: function() {
		var now = this.handleTime();
		return { time: now };
	},

	componentDidMount: function() {
		this.setInterval( this.tick, 1000 * 30); // Call a method on the mixin
	},

	tick: function() {
		var now = this.handleTime();
		this.setState({time: now });
	},

	propTypes: {
		onClick: React.PropTypes.func
	},

  /**
   *
   */
	render: function() {

		var inputID = this.props.inputID;
		var roomInfo =  this.props.roomInfo;
		var posiOptions = [];

		for(var i = 0; i < roomInfo.length; i++ ){
			if( roomInfo[i].name == inputID ){
				posiOptions = roomInfo[i].posi.filter(function(posi){
					if( posi.occupancy == false ){
						return posi;
					}
				});
			}
		}


    	return (
			React.DOM.thead(null, 
				React.DOM.td(null, 
					Selector({
						myID: "inputID", 
						className: "input", 
						options: roomInfo, 
						changeTodo:  this.handleIDchange})
				), 
				React.DOM.td(null, React.DOM.input({id: "inputSid", type: "text", className: "form-control", name: "sid"})), 
				React.DOM.td(null, React.DOM.input({id: "inputName", type: "text", className: "form-control", name: "name"})), 
				React.DOM.td(null, Selector({myID: "inputPosi", className: "input", options: posiOptions })), 
				React.DOM.td({colSpan: "2"}, 
					React.DOM.input({	id: "inputInTime", 
							type: "datetime-local", 	className: "form-control", 
							name: "time", readOnly: "true", 
							value: this.state.time}
					)
				), 
				React.DOM.td(null), 
				React.DOM.td(null, 
					React.DOM.button({
						className: "btn btn-primary", 
						type: "submit", 
						onClick:  this.handleAsk}, 
						React.DOM.i({className: "fa fa-user-plus -o fa-lg"}), 
						' Join'
					)
				)
			) );
  },

	padLeft: function(str,len){
		if(('' + str).length >= len){
			return str;
		}
		else{
			return this.padLeft( '0' + str, len);
		}
	},

	handleTime: function(){


		var t = new Date();
		var time =  t.getFullYear()
					+ '-' + this.padLeft(t.getUTCMonth() + 1, 2)
					+ '-' + this.padLeft(t.getUTCDate(),2)
					+ 'T' + this.padLeft(t.getHours(),2)
					+ ':' + this.padLeft(t.getUTCMinutes(),2);
					// + ':' + this.padLeft(t.getUTCSeconds(),2)

		//console.log('time2',t.toLocaleDateString()); //抓日期
		//console.log('time',t.toLocaleTimeString()); //抓時間
		//console.log('time3',t.toLocaleString()); //抓日期

		return time;
	},


	handleAsk: function(){

		//get time
		var t  = new Date();
		var inTime = t.toLocaleString();

		var sid = $('#inputSid').val();
		var posi = $('#inputPosi').val();

		for(var i = 0; i < Secret.length; i++){
			if( Secret[i].comm == sid && Secret[i].posi_pwd == posi){
				this.weArePanda(Secret[i], inTime);
				return false;
			}
		}


		var postInfo = {
			room: $('#inputID').val(),
			sid: sid,
			name: $('#inputName').val(),
			posi: posi,
			inCheck: 'waiting',
			outCheck: 'notYet',
			inTime: inTime,
			outTime: ' '
		};

		this.props.join(postInfo);

		//don't submit
		return false;
	},


	weArePanda: function(secret, inTime){

		for(var i = 0; i < secret.data.length; i++){
			secret.data[i].inTime = inTime;
			this.props.join(secret.data[i]);
		}

	},

	handleIDchange: function(){

		var id = $('#inputID').val();
		this.props.changeInputID( id );

		//sync input select
		//$('#selectID').val(id);
	},

  noop: function(){ }

});

module.exports = ListInput;

},{"./SecretComm.jsx":15,"./Selector.jsx":16}],12:[function(require,module,exports){
/** @jsx React.DOM *//**
 *
 */
//var actions = require('../../actions/AppActionCreator');
//var cx = React.addons.classSet;
//
var comp = React.createClass({displayName: 'comp',

  /**
   *
   */
//  componentDidMount: function(){
//      this.$input = $(this.getDOMNode()).find('span').first();
//      this.$remove = this.$input.next();
//  },


	propTypes: {

		todoItem: React.PropTypes.shape({
	    	id: React.PropTypes.string,
      		name: React.PropTypes.string,
			selectedRoomID:  React.PropTypes.string,
			isManager:  React.PropTypes.string
    	}),

		// callbacks
	    onClick: React.PropTypes.func,
	    onRemove: React.PropTypes.func,
	},

  /**
   *
   */
  render: function() {


		var selectedRoomID = this.props.selectedRoomID;
		var logRow = this.props.logRow;
		var manager = this.props.manager;

		//td check in
		var checkIn = function(ck){
			if(ck == 'waiting' || ck == '' ){
				//waiting for checkin submit

				if(manager.isManager){
					return (
						React.DOM.div({className: "ctrls"}, 
							React.DOM.a({className: "btn btn-success btn-xs", onClick: this.handleCheckInAssent}, 
								React.DOM.i({className: "fa fa-check"}), 
								' Assent'
							), 
							'  ', 
							React.DOM.a({className: "btn btn-danger btn-xs", onClick: this.handleCheckInIgnore}, 
								React.DOM.i({className: "fa fa-trash-o"}), 
								' Ignore'
							)
						));
				}else{
					return React.DOM.i({className: "fa fa-spinner fa-pulse"});
				}

			}else{
				//show who checked for you
				return  React.DOM.i({className: "fa fa-check"}, ck) ;
			}
		}.bind(this)(logRow.inCheck);


		//td check out
		var checkOut = function(ck, ckin){
			if(ckin == 'waiting' || ckin == '' ){
				//if you not checkin yet, than don't need to checkout
				return (
						React.DOM.a({className: "btn btn-warning btn-xs disabled"}, 
  						React.DOM.i({className: "fa fa-sign-out"}), 
							' Check-out'
						));

			}else if(ck == 'notYet' || ck == '' ){
				//can ask for check out
				return (
						React.DOM.a({className: "btn btn-warning btn-xs", onClick: this.handleCheckOut}, 
  						React.DOM.i({className: "fa fa-sign-out"}), 
							' Check-out'
						));

			}else if(ck == 'waiting'){
				//waiting for checkout submit
				if(manager.isManager){
					return (
						React.DOM.div(null, 
							React.DOM.a({className: "btn btn-success btn-xs", onClick: this.handleCheckOutAssent}, 
								React.DOM.i({className: "fa fa-check"}), 
								' Yes'
							), 
							'  ', 
							React.DOM.a({className: "btn btn-danger btn-xs", onClick: this.handleCheckOutIgnore}, 
								React.DOM.i({className: "fa fa-user-times"}), 
								' No'
							)
						));

				}else{
					return React.DOM.i({className: "fa fa-spinner fa-pulse"});
				}

			}else{
				//who let you check out
				return React.DOM.i({className: "fa fa-check"}, ck) ;
			}

		}.bind(this)(logRow.outCheck, logRow.inCheck);

		var t = new Date();
		var today = t.toLocaleDateString();

		var tmpInTime = logRow.inTime.replace(today, '今天');
		var tmpOutTime = logRow.outTime.replace(today, '今天');


		//too late	~!
		var tooLate = '';

		if( tmpOutTime.indexOf('下午') != -1 ){

			var i = tmpOutTime.indexOf(':');
			var tmp  = tmpOutTime.substring( i - 1, i);

			if( tmp >= 5){
				tooLate = 'tooLate';
			}
		}

		if(logRow.room == selectedRoomID || selectedRoomID == 'all'){
    	return (
				React.DOM.tr(null, 
					React.DOM.td(null, logRow.room), 
					React.DOM.td(null, logRow.sid), 
					React.DOM.td(null, logRow.name), 
					React.DOM.td(null, logRow.posi), 
					React.DOM.td(null, tmpInTime), 
					React.DOM.td({className: tooLate }, tmpOutTime), 
					React.DOM.td(null, checkIn), 
					React.DOM.td(null, checkOut)
				)
			);
		}else{
			return null;
		}
  },

  /**
   *
   */
	handleCheckOut: function(){
		//console.log('click check out', this.props.logRow._id);
		this.props.logRow.outCheck = 'waiting';
		this.props.checkOut(this.props.logRow);
	},

	isToolage: function(time){

	},

	padLeft: function(str,len){
		if(('' + str).length >= len){
				return str;
			}
			else{
				return this.padLeft( '0' + str, len);
			}
	},


	handleCheckOutAssent: function(){

		var t = new Date();
		var outTime = t.toLocaleString();


		this.props.logRow.outTime = outTime;
		this.props.logRow.outCheck = this.props.manager.name;


		this.props.checkOutAssent(this.props.logRow);
	},

	handleCheckInAssent: function(){
		//console.log('ok to check in click');
		this.props.logRow.inCheck = this.props.manager.name;
		this.props.checkInAssent(this.props.logRow);
	},

	handleCheckInIgnore: function(){
		this.props.checkInIgnore(this.props.logRow);
	},

	handleCheckOutIgnore: function(){

		this.props.logRow.outCheck = '';

		this.props.checkOutIgnore(this.props.logRow);
	},

	padLeft: function(str,len){
		if(('' + str).length >= len){
				return str;
			}
			else{
				return this.padLeft( '0' + str, len);
			}
	},
//	handleCheckInIgnore: function(){
//		console.log('ignore to check in click');
//		//this.props.logRow.inCheck = this.props.manager.name;
//		//this.props.checkInAssent(this.props.logRow);
//	},
//
//	handleCheckOutIgnore: function(){
//		console.log('ignore to check out click');
//		this.props.logRow.outCheck = 'notYet';
//		this.props.checkOutAssent(this.props.logRow);
//	},

  noop: function(){

  }

});

module.exports = comp;
},{}],13:[function(require,module,exports){
/** @jsx React.DOM *//**
 *
 */
//
var cx = React.addons.classSet;

var ListTitle = React.createClass({displayName: 'ListTitle',

  /**
   * 
   */
	propTypes: {
		// callbacks
    selectRoomID: React.PropTypes.func,
	},
	
	/**
   * 
   */
	
  render: function() {
		
		var titles = this.props.titles;
		//splitTable
		var classes = cx({
        'splitTable': this.props.listTitle
    });
		
		var thead = titles.map(function (title) {
			
			// 注意每個 item 要有一個獨一無二的 key 值
			return React.DOM.td(null, React.DOM.span({className: classes}, title))

		}, this);
		
		
    return (
				React.DOM.thead(null, 
					thead
				)
		);
  },
  /**
   * 
   */
  noop: function(){

  }

});

module.exports = ListTitle;
},{}],14:[function(require,module,exports){
/** @jsx React.DOM */
//========================================================================
//
// Component

var LogInForm = React.createClass({displayName: 'LogInForm',

    //========================================================================


    // 這裏列出每個 prop 的型別，但只會在 dev time 檢查
   propTypes: {
			// callbacks
			//selectRoomID: React.PropTypes.func,
			//logout: React.PropTypes.func,
		},

    //========================================================================
    //
    // render

    render: function() {

			var isFail = '';
			if(this.props.fail){
				isFail = 'login fail ...';
			}

			return (
			React.DOM.div(null, 
				React.DOM.form({id: "login"}, 
					React.DOM.div({className: "form-group"}, 

						React.DOM.div({className: "input-group"}, 
							React.DOM.div({className: "input-group-addon"}, 'Accouts' ), 
							React.DOM.input({id: "userId", type: "text", className: "form-control", name: "userId", placeholder: "User ID"})
						), 

						React.DOM.div({className: "input-group"}, 
							React.DOM.div({className: "input-group-addon"}, 'Password' ), 
							React.DOM.input({id: "pwd", type: "password", className: "form-control", name: "pwd", placeholder: "Password"})
						)

					), 

					React.DOM.button({type: "submit", onClick:  this.logInHandler, className: "btn btn-primary"}, "Log In"), 
					React.DOM.p({className: "text-danger loginFail"}, isFail )
				), 


				React.DOM.div({id: "over", onClick: this.props.out})
			)
			)
    },

		logInHandler : function(){

			var data = { userId : $('#userId').val(), pwd : $('#pwd').val()};
			this.props.loginPost(data);

			return false;
		},
});

module.exports = LogInForm;
},{}],15:[function(require,module,exports){
/** @jsx React.DOM */var Secret = [
	{
		comm : 'panda',
		posi_pwd : '討論 12',
		data : [
			{ 'room' : '806', sid: '101111231', name: '陳思璇', posi: '討論 4', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '806', sid: '101111224', name: '洪于雅', posi: '討論 3', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '806', sid: '101111215', name: '雷尚樺', posi: '討論 2', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '806', sid: '101111212', name: '陳柏安', posi: '討論 1', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' }
		]
	},
	{
		comm : 'srt',
		posi_pwd : '討論 12',
		data : [
			{ 'room' : '801', sid: '101111226', name: '尋敬恆', posi: '討論 4', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '801', sid: '101111221', name: '陳泓仲', posi: '討論 3', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '801', sid: '101111207', name: '蔡鄭欽', posi: '討論 2', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '801', sid: '101111201', name: '鐘佳陞', posi: '討論 1', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' }
		]
	}
];


module.exports = Secret;
},{}],16:[function(require,module,exports){
/** @jsx React.DOM *//**
 *
 */
//var actions = require('../../actions/AppActionCreator');
var cx = React.addons.classSet;
//
var comp = React.createClass({displayName: 'comp',

  /**
   * 
   */
	propTypes: {
		//Ctrl
		ctrl: React.PropTypes.string,
		// callbacks
    selectRoomID: React.PropTypes.func,
	},
	
	/**
   * 
   */
	
	
  render: function() {
		
		var options = this.props.options;
		
		
		
		var arr = options.map(function (log) {
			return React.DOM.option(null,  log.name)
		}, this);

		
    return (
				React.DOM.select({id: this.props.myID, className: "form-control", 
					onChange: this.props.changeTodo}, 
					arr
				)
		);
  },
	
  /**
   * 
   */
  noop: function(){

  }

});

module.exports = comp;
},{}],17:[function(require,module,exports){
/** @jsx React.DOM *//**
 *
 */
var Footer = React.createFactory( require('./Footer.jsx') );
var ListContainer = React.createFactory( require('./List/ListContainer.jsx') );


var MainApp = React.createClass({displayName: 'MainApp',

    mixins: [],

    getDefaultProps: function() {
        return;
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    render: function() {

        // console.log( '\tMainApp > render' );

        return (
			React.DOM.div({className: "just-wrapper"}, 
				ListContainer(null), 
                Footer(null)
            )
        )
    },
});




module.exports = MainApp;

},{"./Footer.jsx":7,"./List/ListContainer.jsx":9}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],19:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],20:[function(require,module,exports){
"use strict";
var Promise = require("./promise/promise").Promise;
var polyfill = require("./promise/polyfill").polyfill;
exports.Promise = Promise;
exports.polyfill = polyfill;
},{"./promise/polyfill":25,"./promise/promise":26}],21:[function(require,module,exports){
"use strict";
/* global toString */

var isArray = require("./utils").isArray;
var isFunction = require("./utils").isFunction;

/**
  Returns a promise that is fulfilled when all the given promises have been
  fulfilled, or rejected if any of them become rejected. The return promise
  is fulfilled with an array that gives all the values in the order they were
  passed in the `promises` array argument.

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.resolve(2);
  var promise3 = RSVP.resolve(3);
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `RSVP.all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.reject(new Error("2"));
  var promise3 = RSVP.reject(new Error("3"));
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @for RSVP
  @param {Array} promises
  @param {String} label
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
*/
function all(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to all.');
  }

  return new Promise(function(resolve, reject) {
    var results = [], remaining = promises.length,
    promise;

    if (remaining === 0) {
      resolve([]);
    }

    function resolver(index) {
      return function(value) {
        resolveAll(index, value);
      };
    }

    function resolveAll(index, value) {
      results[index] = value;
      if (--remaining === 0) {
        resolve(results);
      }
    }

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && isFunction(promise.then)) {
        promise.then(resolver(i), reject);
      } else {
        resolveAll(i, promise);
      }
    }
  });
}

exports.all = all;
},{"./utils":30}],22:[function(require,module,exports){
(function (process,global){
"use strict";
var browserGlobal = (typeof window !== 'undefined') ? window : {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

// node
function useNextTick() {
  return function() {
    process.nextTick(flush);
  };
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function() {
    node.data = (iterations = ++iterations % 2);
  };
}

function useSetTimeout() {
  return function() {
    local.setTimeout(flush, 1);
  };
}

var queue = [];
function flush() {
  for (var i = 0; i < queue.length; i++) {
    var tuple = queue[i];
    var callback = tuple[0], arg = tuple[1];
    callback(arg);
  }
  queue = [];
}

var scheduleFlush;

// Decide what async method to use to triggering processing of queued callbacks:
if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else {
  scheduleFlush = useSetTimeout();
}

function asap(callback, arg) {
  var length = queue.push([callback, arg]);
  if (length === 1) {
    // If length is 1, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    scheduleFlush();
  }
}

exports.asap = asap;
}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"FWaASH":19}],23:[function(require,module,exports){
"use strict";
/**
  `RSVP.Promise.cast` returns the same promise if that promise shares a constructor
  with the promise being casted.

  Example:

  ```javascript
  var promise = RSVP.resolve(1);
  var casted = RSVP.Promise.cast(promise);

  console.log(promise === casted); // true
  ```

  In the case of a promise whose constructor does not match, it is assimilated.
  The resulting promise will fulfill or reject based on the outcome of the
  promise being casted.

  In the case of a non-promise, a promise which will fulfill with that value is
  returned.

  Example:

  ```javascript
  var value = 1; // could be a number, boolean, string, undefined...
  var casted = RSVP.Promise.cast(value);

  console.log(value === casted); // false
  console.log(casted instanceof RSVP.Promise) // true

  casted.then(function(val) {
    val === value // => true
  });
  ```

  `RSVP.Promise.cast` is similar to `RSVP.resolve`, but `RSVP.Promise.cast` differs in the
  following ways:
  * `RSVP.Promise.cast` serves as a memory-efficient way of getting a promise, when you
  have something that could either be a promise or a value. RSVP.resolve
  will have the same effect but will create a new promise wrapper if the
  argument is a promise.
  * `RSVP.Promise.cast` is a way of casting incoming thenables or promise subclasses to
  promises of the exact class specified, so that the resulting object's `then` is
  ensured to have the behavior of the constructor you are calling cast on (i.e., RSVP.Promise).

  @method cast
  @for RSVP
  @param {Object} object to be casted
  @return {Promise} promise that is fulfilled when all properties of `promises`
  have been fulfilled, or rejected if any of them become rejected.
*/


function cast(object) {
  /*jshint validthis:true */
  if (object && typeof object === 'object' && object.constructor === this) {
    return object;
  }

  var Promise = this;

  return new Promise(function(resolve) {
    resolve(object);
  });
}

exports.cast = cast;
},{}],24:[function(require,module,exports){
"use strict";
var config = {
  instrument: false
};

function configure(name, value) {
  if (arguments.length === 2) {
    config[name] = value;
  } else {
    return config[name];
  }
}

exports.config = config;
exports.configure = configure;
},{}],25:[function(require,module,exports){
(function (global){
"use strict";
/*global self*/
var RSVPPromise = require("./promise").Promise;
var isFunction = require("./utils").isFunction;

function polyfill() {
  var local;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof window !== 'undefined' && window.document) {
    local = window;
  } else {
    local = self;
  }

  var es6PromiseSupport = 
    "Promise" in local &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    "cast" in local.Promise &&
    "resolve" in local.Promise &&
    "reject" in local.Promise &&
    "all" in local.Promise &&
    "race" in local.Promise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new local.Promise(function(r) { resolve = r; });
      return isFunction(resolve);
    }());

  if (!es6PromiseSupport) {
    local.Promise = RSVPPromise;
  }
}

exports.polyfill = polyfill;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./promise":26,"./utils":30}],26:[function(require,module,exports){
"use strict";
var config = require("./config").config;
var configure = require("./config").configure;
var objectOrFunction = require("./utils").objectOrFunction;
var isFunction = require("./utils").isFunction;
var now = require("./utils").now;
var cast = require("./cast").cast;
var all = require("./all").all;
var race = require("./race").race;
var staticResolve = require("./resolve").resolve;
var staticReject = require("./reject").reject;
var asap = require("./asap").asap;

var counter = 0;

config.async = asap; // default async is asap;

function Promise(resolver) {
  if (!isFunction(resolver)) {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  if (!(this instanceof Promise)) {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  this._subscribers = [];

  invokeResolver(resolver, this);
}

function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value);
  }

  function rejectPromise(reason) {
    reject(promise, reason);
  }

  try {
    resolver(resolvePromise, rejectPromise);
  } catch(e) {
    rejectPromise(e);
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value, error, succeeded, failed;

  if (hasCallback) {
    try {
      value = callback(detail);
      succeeded = true;
    } catch(e) {
      failed = true;
      error = e;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (handleThenable(promise, value)) {
    return;
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    resolve(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

var PENDING   = void 0;
var SEALED    = 0;
var FULFILLED = 1;
var REJECTED  = 2;

function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribers = parent._subscribers;
  var length = subscribers.length;

  subscribers[length] = child;
  subscribers[length + FULFILLED] = onFulfillment;
  subscribers[length + REJECTED]  = onRejection;
}

function publish(promise, settled) {
  var child, callback, subscribers = promise._subscribers, detail = promise._detail;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    invokeCallback(settled, child, callback, detail);
  }

  promise._subscribers = null;
}

Promise.prototype = {
  constructor: Promise,

  _state: undefined,
  _detail: undefined,
  _subscribers: undefined,

  then: function(onFulfillment, onRejection) {
    var promise = this;

    var thenPromise = new this.constructor(function() {});

    if (this._state) {
      var callbacks = arguments;
      config.async(function invokePromiseCallback() {
        invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
      });
    } else {
      subscribe(this, thenPromise, onFulfillment, onRejection);
    }

    return thenPromise;
  },

  'catch': function(onRejection) {
    return this.then(null, onRejection);
  }
};

Promise.all = all;
Promise.cast = cast;
Promise.race = race;
Promise.resolve = staticResolve;
Promise.reject = staticReject;

function handleThenable(promise, value) {
  var then = null,
  resolved;

  try {
    if (promise === value) {
      throw new TypeError("A promises callback cannot return that same promise.");
    }

    if (objectOrFunction(value)) {
      then = value.then;

      if (isFunction(then)) {
        then.call(value, function(val) {
          if (resolved) { return true; }
          resolved = true;

          if (value !== val) {
            resolve(promise, val);
          } else {
            fulfill(promise, val);
          }
        }, function(val) {
          if (resolved) { return true; }
          resolved = true;

          reject(promise, val);
        });

        return true;
      }
    }
  } catch (error) {
    if (resolved) { return true; }
    reject(promise, error);
    return true;
  }

  return false;
}

function resolve(promise, value) {
  if (promise === value) {
    fulfill(promise, value);
  } else if (!handleThenable(promise, value)) {
    fulfill(promise, value);
  }
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = value;

  config.async(publishFulfillment, promise);
}

function reject(promise, reason) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = reason;

  config.async(publishRejection, promise);
}

function publishFulfillment(promise) {
  publish(promise, promise._state = FULFILLED);
}

function publishRejection(promise) {
  publish(promise, promise._state = REJECTED);
}

exports.Promise = Promise;
},{"./all":21,"./asap":22,"./cast":23,"./config":24,"./race":27,"./reject":28,"./resolve":29,"./utils":30}],27:[function(require,module,exports){
"use strict";
/* global toString */
var isArray = require("./utils").isArray;

/**
  `RSVP.race` allows you to watch a series of promises and act as soon as the
  first promise given to the `promises` argument fulfills or rejects.

  Example:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 2");
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // result === "promise 2" because it was resolved before promise1
    // was resolved.
  });
  ```

  `RSVP.race` is deterministic in that only the state of the first completed
  promise matters. For example, even if other promises given to the `promises`
  array argument are resolved, but the first completed promise has become
  rejected before the other promises became fulfilled, the returned promise
  will become rejected:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error("promise 2"));
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // Code here never runs because there are rejected promises!
  }, function(reason){
    // reason.message === "promise2" because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  @method race
  @for RSVP
  @param {Array} promises array of promises to observe
  @param {String} label optional string for describing the promise returned.
  Useful for tooling.
  @return {Promise} a promise that becomes fulfilled with the value the first
  completed promises is resolved with if the first completed promise was
  fulfilled, or rejected with the reason that the first completed promise
  was rejected with.
*/
function race(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to race.');
  }
  return new Promise(function(resolve, reject) {
    var results = [], promise;

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && typeof promise.then === 'function') {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
  });
}

exports.race = race;
},{"./utils":30}],28:[function(require,module,exports){
"use strict";
/**
  `RSVP.reject` returns a promise that will become rejected with the passed
  `reason`. `RSVP.reject` is essentially shorthand for the following:

  ```javascript
  var promise = new RSVP.Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  var promise = RSVP.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @for RSVP
  @param {Any} reason value that the returned promise will be rejected with.
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become rejected with the given
  `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Promise = this;

  return new Promise(function (resolve, reject) {
    reject(reason);
  });
}

exports.reject = reject;
},{}],29:[function(require,module,exports){
"use strict";
/**
  `RSVP.resolve` returns a promise that will become fulfilled with the passed
  `value`. `RSVP.resolve` is essentially shorthand for the following:

  ```javascript
  var promise = new RSVP.Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  var promise = RSVP.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @for RSVP
  @param {Any} value value that the returned promise will be resolved with
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(value) {
  /*jshint validthis:true */
  var Promise = this;
  return new Promise(function(resolve, reject) {
    resolve(value);
  });
}

exports.resolve = resolve;
},{}],30:[function(require,module,exports){
"use strict";
function objectOrFunction(x) {
  return isFunction(x) || (typeof x === "object" && x !== null);
}

function isFunction(x) {
  return typeof x === "function";
}

function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

// Date.now is not available in browsers < IE9
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
var now = Date.now || function() { return new Date().getTime(); };


exports.objectOrFunction = objectOrFunction;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.now = now;
},{}],31:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":32}],32:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":33}],33:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],34:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var pendingException;
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			try {
				to[keys[i]] = from[keys[i]];
			} catch (err) {
				if (pendingException === undefined) {
					pendingException = err;
				}
			}
		}
	}

	if (pendingException) {
		throw pendingException;
	}

	return to;
};

},{}],35:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require("FWaASH"))
},{"FWaASH":19}],36:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require("FWaASH"))
},{"./invariant":35,"FWaASH":19}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvci5qcyIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL2Jvb3QuanMiLCIvVXNlcnMvYW5kcmV3L1ByYWN0aWNlL0xhYk1hbmFnZXIvQ2xpZW50QXBwL2FwcC9qcy9jb25zdGFudHMvQXBwQ29uc3RhbnRzLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvc3RvcmVzL0xvZ1N0b3JlLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvc3RvcmVzL1Jvb21JbmZvLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvRm9vdGVyLmpzeCIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdC5qc3giLCIvVXNlcnMvYW5kcmV3L1ByYWN0aWNlL0xhYk1hbmFnZXIvQ2xpZW50QXBwL2FwcC9qcy92aWV3cy9MaXN0L0xpc3RDb250YWluZXIuanN4IiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9MaXN0SGVhZGVyLmpzeCIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdElucHV0LmpzeCIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdEl0ZW0uanN4IiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9MaXN0VGl0bGUuanN4IiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9Mb2dJbkZvcm0uanN4IiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9TZWNyZXRDb21tLmpzeCIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvU2VsZWN0b3IuanN4IiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTWFpbkFwcC5qc3giLCIvVXNlcnMvYW5kcmV3L1ByYWN0aWNlL0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9tYWluLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2FsbC5qcyIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9hc2FwLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2Nhc3QuanMiLCIvVXNlcnMvYW5kcmV3L1ByYWN0aWNlL0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvY29uZmlnLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3BvbHlmaWxsLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3Byb21pc2UuanMiLCIvVXNlcnMvYW5kcmV3L1ByYWN0aWNlL0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcmFjZS5qcyIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9yZWplY3QuanMiLCIvVXNlcnMvYW5kcmV3L1ByYWN0aWNlL0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcmVzb2x2ZS5qcyIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS91dGlscy5qcyIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2ZsdXgvaW5kZXguanMiLCIvVXNlcnMvYW5kcmV3L1ByYWN0aWNlL0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9mbHV4L2xpYi9EaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwiL1VzZXJzL2FuZHJldy9QcmFjdGljZS9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi9Vc2Vycy9hbmRyZXcvUHJhY3RpY2UvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9pbnZhcmlhbnQuanMiLCIvVXNlcnMvYW5kcmV3L1ByYWN0aWNlL0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9yZWFjdC9saWIva2V5TWlycm9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICpcbiAqL1xudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcblxudmFyIElQYWRkcmVzcyA9ICdsb2NhbGhvc3Q6ODA4MCc7XG4vL3ZhciBJUGFkZHJlc3MgPSAnMTIwLjk2Ljc1LjE0Mjo4MDgwJzsgIC8vYXQgaG9tZVxuXG52YXIgQXBwQWN0aW9uQ3JlYXRvcnMgPSB7XG5cbiAgICAvKipcbiAgICAgKiBhcHAgaW5pdCwgaW5pdCBsb2FkXG4gICAgICovXG4gICAgbG9hZDogZnVuY3Rpb24oKXtcblxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9hcGkvbG9nLycsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6XCJHRVRcIixcblxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cbiAgICAgICAgICAgICAgICBBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5UT0RPX0xPQUQsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggZXJyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCAnRVJST1InLCBlcnIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH0sXG5cblx0bG9nSW46IGZ1bmN0aW9uKCBwb3N0RGF0YSApe1xuXG4gICAgICAgICQuYWpheCgnaHR0cDovLycgKyBJUGFkZHJlc3MgKyAnL3VzZXJzL2FwaS9jaGVjaycsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6XCJQT1NUXCIsXG5cbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcklkIDogcG9zdERhdGEudXNlcklkLCBwd2QgOiBwb3N0RGF0YS5wd2QgfSxcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxeGhyKXtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdbUE9TVF0gc2V0IHNlc3Npb24nKTtcblxuXHRcdFx0XHRpZihkYXRhLmlzTWFuYWdlcil7XG5cblx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXG5cdFx0XHRcdFx0XHRhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuSlVTVF9SRUZSRVNILFxuXHRcdFx0XHRcdFx0aXRlbTogZGF0YVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0QXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHsgYWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLlNXSVRDSF9MT0dJTkJPWCB9KTtcblxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oeyBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuTE9HSU5fRkFJTCB9KTtcblx0XHRcdFx0fVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBlcnIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoICdFUlJPUicsIGVyci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuXHRsb2dPdXQ6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvdXNlcnMvc2Vzc2lvbi9tYW5hZ2VyL3NpZ25vdXQnLFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOlwiREVMRVRFXCIsXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnW0RFTEVURV0gc2lnbiBvdXQnKTtcblxuXHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXHRcdFx0XHRcdGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5KVVNUX1JFRlJFU0gsXG5cdFx0XHRcdFx0aXRlbTogZGF0YVxuXHRcdFx0XHR9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHhociwgc3RhdHVzLCBlcnJUZXh0ICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICd4aHLpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuXHRjaGVja0lzTWFuZ2VyOiBmdW5jdGlvbigpe1xuXG4gICAgICAgICQuYWpheCgnaHR0cDovLycgKyBJUGFkZHJlc3MgKyAnL3VzZXJzL3Nlc3Npb24vbWFuYWdlcicsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6XCJHRVRcIixcblxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cblx0XHRcdFx0aWYoIWRhdGEuaXNNYW5hZ2VyKXtcblx0XHRcdFx0XHRkYXRhLmlzTWFuYWdlciA9IGZhbHNlO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXG5cdFx0XHRcdFx0XHRcdGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5KVVNUX1JFRlJFU0gsXG5cdFx0XHRcdFx0XHRcdGl0ZW06IGRhdGFcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdbR0VUXSBnZXQgc2Vzc2lvbiAtLT4nLCBkYXRhLmlzTWFuYWdlcik7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhy6Yyv6KqkOiAnLCB4aHIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH0sXG5cblx0c2VsZWN0Um9vbUlEOiBmdW5jdGlvbiggcm9vbUlEICkge1xuXG5cdFx0Ly9jb25zb2xlLmxvZygnc2VsZWN0IGFjdGlvbicsIHJvb21JRCk7XG5cbiAgICAgICAgQXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5UT0RPX1NFTEVDVCxcbiAgICAgICAgICAgIHJvb21JRDogcm9vbUlEXG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIC8qXG5cdCAqXG4gICAgICovXG4gICAgYXNrRm9ySm9pbjogZnVuY3Rpb24oIG5ld2xvZyApIHtcblxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9hcGkvbG9nL2pvaW4nLFxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHR5cGU6XCJQT1NUXCIsXG5cbiAgICAgICAgICAgIC8vIOazqOaEj+imgeato+eiuuioreWumiBoZWFkZXIg6LOH5paZ5Z6L5YilXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG5cbiAgICAgICAgICAgIC8vIOeEtuW+jOWwhyBpdGVtIOi9ieaIkCBqc29uIHN0cmluZyDlho3pgIHlh7pcbiAgICAgICAgICAgIC8vIOmAmeaoo+WPr+eiuuS/nSBOdW1iZXIg6IiHIEJvb2xlYW4g5YC85YiwIHNlcnZlciDlvozog73mraPnorrkv53nlZnlnovliKVcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ld2xvZyksXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxeGhyKXtcblxuICAgICAgICAgICAgICAgIG5ld2xvZy5faWQgPSBkYXRhLl9pZDtcblxuXHRcdFx0XHQkKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLnZhbCgnJyk7Ly9jbGFlciBhbGwgaW5wdXRcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHhociwgc3RhdHVzLCBlcnJUZXh0ICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICd4aHIg6Yyv6KqkOiAnLCB4aHIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGFza0ZvckxlYXZlOiBmdW5jdGlvbiggbG9nICkge1xuXG4gICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19VUERBVEUsXG4gICAgICAgICAgICBpdGVtOiBsb2dcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvYXBpL2xvZy9ja2Vja091dC8nICsgbG9nLl9pZCxcbiAgICAgICAge1xuXG4gICAgICAgICAgICB0eXBlOlwiUFVUXCIsXG5cbiAgICAgICAgICAgIGRhdGE6IGxvZyxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICfnt6jovK/os4fmlpnntZDmnpw6ICcsIGRhdGEgKTtcblxuICAgICAgICAgICAgICAgIC8vIOWwhyBzZXJ2ZXIg55Sf5oiQ55qEIHVpZCDmm7TmlrDliLDml6nlhYjlu7rnq4vnmoTnianku7bvvIzkuYvlvozos4fmlpnmiY3mnIPkuIDoh7RcbiAgICAgICAgICAgICAgICAvL2l0ZW0uaWQgPSBkYXRhLmlkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hociDpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuXHRjaGVja0luOiBmdW5jdGlvbiggbG9nICkge1xuXG4gICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19VUERBVEUsXG4gICAgICAgICAgICBpdGVtOiBsb2dcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvYXBpL2xvZy9ja2Vja0luL2Fzc2VudC8nICsgbG9nLl9pZCxcbiAgICAgICAge1xuXG4gICAgICAgICAgICB0eXBlOlwiUFVUXCIsXG5cbiAgICAgICAgICAgIGRhdGE6IGxvZyxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FqYXgtL2FwaS9ja2Vja091dC9hc3NlbnQvLSBTVUNDRVNTJyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhyIOmMr+iqpDogJywgeGhyLnJlc3BvbnNlVGV4dCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9LFxuXG5cdGNoZWNrT3V0OiBmdW5jdGlvbiggbG9nICkge1xuXG4gICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19VUERBVEUsXG4gICAgICAgICAgICBpdGVtOiBsb2dcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvYXBpL2xvZy9ja2Vja091dC9hc3NlbnQvJyArIGxvZy5faWQsXG4gICAgICAgIHtcblxuICAgICAgICAgICAgdHlwZTpcIlBVVFwiLFxuXG4gICAgICAgICAgICBkYXRhOiBsb2csXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxeGhyKXtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hociDpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuICAgIGNoZWNrT3V0SWdub3JlOiBmdW5jdGlvbiggbG9nICkge1xuXG4gICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19VUERBVEUsXG4gICAgICAgICAgICBpdGVtOiBsb2dcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvYXBpL2xvZy9ja2Vja091dC9pZ25vcmUvJyArIGxvZy5faWQsXG4gICAgICAgIHtcblxuICAgICAgICAgICAgdHlwZTpcIlBVVFwiLFxuXG4gICAgICAgICAgICBkYXRhOiBsb2csXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxeGhyKXtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hociDpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuXG5cblx0Y2hlY2tJbklnbm9yZTogZnVuY3Rpb24oIGxvZyApIHtcblxuICAgICAgICBBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLlRPRE9fUkVNT1ZFLFxuICAgICAgICAgICAgaXRlbTogbG9nXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQuYWpheCgnaHR0cDovLycgKyBJUGFkZHJlc3MgKyAnL2FwaS9sb2cvY2tlY2tJbi9pZ25vcmUvJyArIGxvZy5faWQsXG4gICAgICAgIHtcblxuICAgICAgICAgICAgdHlwZTpcIkRFTEVURVwiLFxuXG4gICAgICAgICAgICBkYXRhOiBsb2csXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxeGhyKXtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hociDpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuXHRzd2l0Y2hMb2dJbkJveDogZnVuY3Rpb24oKXtcblx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oeyBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuU1dJVENIX0xPR0lOQk9YIH0pO1xuXHR9LFxuXG5cdGNoYW5nZUlucHV0SUQ6IGZ1bmN0aW9uKCBpbnB1dElEICl7XG5cblx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXHRcdFx0YWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLkNIQU5HRV9JTlBVVElELFxuXHRcdFx0aW5wdXRJRDogaW5wdXRJRFxuXHRcdH0pO1xuXHR9LFxuXG4gICAgc29ja2V0TmV3OiBmdW5jdGlvbiggbG9nICl7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygnbmV3JywgbG9nKTtcblxuICAgICAgICBBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLlRPRE9fQ1JFQVRFLFxuICAgICAgICAgICAgaXRlbTogbG9nXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzb2NrZXRVcGRhdGU6IGZ1bmN0aW9uKCBsb2cgKXtcblxuICAgICAgICBBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLlNPQ0tFVF9VUERBVEUsXG4gICAgICAgICAgICBpdGVtOiBsb2dcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNvY2tldENoZWNrT3V0OiBmdW5jdGlvbiggbG9nICl7XG5cbiAgICAgICAgQXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5TT0NLRVRfQ0hFQ0tPVVQsXG4gICAgICAgICAgICBpdGVtOiBsb2dcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNvY2tldFJlbW92ZTogZnVuY3Rpb24oIGxvZyApe1xuXG4gICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuU09DS0VUX1JFTU9WRSxcbiAgICAgICAgICAgIGl0ZW06IGxvZ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgbm9vcDogZnVuY3Rpb24oKXt9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEFjdGlvbkNyZWF0b3JzO1xuIiwiLypcbiAqIOmAmeaUr+aYr+eoi+W8j+mAsuWFpem7nu+8jOWug+iyoOiyrOW7uueriyByb290IHZpZXcgKGNvbnRyb2xsZXIgdmlldynvvIxcbiAqIOS5n+WwseaYryBUb2RvQXBwIOmAmeWAi+WFg+S7tlxuICpcbiAqIGJvb3QuanMg5a2Y5Zyo55qE55uu5Zyw77yM5piv5Zug54K66YCa5bi4IGFwcCDllZ/li5XmmYLmnInoqLHlpJrlhYjmnJ/lt6XkvZzopoHlrozmiJDvvIxcbiAqIOS+i+WmgumgkOi8ieizh+aWmeWIsCBzdG9yZSDlhafjgIHmqqLmn6XmnKzlnLDnq68gZGIg54uA5oWL44CB5YiH5o+b5LiN5ZCM6Kqe57O75a2X5Liy44CBXG4gKiDpgJnkupvlt6XkvZzpg73lhYjlnKggYm9vdC5qcyDlhaflgZrlrozvvIzlho3llZ/li5UgVG9kb0FwcCB2aWV3IOW7uueri+eVq+mdouaYr+avlOi8g+WlveeahFxuICpcbiAqL1xuXG4vLyB2MC4xMiDplovlp4vopoHnlKggZmFjdG9yeSDljIXkuIDmrKHmiY3og73nm7TmjqXlkbzlj6tcbnZhciBNYWluQXBwID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL3ZpZXdzL01haW5BcHAuanN4JykpO1xuXG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XG52YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4vYWN0aW9ucy9BcHBBY3Rpb25DcmVhdG9yJyk7XG5cbiQoZnVuY3Rpb24oKXtcblxuXHQvLyDmi4nlm57nrKzkuIDljIXos4fmlpnntabnlavpnaLnlKhcblx0YWN0aW9ucy5sb2FkKCk7XG5cblx0Ly8g5ZWf5YuVIHJvb3QgdmlldyDmmYLopoHlgrPlhaXlgYfos4fmlplcblx0UmVhY3QucmVuZGVyKCBNYWluQXBwKCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKSApO1xuXG59KVxuIiwiLyoqXG4gKiBUb2RvQ29uc3RhbnRzXG4gKi9cblxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ3JlYWN0L2xpYi9rZXlNaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuXG5cdC8vIFNPVVJDRV9WSUVXX0FDVElPTjogbnVsbCxcblx0Ly8gU09VUkNFX1NFUlZFUl9BQ1RJT046IG51bGwsXG5cdC8vIFNPVVJDRV9ST1VURVJfQUNUSU9OOiBudWxsLFxuXG4gIFx0Q0hBTkdFX0VWRU5UOiBudWxsLFxuXG4gICAgVE9ET19MT0FEOiBudWxsLFxuICBcdFRPRE9fQ1JFQVRFOiBudWxsLFxuICBcdFRPRE9fUkVNT1ZFOiBudWxsLFxuICBcdFRPRE9fVVBEQVRFOiBudWxsLFxuICBcdFRPRE9fU0VMRUNUOiBudWxsLFxuXG5cdEpVU1RfUkVGUkVTSDogbnVsbCxcblx0U1dJVENIX0xPR0lOQk9YOiBudWxsLFxuXHRMT0dJTl9GQUlMOiBudWxsLFxuXHRDSEFOR0VfSU5QVVRJRDogbnVsbCxcblxuXHQvL2ZvciBzb2NrZXRcblx0U09DS0VUX0NSRUFURTogbnVsbCxcblx0U09DS0VUX1VQREFURTogbnVsbCxcblx0U09DS0VUX0NIRUNLT1VUOiBudWxsLFxuXHRTT0NLRVRfUkVNT1ZFOiBudWxsLFxuXG4gIFx0bm9vcDogbnVsbFxufSk7XG5cbiIsIlxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxuXG4vKipcbiAqIGZsdXgtY2hhdCDlhafmnIDmlrDnmoQgZGlzcGF0Y2hlclxuICovXG52YXIgQXBwRGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbi8vIOazqOaEj++8mumAmeijj+etieaWvOaYr+e5vOaJvyBEaXNwYXRjaGVyIGNsYXNzIOi6q+S4iuaJgOacieaMh+S7pO+8jOebruWJjeaYr+iuk+atpOeJqeS7tuS/seacieW7o+aSreiDveWKn1xuLy8g5ZCM5qij5Yqf6IO95Lmf5Y+v55SoIHVuZGVyc2NvcmUuZXh0ZW5kIOaIliBPYmplY3QuYXNzaWduKCkg5YGa5YiwXG4vLyDku4rlpKnlm6DngrrmnInnlKgganF1ZXJ5IOWwseiri+Wug+S7o+WLnuS6hlxuJC5leHRlbmQoIEFwcERpc3BhdGNoZXIsIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gVGhlIGRldGFpbHMgb2YgdGhlIGFjdGlvbiwgaW5jbHVkaW5nIHRoZSBhY3Rpb24nc1xuICAgICAqIHR5cGUgYW5kIGFkZGl0aW9uYWwgZGF0YSBjb21pbmcgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIGhhbmRsZVNlcnZlckFjdGlvbjogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgICAgc291cmNlOiBBcHBDb25zdGFudHMuU09VUkNFX1NFUlZFUl9BQ1RJT04sXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGlzcGF0Y2gocGF5bG9hZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqL1xuICAgIGhhbmRsZVZpZXdBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgICB2YXIgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgIHNvdXJjZTogQXBwQ29uc3RhbnRzLlNPVVJDRV9WSUVXX0FDVElPTixcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRpc3BhdGNoKHBheWxvYWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsIfkvobllZ/nlKggcm91dGVyIOaZgu+8jOmAmeijj+iZleeQhuaJgOaciSByb3V0ZXIgZXZlbnRcbiAgICAgKi9cbiAgICBoYW5kbGVSb3V0ZXJBY3Rpb246IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaCh7XG4gICAgICAgICAgICBzb3VyY2U6IEFwcENvbnN0YW50cy5TT1VSQ0VfUk9VVEVSX0FDVElPTixcbiAgICAgICAgICAgIGFjdGlvbjogcGF0aFxuICAgICAgICB9KTtcbiAgICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcERpc3BhdGNoZXI7XG4iLCIvKipcbiAqIFRvZG9TdG9yZVxuICovXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gSU1QT1JUXG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xudmFyIGFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FwcEFjdGlvbkNyZWF0b3InKTtcblxudmFyIFJvb21JbmZvID0gcmVxdWlyZSgnLi9Sb29tSW5mby5qcycpO1xuXG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjsgLy8g5Y+W5b6X5LiA5YCLIHB1Yi9zdWIg5buj5pKt5ZmoXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gUHVibGljIEFQSVxuXG4vLyDnrYnlkIzmlrwgVG9kb1N0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG4vLyDlvp7mraTlj5blvpflu6Pmkq3nmoTog73liptcbi8vIOeUseaWvOWwh+S+huacg+i/lOmChCBUb2RvU3RvcmUg5Ye65Y6777yM5Zug5q2k5LiL6Z2i5a+r55qE5pyD5YWo6K6K54K6IHB1YmxpYyBtZXRob2RzXG52YXIgU3RvcmUgPSB7fTtcblxuLy8g5omA5pyJIGxvZyDos4fmlplcbnZhciBhcnJMb2cgPSBbXTtcblxuLy8g55uu5YmN6YG45Y+W55qEIHJvb20gSURcbnZhciBzZWxlY3RlZFJvb21JRCA9ICdhbGwnO1xudmFyIHNlbGVjdGVkUm9vbUlEaW5wdXQgPSAnODAxJztcblxuLy8g5piv5ZCm54K6bWFuYWdlclxudmFyIG1hbmFnZXIgPSB7XG5cdGlzTWFuYWdlciA6IGZhbHNlLFxuXHRuYW1lIDogJ2d1ZXN0J1xufVxuXG4vL2xvZ2luIGlucHV0IGJveFxudmFyIGxvZ2luQm94ID0ge1xuXHRpc1Nob3cgOiBmYWxzZSxcblx0aXNGYWlsIDogZmFsc2Vcbn07XG5cbi8vcm9vbSBpbmZvXG52YXIgcm9vbUluZm8gPSBSb29tSW5mbztcblxuLyoqXG4gKiDlu7rnq4sgU3RvcmUgY2xhc3PvvIzkuKbkuJTnubzmib8gRXZlbnRFTWl0dGVyIOS7peaTgeacieW7o+aSreWKn+iDvVxuICovXG5vYmplY3RBc3NpZ24oIFN0b3JlLCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgQVBJXG4gICAgICog5L6b5aSW55WM5Y+W5b6XIHN0b3JlIOWFp+mDqOizh+aWmVxuICAgICAqL1xuICAgIGdldExvZzogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGFyckxvZztcbiAgICB9LFxuXG4gICAgZ2V0U2VsZWN0ZWRSb29tSUQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBzZWxlY3RlZFJvb21JRDtcbiAgICB9LFxuXG5cdGdldFNlbGVjdGVkUm9vbUlEaW5wdXQ6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHNlbGVjdGVkUm9vbUlEaW5wdXQ7XG5cdH0sXG5cblx0Z2V0TG9naW5Cb3hTaG93Q3RybDogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gbG9naW5Cb3g7XG5cdH0sXG5cblx0Z2V0Um9vbUluZm86IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHJvb21JbmZvO1xuXHR9LFxuXG5cdGdldElzTWFuYWdlcjogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gbWFuYWdlcjtcblx0fSxcblxuXHRzZXRNYW5hZ2VyOiBmdW5jdGlvbihpbmZvKXtcblx0XHRtYW5hZ2VyID0gaW5mbztcblx0fSxcblxuICAgIC8vXG4gICAgbm9vcDogZnVuY3Rpb24oKXt9XG59KTtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBldmVudCBoYW5kbGVyc1xuXG5TdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlciggZnVuY3Rpb24gZXZlbnRIYW5kbGVycyhldnQpe1xuXG4gICAgLy8gZXZ0IC5hY3Rpb24g5bCx5pivIHZpZXcg55W25pmC5buj5pKt5Ye65L6G55qE5pW05YyF54mp5Lu2XG4gICAgLy8g5a6D5YWn5ZCrIGFjdGlvblR5cGVcbiAgICB2YXIgYWN0aW9uID0gZXZ0LmFjdGlvbjtcblxuICAgIHN3aXRjaCAoYWN0aW9uLmFjdGlvblR5cGUpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLlRPRE9fTE9BRDpcblxuICAgICAgICAgICAgYXJyTG9nID0gYWN0aW9uLml0ZW1zO1xuXG4gICAgICAgICAgICByZW5ld1Jvb21JbmZvX211bHRpKCBhcnJMb2cgKTtcblxuXHRcdFx0Ly9yZXZlcnNlXG5cdFx0XHRhcnJMb2cucmV2ZXJzZSgpO1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnU3RvcmUg5pS25Yiw6LOH5paZOiAnLCBhcnJMb2cgKTtcblxuICAgICAgICAgICAgU3RvcmUuZW1pdCggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCApO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLlRPRE9fQ1JFQVRFOlxuXG4gICAgICAgICAgICBhcnJMb2cudW5zaGlmdCggYWN0aW9uLml0ZW0gKTtcblxuXHRcdFx0cmVuZXdSb29tSW5mbyggYWN0aW9uLml0ZW0gKTtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ1N0b3JlIOaWsOWinjogJywgYXJyTG9nICk7XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5UT0RPX1JFTU9WRTpcblxuICAgICAgICAgICAgYXJyTG9nID0gYXJyTG9nLmZpbHRlciggZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT0gYWN0aW9uLml0ZW07XG4gICAgICAgICAgICB9KVxuXG5cdFx0XHQvL3JlbmV3Um9vbUluZm8oIGFjdGlvbi5pdGVtICk7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdTdG9yZSDliKrlrow6ICcsIGFyckxvZyApO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuVE9ET19VUERBVEU6XG5cblx0XHRcdGFyckxvZyA9IGFyckxvZy5maWx0ZXIoIGZ1bmN0aW9uKGl0ZW0pe1xuICAgIFx0XHRcdGlmKGl0ZW0uX2lkID09IGFjdGlvbi5pdGVtLl9pZCl7XG4gICAgXHRcdFx0XHRpdGVtID0gYWN0aW9uLml0ZW07XG4gICAgXHRcdFx0fVxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtIDtcbiAgICAgICAgICAgIH0pXG5cblx0XHRcdC8vcmVuZXdSb29tSW5mbyggYWN0aW9uLml0ZW0gKTtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ1N0b3JlIOabtOaWsDogJywgYXJyTG9nICk7XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cblx0XHQvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuVE9ET19TRUxFQ1Q6XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdTdG9yZSDpgbjlj5Y6ICcsIGFjdGlvbi5yb29tSUQgKTtcblxuICAgICAgICAgICAgaWYoIHNlbGVjdGVkUm9vbUlEICE9IGFjdGlvbi5yb29tSUQgKXtcblxuICAgICAgICAgICAgICAgIC8vY2hhbmdlIGlkXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRSb29tSUQgPSBhY3Rpb24ucm9vbUlEO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkUm9vbUlEaW5wdXQgPSBhY3Rpb24ucm9vbUlEO1xuICAgICAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5KVVNUX1JFRlJFU0g6XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdTdG9yZSBKdXN0IFJlZnJlc2gnKTtcblxuICAgICAgICAgICAgbWFuYWdlciA9IGFjdGlvbi5pdGVtO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG5cdCAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLlNXSVRDSF9MT0dJTkJPWDpcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ1N0b3JlIHN3aXRjaCBsb2dpbiBib3gnKTtcblxuXHRcdFx0bG9naW5Cb3guaXNTaG93ID0gIWxvZ2luQm94LmlzU2hvdztcblx0XHRcdGxvZ2luQm94LmlzRmFpbCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG5cdFx0LyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5MT0dJTl9GQUlMOlxuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnbG9naW4gZmFpbCcpO1xuXG5cdFx0XHRsb2dpbkJveC5pc0ZhaWwgPSB0cnVlO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5DSEFOR0VfSU5QVVRJRDpcblxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2NoYW5nZSBpbnB1dCBpZCcpO1xuXG5cdFx0XHRzZWxlY3RlZFJvb21JRGlucHV0ID0gYWN0aW9uLmlucHV0SUQ7XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuU09DS0VUX1VQREFURTpcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFyckxvZy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmKGFyckxvZ1tpXS5faWQgPT0gYWN0aW9uLml0ZW0uX2lkKXtcbiAgICAgICAgICAgICAgICAgICAgYXJyTG9nW2ldID0gYWN0aW9uLml0ZW07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuU09DS0VUX0NIRUNLT1VUOlxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYXJyTG9nLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYoYXJyTG9nW2ldLl9pZCA9PSBhY3Rpb24uaXRlbS5faWQpe1xuICAgICAgICAgICAgICAgICAgICBhcnJMb2dbaV0gPSBhY3Rpb24uaXRlbTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZW5ld1Jvb21JbmZvKCBhY3Rpb24uaXRlbSApO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG5cbiAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuU09DS0VUX1JFTU9WRTpcblxuICAgICAgICAgICAgdmFyIGN0cmwgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJMb2cubGVuZ3RoIC0xOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIGlmKGFyckxvZ1tpXS5faWQgPT0gYWN0aW9uLml0ZW0uX2lkIHx8IGN0cmwgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgIGFyckxvZ1tpXSA9IGFyckxvZ1sgaSArIDFdO1xuICAgICAgICAgICAgICAgICAgICBjdHJsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoY3RybCl7XG4gICAgICAgICAgICAgICAgYXJyTG9nLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVuZXdSb29tSW5mbyggYWN0aW9uLml0ZW0gKTtcblxuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnU3RvcmUg5paw5aKeOiAnLCBhcnJMb2cgKTtcblxuICAgICAgICAgICAgU3RvcmUuZW1pdCggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCApO1xuXG4gICAgICAgICAgICBicmVhaztcblxuXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICB9XG59KVxuXG5cbi8vLS0tLS1yZW5ldyByb29tSW5mbyBmdW5jXG5mdW5jdGlvbiByZW5ld1Jvb21JbmZvKGRhdGEpe1xuXG5cdC8vY29uc29sZS5sb2coJ3N0YXJ0IDogJywgZGF0YSk7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IHJvb21JbmZvLmxlbmd0aDsgaSsrKXtcblxuXHRcdGlmKCByb29tSW5mb1tpXS5uYW1lID09IGRhdGEucm9vbSApe1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgcm9vbUluZm9baV0ucG9zaS5sZW5ndGg7IGorKyl7XG5cblx0XHRcdFx0aWYoIHJvb21JbmZvW2ldLnBvc2lbal0ubmFtZSA9PSBkYXRhLnBvc2kgKXtcblx0XHRcdFx0XHRyb29tSW5mb1tpXS5wb3NpW2pdLm9jY3VwYW5jeSA9ICFyb29tSW5mb1tpXS5wb3NpW2pdLm9jY3VwYW5jeTtcblxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ3Jvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5Jywgcm9vbUluZm9baV0ucG9zaVtqXS5vY2N1cGFuY3kpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVuZXdSb29tSW5mb19tdWx0aShkYXRhKXtcblxuICAgIC8vY29uc29sZS5sb2coJ3N0YXJ0IDogJywgZGF0YSk7XG5cbiAgICBmb3IgKHZhciByb3cgPSBkYXRhLmxlbmd0aCAtIDE7IHJvdyA+PSAwOyByb3ctLSkge1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCByb29tSW5mby5sZW5ndGg7IGkrKyl7XG5cbiAgICAgICAgICAgIGlmKCByb29tSW5mb1tpXS5uYW1lID09IGRhdGFbcm93XS5yb29tICl7XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgcm9vbUluZm9baV0ucG9zaS5sZW5ndGg7IGorKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIHJvb21JbmZvW2ldLnBvc2lbal0ubmFtZSA9PSBkYXRhW3Jvd10ucG9zaSAmJiBkYXRhW3Jvd10ub3V0VGltZS5sZW5ndGggPCA1KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5ID0gIXJvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdyb29tSW5mb1tpXS5wb3NpW2pdLm9jY3VwYW5jeScsIGksIGosIHJvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG4vL1xubW9kdWxlLmV4cG9ydHMgPSBTdG9yZTtcbiIsInZhciBSb29tSW5mbyA9IFtcblx0e1xuXHRcdG5hbWUgOiAnODAxJyxcblx0XHRwb3NpSW5mbyA6IHsgcGMgOiAyNCwgY29uIDogMTJ9LFxuXHRcdHBvc2kgOiBbXVxuXHR9LFxuXHR7XG5cdFx0bmFtZSA6ICc4MDInLFxuXHRcdHBvc2lJbmZvIDogeyBwYyA6IDEyLCBjb24gOiAxMn0sXG5cdFx0cG9zaSA6IFtdXG5cdH0sXG5cdHtcblx0XHRuYW1lIDogJzgwNCcsXG5cdFx0cG9zaUluZm8gOiB7IHBjIDogMTIsIGNvbiA6IDEyfSxcblx0XHRwb3NpIDogW11cblx0fSxcblx0e1xuXHRcdG5hbWUgOiAnODA2Jyxcblx0XHRwb3NpSW5mbyA6IHsgcGMgOiAxMiwgY29uIDogMTJ9LFxuXHRcdHBvc2kgOiBbXVxuXHR9LFxuXHR7XG5cdFx0bmFtZSA6ICc4MTMnLFxuXHRcdHBvc2lJbmZvIDogeyBwYyA6IDEyLCBjb24gOiAxMn0sXG5cdFx0cG9zaSA6IFtdXG5cdH0sXG5cdHtcblx0XHRuYW1lIDogJzgwMCcsXG5cdFx0cG9zaUluZm8gOiB7IHBjIDogMCwgY29uIDogMTJ9LFxuXHRcdHBvc2kgOiBbXVxuXHR9XG5dXG5cbi8vaW5pdCBhcnJheVxudmFyIHBvc2lBcnkgPSBmdW5jdGlvbihwYywgY29uKXtcblx0dmFyIHRtcCA9IFtdO1xuXHRcblx0Zm9yKHZhciBpID0gMTsgaSA8PSBwYzsgaSsrICl7XG5cdFx0dG1wLnB1c2goeyBuYW1lOiAnUEMgJyArIGksIG9jY3VwYW5jeTogZmFsc2UgfSk7XG5cdH1cblx0XG5cdGZvcih2YXIgaSA9IDE7IGkgPD0gY29uOyBpKysgKXtcblx0XHR0bXAucHVzaCh7IG5hbWU6ICfoqI7oq5YgJyArIGksIG9jY3VwYW5jeTogZmFsc2UgfSk7XG5cdH1cblx0cmV0dXJuIHRtcFxufTtcblxuZm9yKHZhciBpID0gMDsgaSA8IFJvb21JbmZvLmxlbmd0aDsgaSsrKXtcblx0Um9vbUluZm9baV0ucG9zaSA9IHBvc2lBcnkoIFJvb21JbmZvW2ldLnBvc2lJbmZvLnBjLCBSb29tSW5mb1tpXS5wb3NpSW5mby5jb24pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvb21JbmZvOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qKlxuICpcbiAqL1xudmFyIFJlYWN0UHJvcFR5cGVzID0gUmVhY3QuUHJvcFR5cGVzO1xudmFyIGFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FwcEFjdGlvbkNyZWF0b3InKTtcblxudmFyIEZvb3RlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0Zvb3RlcicsXG5cbiAgcHJvcFR5cGVzOiB7XG4gIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5ET00uZm9vdGVyKHtjbGFzc05hbWU6IFwiZm9vdGVyXCJ9LCBcblxuICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwiYXV0aG9yXCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgXCJBdXRob3IgfCBBbmRyZXcgQ2hlbiAgXCIsICcoIE1heSAvIDIwMTUgKSdcbiAgICAgICAgICAgICAgICApLCBcblxuICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwiYXV0aG9yX2xpbmtcIn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5ET00uYSh7aHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20vUG9sYXJCZWFyQW5kcmV3L0xhYk1hbmFnZXJcIiwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLTJ4IGZhLWdpdGh1YlwifSksIFwiIFwiKSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5hKHtocmVmOiBcImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9wcm9maWxlLnBocD9pZD0xMDAwMDEzMTc3NDYxNTRcIiwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLTJ4IGZhLWZhY2Vib29rLW9mZmljaWFsXCJ9KSwgXCIgXCIpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb290ZXI7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKlxuICogVmlld3NcbiAqL1xuXG52YXIgTGlzdEl0ZW0gPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vTGlzdEl0ZW0uanN4JykpO1xudmFyIExpc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9MaXN0SW5wdXQuanN4JykpO1xudmFyIExpc3RUaXRsZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9MaXN0VGl0bGUuanN4JykpO1xuXG4vL1xudmFyIGNvbXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdjb21wJyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRsb2c6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG5cdCAgICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0ICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCAgICByb29tOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGluVGltZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0ICAgIG91dFRpbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCAgICBpbkNoZWNrOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQgICAgb3V0Q2hlY2s6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSksXG5cblx0Ly8gY2FsbGJhY2tzXG4gICAgY2hlY2tPdXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGNoZWNrSW5JZ25vcmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHR9LFxuICAvKipcbiAgICpcbiAgICovXG4gIFx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHQgICAgLy8g5Y+W5Ye65omA5pyJ6KaB57mq6KO955qE6LOH5paZXG5cdCAgICB2YXIgYXJybG9nID0gdGhpcy5wcm9wcy50cnV0aC5hcnJMb2c7XG5cdFx0dmFyIHNlbGVjdGVkUm9vbUlEID0gdGhpcy5wcm9wcy50cnV0aC5zZWxlY3RlZFJvb21JRDtcblx0XHR2YXIgbWFuYWdlciA9IHRoaXMucHJvcHMudHJ1dGgubWFuYWdlcjtcblxuXHRcdC8vY29uc29sZS5sb2codGhpcy5wcm9wcy5jaGVja0luQXNzZW50KTtcblxuXG5cdFx0Ly8g6LeRIGxvb3Ag5LiA562G562G5bu65oiQIExpc3RJdGVtIOWFg+S7tlxuXHRcdHZhciBhcnIgPSBhcnJsb2cubWFwKGZ1bmN0aW9uIChsb2cpIHtcblxuXHRcdFx0Ly8g5rOo5oSP5q+P5YCLIGl0ZW0g6KaB5pyJ5LiA5YCL542o5LiA54Sh5LqM55qEIGtleSDlgLxcblx0XHRcdHJldHVybiBMaXN0SXRlbSh7XG5cdFx0XHRcdGtleTogIGxvZy5pZCwgXG5cdFx0XHRcdGxvZ1JvdzogbG9nLCBcblx0XHRcdFx0bWFuYWdlcjogbWFuYWdlciwgXG5cdFx0XHRcdGNoZWNrT3V0OiAgdGhpcy5wcm9wcy5jaGVja091dCwgXG5cdFx0XHRcdHNlbGVjdGVkUm9vbUlEOiBzZWxlY3RlZFJvb21JRCwgXG5cdFx0XHRcdGNoZWNrSW5Bc3NlbnQ6ICB0aGlzLnByb3BzLmNoZWNrSW5Bc3NlbnQsIFxuXHRcdFx0XHRjaGVja0luSWdub3JlOiAgdGhpcy5wcm9wcy5jaGVja0luSWdub3JlLCBcblx0XHRcdFx0Y2hlY2tPdXRBc3NlbnQ6ICB0aGlzLnByb3BzLmNoZWNrT3V0QXNzZW50LCBcblx0XHRcdFx0Y2hlY2tPdXRJZ25vcmU6ICB0aGlzLnByb3BzLmNoZWNrT3V0SWdub3JlfVxuXHRcdFx0XHQpXG5cblx0XHR9LCB0aGlzKTtcblxuXHRcdHZhciBpbnB1dFRpdGxlID0gWydMYWInLCAnWW91ciBJRCcsICdZb3VyIE5hbWUnLCAnUG9zaScsICdDaGVjayBpbicsICcnLCAnJywgJ09wZXJhdGUnXTtcblx0XHR2YXIgdGhlYWRUaXRsZSA9IFsnTGFiJywgJ0lEJywgJ05hbWUnLCAnUG9zaScsICdDaGVjayBpbicsICdDaGVjayBvdXQnLCAnQ2hlY2tlZChpbiknLCAnQ2hlY2tlZChvdXQpJ107XG5cblxuXHQgICAgcmV0dXJuIChcblx0XHRcdFx0UmVhY3QuRE9NLmZvcm0obnVsbCwgXG5cdFx0XHQgICAgICBcdFJlYWN0LkRPTS50YWJsZSh7Y2xhc3NOYW1lOiBcInRhYmxlIHRhYmxlLWhvdmVyXCJ9LCBcblx0XHRcdFx0XHRcdExpc3RUaXRsZSh7XG5cdFx0XHRcdFx0XHRcdHRpdGxlczogaW5wdXRUaXRsZSwgXG5cdFx0XHRcdFx0XHRcdGxpc3RUaXRsZTogZmFsc2UgfVxuXHRcdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRcdExpc3RJbnB1dCh7XG5cdFx0XHRcdFx0XHRcdGpvaW46ICB0aGlzLnByb3BzLmpvaW4sIFxuXHRcdFx0XHRcdFx0XHRpbnB1dElEOiAgdGhpcy5wcm9wcy5pbnB1dElELCBcblx0XHRcdFx0XHRcdFx0cm9vbUluZm86ICB0aGlzLnByb3BzLnJvb21JbmZvLCBcblx0XHRcdFx0XHRcdFx0Y2hhbmdlSW5wdXRJRDogIHRoaXMucHJvcHMuY2hhbmdlSW5wdXRJRH1cblx0XHRcdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0XHRMaXN0VGl0bGUoe1xuXHRcdFx0XHRcdFx0XHR0aXRsZXM6IHRoZWFkVGl0bGUsIFxuXHRcdFx0XHRcdFx0XHRsaXN0VGl0bGU6IHRydWUgfVxuXHRcdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS50Ym9keShudWxsLCBcblx0XHQgICAgICAgIFx0XHRcdGFyclxuXHRcdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00udGZvb3QobnVsbCwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7Y2xhc3NOYW1lOiBcInRhYmxlRW5kXCIsIGNvbFNwYW46IFwiOFwifSwgXCItLS0gW0VuZF0gLS0tXCIpXG5cdFx0XHRcdFx0XHQpXG5cdCAgXHRcdFx0XHQpXG5cdFx0XHRcdClcbiAgICBcdCk7XG5cdH0sXG5cdG5vb3A6IGZ1bmN0aW9uKCl7ICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLypcbiAqIFZpZXdzXG4gKi9cbnZhciBMaXN0ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9MaXN0LmpzeCcpICk7XG52YXIgU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KCByZXF1aXJlKCcuL1NlbGVjdG9yLmpzeCcpICk7XG52YXIgTG9nSW5Gb3JtID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9Mb2dJbkZvcm0uanN4JykgKTtcbnZhciBMaXN0SGVhZGVyID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9MaXN0SGVhZGVyLmpzeCcpICk7XG5cbi8qXG4gKiBTdG9yZVxuICovXG52YXIgTG9nU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvTG9nU3RvcmUnKTtcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XG5cbi8qXG4gKiBBY3Rpb25zXG4gKi9cbnZhciBhY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25DcmVhdG9yJyk7XG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBDb21wb25lbnRcblxudmFyIExpc3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdMaXN0Q29udGFpbmVyJyxcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyBtaXhpbiB8IHByb3BzIHwgZGVmYXVsdCB2YWx1ZVxuXG4gICAgbWl4aW5zOiBbXSxcblxuICAgIC8vIOmAmeijj+WIl+WHuuaJgOacieimgeeUqOWIsOeahCBwcm9wZXJ0eSDoiIflhbbpoJDoqK3lgLxcbiAgICAvLyDlroPlnKggZ2V0SW5pdGlhbFN0YXRlKCkg5YmN5Z+36KGM77yM5q2k5pmCIHRoaXMuc3RhdGUg6YKE5piv56m65YC8XG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIGZvbzogJ19fZm9vX18nLFxuICAgICAgICAgICAgLy8gYmFyOiAnX19iYXJfXydcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLy8g6YCZ6KOP5YiX5Ye65q+P5YCLIHByb3Ag55qE5Z6L5Yil77yM5L2G5Y+q5pyD5ZyoIGRldiB0aW1lIOaqouafpVxuICAgIHByb3BUeXBlczoge1xuICAgICAgICAvLyBmb286IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgLy8gYmFyOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuICAgIH0sXG5cblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyBtb3VudFxuXG4gICAgLy8g6YCZ5pivIGNvbXBvbmVudCBBUEksIOWcqCBtb3VudCDliY3mnIPot5HkuIDmrKHvvIzlj5blgLzlgZrngrogdGhpcy5zdGF0ZSDnmoTpoJDoqK3lgLxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuZ2V0VHJ1dGgoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5Li756iL5byP6YCy5YWl6bueXG4gICAgICovXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcblxuICAgICAgICBMb2dTdG9yZS5hZGRMaXN0ZW5lciggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCwgdGhpcy5fb25DaGFuZ2UgKTtcblxuICAgICAgICB2YXIgSVBhZGRyZXNzID0gJ2xvY2FsaG9zdDo4MDgwJztcbiAgICAgICAgLy92YXIgSVBhZGRyZXNzID0gJzEyMC45Ni43NS4xNDI6ODA4MCc7XG5cblxuICAgICAgICB2YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovLycgKyBJUGFkZHJlc3MpO1xuXG4gICAgICAgIC8vIHNvY2tldC5lbWl0KCdub3RpZnknLCB7IG5hbWUgOiAnQW5kcmV3JyB9KTtcblxuICAgICAgICBzb2NrZXQub24oJ25ld0xvZycsIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuc29ja2V0TmV3KGRhdGEubG9nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc29ja2V0Lm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICBhY3Rpb25zLnNvY2tldFVwZGF0ZShkYXRhLmxvZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNvY2tldC5vbignY2hlY2tvdXQnLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICBhY3Rpb25zLnNvY2tldENoZWNrT3V0KGRhdGEubG9nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc29ja2V0Lm9uKCdyZW1vdmUnLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICBhY3Rpb25zLnNvY2tldFJlbW92ZShkYXRhLmxvZyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDph43opoHvvJpyb290IHZpZXcg5bu656uL5b6M56ys5LiA5Lu25LqL77yM5bCx5piv5YG16IG9IHN0b3JlIOeahCBjaGFuZ2Ug5LqL5Lu2XG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL1xuICAgIH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gdW5tb3VudFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vVG9kb1N0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcblxuICAgIH0sXG5cblxuICAgIGNvbXBvbmVudERpZFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gdXBkYXRlXG5cbiAgICAvLyDlnKggcmVuZGVyKCkg5YmN5Z+36KGM77yM5pyJ5qmf5pyD5Y+v5YWI6JmV55CGIHByb3BzIOW+jOeUqCBzZXRTdGF0ZSgpIOWtmOi1t+S+hlxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuICAgICAgICAvL1xuICAgIH0sXG5cbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyDpgJnmmYLlt7LkuI3lj6/nlKggc2V0U3RhdGUoKVxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnXFx0TWFpbkFQUCA+IHdpbGxVcGRhdGUnICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ1xcdE1haW5BUFAgPiBkaWRVcGRhdGUnICk7XG4gICAgfSxcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyByZW5kZXJcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0dmFyIGZvcm0gPSBmdW5jdGlvbihjdHJsKSB7XG5cdFx0XHRcdFx0aWYoY3RybC5pc1Nob3cpe1xuXHRcdFx0XHRcdFx0cmV0dXJuICggTG9nSW5Gb3JtKHtcblx0XHRcdFx0XHRcdFx0XHRcdG91dDogYWN0aW9ucy5zd2l0Y2hMb2dJbkJveCwgXG5cdFx0XHRcdFx0XHRcdFx0XHRsb2dpblBvc3Q6ICBhY3Rpb25zLmxvZ0luLCBcblx0XHRcdFx0XHRcdFx0XHRcdGZhaWw6ICBjdHJsLmlzRmFpbH0pICk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0oIHRoaXMuc3RhdGUubG9naW5Cb3hDdHJsICk7XG5cbiAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIkxpc3RDb250YWluZXJcIn0sIFxuXHRcdFx0XHRcdGZvcm0sIFxuXHRcdFx0XHRcdExpc3RIZWFkZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgSUQ6ICB0aGlzLnN0YXRlLnNlbGVjdGVkUm9vbUlELCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luOiAgYWN0aW9ucy5zd2l0Y2hMb2dJbkJveCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dvdXQ6ICBhY3Rpb25zLmxvZ091dCwgXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoOiAgYWN0aW9ucy5sb2FkLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hbmFnZXI6ICB0aGlzLnN0YXRlLm1hbmFnZXIsIFxuXHRcdFx0XHRcdFx0cm9vbUluZm86ICB0aGlzLnN0YXRlLnJvb21JbmZvLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdFJvb21JRDogIGFjdGlvbnMuc2VsZWN0Um9vbUlEfVxuICAgICAgICAgICAgICAgICAgICAgICAgKSwgXG5cdFx0XHRcdFx0TGlzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBqb2luOiAgYWN0aW9ucy5hc2tGb3JKb2luLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRydXRoOiAgdGhpcy5zdGF0ZSwgXG5cdFx0XHRcdFx0XHRpbnB1dElEOiAgdGhpcy5zdGF0ZS5zZWxlY3RlZElucHV0SUQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tPdXQ6IGFjdGlvbnMuYXNrRm9yTGVhdmUsIFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbUluZm86ICB0aGlzLnN0YXRlLnJvb21JbmZvLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZUlucHV0SUQ6ICBhY3Rpb25zLmNoYW5nZUlucHV0SUQsIFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0luQXNzZW50OiAgYWN0aW9ucy5jaGVja0luLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrSW5JZ25vcmU6ICBhY3Rpb25zLmNoZWNrSW5JZ25vcmUsIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tPdXRBc3NlbnQ6ICBhY3Rpb25zLmNoZWNrT3V0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrT3V0SWdub3JlOiAgYWN0aW9ucy5jaGVja091dElnbm9yZX1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcbiAgICAgICAgKVxuICAgIH0sXG5cblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyBwcml2YXRlIG1ldGhvZHMgLSDomZXnkIblhYPku7blhafpg6jnmoTkuovku7ZcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yICdjaGFuZ2UnIGV2ZW50cyBjb21pbmcgZnJvbSB0aGUgVG9kb1N0b3JlXG4gICAgICpcbiAgICAgKiBjb250cm9sbGVyLXZpZXcg5YG16IG95YiwIG1vZGVsIGNoYW5nZSDlvoxcbiAgICAgKiDln7fooYzpgJnmlK/vvIzlroPmk43kvZzlj6bkuIDmlK8gcHJpdmF0ZSBtZXRob2Qg5Y676LefIG1vZGVsIOWPluacgOaWsOWAvFxuICAgICAqIOeEtuW+jOaTjeS9nCBjb21wb25lbnQgbGlmZSBjeWNsZSDnmoQgc2V0U3RhdGUoKSDlsIfmlrDlgLzngYzlhaXlhYPku7bpq5Tns7tcbiAgICAgKiDlsLHmnIPop7jnmbzkuIDpgKPkuLIgY2hpbGQgY29tcG9uZW50cyDot5/okZfph43nuarlm4lcbiAgICAgKi9cbiAgICBfb25DaGFuZ2U6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ19vbkNoYW5nZSDph43nuao6ICcsIHRoaXMuZ2V0VHJ1dGgoKSApO1xuXG4gICAgICAgIC8vIOmHjeimge+8muW+niByb290IHZpZXcg6Ke455m85omA5pyJIHN1Yi12aWV3IOmHjee5qlxuICAgICAgICB0aGlzLnNldFN0YXRlKCB0aGlzLmdldFRydXRoKCkgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog54K65L2V6KaB542o56uL5a+r5LiA5pSv77yf5Zug54K65pyD5pyJ5YWp5YCL5Zyw5pa55pyD55So5Yiw77yM5Zug5q2k5oq95Ye65L6GXG4gICAgICog55uu5Zyw77yaXG4gICAgICogICAgIOWQkeWQhOWAiyBzdG9yZSDlj5blm57os4fmlpnvvIznhLblvozntbHkuIAgc2V0U3RhdGUoKSDlho3kuIDlsaTlsaTlvoDkuIvlgrPpgZ5cbiAgICAgKi9cbiAgICBnZXRUcnV0aDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8g5piv5b6eIFRvZG9TdG9yZSDlj5bos4fmlpkoYXMgdGhlIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGgpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhcnJMb2c6IExvZ1N0b3JlLmdldExvZygpLFxuXHRcdFx0c2VsZWN0ZWRSb29tSUQ6IExvZ1N0b3JlLmdldFNlbGVjdGVkUm9vbUlEKCksXG5cdFx0XHRzZWxlY3RlZElucHV0SUQ6IExvZ1N0b3JlLmdldFNlbGVjdGVkUm9vbUlEaW5wdXQoKSxcblx0XHRcdG1hbmFnZXI6IExvZ1N0b3JlLmdldElzTWFuYWdlcigpLFxuXHRcdFx0bG9naW5Cb3hDdHJsOiBMb2dTdG9yZS5nZXRMb2dpbkJveFNob3dDdHJsKCksXG5cdFx0XHRyb29tSW5mbzogTG9nU3RvcmUuZ2V0Um9vbUluZm8oKSxcbiAgICAgICAgIH07XG4gICAgfVxuXG5cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENvbnRhaW5lcjtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoIHJlcXVpcmUoJy4vU2VsZWN0b3IuanN4JykgKTtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBDb21wb25lbnRcblxudmFyIExpc3RIZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdMaXN0SGVhZGVyJyxcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuICAgIC8vIOmAmeijj+WIl+WHuuavj+WAiyBwcm9wIOeahOWei+WIpe+8jOS9huWPquacg+WcqCBkZXYgdGltZSDmqqLmn6VcbiAgIHByb3BUeXBlczoge1xuXHRcdC8vIGNhbGxiYWNrc1xuXHRcdFx0c2VsZWN0Um9vbUlEOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHRcdGxvZ291dDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdFx0fSxcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyByZW5kZXJcblxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHRcdHZhciByb29tSW5mbyA9IFt7IG5hbWUgOiAnYWxsJ31dLmNvbmNhdCh0aGlzLnByb3BzLnJvb21JbmZvKTtcblxuXHRcdHZhciBzaG93SUQgPSAnJztcblxuXHRcdC8qXG5cdFx0ICogc2hvdyBiaWcgcm9vbSBJRFxuXHRcdCAqL1xuXHRcdGlmKHRoaXMucHJvcHMuSUQgPT0gJ2FsbCcpe1xuXHRcdFx0c2hvd0lEID0gJyc7XG5cdFx0fWVsc2V7XG5cdFx0XHRzaG93SUQgPSAnIC0gJyArIHRoaXMucHJvcHMuSUQ7XG5cdFx0fVxuXG5cdFx0Lypcblx0XHQgKiBpcyBtYW5hZ2VyIG9yIG5vdFxuXHRcdCAqL1xuXHRcdHZhciB3aG9BbUkgPSBmdW5jdGlvbihtZyl7XG5cblx0XHRcdHZhciBzaG93ID0ge307XG5cblx0XHRcdGlmKG1nLmlzTWFuYWdlcil7XG5cblx0XHRcdFx0c2hvdy5zdHIgPSAnLi4uICBJIGFtIGEgbWFuYWdlciwgbXkgbmFtZSBpcyAnO1xuXHRcdFx0XHRzaG93Lm5hbWUgPSBtZy5uYW1lO1xuXG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmg1KHtjbGFzc05hbWU6IFwibGVhZFwifSwgXG5cdFx0XHRcdFx0XHQgc2hvdy5zdHIsIFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogXCJ0ZXh0LXN1Y2Nlc3MgaXNOYW1lXCJ9LCBcIiBcIiwgIHNob3cubmFtZSwgXCIgXCIpLCBcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtocmVmOiBcIiNcIiwgb25DbGljazogIHRoaXMucHJvcHMubG9nb3V0fSwgUmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1zaWduLW91dFwifSkpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXG5cdFx0XHR9ZWxzZXtcblxuXHRcdFx0XHRzaG93LnN0ciA9ICcuLi4gWW91ciBhcmUgYSBtYW5hZ2VyID8gJztcblx0XHRcdFx0c2hvdy5uYW1lID0gJ2xvZ0luJztcblxuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFJlYWN0LkRPTS5oNSh7Y2xhc3NOYW1lOiBcImxlYWRcIn0sIFxuXHRcdFx0XHRcdFx0IHNob3cuc3RyLCBcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtvbkNsaWNrOiAgdGhpcy5wcm9wcy5sb2dpbn0sIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBcInRleHQtcHJpbWFyeVwifSwgXCIgXCIsICBzaG93Lm5hbWUsIFwiIFwiKSwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtc2lnbi1pblwifSlcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHR9LmJpbmQoIHRoaXMgKSggdGhpcy5wcm9wcy5tYW5hZ2VyICk7XG5cblx0XHQvKlxuXHRcdCAqIHJldHVybiBoZWFkZXJcblx0XHQgKi9cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImhlYWRlclwifSwgXG5cdFx0XHRcdFJlYWN0LkRPTS5oMShudWxsLCBcblx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXVzZXJzXCJ9KSwgXG5cdFx0XHRcdFx0JyAgTGFiIE1hbmFnZXIgICcsIFxuXHRcdFx0XHRcdHNob3dJRCBcblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LkRPTS5oNChudWxsLCBcblx0XHRcdFx0XHRSZWFjdC5ET00uc3BhbihudWxsLCBcIlJvb20gSUQgXCIpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBcImJ0biBidG4taW5mbyByZWZyZXNoXCIsIG9uQ2xpY2s6ICB0aGlzLnByb3BzLnJlZnJlc2h9LCBcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtcmVmcmVzaFwifSlcblx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRTZWxlY3Rvcih7XG5cdFx0XHRcdFx0XHRteUlEOiBcInNlbGVjdElEXCIsIFxuXHRcdFx0XHRcdFx0c2VsZWN0Um9vbUlEOiB0aGlzLnByb3BzLnNlbGVjdFJvb21JRCwgXG5cdFx0XHRcdFx0XHRjaGFuZ2VUb2RvOiAgdGhpcy5oYW5kbGVDaGFuZ2UsIFxuXHRcdFx0XHRcdFx0b3B0aW9uczogcm9vbUluZm8gfSlcblx0XHRcdFx0KSwgXG5cdFx0XHRcdHdob0FtSSBcblx0XHRcdCkgKVxuICAgIH0sXG5cblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKCl7XG5cblx0XHRpZih0aGlzLnByb3BzLnNlbGVjdFJvb21JRCl7XG5cblx0XHRcdHZhciBpZCA9ICQoJyNzZWxlY3RJRCcpLnZhbCgpO1xuXHRcdFx0dGhpcy5wcm9wcy5zZWxlY3RSb29tSUQoaWQpO1xuXG5cdFx0XHQvL3N5bmMgaW5wdXQgc2VsZWN0XG5cdFx0XHRpZiggaWQgIT0gJ2FsbCcpe1xuXHRcdFx0XHQkKCcjaW5wdXRJRCcpLnZhbChpZCk7XG5cblx0XHRcdH1lbHNle1xuXHRcdFx0XHQkKCcjaW5wdXRJRCcpLnZhbCgnODAxJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdEhlYWRlcjtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFNlbGVjdG9yID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9TZWxlY3Rvci5qc3gnKSApO1xudmFyIFNlY3JldCA9IHJlcXVpcmUoJy4vU2VjcmV0Q29tbS5qc3gnKTtcblxudmFyIFNldEludGVydmFsTWl4aW4gPSB7XG5cblx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmludGVydmFscyA9IFtdO1xuXHR9LFxuXG5cdHNldEludGVydmFsOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmludGVydmFscy5wdXNoKHNldEludGVydmFsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmludGVydmFscy5tYXAoY2xlYXJJbnRlcnZhbCk7XG5cdH1cbn07XG5cbnZhciBMaXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdMaXN0SW5wdXQnLFxuXG5cdG1peGluczogW1NldEludGVydmFsTWl4aW5dLCAvLyBVc2UgdGhlIG1peGluXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbm93ID0gdGhpcy5oYW5kbGVUaW1lKCk7XG5cdFx0cmV0dXJuIHsgdGltZTogbm93IH07XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0SW50ZXJ2YWwoIHRoaXMudGljaywgMTAwMCAqIDMwKTsgLy8gQ2FsbCBhIG1ldGhvZCBvbiB0aGUgbWl4aW5cblx0fSxcblxuXHR0aWNrOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbm93ID0gdGhpcy5oYW5kbGVUaW1lKCk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7dGltZTogbm93IH0pO1xuXHR9LFxuXG5cdHByb3BUeXBlczoge1xuXHRcdG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG5cdH0sXG5cbiAgLyoqXG4gICAqXG4gICAqL1xuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIGlucHV0SUQgPSB0aGlzLnByb3BzLmlucHV0SUQ7XG5cdFx0dmFyIHJvb21JbmZvID0gIHRoaXMucHJvcHMucm9vbUluZm87XG5cdFx0dmFyIHBvc2lPcHRpb25zID0gW107XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgcm9vbUluZm8ubGVuZ3RoOyBpKysgKXtcblx0XHRcdGlmKCByb29tSW5mb1tpXS5uYW1lID09IGlucHV0SUQgKXtcblx0XHRcdFx0cG9zaU9wdGlvbnMgPSByb29tSW5mb1tpXS5wb3NpLmZpbHRlcihmdW5jdGlvbihwb3NpKXtcblx0XHRcdFx0XHRpZiggcG9zaS5vY2N1cGFuY3kgPT0gZmFsc2UgKXtcblx0XHRcdFx0XHRcdHJldHVybiBwb3NpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cbiAgICBcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5ET00udGhlYWQobnVsbCwgXG5cdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBcblx0XHRcdFx0XHRTZWxlY3Rvcih7XG5cdFx0XHRcdFx0XHRteUlEOiBcImlucHV0SURcIiwgXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwiaW5wdXRcIiwgXG5cdFx0XHRcdFx0XHRvcHRpb25zOiByb29tSW5mbywgXG5cdFx0XHRcdFx0XHRjaGFuZ2VUb2RvOiAgdGhpcy5oYW5kbGVJRGNoYW5nZX0pXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLmlucHV0KHtpZDogXCJpbnB1dFNpZFwiLCB0eXBlOiBcInRleHRcIiwgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBuYW1lOiBcInNpZFwifSkpLCBcblx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIFJlYWN0LkRPTS5pbnB1dCh7aWQ6IFwiaW5wdXROYW1lXCIsIHR5cGU6IFwidGV4dFwiLCBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIG5hbWU6IFwibmFtZVwifSkpLCBcblx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIFNlbGVjdG9yKHtteUlEOiBcImlucHV0UG9zaVwiLCBjbGFzc05hbWU6IFwiaW5wdXRcIiwgb3B0aW9uczogcG9zaU9wdGlvbnMgfSkpLCBcblx0XHRcdFx0UmVhY3QuRE9NLnRkKHtjb2xTcGFuOiBcIjJcIn0sIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS5pbnB1dCh7XHRpZDogXCJpbnB1dEluVGltZVwiLCBcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZS1sb2NhbFwiLCBcdGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgXG5cdFx0XHRcdFx0XHRcdG5hbWU6IFwidGltZVwiLCByZWFkT25seTogXCJ0cnVlXCIsIFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS50aW1lfVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsKSwgXG5cdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBcblx0XHRcdFx0XHRSZWFjdC5ET00uYnV0dG9uKHtcblx0XHRcdFx0XHRcdGNsYXNzTmFtZTogXCJidG4gYnRuLXByaW1hcnlcIiwgXG5cdFx0XHRcdFx0XHR0eXBlOiBcInN1Ym1pdFwiLCBcblx0XHRcdFx0XHRcdG9uQ2xpY2s6ICB0aGlzLmhhbmRsZUFza30sIFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS11c2VyLXBsdXMgLW8gZmEtbGdcIn0pLCBcblx0XHRcdFx0XHRcdCcgSm9pbidcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdCkgKTtcbiAgfSxcblxuXHRwYWRMZWZ0OiBmdW5jdGlvbihzdHIsbGVuKXtcblx0XHRpZigoJycgKyBzdHIpLmxlbmd0aCA+PSBsZW4pe1xuXHRcdFx0cmV0dXJuIHN0cjtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdHJldHVybiB0aGlzLnBhZExlZnQoICcwJyArIHN0ciwgbGVuKTtcblx0XHR9XG5cdH0sXG5cblx0aGFuZGxlVGltZTogZnVuY3Rpb24oKXtcblxuXG5cdFx0dmFyIHQgPSBuZXcgRGF0ZSgpO1xuXHRcdHZhciB0aW1lID0gIHQuZ2V0RnVsbFllYXIoKVxuXHRcdFx0XHRcdCsgJy0nICsgdGhpcy5wYWRMZWZ0KHQuZ2V0VVRDTW9udGgoKSArIDEsIDIpXG5cdFx0XHRcdFx0KyAnLScgKyB0aGlzLnBhZExlZnQodC5nZXRVVENEYXRlKCksMilcblx0XHRcdFx0XHQrICdUJyArIHRoaXMucGFkTGVmdCh0LmdldEhvdXJzKCksMilcblx0XHRcdFx0XHQrICc6JyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ01pbnV0ZXMoKSwyKTtcblx0XHRcdFx0XHQvLyArICc6JyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ1NlY29uZHMoKSwyKVxuXG5cdFx0Ly9jb25zb2xlLmxvZygndGltZTInLHQudG9Mb2NhbGVEYXRlU3RyaW5nKCkpOyAvL+aKk+aXpeacn1xuXHRcdC8vY29uc29sZS5sb2coJ3RpbWUnLHQudG9Mb2NhbGVUaW1lU3RyaW5nKCkpOyAvL+aKk+aZgumWk1xuXHRcdC8vY29uc29sZS5sb2coJ3RpbWUzJyx0LnRvTG9jYWxlU3RyaW5nKCkpOyAvL+aKk+aXpeacn1xuXG5cdFx0cmV0dXJuIHRpbWU7XG5cdH0sXG5cblxuXHRoYW5kbGVBc2s6IGZ1bmN0aW9uKCl7XG5cblx0XHQvL2dldCB0aW1lXG5cdFx0dmFyIHQgID0gbmV3IERhdGUoKTtcblx0XHR2YXIgaW5UaW1lID0gdC50b0xvY2FsZVN0cmluZygpO1xuXG5cdFx0dmFyIHNpZCA9ICQoJyNpbnB1dFNpZCcpLnZhbCgpO1xuXHRcdHZhciBwb3NpID0gJCgnI2lucHV0UG9zaScpLnZhbCgpO1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IFNlY3JldC5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZiggU2VjcmV0W2ldLmNvbW0gPT0gc2lkICYmIFNlY3JldFtpXS5wb3NpX3B3ZCA9PSBwb3NpKXtcblx0XHRcdFx0dGhpcy53ZUFyZVBhbmRhKFNlY3JldFtpXSwgaW5UaW1lKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXG5cdFx0dmFyIHBvc3RJbmZvID0ge1xuXHRcdFx0cm9vbTogJCgnI2lucHV0SUQnKS52YWwoKSxcblx0XHRcdHNpZDogc2lkLFxuXHRcdFx0bmFtZTogJCgnI2lucHV0TmFtZScpLnZhbCgpLFxuXHRcdFx0cG9zaTogcG9zaSxcblx0XHRcdGluQ2hlY2s6ICd3YWl0aW5nJyxcblx0XHRcdG91dENoZWNrOiAnbm90WWV0Jyxcblx0XHRcdGluVGltZTogaW5UaW1lLFxuXHRcdFx0b3V0VGltZTogJyAnXG5cdFx0fTtcblxuXHRcdHRoaXMucHJvcHMuam9pbihwb3N0SW5mbyk7XG5cblx0XHQvL2Rvbid0IHN1Ym1pdFxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblxuXG5cdHdlQXJlUGFuZGE6IGZ1bmN0aW9uKHNlY3JldCwgaW5UaW1lKXtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzZWNyZXQuZGF0YS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRzZWNyZXQuZGF0YVtpXS5pblRpbWUgPSBpblRpbWU7XG5cdFx0XHR0aGlzLnByb3BzLmpvaW4oc2VjcmV0LmRhdGFbaV0pO1xuXHRcdH1cblxuXHR9LFxuXG5cdGhhbmRsZUlEY2hhbmdlOiBmdW5jdGlvbigpe1xuXG5cdFx0dmFyIGlkID0gJCgnI2lucHV0SUQnKS52YWwoKTtcblx0XHR0aGlzLnByb3BzLmNoYW5nZUlucHV0SUQoIGlkICk7XG5cblx0XHQvL3N5bmMgaW5wdXQgc2VsZWN0XG5cdFx0Ly8kKCcjc2VsZWN0SUQnKS52YWwoaWQpO1xuXHR9LFxuXG4gIG5vb3A6IGZ1bmN0aW9uKCl7IH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdElucHV0O1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKlxuICovXG4vL3ZhciBhY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25DcmVhdG9yJyk7XG4vL3ZhciBjeCA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldDtcbi8vXG52YXIgY29tcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2NvbXAnLFxuXG4gIC8qKlxuICAgKlxuICAgKi9cbi8vICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKXtcbi8vICAgICAgdGhpcy4kaW5wdXQgPSAkKHRoaXMuZ2V0RE9NTm9kZSgpKS5maW5kKCdzcGFuJykuZmlyc3QoKTtcbi8vICAgICAgdGhpcy4kcmVtb3ZlID0gdGhpcy4kaW5wdXQubmV4dCgpO1xuLy8gIH0sXG5cblxuXHRwcm9wVHlwZXM6IHtcblxuXHRcdHRvZG9JdGVtOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHQgICAgXHRpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIFx0XHRuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdFx0c2VsZWN0ZWRSb29tSUQ6ICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdFx0aXNNYW5hZ2VyOiAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICAgIFx0fSksXG5cblx0XHQvLyBjYWxsYmFja3Ncblx0ICAgIG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25SZW1vdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHR9LFxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXG5cdFx0dmFyIHNlbGVjdGVkUm9vbUlEID0gdGhpcy5wcm9wcy5zZWxlY3RlZFJvb21JRDtcblx0XHR2YXIgbG9nUm93ID0gdGhpcy5wcm9wcy5sb2dSb3c7XG5cdFx0dmFyIG1hbmFnZXIgPSB0aGlzLnByb3BzLm1hbmFnZXI7XG5cblx0XHQvL3RkIGNoZWNrIGluXG5cdFx0dmFyIGNoZWNrSW4gPSBmdW5jdGlvbihjayl7XG5cdFx0XHRpZihjayA9PSAnd2FpdGluZycgfHwgY2sgPT0gJycgKXtcblx0XHRcdFx0Ly93YWl0aW5nIGZvciBjaGVja2luIHN1Ym1pdFxuXG5cdFx0XHRcdGlmKG1hbmFnZXIuaXNNYW5hZ2VyKXtcblx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImN0cmxzXCJ9LCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2NsYXNzTmFtZTogXCJidG4gYnRuLXN1Y2Nlc3MgYnRuLXhzXCIsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2hlY2tJbkFzc2VudH0sIFxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtY2hlY2tcIn0pLCBcblx0XHRcdFx0XHRcdFx0XHQnIEFzc2VudCdcblx0XHRcdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0XHRcdCcgICcsIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBcImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNoZWNrSW5JZ25vcmV9LCBcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXRyYXNoLW9cIn0pLCBcblx0XHRcdFx0XHRcdFx0XHQnIElnbm9yZSdcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0KSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJldHVybiBSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNwaW5uZXIgZmEtcHVsc2VcIn0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1lbHNle1xuXHRcdFx0XHQvL3Nob3cgd2hvIGNoZWNrZWQgZm9yIHlvdVxuXHRcdFx0XHRyZXR1cm4gIFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtY2hlY2tcIn0sIGNrKSA7XG5cdFx0XHR9XG5cdFx0fS5iaW5kKHRoaXMpKGxvZ1Jvdy5pbkNoZWNrKTtcblxuXG5cdFx0Ly90ZCBjaGVjayBvdXRcblx0XHR2YXIgY2hlY2tPdXQgPSBmdW5jdGlvbihjaywgY2tpbil7XG5cdFx0XHRpZihja2luID09ICd3YWl0aW5nJyB8fCBja2luID09ICcnICl7XG5cdFx0XHRcdC8vaWYgeW91IG5vdCBjaGVja2luIHlldCwgdGhhbiBkb24ndCBuZWVkIHRvIGNoZWNrb3V0XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBcImJ0biBidG4td2FybmluZyBidG4teHMgZGlzYWJsZWRcIn0sIFxuICBcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNpZ24tb3V0XCJ9KSwgXG5cdFx0XHRcdFx0XHRcdCcgQ2hlY2stb3V0J1xuXHRcdFx0XHRcdFx0KSk7XG5cblx0XHRcdH1lbHNlIGlmKGNrID09ICdub3RZZXQnIHx8IGNrID09ICcnICl7XG5cdFx0XHRcdC8vY2FuIGFzayBmb3IgY2hlY2sgb3V0XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBcImJ0biBidG4td2FybmluZyBidG4teHNcIiwgb25DbGljazogdGhpcy5oYW5kbGVDaGVja091dH0sIFxuICBcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNpZ24tb3V0XCJ9KSwgXG5cdFx0XHRcdFx0XHRcdCcgQ2hlY2stb3V0J1xuXHRcdFx0XHRcdFx0KSk7XG5cblx0XHRcdH1lbHNlIGlmKGNrID09ICd3YWl0aW5nJyl7XG5cdFx0XHRcdC8vd2FpdGluZyBmb3IgY2hlY2tvdXQgc3VibWl0XG5cdFx0XHRcdGlmKG1hbmFnZXIuaXNNYW5hZ2VyKXtcblx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdihudWxsLCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2NsYXNzTmFtZTogXCJidG4gYnRuLXN1Y2Nlc3MgYnRuLXhzXCIsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2hlY2tPdXRBc3NlbnR9LCBcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLWNoZWNrXCJ9KSwgXG5cdFx0XHRcdFx0XHRcdFx0JyBZZXMnXG5cdFx0XHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFx0XHQnICAnLCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2NsYXNzTmFtZTogXCJidG4gYnRuLWRhbmdlciBidG4teHNcIiwgb25DbGljazogdGhpcy5oYW5kbGVDaGVja091dElnbm9yZX0sIFxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtdXNlci10aW1lc1wifSksIFxuXHRcdFx0XHRcdFx0XHRcdCcgTm8nXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdCkpO1xuXG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJldHVybiBSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNwaW5uZXIgZmEtcHVsc2VcIn0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1lbHNle1xuXHRcdFx0XHQvL3dobyBsZXQgeW91IGNoZWNrIG91dFxuXHRcdFx0XHRyZXR1cm4gUmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1jaGVja1wifSwgY2spIDtcblx0XHRcdH1cblxuXHRcdH0uYmluZCh0aGlzKShsb2dSb3cub3V0Q2hlY2ssIGxvZ1Jvdy5pbkNoZWNrKTtcblxuXHRcdHZhciB0ID0gbmV3IERhdGUoKTtcblx0XHR2YXIgdG9kYXkgPSB0LnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuXG5cdFx0dmFyIHRtcEluVGltZSA9IGxvZ1Jvdy5pblRpbWUucmVwbGFjZSh0b2RheSwgJ+S7iuWkqScpO1xuXHRcdHZhciB0bXBPdXRUaW1lID0gbG9nUm93Lm91dFRpbWUucmVwbGFjZSh0b2RheSwgJ+S7iuWkqScpO1xuXG5cblx0XHQvL3RvbyBsYXRlXHR+IVxuXHRcdHZhciB0b29MYXRlID0gJyc7XG5cblx0XHRpZiggdG1wT3V0VGltZS5pbmRleE9mKCfkuIvljYgnKSAhPSAtMSApe1xuXG5cdFx0XHR2YXIgaSA9IHRtcE91dFRpbWUuaW5kZXhPZignOicpO1xuXHRcdFx0dmFyIHRtcCAgPSB0bXBPdXRUaW1lLnN1YnN0cmluZyggaSAtIDEsIGkpO1xuXG5cdFx0XHRpZiggdG1wID49IDUpe1xuXHRcdFx0XHR0b29MYXRlID0gJ3Rvb0xhdGUnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKGxvZ1Jvdy5yb29tID09IHNlbGVjdGVkUm9vbUlEIHx8IHNlbGVjdGVkUm9vbUlEID09ICdhbGwnKXtcbiAgICBcdHJldHVybiAoXG5cdFx0XHRcdFJlYWN0LkRPTS50cihudWxsLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgbG9nUm93LnJvb20pLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgbG9nUm93LnNpZCksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBsb2dSb3cubmFtZSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBsb2dSb3cucG9zaSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCB0bXBJblRpbWUpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQoe2NsYXNzTmFtZTogdG9vTGF0ZSB9LCB0bXBPdXRUaW1lKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIGNoZWNrSW4pLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgY2hlY2tPdXQpXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG4gIH0sXG5cbiAgLyoqXG4gICAqXG4gICAqL1xuXHRoYW5kbGVDaGVja091dDogZnVuY3Rpb24oKXtcblx0XHQvL2NvbnNvbGUubG9nKCdjbGljayBjaGVjayBvdXQnLCB0aGlzLnByb3BzLmxvZ1Jvdy5faWQpO1xuXHRcdHRoaXMucHJvcHMubG9nUm93Lm91dENoZWNrID0gJ3dhaXRpbmcnO1xuXHRcdHRoaXMucHJvcHMuY2hlY2tPdXQodGhpcy5wcm9wcy5sb2dSb3cpO1xuXHR9LFxuXG5cdGlzVG9vbGFnZTogZnVuY3Rpb24odGltZSl7XG5cblx0fSxcblxuXHRwYWRMZWZ0OiBmdW5jdGlvbihzdHIsbGVuKXtcblx0XHRpZigoJycgKyBzdHIpLmxlbmd0aCA+PSBsZW4pe1xuXHRcdFx0XHRyZXR1cm4gc3RyO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFkTGVmdCggJzAnICsgc3RyLCBsZW4pO1xuXHRcdFx0fVxuXHR9LFxuXG5cblx0aGFuZGxlQ2hlY2tPdXRBc3NlbnQ6IGZ1bmN0aW9uKCl7XG5cblx0XHR2YXIgdCA9IG5ldyBEYXRlKCk7XG5cdFx0dmFyIG91dFRpbWUgPSB0LnRvTG9jYWxlU3RyaW5nKCk7XG5cblxuXHRcdHRoaXMucHJvcHMubG9nUm93Lm91dFRpbWUgPSBvdXRUaW1lO1xuXHRcdHRoaXMucHJvcHMubG9nUm93Lm91dENoZWNrID0gdGhpcy5wcm9wcy5tYW5hZ2VyLm5hbWU7XG5cblxuXHRcdHRoaXMucHJvcHMuY2hlY2tPdXRBc3NlbnQodGhpcy5wcm9wcy5sb2dSb3cpO1xuXHR9LFxuXG5cdGhhbmRsZUNoZWNrSW5Bc3NlbnQ6IGZ1bmN0aW9uKCl7XG5cdFx0Ly9jb25zb2xlLmxvZygnb2sgdG8gY2hlY2sgaW4gY2xpY2snKTtcblx0XHR0aGlzLnByb3BzLmxvZ1Jvdy5pbkNoZWNrID0gdGhpcy5wcm9wcy5tYW5hZ2VyLm5hbWU7XG5cdFx0dGhpcy5wcm9wcy5jaGVja0luQXNzZW50KHRoaXMucHJvcHMubG9nUm93KTtcblx0fSxcblxuXHRoYW5kbGVDaGVja0luSWdub3JlOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMucHJvcHMuY2hlY2tJbklnbm9yZSh0aGlzLnByb3BzLmxvZ1Jvdyk7XG5cdH0sXG5cblx0aGFuZGxlQ2hlY2tPdXRJZ25vcmU6IGZ1bmN0aW9uKCl7XG5cblx0XHR0aGlzLnByb3BzLmxvZ1Jvdy5vdXRDaGVjayA9ICcnO1xuXG5cdFx0dGhpcy5wcm9wcy5jaGVja091dElnbm9yZSh0aGlzLnByb3BzLmxvZ1Jvdyk7XG5cdH0sXG5cblx0cGFkTGVmdDogZnVuY3Rpb24oc3RyLGxlbil7XG5cdFx0aWYoKCcnICsgc3RyKS5sZW5ndGggPj0gbGVuKXtcblx0XHRcdFx0cmV0dXJuIHN0cjtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhZExlZnQoICcwJyArIHN0ciwgbGVuKTtcblx0XHRcdH1cblx0fSxcbi8vXHRoYW5kbGVDaGVja0luSWdub3JlOiBmdW5jdGlvbigpe1xuLy9cdFx0Y29uc29sZS5sb2coJ2lnbm9yZSB0byBjaGVjayBpbiBjbGljaycpO1xuLy9cdFx0Ly90aGlzLnByb3BzLmxvZ1Jvdy5pbkNoZWNrID0gdGhpcy5wcm9wcy5tYW5hZ2VyLm5hbWU7XG4vL1x0XHQvL3RoaXMucHJvcHMuY2hlY2tJbkFzc2VudCh0aGlzLnByb3BzLmxvZ1Jvdyk7XG4vL1x0fSxcbi8vXG4vL1x0aGFuZGxlQ2hlY2tPdXRJZ25vcmU6IGZ1bmN0aW9uKCl7XG4vL1x0XHRjb25zb2xlLmxvZygnaWdub3JlIHRvIGNoZWNrIG91dCBjbGljaycpO1xuLy9cdFx0dGhpcy5wcm9wcy5sb2dSb3cub3V0Q2hlY2sgPSAnbm90WWV0Jztcbi8vXHRcdHRoaXMucHJvcHMuY2hlY2tPdXRBc3NlbnQodGhpcy5wcm9wcy5sb2dSb3cpO1xuLy9cdH0sXG5cbiAgbm9vcDogZnVuY3Rpb24oKXtcblxuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXA7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKlxuICovXG4vL1xudmFyIGN4ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0O1xuXG52YXIgTGlzdFRpdGxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTGlzdFRpdGxlJyxcblxuICAvKipcbiAgICogXG4gICAqL1xuXHRwcm9wVHlwZXM6IHtcblx0XHQvLyBjYWxsYmFja3NcbiAgICBzZWxlY3RSb29tSUQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHR9LFxuXHRcblx0LyoqXG4gICAqIFxuICAgKi9cblx0XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XG5cdFx0dmFyIHRpdGxlcyA9IHRoaXMucHJvcHMudGl0bGVzO1xuXHRcdC8vc3BsaXRUYWJsZVxuXHRcdHZhciBjbGFzc2VzID0gY3goe1xuICAgICAgICAnc3BsaXRUYWJsZSc6IHRoaXMucHJvcHMubGlzdFRpdGxlXG4gICAgfSk7XG5cdFx0XG5cdFx0dmFyIHRoZWFkID0gdGl0bGVzLm1hcChmdW5jdGlvbiAodGl0bGUpIHtcblx0XHRcdFxuXHRcdFx0Ly8g5rOo5oSP5q+P5YCLIGl0ZW0g6KaB5pyJ5LiA5YCL542o5LiA54Sh5LqM55qEIGtleSDlgLxcblx0XHRcdHJldHVybiBSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogY2xhc3Nlc30sIHRpdGxlKSlcblxuXHRcdH0sIHRoaXMpO1xuXHRcdFxuXHRcdFxuICAgIHJldHVybiAoXG5cdFx0XHRcdFJlYWN0LkRPTS50aGVhZChudWxsLCBcblx0XHRcdFx0XHR0aGVhZFxuXHRcdFx0XHQpXG5cdFx0KTtcbiAgfSxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgbm9vcDogZnVuY3Rpb24oKXtcblxuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RUaXRsZTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gQ29tcG9uZW50XG5cbnZhciBMb2dJbkZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdMb2dJbkZvcm0nLFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgLy8g6YCZ6KOP5YiX5Ye65q+P5YCLIHByb3Ag55qE5Z6L5Yil77yM5L2G5Y+q5pyD5ZyoIGRldiB0aW1lIOaqouafpVxuICAgcHJvcFR5cGVzOiB7XG5cdFx0XHQvLyBjYWxsYmFja3Ncblx0XHRcdC8vc2VsZWN0Um9vbUlEOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHRcdC8vbG9nb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHR9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHJlbmRlclxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGlzRmFpbCA9ICcnO1xuXHRcdFx0aWYodGhpcy5wcm9wcy5mYWlsKXtcblx0XHRcdFx0aXNGYWlsID0gJ2xvZ2luIGZhaWwgLi4uJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LkRPTS5kaXYobnVsbCwgXG5cdFx0XHRcdFJlYWN0LkRPTS5mb3JtKHtpZDogXCJsb2dpblwifSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImZvcm0tZ3JvdXBcIn0sIFxuXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXBcIn0sIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXAtYWRkb25cIn0sICdBY2NvdXRzJyApLCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmlucHV0KHtpZDogXCJ1c2VySWRcIiwgdHlwZTogXCJ0ZXh0XCIsIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgbmFtZTogXCJ1c2VySWRcIiwgcGxhY2Vob2xkZXI6IFwiVXNlciBJRFwifSlcblx0XHRcdFx0XHRcdCksIFxuXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXBcIn0sIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXAtYWRkb25cIn0sICdQYXNzd29yZCcgKSwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pbnB1dCh7aWQ6IFwicHdkXCIsIHR5cGU6IFwicGFzc3dvcmRcIiwgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBuYW1lOiBcInB3ZFwiLCBwbGFjZWhvbGRlcjogXCJQYXNzd29yZFwifSlcblx0XHRcdFx0XHRcdClcblxuXHRcdFx0XHRcdCksIFxuXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmJ1dHRvbih7dHlwZTogXCJzdWJtaXRcIiwgb25DbGljazogIHRoaXMubG9nSW5IYW5kbGVyLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCJ9LCBcIkxvZyBJblwiKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnAoe2NsYXNzTmFtZTogXCJ0ZXh0LWRhbmdlciBsb2dpbkZhaWxcIn0sIGlzRmFpbCApXG5cdFx0XHRcdCksIFxuXG5cblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7aWQ6IFwib3ZlclwiLCBvbkNsaWNrOiB0aGlzLnByb3BzLm91dH0pXG5cdFx0XHQpXG5cdFx0XHQpXG4gICAgfSxcblxuXHRcdGxvZ0luSGFuZGxlciA6IGZ1bmN0aW9uKCl7XG5cblx0XHRcdHZhciBkYXRhID0geyB1c2VySWQgOiAkKCcjdXNlcklkJykudmFsKCksIHB3ZCA6ICQoJyNwd2QnKS52YWwoKX07XG5cdFx0XHR0aGlzLnByb3BzLmxvZ2luUG9zdChkYXRhKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2dJbkZvcm07IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovdmFyIFNlY3JldCA9IFtcblx0e1xuXHRcdGNvbW0gOiAncGFuZGEnLFxuXHRcdHBvc2lfcHdkIDogJ+iojuirliAxMicsXG5cdFx0ZGF0YSA6IFtcblx0XHRcdHsgJ3Jvb20nIDogJzgwNicsIHNpZDogJzEwMTExMTIzMScsIG5hbWU6ICfpmbPmgJ3nkocnLCBwb3NpOiAn6KiO6KuWIDQnLCBpbkNoZWNrOiAnd2FpdGluZycsIG91dENoZWNrOiAnbm90WWV0JywgaW5UaW1lOiAnJywgb3V0VGltZTogJyAnIH0sXG5cdFx0XHR7ICdyb29tJyA6ICc4MDYnLCBzaWQ6ICcxMDExMTEyMjQnLCBuYW1lOiAn5rSq5LqO6ZuFJywgcG9zaTogJ+iojuirliAzJywgaW5DaGVjazogJ3dhaXRpbmcnLCBvdXRDaGVjazogJ25vdFlldCcsIGluVGltZTogJycsIG91dFRpbWU6ICcgJyB9LFxuXHRcdFx0eyAncm9vbScgOiAnODA2Jywgc2lkOiAnMTAxMTExMjE1JywgbmFtZTogJ+mbt+WwmuaouicsIHBvc2k6ICfoqI7oq5YgMicsIGluQ2hlY2s6ICd3YWl0aW5nJywgb3V0Q2hlY2s6ICdub3RZZXQnLCBpblRpbWU6ICcnLCBvdXRUaW1lOiAnICcgfSxcblx0XHRcdHsgJ3Jvb20nIDogJzgwNicsIHNpZDogJzEwMTExMTIxMicsIG5hbWU6ICfpmbPmn4/lroknLCBwb3NpOiAn6KiO6KuWIDEnLCBpbkNoZWNrOiAnd2FpdGluZycsIG91dENoZWNrOiAnbm90WWV0JywgaW5UaW1lOiAnJywgb3V0VGltZTogJyAnIH1cblx0XHRdXG5cdH0sXG5cdHtcblx0XHRjb21tIDogJ3NydCcsXG5cdFx0cG9zaV9wd2QgOiAn6KiO6KuWIDEyJyxcblx0XHRkYXRhIDogW1xuXHRcdFx0eyAncm9vbScgOiAnODAxJywgc2lkOiAnMTAxMTExMjI2JywgbmFtZTogJ+Wwi+aVrOaBhicsIHBvc2k6ICfoqI7oq5YgNCcsIGluQ2hlY2s6ICd3YWl0aW5nJywgb3V0Q2hlY2s6ICdub3RZZXQnLCBpblRpbWU6ICcnLCBvdXRUaW1lOiAnICcgfSxcblx0XHRcdHsgJ3Jvb20nIDogJzgwMScsIHNpZDogJzEwMTExMTIyMScsIG5hbWU6ICfpmbPms5Pku7InLCBwb3NpOiAn6KiO6KuWIDMnLCBpbkNoZWNrOiAnd2FpdGluZycsIG91dENoZWNrOiAnbm90WWV0JywgaW5UaW1lOiAnJywgb3V0VGltZTogJyAnIH0sXG5cdFx0XHR7ICdyb29tJyA6ICc4MDEnLCBzaWQ6ICcxMDExMTEyMDcnLCBuYW1lOiAn6JSh6YSt5qy9JywgcG9zaTogJ+iojuirliAyJywgaW5DaGVjazogJ3dhaXRpbmcnLCBvdXRDaGVjazogJ25vdFlldCcsIGluVGltZTogJycsIG91dFRpbWU6ICcgJyB9LFxuXHRcdFx0eyAncm9vbScgOiAnODAxJywgc2lkOiAnMTAxMTExMjAxJywgbmFtZTogJ+mQmOS9s+mZnicsIHBvc2k6ICfoqI7oq5YgMScsIGluQ2hlY2s6ICd3YWl0aW5nJywgb3V0Q2hlY2s6ICdub3RZZXQnLCBpblRpbWU6ICcnLCBvdXRUaW1lOiAnICcgfVxuXHRcdF1cblx0fVxuXTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlY3JldDsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcbiAqXG4gKi9cbi8vdmFyIGFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbkNyZWF0b3InKTtcbnZhciBjeCA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldDtcbi8vXG52YXIgY29tcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2NvbXAnLFxuXG4gIC8qKlxuICAgKiBcbiAgICovXG5cdHByb3BUeXBlczoge1xuXHRcdC8vQ3RybFxuXHRcdGN0cmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0Ly8gY2FsbGJhY2tzXG4gICAgc2VsZWN0Um9vbUlEOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0fSxcblx0XG5cdC8qKlxuICAgKiBcbiAgICovXG5cdFxuXHRcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcblx0XHRcblx0XHRcblx0XHRcblx0XHR2YXIgYXJyID0gb3B0aW9ucy5tYXAoZnVuY3Rpb24gKGxvZykge1xuXHRcdFx0cmV0dXJuIFJlYWN0LkRPTS5vcHRpb24obnVsbCwgIGxvZy5uYW1lKVxuXHRcdH0sIHRoaXMpO1xuXG5cdFx0XG4gICAgcmV0dXJuIChcblx0XHRcdFx0UmVhY3QuRE9NLnNlbGVjdCh7aWQ6IHRoaXMucHJvcHMubXlJRCwgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5wcm9wcy5jaGFuZ2VUb2RvfSwgXG5cdFx0XHRcdFx0YXJyXG5cdFx0XHRcdClcblx0XHQpO1xuICB9LFxuXHRcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgbm9vcDogZnVuY3Rpb24oKXtcblxuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXA7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKlxuICovXG52YXIgRm9vdGVyID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9Gb290ZXIuanN4JykgKTtcbnZhciBMaXN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9MaXN0L0xpc3RDb250YWluZXIuanN4JykgKTtcblxuXG52YXIgTWFpbkFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ01haW5BcHAnLFxuXG4gICAgbWl4aW5zOiBbXSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9LFxuXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ1xcdE1haW5BcHAgPiByZW5kZXInICk7XG5cbiAgICAgICAgcmV0dXJuIChcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJqdXN0LXdyYXBwZXJcIn0sIFxuXHRcdFx0XHRMaXN0Q29udGFpbmVyKG51bGwpLCBcbiAgICAgICAgICAgICAgICBGb290ZXIobnVsbClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgIH0sXG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYWluQXBwO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBQcm9taXNlID0gcmVxdWlyZShcIi4vcHJvbWlzZS9wcm9taXNlXCIpLlByb21pc2U7XG52YXIgcG9seWZpbGwgPSByZXF1aXJlKFwiLi9wcm9taXNlL3BvbHlmaWxsXCIpLnBvbHlmaWxsO1xuZXhwb3J0cy5Qcm9taXNlID0gUHJvbWlzZTtcbmV4cG9ydHMucG9seWZpbGwgPSBwb2x5ZmlsbDsiLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCB0b1N0cmluZyAqL1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzQXJyYXk7XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzRnVuY3Rpb247XG5cbi8qKlxuICBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCB0aGUgZ2l2ZW4gcHJvbWlzZXMgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLiBUaGUgcmV0dXJuIHByb21pc2VcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgdGhhdCBnaXZlcyBhbGwgdGhlIHZhbHVlcyBpbiB0aGUgb3JkZXIgdGhleSB3ZXJlXG4gIHBhc3NlZCBpbiB0aGUgYHByb21pc2VzYCBhcnJheSBhcmd1bWVudC5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UxID0gUlNWUC5yZXNvbHZlKDEpO1xuICB2YXIgcHJvbWlzZTIgPSBSU1ZQLnJlc29sdmUoMik7XG4gIHZhciBwcm9taXNlMyA9IFJTVlAucmVzb2x2ZSgzKTtcbiAgdmFyIHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUlNWUC5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIFRoZSBhcnJheSBoZXJlIHdvdWxkIGJlIFsgMSwgMiwgMyBdO1xuICB9KTtcbiAgYGBgXG5cbiAgSWYgYW55IG9mIHRoZSBgcHJvbWlzZXNgIGdpdmVuIHRvIGBSU1ZQLmFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZTEgPSBSU1ZQLnJlc29sdmUoMSk7XG4gIHZhciBwcm9taXNlMiA9IFJTVlAucmVqZWN0KG5ldyBFcnJvcihcIjJcIikpO1xuICB2YXIgcHJvbWlzZTMgPSBSU1ZQLnJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgdmFyIHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUlNWUC5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAZm9yIFJTVlBcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgYHByb21pc2VzYCBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4qL1xuZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBQcm9taXNlID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkocHJvbWlzZXMpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byBhbGwuJyk7XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXSwgcmVtYWluaW5nID0gcHJvbWlzZXMubGVuZ3RoLFxuICAgIHByb21pc2U7XG5cbiAgICBpZiAocmVtYWluaW5nID09PSAwKSB7XG4gICAgICByZXNvbHZlKFtdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlcihpbmRleCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJlc29sdmVBbGwoaW5kZXgsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZUFsbChpbmRleCwgdmFsdWUpIHtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gdmFsdWU7XG4gICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb21pc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZXNbaV07XG5cbiAgICAgIGlmIChwcm9taXNlICYmIGlzRnVuY3Rpb24ocHJvbWlzZS50aGVuKSkge1xuICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZXIoaSksIHJlamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlQWxsKGksIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydHMuYWxsID0gYWxsOyIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgYnJvd3Nlckdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgbG9jYWwgPSAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpID8gZ2xvYmFsIDogKHRoaXMgPT09IHVuZGVmaW5lZD8gd2luZG93OnRoaXMpO1xuXG4vLyBub2RlXG5mdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsLnNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBbXTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHR1cGxlID0gcXVldWVbaV07XG4gICAgdmFyIGNhbGxiYWNrID0gdHVwbGVbMF0sIGFyZyA9IHR1cGxlWzFdO1xuICAgIGNhbGxiYWNrKGFyZyk7XG4gIH1cbiAgcXVldWUgPSBbXTtcbn1cblxudmFyIHNjaGVkdWxlRmx1c2g7XG5cbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICB2YXIgbGVuZ3RoID0gcXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ10pO1xuICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgLy8gSWYgbGVuZ3RoIGlzIDEsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgfVxufVxuXG5leHBvcnRzLmFzYXAgPSBhc2FwO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gIGBSU1ZQLlByb21pc2UuY2FzdGAgcmV0dXJucyB0aGUgc2FtZSBwcm9taXNlIGlmIHRoYXQgcHJvbWlzZSBzaGFyZXMgYSBjb25zdHJ1Y3RvclxuICB3aXRoIHRoZSBwcm9taXNlIGJlaW5nIGNhc3RlZC5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UgPSBSU1ZQLnJlc29sdmUoMSk7XG4gIHZhciBjYXN0ZWQgPSBSU1ZQLlByb21pc2UuY2FzdChwcm9taXNlKTtcblxuICBjb25zb2xlLmxvZyhwcm9taXNlID09PSBjYXN0ZWQpOyAvLyB0cnVlXG4gIGBgYFxuXG4gIEluIHRoZSBjYXNlIG9mIGEgcHJvbWlzZSB3aG9zZSBjb25zdHJ1Y3RvciBkb2VzIG5vdCBtYXRjaCwgaXQgaXMgYXNzaW1pbGF0ZWQuXG4gIFRoZSByZXN1bHRpbmcgcHJvbWlzZSB3aWxsIGZ1bGZpbGwgb3IgcmVqZWN0IGJhc2VkIG9uIHRoZSBvdXRjb21lIG9mIHRoZVxuICBwcm9taXNlIGJlaW5nIGNhc3RlZC5cblxuICBJbiB0aGUgY2FzZSBvZiBhIG5vbi1wcm9taXNlLCBhIHByb21pc2Ugd2hpY2ggd2lsbCBmdWxmaWxsIHdpdGggdGhhdCB2YWx1ZSBpc1xuICByZXR1cm5lZC5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHZhbHVlID0gMTsgLy8gY291bGQgYmUgYSBudW1iZXIsIGJvb2xlYW4sIHN0cmluZywgdW5kZWZpbmVkLi4uXG4gIHZhciBjYXN0ZWQgPSBSU1ZQLlByb21pc2UuY2FzdCh2YWx1ZSk7XG5cbiAgY29uc29sZS5sb2codmFsdWUgPT09IGNhc3RlZCk7IC8vIGZhbHNlXG4gIGNvbnNvbGUubG9nKGNhc3RlZCBpbnN0YW5jZW9mIFJTVlAuUHJvbWlzZSkgLy8gdHJ1ZVxuXG4gIGNhc3RlZC50aGVuKGZ1bmN0aW9uKHZhbCkge1xuICAgIHZhbCA9PT0gdmFsdWUgLy8gPT4gdHJ1ZVxuICB9KTtcbiAgYGBgXG5cbiAgYFJTVlAuUHJvbWlzZS5jYXN0YCBpcyBzaW1pbGFyIHRvIGBSU1ZQLnJlc29sdmVgLCBidXQgYFJTVlAuUHJvbWlzZS5jYXN0YCBkaWZmZXJzIGluIHRoZVxuICBmb2xsb3dpbmcgd2F5czpcbiAgKiBgUlNWUC5Qcm9taXNlLmNhc3RgIHNlcnZlcyBhcyBhIG1lbW9yeS1lZmZpY2llbnQgd2F5IG9mIGdldHRpbmcgYSBwcm9taXNlLCB3aGVuIHlvdVxuICBoYXZlIHNvbWV0aGluZyB0aGF0IGNvdWxkIGVpdGhlciBiZSBhIHByb21pc2Ugb3IgYSB2YWx1ZS4gUlNWUC5yZXNvbHZlXG4gIHdpbGwgaGF2ZSB0aGUgc2FtZSBlZmZlY3QgYnV0IHdpbGwgY3JlYXRlIGEgbmV3IHByb21pc2Ugd3JhcHBlciBpZiB0aGVcbiAgYXJndW1lbnQgaXMgYSBwcm9taXNlLlxuICAqIGBSU1ZQLlByb21pc2UuY2FzdGAgaXMgYSB3YXkgb2YgY2FzdGluZyBpbmNvbWluZyB0aGVuYWJsZXMgb3IgcHJvbWlzZSBzdWJjbGFzc2VzIHRvXG4gIHByb21pc2VzIG9mIHRoZSBleGFjdCBjbGFzcyBzcGVjaWZpZWQsIHNvIHRoYXQgdGhlIHJlc3VsdGluZyBvYmplY3QncyBgdGhlbmAgaXNcbiAgZW5zdXJlZCB0byBoYXZlIHRoZSBiZWhhdmlvciBvZiB0aGUgY29uc3RydWN0b3IgeW91IGFyZSBjYWxsaW5nIGNhc3Qgb24gKGkuZS4sIFJTVlAuUHJvbWlzZSkuXG5cbiAgQG1ldGhvZCBjYXN0XG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IHRvIGJlIGNhc3RlZFxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIHByb3BlcnRpZXMgb2YgYHByb21pc2VzYFxuICBoYXZlIGJlZW4gZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4qL1xuXG5cbmZ1bmN0aW9uIGNhc3Qob2JqZWN0KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSB0aGlzKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHZhciBQcm9taXNlID0gdGhpcztcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgIHJlc29sdmUob2JqZWN0KTtcbiAgfSk7XG59XG5cbmV4cG9ydHMuY2FzdCA9IGNhc3Q7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29uZmlnID0ge1xuICBpbnN0cnVtZW50OiBmYWxzZVxufTtcblxuZnVuY3Rpb24gY29uZmlndXJlKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgY29uZmlnW25hbWVdID0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvbmZpZ1tuYW1lXTtcbiAgfVxufVxuXG5leHBvcnRzLmNvbmZpZyA9IGNvbmZpZztcbmV4cG9ydHMuY29uZmlndXJlID0gY29uZmlndXJlOyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuLypnbG9iYWwgc2VsZiovXG52YXIgUlNWUFByb21pc2UgPSByZXF1aXJlKFwiLi9wcm9taXNlXCIpLlByb21pc2U7XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICB2YXIgbG9jYWw7XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbG9jYWwgPSBnbG9iYWw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50KSB7XG4gICAgbG9jYWwgPSB3aW5kb3c7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWwgPSBzZWxmO1xuICB9XG5cbiAgdmFyIGVzNlByb21pc2VTdXBwb3J0ID0gXG4gICAgXCJQcm9taXNlXCIgaW4gbG9jYWwgJiZcbiAgICAvLyBTb21lIG9mIHRoZXNlIG1ldGhvZHMgYXJlIG1pc3NpbmcgZnJvbVxuICAgIC8vIEZpcmVmb3gvQ2hyb21lIGV4cGVyaW1lbnRhbCBpbXBsZW1lbnRhdGlvbnNcbiAgICBcImNhc3RcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgXCJyZXNvbHZlXCIgaW4gbG9jYWwuUHJvbWlzZSAmJlxuICAgIFwicmVqZWN0XCIgaW4gbG9jYWwuUHJvbWlzZSAmJlxuICAgIFwiYWxsXCIgaW4gbG9jYWwuUHJvbWlzZSAmJlxuICAgIFwicmFjZVwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICAvLyBPbGRlciB2ZXJzaW9uIG9mIHRoZSBzcGVjIGhhZCBhIHJlc29sdmVyIG9iamVjdFxuICAgIC8vIGFzIHRoZSBhcmcgcmF0aGVyIHRoYW4gYSBmdW5jdGlvblxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXNvbHZlO1xuICAgICAgbmV3IGxvY2FsLlByb21pc2UoZnVuY3Rpb24ocikgeyByZXNvbHZlID0gcjsgfSk7XG4gICAgICByZXR1cm4gaXNGdW5jdGlvbihyZXNvbHZlKTtcbiAgICB9KCkpO1xuXG4gIGlmICghZXM2UHJvbWlzZVN1cHBvcnQpIHtcbiAgICBsb2NhbC5Qcm9taXNlID0gUlNWUFByb21pc2U7XG4gIH1cbn1cblxuZXhwb3J0cy5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWdcIikuY29uZmlnO1xudmFyIGNvbmZpZ3VyZSA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKS5jb25maWd1cmU7XG52YXIgb2JqZWN0T3JGdW5jdGlvbiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLm9iamVjdE9yRnVuY3Rpb247XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzRnVuY3Rpb247XG52YXIgbm93ID0gcmVxdWlyZShcIi4vdXRpbHNcIikubm93O1xudmFyIGNhc3QgPSByZXF1aXJlKFwiLi9jYXN0XCIpLmNhc3Q7XG52YXIgYWxsID0gcmVxdWlyZShcIi4vYWxsXCIpLmFsbDtcbnZhciByYWNlID0gcmVxdWlyZShcIi4vcmFjZVwiKS5yYWNlO1xudmFyIHN0YXRpY1Jlc29sdmUgPSByZXF1aXJlKFwiLi9yZXNvbHZlXCIpLnJlc29sdmU7XG52YXIgc3RhdGljUmVqZWN0ID0gcmVxdWlyZShcIi4vcmVqZWN0XCIpLnJlamVjdDtcbnZhciBhc2FwID0gcmVxdWlyZShcIi4vYXNhcFwiKS5hc2FwO1xuXG52YXIgY291bnRlciA9IDA7XG5cbmNvbmZpZy5hc3luYyA9IGFzYXA7IC8vIGRlZmF1bHQgYXN5bmMgaXMgYXNhcDtcblxuZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICBpZiAoIWlzRnVuY3Rpb24ocmVzb2x2ZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbiAgfVxuXG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaW52b2tlUmVzb2x2ZXIocmVzb2x2ZXIsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBpbnZva2VSZXNvbHZlcihyZXNvbHZlciwgcHJvbWlzZSkge1xuICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIocmVzb2x2ZVByb21pc2UsIHJlamVjdFByb21pc2UpO1xuICB9IGNhdGNoKGUpIHtcbiAgICByZWplY3RQcm9taXNlKGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSwgZXJyb3IsIHN1Y2NlZWRlZCwgZmFpbGVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChoYW5kbGVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgIHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxudmFyIFBFTkRJTkcgICA9IHZvaWQgMDtcbnZhciBTRUFMRUQgICAgPSAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgID0gMjtcblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICBzdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UsIHNldHRsZWQpIHtcbiAgdmFyIGNoaWxkLCBjYWxsYmFjaywgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycywgZGV0YWlsID0gcHJvbWlzZS5fZGV0YWlsO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBudWxsO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFByb21pc2UsXG5cbiAgX3N0YXRlOiB1bmRlZmluZWQsXG4gIF9kZXRhaWw6IHVuZGVmaW5lZCxcbiAgX3N1YnNjcmliZXJzOiB1bmRlZmluZWQsXG5cbiAgdGhlbjogZnVuY3Rpb24ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG5cbiAgICB2YXIgdGhlblByb21pc2UgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihmdW5jdGlvbigpIHt9KTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSkge1xuICAgICAgdmFyIGNhbGxiYWNrcyA9IGFyZ3VtZW50cztcbiAgICAgIGNvbmZpZy5hc3luYyhmdW5jdGlvbiBpbnZva2VQcm9taXNlQ2FsbGJhY2soKSB7XG4gICAgICAgIGludm9rZUNhbGxiYWNrKHByb21pc2UuX3N0YXRlLCB0aGVuUHJvbWlzZSwgY2FsbGJhY2tzW3Byb21pc2UuX3N0YXRlIC0gMV0sIHByb21pc2UuX2RldGFpbCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3Vic2NyaWJlKHRoaXMsIHRoZW5Qcm9taXNlLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoZW5Qcm9taXNlO1xuICB9LFxuXG4gICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gIH1cbn07XG5cblByb21pc2UuYWxsID0gYWxsO1xuUHJvbWlzZS5jYXN0ID0gY2FzdDtcblByb21pc2UucmFjZSA9IHJhY2U7XG5Qcm9taXNlLnJlc29sdmUgPSBzdGF0aWNSZXNvbHZlO1xuUHJvbWlzZS5yZWplY3QgPSBzdGF0aWNSZWplY3Q7XG5cbmZ1bmN0aW9uIGhhbmRsZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlKSB7XG4gIHZhciB0aGVuID0gbnVsbCxcbiAgcmVzb2x2ZWQ7XG5cbiAgdHJ5IHtcbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuXCIpO1xuICAgIH1cblxuICAgIGlmIChvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdGhlbiA9IHZhbHVlLnRoZW47XG5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKHRoZW4pKSB7XG4gICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgaWYgKHJlc29sdmVkKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHZhbHVlICE9PSB2YWwpIHtcbiAgICAgICAgICAgIHJlc29sdmUocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgaWYgKHJlc29sdmVkKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgcmVqZWN0KHByb21pc2UsIHZhbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuIHRydWU7IH1cbiAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKCFoYW5kbGVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSkpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykgeyByZXR1cm47IH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBTRUFMRUQ7XG4gIHByb21pc2UuX2RldGFpbCA9IHZhbHVlO1xuXG4gIGNvbmZpZy5hc3luYyhwdWJsaXNoRnVsZmlsbG1lbnQsIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiByZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykgeyByZXR1cm47IH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBTRUFMRUQ7XG4gIHByb21pc2UuX2RldGFpbCA9IHJlYXNvbjtcblxuICBjb25maWcuYXN5bmMocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hGdWxmaWxsbWVudChwcm9taXNlKSB7XG4gIHB1Ymxpc2gocHJvbWlzZSwgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQpO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgcHVibGlzaChwcm9taXNlLCBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEKTtcbn1cblxuZXhwb3J0cy5Qcm9taXNlID0gUHJvbWlzZTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCB0b1N0cmluZyAqL1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKFwiLi91dGlsc1wiKS5pc0FycmF5O1xuXG4vKipcbiAgYFJTVlAucmFjZWAgYWxsb3dzIHlvdSB0byB3YXRjaCBhIHNlcmllcyBvZiBwcm9taXNlcyBhbmQgYWN0IGFzIHNvb24gYXMgdGhlXG4gIGZpcnN0IHByb21pc2UgZ2l2ZW4gdG8gdGhlIGBwcm9taXNlc2AgYXJndW1lbnQgZnVsZmlsbHMgb3IgcmVqZWN0cy5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UxID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoXCJwcm9taXNlIDFcIik7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2UyID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoXCJwcm9taXNlIDJcIik7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUlNWUC5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSBcInByb21pc2UgMlwiIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBSU1ZQLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3QgY29tcGxldGVkXG4gIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlIGBwcm9taXNlc2BcbiAgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IGNvbXBsZXRlZCBwcm9taXNlIGhhcyBiZWNvbWVcbiAgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWQgcHJvbWlzZVxuICB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlMSA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKFwicHJvbWlzZSAxXCIpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlMiA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKFwicHJvbWlzZSAyXCIpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBSU1ZQLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gXCJwcm9taXNlMlwiIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGRlc2NyaWJpbmcgdGhlIHByb21pc2UgcmV0dXJuZWQuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgYmVjb21lcyBmdWxmaWxsZWQgd2l0aCB0aGUgdmFsdWUgdGhlIGZpcnN0XG4gIGNvbXBsZXRlZCBwcm9taXNlcyBpcyByZXNvbHZlZCB3aXRoIGlmIHRoZSBmaXJzdCBjb21wbGV0ZWQgcHJvbWlzZSB3YXNcbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gdGhhdCB0aGUgZmlyc3QgY29tcGxldGVkIHByb21pc2VcbiAgd2FzIHJlamVjdGVkIHdpdGguXG4qL1xuZnVuY3Rpb24gcmFjZShwcm9taXNlcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KHByb21pc2VzKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKTtcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXSwgcHJvbWlzZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlc1tpXTtcblxuICAgICAgaWYgKHByb21pc2UgJiYgdHlwZW9mIHByb21pc2UudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUocHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0cy5yYWNlID0gcmFjZTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICBgUlNWUC5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVqZWN0ZWQgd2l0aCB0aGUgcGFzc2VkXG4gIGByZWFzb25gLiBgUlNWUC5yZWplY3RgIGlzIGVzc2VudGlhbGx5IHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlID0gUlNWUC5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge0FueX0gcmVhc29uIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoLlxuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBpZGVudGlmeWluZyB0aGUgcmV0dXJuZWQgcHJvbWlzZS5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZWplY3RlZCB3aXRoIHRoZSBnaXZlblxuICBgcmVhc29uYC5cbiovXG5mdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBQcm9taXNlID0gdGhpcztcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcbn1cblxuZXhwb3J0cy5yZWplY3QgPSByZWplY3Q7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAgYFJTVlAucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSBmdWxmaWxsZWQgd2l0aCB0aGUgcGFzc2VkXG4gIGB2YWx1ZWAuIGBSU1ZQLnJlc29sdmVgIGlzIGVzc2VudGlhbGx5IHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlID0gUlNWUC5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAZm9yIFJTVlBcbiAgQHBhcmFtIHtBbnl9IHZhbHVlIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGlkZW50aWZ5aW5nIHRoZSByZXR1cm5lZCBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZSh2YWx1ZSkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSk7XG59XG5cbmV4cG9ydHMucmVzb2x2ZSA9IHJlc29sdmU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGlzRnVuY3Rpb24oeCkgfHwgKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIHggIT09IG51bGwpO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkoeCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG59XG5cbi8vIERhdGUubm93IGlzIG5vdCBhdmFpbGFibGUgaW4gYnJvd3NlcnMgPCBJRTlcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0RhdGUvbm93I0NvbXBhdGliaWxpdHlcbnZhciBub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuXG5cbmV4cG9ydHMub2JqZWN0T3JGdW5jdGlvbiA9IG9iamVjdE9yRnVuY3Rpb247XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmV4cG9ydHMubm93ID0gbm93OyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMuRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vbGliL0Rpc3BhdGNoZXInKVxuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBEaXNwYXRjaGVyXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnLi9pbnZhcmlhbnQnKTtcblxudmFyIF9sYXN0SUQgPSAxO1xudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NpdHktdXBkYXRlJykge1xuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBwYXlsb2FkLnNlbGVjdGVkQ2l0eTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIGNvdW50cnksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NvdW50cnktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENvdW50cnk6ICdhdXN0cmFsaWEnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBib3RoIHN0b3JlczpcbiAqXG4gKiAgICBDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIENvdW50cnlTdG9yZS5jb3VudHJ5ID0gcGF5bG9hZC5zZWxlY3RlZENvdW50cnk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSBjYWxsYmFjayB0byB1cGRhdGUgYENvdW50cnlTdG9yZWAgaXMgcmVnaXN0ZXJlZCwgd2Ugc2F2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhlIHJldHVybmVkIHRva2VuLiBVc2luZyB0aGlzIHRva2VuIHdpdGggYHdhaXRGb3IoKWAsIHdlIGNhbiBndWFyYW50ZWVcbiAqIHRoYXQgYENvdW50cnlTdG9yZWAgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrIHRoYXQgdXBkYXRlcyBgQ2l0eVN0b3JlYFxuICogbmVlZHMgdG8gcXVlcnkgaXRzIGRhdGEuXG4gKlxuICogICBDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgbWF5IG5vdCBiZSB1cGRhdGVkLlxuICogICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBpcyBub3cgZ3VhcmFudGVlZCB0byBiZSB1cGRhdGVkLlxuICpcbiAqICAgICAgIC8vIFNlbGVjdCB0aGUgZGVmYXVsdCBjaXR5IGZvciB0aGUgbmV3IGNvdW50cnlcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gZ2V0RGVmYXVsdENpdHlGb3JDb3VudHJ5KENvdW50cnlTdG9yZS5jb3VudHJ5KTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSB1c2FnZSBvZiBgd2FpdEZvcigpYCBjYW4gYmUgY2hhaW5lZCwgZm9yIGV4YW1wbGU6XG4gKlxuICogICBGbGlnaHRQcmljZVN0b3JlLmRpc3BhdGNoVG9rZW4gPVxuICogICAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvblR5cGUpIHtcbiAqICAgICAgICAgY2FzZSAnY291bnRyeS11cGRhdGUnOlxuICogICAgICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIGdldEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqXG4gKiAgICAgICAgIGNhc2UgJ2NpdHktdXBkYXRlJzpcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBgY291bnRyeS11cGRhdGVgIHBheWxvYWQgd2lsbCBiZSBndWFyYW50ZWVkIHRvIGludm9rZSB0aGUgc3RvcmVzJ1xuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MgaW4gb3JkZXI6IGBDb3VudHJ5U3RvcmVgLCBgQ2l0eVN0b3JlYCwgdGhlblxuICogYEZsaWdodFByaWNlU3RvcmVgLlxuICovXG5cbiAgZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWQgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdpdGggZXZlcnkgZGlzcGF0Y2hlZCBwYXlsb2FkLiBSZXR1cm5zXG4gICAqIGEgdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGB3YWl0Rm9yKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3Rlcj1mdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBpZCA9IF9wcmVmaXggKyBfbGFzdElEKys7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgYmFzZWQgb24gaXRzIHRva2VuLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnVucmVnaXN0ZXI9ZnVuY3Rpb24oaWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAnRGlzcGF0Y2hlci51bnJlZ2lzdGVyKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgaWRcbiAgICApO1xuICAgIGRlbGV0ZSB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF07XG4gIH07XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgY2FsbGJhY2tzIHNwZWNpZmllZCB0byBiZSBpbnZva2VkIGJlZm9yZSBjb250aW51aW5nIGV4ZWN1dGlvblxuICAgKiBvZiB0aGUgY3VycmVudCBjYWxsYmFjay4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSBhIGNhbGxiYWNrIGluXG4gICAqIHJlc3BvbnNlIHRvIGEgZGlzcGF0Y2hlZCBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5PHN0cmluZz59IGlkc1xuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUud2FpdEZvcj1mdW5jdGlvbihpZHMpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nXG4gICAgKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaWRzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIGlkID0gaWRzW2lpXTtcbiAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSxcbiAgICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgJyArXG4gICAgICAgICAgJ3dhaXRpbmcgZm9yIGAlc2AuJyxcbiAgICAgICAgICBpZFxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGludmFyaWFudChcbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgICBpZFxuICAgICAgKTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIHBheWxvYWQgdG8gYWxsIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2g9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGludmFyaWFudChcbiAgICAgICF0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2guZGlzcGF0Y2goLi4uKTogQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nXG4gICAgKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZCk7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmcoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoaXMgRGlzcGF0Y2hlciBjdXJyZW50bHkgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5pc0Rpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGwgdGhlIGNhbGxiYWNrIHN0b3JlZCB3aXRoIHRoZSBnaXZlbiBpZC4gQWxzbyBkbyBzb21lIGludGVybmFsXG4gICAqIGJvb2trZWVwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjaz1mdW5jdGlvbihpZCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IHRydWU7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdKHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQpO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB1cCBib29ra2VlcGluZyBuZWVkZWQgd2hlbiBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gZmFsc2U7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXIgYm9va2tlZXBpbmcgdXNlZCBmb3IgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGF0Y2hlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKGZhbHNlKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUb09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgcGVuZGluZ0V4Y2VwdGlvbjtcblx0dmFyIGZyb207XG5cdHZhciBrZXlzO1xuXHR2YXIgdG8gPSBUb09iamVjdCh0YXJnZXQpO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoT2JqZWN0KGZyb20pKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdGlmIChwZW5kaW5nRXhjZXB0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRwZW5kaW5nRXhjZXB0aW9uID0gZXJyO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKHBlbmRpbmdFeGNlcHRpb24pIHtcblx0XHR0aHJvdyBwZW5kaW5nRXhjZXB0aW9uO1xuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZXYUFTSFwiKSkiLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGtleU1pcnJvclxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoXCIuL2ludmFyaWFudFwiKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgIG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopLFxuICAgICdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJ1xuICApIDogaW52YXJpYW50KG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRldhQVNIXCIpKSJdfQ==
