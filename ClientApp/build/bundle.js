(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

// Constructs an enumeration with keys equal to their value.
// 也就是讓 hash 的 key 與 value 值一樣
// 不然原本 value 都是 null
// 不過既然如此，為何不乾脆用 set 之類只有key 的就好
module.exports = keyMirror({

	SOURCE_VIEW_ACTION: null,
	SOURCE_SERVER_ACTION: null,
	SOURCE_ROUTER_ACTION: null,

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

			renewRoomInfo( action.item );

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

			renewRoomInfo( action.item );

            //console.log( 'Store 更新: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

		/**
         *
         */
		case AppConstants.TODO_SELECT:

            //console.log( 'Store 選取: ', action.roomID );

            // 選取同樣的 item 就不用處理下去了
            if( selectedRoomID != action.roomID ){
                selectedRoomID = action.roomID;

        		// if(selectedRoomID != 'all'){
        		// 	selectedRoomIDinput = action.inputID;
        		// }

            //
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

                    if( roomInfo[i].posi[j].name == data[row].posi ){
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

  /**
   * @return {object}
   */
  render: function() {

  	return (
      React.DOM.footer({className: "footer"}, 
        React.DOM.span({className: "author"}, 
            "Author | Andrew Chen  ", '( May / 2015 )'
			
        )
      )
    );
  },


});

module.exports = Footer;

},{"../actions/AppActionCreator":1}],8:[function(require,module,exports){
/** @jsx React.DOM *//**
 *
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
			checkOutAssent:  this.props.checkOutAssent}
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
						listTitle: true}
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
/** @jsx React.DOM *//**
 * 這是 root view，也稱為 controller-view
 */


//========================================================================
//
// import

// var React = require('react');
//var InputBox = React.createFactory( require('./InputBox.jsx') );
var List = React.createFactory( require('./List.jsx') );
var ListHeader = React.createFactory( require('./ListHeader.jsx') );
var Selector = React.createFactory( require('./Selector.jsx') );
var LogInForm = React.createFactory( require('./LogInForm.jsx') );

var LogStore = require('../../stores/LogStore');
var AppConstants = require('../../constants/AppConstants');

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

//			var socket = io.connect('http://localhost:8080');
//			socket.on('newLog', function (data) {
//				console.log(data);
//				socket.emit('my other event', { my: 'data' });
//			});

    		return this.getTruth();
        },

    /**
     * 主程式進入點
     */
    componentWillMount: function() {
        LogStore.addListener( AppConstants.CHANGE_EVENT, this._onChange );
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
                        checkInAssent:  actions.checkIn, 
                        changeInputID:  actions.changeInputID, 
                        checkInIgnore:  actions.checkInIgnore, 
                        checkOutAssent:  actions.checkOut}
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
						React.DOM.a({href: "#", onClick: this.props.logout}, React.DOM.i({className: "fa fa-sign-out"}))
					)
				);

			}else{

				show.str = '... Your are a manager ? ';
				show.name = 'logIn';

				return (
					React.DOM.h5({className: "lead"}, 
						 show.str, 
						React.DOM.a({href: "#", onClick: this.props.login}, 
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


/**
 *
 */

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
    return {time: now };
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000 * 30); // Call a method on the mixin
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
					React.DOM.td(null, Selector({
							myID: "inputID", 
							className: "input", 
							options: roomInfo, 
							changeTodo:  this.handleIDchange}
						)), 
					React.DOM.td(null, React.DOM.input({id: "inputSid", type: "text", className: "form-control", name: "sid"})), 
					React.DOM.td(null, React.DOM.input({id: "inputName", type: "text", className: "form-control", name: "name"})), 
					React.DOM.td(null, Selector({myID: "inputPosi", className: "input", options: posiOptions})), 
					React.DOM.td({colSpan: "2"}, 
						React.DOM.input({	id: "inputInTime", 
								type: "datetime-local", 	className: "form-control", 
								name: "time", readOnly: "true", 
								value: this.state.time}
						)), 
					React.DOM.td(null
					), 
					React.DOM.td(null, 
						React.DOM.button({
							className: "btn btn-primary", 
							type: "submit", 
							onClick:  this.handleAsk}, 
  						React.DOM.i({className: "fa fa-user-plus -o fa-lg"}), 
							' Join'
						)
					)
			)
    );
//						<a className="btn btn-warning" href="#">
//  						<i className="fa fa-repeat -o fa-lg"></i>
//							{' Reset'}
//						</a>
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
							React.DOM.a({className: "btn btn-success btn-xs", href: "#", onClick: this.handleCheckInAssent}, 
								React.DOM.i({className: "fa fa-check"}), 
								' Assent'
							), 
							'  ', 
							React.DOM.a({className: "btn btn-danger btn-xs", href: "#", onClick: this.handleCheckInIgnore}, 
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
						React.DOM.a({className: "btn btn-warning btn-xs disabled", href: "#"}, 
  						React.DOM.i({className: "fa fa-sign-out"}), 
							' Check-out'
						));

			}else if(ck == 'notYet' || ck == '' ){
				//can ask for check out
				return (
						React.DOM.a({className: "btn btn-warning btn-xs", href: "#", onClick: this.handleCheckOut}, 
  						React.DOM.i({className: "fa fa-sign-out"}), 
							' Check-out'
						));

			}else if(ck == 'waiting'){
				//waiting for checkout submit
				if(manager.isManager){
					return (
						React.DOM.div(null, 
							React.DOM.a({className: "btn btn-success btn-xs", href: "#", onClick: this.handleCheckOutAssent}, 
								React.DOM.i({className: "fa fa-check"}), 
								' Yes'
							), 
							'  ', 
							React.DOM.a({className: "btn btn-danger btn-xs", href: "#"}, 
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
		comm : 'Panda',
		posi_pwd : '討論 12',
		data : [
			{ 'room' : '806', sid: '101111231', name: '陳思璇', posi: '討論 4', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '806', sid: '101111224', name: '洪于雅', posi: '討論 3', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '806', sid: '101111215', name: '雷尚樺', posi: '討論 2', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' },
			{ 'room' : '806', sid: '101111212', name: '陳柏安', posi: '討論 1', inCheck: 'waiting', outCheck: 'notYet', inTime: '', outTime: ' ' }
		]
	},
	{
		comm : 'Srt',
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
 * 這是 root view，也稱為 controller-view
 */



//========================================================================
//
// import

// var React = require('react');
var Footer = React.createFactory( require('./Footer.jsx') );
var ListContainer = React.createFactory( require('./List/ListContainer.jsx') );

//========================================================================
//
// Component

var MainApp = React.createClass({displayName: 'MainApp',

    //========================================================================
    mixins: [],

    getDefaultProps: function() {
        return {
            // foo: '__foo__',
            // bar: '__bar__'
        };
    },

    //========================================================================

	/**
     * 主程式進入點
     */
    componentWillMount: function() {
        //TodoStore.addListener( AppConstants.CHANGE_EVENT, this._onChange );
    },

    // 重要：root view 建立後第一件事，就是偵聽 store 的 change 事件
    componentDidMount: function() {
        //
    },

    //========================================================================
    //
    // unmount

    componentWillUnmount: function() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvci5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL2Jvb3QuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL2FwcC9qcy9jb25zdGFudHMvQXBwQ29uc3RhbnRzLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvc3RvcmVzL0xvZ1N0b3JlLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvc3RvcmVzL1Jvb21JbmZvLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvRm9vdGVyLmpzeCIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdC5qc3giLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL2FwcC9qcy92aWV3cy9MaXN0L0xpc3RDb250YWluZXIuanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9MaXN0SGVhZGVyLmpzeCIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdElucHV0LmpzeCIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdEl0ZW0uanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9MaXN0VGl0bGUuanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9Mb2dJbkZvcm0uanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9TZWNyZXRDb21tLmpzeCIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvU2VsZWN0b3IuanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTWFpbkFwcC5qc3giLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9tYWluLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2FsbC5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9hc2FwLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2Nhc3QuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvY29uZmlnLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3BvbHlmaWxsLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3Byb21pc2UuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcmFjZS5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9yZWplY3QuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcmVzb2x2ZS5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS91dGlscy5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2ZsdXgvaW5kZXguanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9mbHV4L2xpYi9EaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9pbnZhcmlhbnQuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9yZWFjdC9saWIva2V5TWlycm9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKlxuICovXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnZXM2LXByb21pc2UnKS5Qcm9taXNlO1xuXG52YXIgSVBhZGRyZXNzID0gJ2xvY2FsaG9zdDo4MDgwJztcbi8vdmFyIElQYWRkcmVzcyA9ICcxOTIuMTY4LjIuMjQ6ODA4MCc7XG5cbi8vIOWwseaYr+WAi+WWrue0lOeahCBoYXNoIHRhYmxlXG4vLyDlm6DmraTkuIvpnaLmiYDmnInmjIfku6Tnmoblj6/oppbngrogQWN0aW9uIHN0YXRpYyBtZXRob2RcbnZhciBBcHBBY3Rpb25DcmVhdG9ycyA9IHtcblxuICAgIC8qKlxuICAgICAqIGFwcCBpbml0LCBmaXJzdCBsb2FkXG4gICAgICovXG4gICAgbG9hZDogZnVuY3Rpb24oKXtcblxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9hcGkvbG9nLycsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6XCJHRVRcIixcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxeGhyKXtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAneGhyIOWPluWbnuizh+aWmTogJywgZGF0YSApO1xuICAgICAgICAgICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdHlwZSDmmK/ngrrkuobmlrnkvr/lsIfkvobmiYDmnIkgU3RvcmUg5YWn6YOo5Yik5pa35piv5ZCm6KaB6JmV55CG6YCZ5YCLIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19MT0FELFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIOmAmeijj+aYr+ecn+ato+imgeWCs+WHuuWOu+eahOWAvFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhy6Yyv6KqkOiAnLCB4aHIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH0sXG5cblx0XHRsb2dJbjogZnVuY3Rpb24oIHBvc3REYXRhICl7XG5cbiAgICAgICAgLy8kLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy91c2Vycy9zZXNzaW9uL21hbmFnZXInLFxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy91c2Vycy9hcGkvY2hlY2snLFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOlwiUE9TVFwiLFxuXHRcdFx0XHRcdFx0ZGF0YTogeyB1c2VySWQgOiBwb3N0RGF0YS51c2VySWQsIHB3ZCA6IHBvc3REYXRhLnB3ZCB9LFxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ1tQT1NUXSBzZXQgc2Vzc2lvbicpO1xuXG5cdFx0XHRcdGlmKGRhdGEuaXNNYW5hZ2VyKXtcblx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXHRcdFx0XHRcdFx0YWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLkpVU1RfUkVGUkVTSCxcblx0XHRcdFx0XHRcdGl0ZW06IGRhdGFcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oeyBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuU1dJVENIX0xPR0lOQk9YIH0pO1xuXG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7IGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5MT0dJTl9GQUlMIH0pO1xuXHRcdFx0XHR9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhy6Yyv6KqkOiAnLCB4aHIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH0sXG5cblx0XHRsb2dPdXQ6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvdXNlcnMvc2Vzc2lvbi9tYW5hZ2VyL3NpZ25vdXQnLFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOlwiREVMRVRFXCIsXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnW0RFTEVURV0gc2lnbiBvdXQnKTtcblxuXHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXHRcdFx0XHRcdGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5KVVNUX1JFRlJFU0gsXG5cdFx0XHRcdFx0aXRlbTogZGF0YVxuXHRcdFx0XHR9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHhociwgc3RhdHVzLCBlcnJUZXh0ICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICd4aHLpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuXHRcdENoZWNrSXNNYW5nZXI6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvdXNlcnMvc2Vzc2lvbi9tYW5hZ2VyJyxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTpcIkdFVFwiLFxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXHRcdFx0XHRcdFx0XHQvL2RvIG5vdGhpbmdcblx0XHRcdFx0aWYoIWRhdGEuaXNNYW5hZ2VyKXtcblx0XHRcdFx0XHRkYXRhLmlzTWFuYWdlciA9IGZhbHNlO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXHRcdFx0XHRcdFx0XHRhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuSlVTVF9SRUZSRVNILFxuXHRcdFx0XHRcdFx0XHRpdGVtOiBkYXRhXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnW0dFVF0gZ2V0IHNlc3Npb24gLS0+JywgZGF0YS5pc01hbmFnZXIpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hocumMr+iqpDogJywgeGhyLnJlc3BvbnNlVGV4dCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9LFxuXG5cdFx0c2VsZWN0Um9vbUlEOiBmdW5jdGlvbiggcm9vbUlEICkge1xuXG5cdFx0Ly9jb25zb2xlLmxvZygnc2VsZWN0IGFjdGlvbicsIHJvb21JRCk7XG5cbiAgICAgICAgQXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5UT0RPX1NFTEVDVCxcbiAgICAgICAgICAgIHJvb21JRDogcm9vbUlEXG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgICAgICAvKlxuXHRcdCAqXG4gICAgICAgICAqL1xuICAgIGFza0ZvckpvaW46IGZ1bmN0aW9uKCBuZXdsb2cgKSB7XG5cbiAgICAgICAgLy8gMS4g5buj5pKt57WmIHN0b3JlIOefpemBk+WOuyBvcHRpbWlzdGljIOabtOaWsCB2aWV3XG4gICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19DUkVBVEUsXG4gICAgICAgICAgICBpdGVtOiBuZXdsb2dcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvYXBpL2xvZy9qb2luJyxcbiAgICAgICAge1xuXG4gICAgICAgICAgICB0eXBlOlwiUE9TVFwiLFxuXG4gICAgICAgICAgICAvLyDms6jmhI/opoHmraPnorroqK3lrpogaGVhZGVyIOizh+aWmeWei+WIpVxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuXG4gICAgICAgICAgICAvLyDnhLblvozlsIcgaXRlbSDovYnmiJAganNvbiBzdHJpbmcg5YaN6YCB5Ye6XG4gICAgICAgICAgICAvLyDpgJnmqKPlj6/norrkv50gTnVtYmVyIOiIhyBCb29sZWFuIOWAvOWIsCBzZXJ2ZXIg5b6M6IO95q2j56K65L+d55WZ5Z6L5YilXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdsb2cpLFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cbiAgICAgICAgICAgICAgICBuZXdsb2cuX2lkID0gZGF0YS5faWQ7XG5cblxuXHRcdFx0XHQkKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLnZhbCgnJyk7Ly9jbGFlciBhbGwgaW5wdXRcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHhociwgc3RhdHVzLCBlcnJUZXh0ICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICd4aHIg6Yyv6KqkOiAnLCB4aHIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGFza0ZvckxlYXZlOiBmdW5jdGlvbiggbG9nICkge1xuXG4gICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19VUERBVEUsXG4gICAgICAgICAgICBpdGVtOiBsb2dcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvYXBpL2xvZy9ja2Vja091dC8nICsgbG9nLl9pZCxcbiAgICAgICAge1xuXG4gICAgICAgICAgICB0eXBlOlwiUFVUXCIsXG5cbiAgICAgICAgICAgIGRhdGE6IGxvZyxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICfnt6jovK/os4fmlpnntZDmnpw6ICcsIGRhdGEgKTtcblxuICAgICAgICAgICAgICAgIC8vIOWwhyBzZXJ2ZXIg55Sf5oiQ55qEIHVpZCDmm7TmlrDliLDml6nlhYjlu7rnq4vnmoTnianku7bvvIzkuYvlvozos4fmlpnmiY3mnIPkuIDoh7RcbiAgICAgICAgICAgICAgICAvL2l0ZW0uaWQgPSBkYXRhLmlkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hociDpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuXHRcdGNoZWNrSW46IGZ1bmN0aW9uKCBsb2cgKSB7XG5cbiAgICAgICAgQXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5UT0RPX1VQREFURSxcbiAgICAgICAgICAgIGl0ZW06IGxvZ1xuICAgICAgICB9KTtcblxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9hcGkvbG9nL2NrZWNrSW4vYXNzZW50LycgKyBsb2cuX2lkLFxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHR5cGU6XCJQVVRcIixcblxuICAgICAgICAgICAgZGF0YTogbG9nLFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWpheC0vYXBpL2NrZWNrT3V0L2Fzc2VudC8tIFNVQ0NFU1MnKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHhociwgc3RhdHVzLCBlcnJUZXh0ICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICd4aHIg6Yyv6KqkOiAnLCB4aHIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH0sXG5cblx0XHRjaGVja091dDogZnVuY3Rpb24oIGxvZyApIHtcblxuICAgICAgICBBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLlRPRE9fVVBEQVRFLFxuICAgICAgICAgICAgaXRlbTogbG9nXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQuYWpheCgnaHR0cDovLycgKyBJUGFkZHJlc3MgKyAnL2FwaS9sb2cvY2tlY2tPdXQvYXNzZW50LycgKyBsb2cuX2lkLFxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHR5cGU6XCJQVVRcIixcblxuICAgICAgICAgICAgZGF0YTogbG9nLFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ+e3qOi8r+izh+aWmee1kOaenDogJywgZGF0YSApO1xuXG4gICAgICAgICAgICAgICAgLy8g5bCHIHNlcnZlciDnlJ/miJDnmoQgdWlkIOabtOaWsOWIsOaXqeWFiOW7uueri+eahOeJqeS7tu+8jOS5i+W+jOizh+aWmeaJjeacg+S4gOiHtFxuICAgICAgICAgICAgICAgIC8vaXRlbS5pZCA9IGRhdGEuaWQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhyIOmMr+iqpDogJywgeGhyLnJlc3BvbnNlVGV4dCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9LFxuXG5cdFx0Y2hlY2tJbklnbm9yZTogZnVuY3Rpb24oIGxvZyApIHtcblxuXHRcdFx0Y29uc29sZS5sb2cobG9nLl9pZCk7XG5cbiAgICAgICAgQXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5UT0RPX1JFTU9WRSxcbiAgICAgICAgICAgIGl0ZW06IGxvZ1xuICAgICAgICB9KTtcblxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9hcGkvbG9nL2NrZWNrSW4vaWdub3JlLycgKyBsb2cuX2lkLFxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHR5cGU6XCJERUxFVEVcIixcblxuICAgICAgICAgICAgZGF0YTogbG9nLFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHhociwgc3RhdHVzLCBlcnJUZXh0ICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICd4aHIg6Yyv6KqkOiAnLCB4aHIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH0sXG5cblx0XHRzd2l0Y2hMb2dJbkJveDogZnVuY3Rpb24oKXtcblx0XHRcdEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7IGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5TV0lUQ0hfTE9HSU5CT1ggfSk7XG5cdFx0fSxcblxuXHRcdGNoYW5nZUlucHV0SUQ6IGZ1bmN0aW9uKCBpbnB1dElEICl7XG5cblxuXHRcdFx0QXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcblx0XHRcdFx0YWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLkNIQU5HRV9JTlBVVElELFxuXHRcdFx0XHRpbnB1dElEOiBpbnB1dElEXG5cdFx0XHR9KTtcblx0XHR9LFxuXG4gICAgLy8gZHVtbXlcbiAgICBub29wOiBmdW5jdGlvbigpe31cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQWN0aW9uQ3JlYXRvcnM7XG4iLCIvKlxuICog6YCZ5pSv5piv56iL5byP6YCy5YWl6bue77yM5a6D6LKg6LKs5bu656uLIHJvb3QgdmlldyAoY29udHJvbGxlciB2aWV3Ke+8jFxuICog5Lmf5bCx5pivIFRvZG9BcHAg6YCZ5YCL5YWD5Lu2XG4gKlxuICogYm9vdC5qcyDlrZjlnKjnmoTnm67lnLDvvIzmmK/lm6DngrrpgJrluLggYXBwIOWVn+WLleaZguacieioseWkmuWFiOacn+W3peS9nOimgeWujOaIkO+8jFxuICog5L6L5aaC6aCQ6LyJ6LOH5paZ5YiwIHN0b3JlIOWFp+OAgeaqouafpeacrOWcsOerryBkYiDni4DmhYvjgIHliIfmj5vkuI3lkIzoqp7ns7vlrZfkuLLjgIFcbiAqIOmAmeS6m+W3peS9nOmDveWFiOWcqCBib290LmpzIOWFp+WBmuWujO+8jOWGjeWVn+WLlSBUb2RvQXBwIHZpZXcg5bu656uL55Wr6Z2i5piv5q+U6LyD5aW955qEXG4gKlxuICovXG5cbi8vIHYwLjEyIOmWi+Wni+imgeeUqCBmYWN0b3J5IOWMheS4gOasoeaJjeiDveebtOaOpeWRvOWPq1xudmFyIE1haW5BcHAgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vdmlld3MvTWFpbkFwcC5qc3gnKSk7XG5cbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcbnZhciBhY3Rpb25zID0gcmVxdWlyZSgnLi9hY3Rpb25zL0FwcEFjdGlvbkNyZWF0b3InKTtcblxuJChmdW5jdGlvbigpe1xuXG4gIC8vIOaLieWbnuesrOS4gOWMheizh+aWmee1pueVq+mdoueUqFxuICBhY3Rpb25zLmxvYWQoKTtcblxuXHQvLyDllZ/li5Ugcm9vdCB2aWV3IOaZguimgeWCs+WFpeWBh+izh+aWmVxuXHRSZWFjdC5yZW5kZXIoIE1haW5BcHAoKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpICk7XG5cbn0pXG4iLCIvKipcbiAqIFRvZG9Db25zdGFudHNcbiAqL1xuXG52YXIga2V5TWlycm9yID0gcmVxdWlyZSgncmVhY3QvbGliL2tleU1pcnJvcicpO1xuXG4vLyBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbi8vIOS5n+WwseaYr+iukyBoYXNoIOeahCBrZXkg6IiHIHZhbHVlIOWAvOS4gOaoo1xuLy8g5LiN54S25Y6f5pysIHZhbHVlIOmDveaYryBudWxsXG4vLyDkuI3pgY7ml6LnhLblpoLmraTvvIzngrrkvZXkuI3kub7ohIbnlKggc2V0IOS5i+mhnuWPquaciWtleSDnmoTlsLHlpb1cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcblxuXHRTT1VSQ0VfVklFV19BQ1RJT046IG51bGwsXG5cdFNPVVJDRV9TRVJWRVJfQUNUSU9OOiBudWxsLFxuXHRTT1VSQ0VfUk9VVEVSX0FDVElPTjogbnVsbCxcblxuICBcdENIQU5HRV9FVkVOVDogbnVsbCxcblxuICAgIFRPRE9fTE9BRDogbnVsbCxcbiAgXHRUT0RPX0NSRUFURTogbnVsbCxcbiAgXHRUT0RPX1JFTU9WRTogbnVsbCxcbiAgXHRUT0RPX1VQREFURTogbnVsbCxcbiAgXHRUT0RPX1NFTEVDVDogbnVsbCxcblx0XG5cdFx0SlVTVF9SRUZSRVNIOiBudWxsLFxuXHRcdFNXSVRDSF9MT0dJTkJPWDogbnVsbCxcblx0XHRMT0dJTl9GQUlMOiBudWxsLFxuXHRcdENIQU5HRV9JTlBVVElEOiBudWxsLFxuXG4gIFx0bm9vcDogbnVsbFxufSk7XG5cbiIsIlxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxuXG4vKipcbiAqIGZsdXgtY2hhdCDlhafmnIDmlrDnmoQgZGlzcGF0Y2hlclxuICovXG52YXIgQXBwRGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbi8vIOazqOaEj++8mumAmeijj+etieaWvOaYr+e5vOaJvyBEaXNwYXRjaGVyIGNsYXNzIOi6q+S4iuaJgOacieaMh+S7pO+8jOebruWJjeaYr+iuk+atpOeJqeS7tuS/seacieW7o+aSreiDveWKn1xuLy8g5ZCM5qij5Yqf6IO95Lmf5Y+v55SoIHVuZGVyc2NvcmUuZXh0ZW5kIOaIliBPYmplY3QuYXNzaWduKCkg5YGa5YiwXG4vLyDku4rlpKnlm6DngrrmnInnlKgganF1ZXJ5IOWwseiri+Wug+S7o+WLnuS6hlxuJC5leHRlbmQoIEFwcERpc3BhdGNoZXIsIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gVGhlIGRldGFpbHMgb2YgdGhlIGFjdGlvbiwgaW5jbHVkaW5nIHRoZSBhY3Rpb24nc1xuICAgICAqIHR5cGUgYW5kIGFkZGl0aW9uYWwgZGF0YSBjb21pbmcgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIGhhbmRsZVNlcnZlckFjdGlvbjogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgICAgc291cmNlOiBBcHBDb25zdGFudHMuU09VUkNFX1NFUlZFUl9BQ1RJT04sXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGlzcGF0Y2gocGF5bG9hZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqL1xuICAgIGhhbmRsZVZpZXdBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgICB2YXIgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgIHNvdXJjZTogQXBwQ29uc3RhbnRzLlNPVVJDRV9WSUVXX0FDVElPTixcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRpc3BhdGNoKHBheWxvYWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsIfkvobllZ/nlKggcm91dGVyIOaZgu+8jOmAmeijj+iZleeQhuaJgOaciSByb3V0ZXIgZXZlbnRcbiAgICAgKi9cbiAgICBoYW5kbGVSb3V0ZXJBY3Rpb246IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaCh7XG4gICAgICAgICAgICBzb3VyY2U6IEFwcENvbnN0YW50cy5TT1VSQ0VfUk9VVEVSX0FDVElPTixcbiAgICAgICAgICAgIGFjdGlvbjogcGF0aFxuICAgICAgICB9KTtcbiAgICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcERpc3BhdGNoZXI7XG4iLCIvKipcbiAqIFRvZG9TdG9yZVxuICovXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gSU1QT1JUXG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xudmFyIGFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FwcEFjdGlvbkNyZWF0b3InKTtcblxudmFyIFJvb21JbmZvID0gcmVxdWlyZSgnLi9Sb29tSW5mby5qcycpO1xuXG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjsgLy8g5Y+W5b6X5LiA5YCLIHB1Yi9zdWIg5buj5pKt5ZmoXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gUHVibGljIEFQSVxuXG4vLyDnrYnlkIzmlrwgVG9kb1N0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG4vLyDlvp7mraTlj5blvpflu6Pmkq3nmoTog73liptcbi8vIOeUseaWvOWwh+S+huacg+i/lOmChCBUb2RvU3RvcmUg5Ye65Y6777yM5Zug5q2k5LiL6Z2i5a+r55qE5pyD5YWo6K6K54K6IHB1YmxpYyBtZXRob2RzXG52YXIgU3RvcmUgPSB7fTtcblxuLy8g5omA5pyJIGxvZyDos4fmlplcbnZhciBhcnJMb2cgPSBbXTtcblxuLy8g55uu5YmN6YG45Y+W55qEIHJvb20gSURcbnZhciBzZWxlY3RlZFJvb21JRCA9ICdhbGwnO1xudmFyIHNlbGVjdGVkUm9vbUlEaW5wdXQgPSAnODAxJztcblxuLy8g5piv5ZCm54K6bWFuYWdlclxudmFyIG1hbmFnZXIgPSB7XG5cdGlzTWFuYWdlciA6IGZhbHNlLFxuXHRuYW1lIDogJ2d1ZXN0J1xufVxuXG4vL2xvZ2luIGlucHV0IGJveFxudmFyIGxvZ2luQm94ID0ge1xuXHRpc1Nob3cgOiBmYWxzZSxcblx0aXNGYWlsIDogZmFsc2Vcbn07XG5cbi8vcm9vbSBpbmZvXG52YXIgcm9vbUluZm8gPSBSb29tSW5mbztcblxuLyoqXG4gKiDlu7rnq4sgU3RvcmUgY2xhc3PvvIzkuKbkuJTnubzmib8gRXZlbnRFTWl0dGVyIOS7peaTgeacieW7o+aSreWKn+iDvVxuICovXG5vYmplY3RBc3NpZ24oIFN0b3JlLCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgQVBJXG4gICAgICog5L6b5aSW55WM5Y+W5b6XIHN0b3JlIOWFp+mDqOizh+aWmVxuICAgICAqL1xuICAgIGdldExvZzogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGFyckxvZztcbiAgICB9LFxuXG4gICAgZ2V0U2VsZWN0ZWRSb29tSUQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBzZWxlY3RlZFJvb21JRDtcbiAgICB9LFxuXG5cdGdldFNlbGVjdGVkUm9vbUlEaW5wdXQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gc2VsZWN0ZWRSb29tSURpbnB1dDtcblx0fSxcblxuXHRnZXRMb2dpbkJveFNob3dDdHJsOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGxvZ2luQm94O1xuXHR9LFxuXG5cdGdldFJvb21JbmZvOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHJvb21JbmZvO1xuXHR9LFxuXG5cdGdldElzTWFuYWdlcjogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBtYW5hZ2VyO1xuXHR9LFxuXG5cdHNldE1hbmFnZXI6IGZ1bmN0aW9uKGluZm8pe1xuXHRcdFx0bWFuYWdlciA9IGluZm87XG5cdH0sXG5cbiAgICAvL1xuICAgIG5vb3A6IGZ1bmN0aW9uKCl7fVxufSk7XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gZXZlbnQgaGFuZGxlcnNcblxuU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IEFwcERpc3BhdGNoZXIucmVnaXN0ZXIoIGZ1bmN0aW9uIGV2ZW50SGFuZGxlcnMoZXZ0KXtcblxuICAgIC8vIGV2dCAuYWN0aW9uIOWwseaYryB2aWV3IOeVtuaZguW7o+aSreWHuuS+hueahOaVtOWMheeJqeS7tlxuICAgIC8vIOWug+WFp+WQqyBhY3Rpb25UeXBlXG4gICAgdmFyIGFjdGlvbiA9IGV2dC5hY3Rpb247XG5cbiAgICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb25UeXBlKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5UT0RPX0xPQUQ6XG5cbiAgICAgICAgICAgIGFyckxvZyA9IGFjdGlvbi5pdGVtcztcblxuICAgICAgICAgICAgcmVuZXdSb29tSW5mb19tdWx0aSggYXJyTG9nICk7XG5cblx0XHRcdC8vcmV2ZXJzZVxuXHRcdFx0YXJyTG9nLnJldmVyc2UoKTtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ1N0b3JlIOaUtuWIsOizh+aWmTogJywgYXJyTG9nICk7XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5UT0RPX0NSRUFURTpcblxuICAgICAgICAgICAgYXJyTG9nLnVuc2hpZnQoIGFjdGlvbi5pdGVtICk7XG5cblx0XHRcdHJlbmV3Um9vbUluZm8oIGFjdGlvbi5pdGVtICk7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdTdG9yZSDmlrDlop46ICcsIGFyckxvZyApO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuVE9ET19SRU1PVkU6XG5cbiAgICAgICAgICAgIGFyckxvZyA9IGFyckxvZy5maWx0ZXIoIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtICE9IGFjdGlvbi5pdGVtO1xuICAgICAgICAgICAgfSlcblxuXHRcdFx0cmVuZXdSb29tSW5mbyggYWN0aW9uLml0ZW0gKTtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ1N0b3JlIOWIquWujDogJywgYXJyTG9nICk7XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5UT0RPX1VQREFURTpcblxuXHRcdFx0YXJyTG9nID0gYXJyTG9nLmZpbHRlciggZnVuY3Rpb24oaXRlbSl7XG4gICAgXHRcdFx0aWYoaXRlbS5faWQgPT0gYWN0aW9uLml0ZW0uX2lkKXtcbiAgICBcdFx0XHRcdGl0ZW0gPSBhY3Rpb24uaXRlbTtcbiAgICBcdFx0XHR9XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtIDtcbiAgICAgICAgICAgIH0pXG5cblx0XHRcdHJlbmV3Um9vbUluZm8oIGFjdGlvbi5pdGVtICk7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdTdG9yZSDmm7TmlrA6ICcsIGFyckxvZyApO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG5cdFx0LyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLlRPRE9fU0VMRUNUOlxuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnU3RvcmUg6YG45Y+WOiAnLCBhY3Rpb24ucm9vbUlEICk7XG5cbiAgICAgICAgICAgIC8vIOmBuOWPluWQjOaoo+eahCBpdGVtIOWwseS4jeeUqOiZleeQhuS4i+WOu+S6hlxuICAgICAgICAgICAgaWYoIHNlbGVjdGVkUm9vbUlEICE9IGFjdGlvbi5yb29tSUQgKXtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFJvb21JRCA9IGFjdGlvbi5yb29tSUQ7XG5cbiAgICAgICAgXHRcdC8vIGlmKHNlbGVjdGVkUm9vbUlEICE9ICdhbGwnKXtcbiAgICAgICAgXHRcdC8vIFx0c2VsZWN0ZWRSb29tSURpbnB1dCA9IGFjdGlvbi5pbnB1dElEO1xuICAgICAgICBcdFx0Ly8gfVxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgU3RvcmUuZW1pdCggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLkpVU1RfUkVGUkVTSDpcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ1N0b3JlIEp1c3QgUmVmcmVzaCcpO1xuXG4gICAgICAgICAgICBtYW5hZ2VyID0gYWN0aW9uLml0ZW07XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cblx0XHRcdFx0LyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5TV0lUQ0hfTE9HSU5CT1g6XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdTdG9yZSBzd2l0Y2ggbG9naW4gYm94Jyk7XG5cblx0XHRcdGxvZ2luQm94LmlzU2hvdyA9ICFsb2dpbkJveC5pc1Nob3c7XG5cdFx0XHRsb2dpbkJveC5pc0ZhaWwgPSBmYWxzZTtcblxuICAgICAgICAgICAgU3RvcmUuZW1pdCggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCApO1xuXG4gICAgICAgICAgICBicmVhaztcblxuXHRcdFx0XHQvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLkxPR0lOX0ZBSUw6XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdsb2dpbiBmYWlsJyk7XG5cblx0XHRcdGxvZ2luQm94LmlzRmFpbCA9IHRydWU7XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cdFx0XHRcdC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuQ0hBTkdFX0lOUFVUSUQ6XG5cbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdjaGFuZ2UgaW5wdXQgaWQnKTtcblxuXHRcdFx0c2VsZWN0ZWRSb29tSURpbnB1dCA9IGFjdGlvbi5pbnB1dElEO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICB9XG59KVxuXG5cbi8vLS0tLS1yZW5ldyByb29tSW5mbyBmdW5jXG5mdW5jdGlvbiByZW5ld1Jvb21JbmZvKGRhdGEpe1xuXG5cdC8vY29uc29sZS5sb2coJ3N0YXJ0IDogJywgZGF0YSk7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IHJvb21JbmZvLmxlbmd0aDsgaSsrKXtcblxuXHRcdGlmKCByb29tSW5mb1tpXS5uYW1lID09IGRhdGEucm9vbSApe1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgcm9vbUluZm9baV0ucG9zaS5sZW5ndGg7IGorKyl7XG5cblx0XHRcdFx0aWYoIHJvb21JbmZvW2ldLnBvc2lbal0ubmFtZSA9PSBkYXRhLnBvc2kgKXtcblx0XHRcdFx0XHRyb29tSW5mb1tpXS5wb3NpW2pdLm9jY3VwYW5jeSA9ICFyb29tSW5mb1tpXS5wb3NpW2pdLm9jY3VwYW5jeTtcblxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ3Jvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5Jywgcm9vbUluZm9baV0ucG9zaVtqXS5vY2N1cGFuY3kpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVuZXdSb29tSW5mb19tdWx0aShkYXRhKXtcblxuICAgIC8vY29uc29sZS5sb2coJ3N0YXJ0IDogJywgZGF0YSk7XG5cbiAgICBmb3IgKHZhciByb3cgPSBkYXRhLmxlbmd0aCAtIDE7IHJvdyA+PSAwOyByb3ctLSkge1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCByb29tSW5mby5sZW5ndGg7IGkrKyl7XG5cbiAgICAgICAgICAgIGlmKCByb29tSW5mb1tpXS5uYW1lID09IGRhdGFbcm93XS5yb29tICl7XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgcm9vbUluZm9baV0ucG9zaS5sZW5ndGg7IGorKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIHJvb21JbmZvW2ldLnBvc2lbal0ubmFtZSA9PSBkYXRhW3Jvd10ucG9zaSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbUluZm9baV0ucG9zaVtqXS5vY2N1cGFuY3kgPSAhcm9vbUluZm9baV0ucG9zaVtqXS5vY2N1cGFuY3k7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Jvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5JywgaSwgaiwgcm9vbUluZm9baV0ucG9zaVtqXS5vY2N1cGFuY3kpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5cbi8vXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlO1xuIiwidmFyIFJvb21JbmZvID0gW1xuXHR7XG5cdFx0bmFtZSA6ICc4MDEnLFxuXHRcdHBvc2lJbmZvIDogeyBwYyA6IDI0LCBjb24gOiAxMn0sXG5cdFx0cG9zaSA6IFtdXG5cdH0sXG5cdHtcblx0XHRuYW1lIDogJzgwMicsXG5cdFx0cG9zaUluZm8gOiB7IHBjIDogMTIsIGNvbiA6IDEyfSxcblx0XHRwb3NpIDogW11cblx0fSxcblx0e1xuXHRcdG5hbWUgOiAnODA0Jyxcblx0XHRwb3NpSW5mbyA6IHsgcGMgOiAxMiwgY29uIDogMTJ9LFxuXHRcdHBvc2kgOiBbXVxuXHR9LFxuXHR7XG5cdFx0bmFtZSA6ICc4MDYnLFxuXHRcdHBvc2lJbmZvIDogeyBwYyA6IDEyLCBjb24gOiAxMn0sXG5cdFx0cG9zaSA6IFtdXG5cdH0sXG5cdHtcblx0XHRuYW1lIDogJzgxMycsXG5cdFx0cG9zaUluZm8gOiB7IHBjIDogMTIsIGNvbiA6IDEyfSxcblx0XHRwb3NpIDogW11cblx0fSxcblx0e1xuXHRcdG5hbWUgOiAnODAwJyxcblx0XHRwb3NpSW5mbyA6IHsgcGMgOiAwLCBjb24gOiAxMn0sXG5cdFx0cG9zaSA6IFtdXG5cdH1cbl1cblxuLy9pbml0IGFycmF5XG52YXIgcG9zaUFyeSA9IGZ1bmN0aW9uKHBjLCBjb24pe1xuXHR2YXIgdG1wID0gW107XG5cdFxuXHRmb3IodmFyIGkgPSAxOyBpIDw9IHBjOyBpKysgKXtcblx0XHR0bXAucHVzaCh7IG5hbWU6ICdQQyAnICsgaSwgb2NjdXBhbmN5OiBmYWxzZSB9KTtcblx0fVxuXHRcblx0Zm9yKHZhciBpID0gMTsgaSA8PSBjb247IGkrKyApe1xuXHRcdHRtcC5wdXNoKHsgbmFtZTogJ+iojuirliAnICsgaSwgb2NjdXBhbmN5OiBmYWxzZSB9KTtcblx0fVxuXHRyZXR1cm4gdG1wXG59O1xuXG5mb3IodmFyIGkgPSAwOyBpIDwgUm9vbUluZm8ubGVuZ3RoOyBpKyspe1xuXHRSb29tSW5mb1tpXS5wb3NpID0gcG9zaUFyeSggUm9vbUluZm9baV0ucG9zaUluZm8ucGMsIFJvb21JbmZvW2ldLnBvc2lJbmZvLmNvbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUm9vbUluZm87IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKlxuICovXG52YXIgUmVhY3RQcm9wVHlwZXMgPSBSZWFjdC5Qcm9wVHlwZXM7XG52YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvcicpO1xuXG52YXIgRm9vdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRm9vdGVyJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgfSxcblxuICAvKipcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICBcdHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZm9vdGVyKHtjbGFzc05hbWU6IFwiZm9vdGVyXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogXCJhdXRob3JcIn0sIFxuICAgICAgICAgICAgXCJBdXRob3IgfCBBbmRyZXcgQ2hlbiAgXCIsICcoIE1heSAvIDIwMTUgKSdcblx0XHRcdFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb290ZXI7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcbiAqXG4gKi9cblxudmFyIExpc3RJdGVtID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL0xpc3RJdGVtLmpzeCcpKTtcbnZhciBMaXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vTGlzdElucHV0LmpzeCcpKTtcbnZhciBMaXN0VGl0bGUgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vTGlzdFRpdGxlLmpzeCcpKTtcblxuLy9cbnZhciBjb21wID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnY29tcCcsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0bG9nOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuXHQgICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQgICAgcm9vbTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRpblRpbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCAgICBvdXRUaW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQgICAgaW5DaGVjazogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0ICAgIG91dENoZWNrOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIH0pLFxuXG5cdC8vIGNhbGxiYWNrc1xuICAgIGNoZWNrT3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBjaGVja0luSWdub3JlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0fSxcbiAgLyoqXG4gICAqXG4gICAqL1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8g5Y+W5Ye65omA5pyJ6KaB57mq6KO955qE6LOH5paZXG4gICAgdmFyIGFycmxvZyA9IHRoaXMucHJvcHMudHJ1dGguYXJyTG9nO1xuXHR2YXIgc2VsZWN0ZWRSb29tSUQgPSB0aGlzLnByb3BzLnRydXRoLnNlbGVjdGVkUm9vbUlEO1xuXHR2YXIgbWFuYWdlciA9IHRoaXMucHJvcHMudHJ1dGgubWFuYWdlcjtcblxuXHQvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMuY2hlY2tJbkFzc2VudCk7XG5cblxuXHQvLyDot5EgbG9vcCDkuIDnrYbnrYblu7rmiJAgTGlzdEl0ZW0g5YWD5Lu2XG5cdHZhciBhcnIgPSBhcnJsb2cubWFwKGZ1bmN0aW9uIChsb2cpIHtcblxuXHRcdC8vIOazqOaEj+avj+WAiyBpdGVtIOimgeacieS4gOWAi+eNqOS4gOeEoeS6jOeahCBrZXkg5YC8XG5cdFx0cmV0dXJuIExpc3RJdGVtKHtcblx0XHRcdGtleTogIGxvZy5pZCwgXG5cdFx0XHRsb2dSb3c6IGxvZywgXG5cdFx0XHRtYW5hZ2VyOiBtYW5hZ2VyLCBcblx0XHRcdGNoZWNrT3V0OiAgdGhpcy5wcm9wcy5jaGVja091dCwgXG5cdFx0XHRzZWxlY3RlZFJvb21JRDogc2VsZWN0ZWRSb29tSUQsIFxuXHRcdFx0Y2hlY2tJbkFzc2VudDogIHRoaXMucHJvcHMuY2hlY2tJbkFzc2VudCwgXG5cdFx0XHRjaGVja0luSWdub3JlOiAgdGhpcy5wcm9wcy5jaGVja0luSWdub3JlLCBcblx0XHRcdGNoZWNrT3V0QXNzZW50OiAgdGhpcy5wcm9wcy5jaGVja091dEFzc2VudH1cblx0XHRcdClcblxuXHR9LCB0aGlzKTtcblxuXHR2YXIgaW5wdXRUaXRsZSA9IFsnTGFiJywgJ1lvdXIgSUQnLCAnWW91ciBOYW1lJywgJ1Bvc2knLCAnQ2hlY2sgaW4nLCAnJywgJycsICdPcGVyYXRlJ107XG5cdHZhciB0aGVhZFRpdGxlID0gWydMYWInLCAnSUQnLCAnTmFtZScsICdQb3NpJywgJ0NoZWNrIGluJywgJ0NoZWNrIG91dCcsICdDaGVja2VkKGluKScsICdDaGVja2VkKG91dCknXTtcblxuXG4gICAgcmV0dXJuIChcblx0XHRcdFJlYWN0LkRPTS5mb3JtKG51bGwsIFxuXHRcdCAgICAgIFx0UmVhY3QuRE9NLnRhYmxlKHtjbGFzc05hbWU6IFwidGFibGUgdGFibGUtaG92ZXJcIn0sIFxuXHRcdFx0XHRcdExpc3RUaXRsZSh7XG5cdFx0XHRcdFx0XHR0aXRsZXM6IGlucHV0VGl0bGUsIFxuXHRcdFx0XHRcdFx0bGlzdFRpdGxlOiBmYWxzZSB9XG5cdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRMaXN0SW5wdXQoe1xuXHRcdFx0XHRcdFx0am9pbjogIHRoaXMucHJvcHMuam9pbiwgXG5cdFx0XHRcdFx0XHRpbnB1dElEOiAgdGhpcy5wcm9wcy5pbnB1dElELCBcblx0XHRcdFx0XHRcdHJvb21JbmZvOiAgdGhpcy5wcm9wcy5yb29tSW5mbywgXG5cdFx0XHRcdFx0XHRjaGFuZ2VJbnB1dElEOiAgdGhpcy5wcm9wcy5jaGFuZ2VJbnB1dElEfVxuXHRcdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0TGlzdFRpdGxlKHtcblx0XHRcdFx0XHRcdHRpdGxlczogdGhlYWRUaXRsZSwgXG5cdFx0XHRcdFx0XHRsaXN0VGl0bGU6IHRydWV9XG5cdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGJvZHkobnVsbCwgXG5cdCAgICAgICAgXHRcdCAgYXJyXG5cdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRmb290KG51bGwsIFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLnRkKHtjbGFzc05hbWU6IFwidGFibGVFbmRcIiwgY29sU3BhbjogXCI4XCJ9LCBcIi0tLSBbRW5kXSAtLS1cIilcblx0XHRcdFx0XHQpXG4gIFx0XHRcdFx0KVxuXHRcdFx0KVxuICAgICk7XG4gIH0sXG4gIG5vb3A6IGZ1bmN0aW9uKCl7ICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKiDpgJnmmK8gcm9vdCB2aWV377yM5Lmf56ix54K6IGNvbnRyb2xsZXItdmlld1xuICovXG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBpbXBvcnRcblxuLy8gdmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbi8vdmFyIElucHV0Qm94ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9JbnB1dEJveC5qc3gnKSApO1xudmFyIExpc3QgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KCByZXF1aXJlKCcuL0xpc3QuanN4JykgKTtcbnZhciBMaXN0SGVhZGVyID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9MaXN0SGVhZGVyLmpzeCcpICk7XG52YXIgU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KCByZXF1aXJlKCcuL1NlbGVjdG9yLmpzeCcpICk7XG52YXIgTG9nSW5Gb3JtID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9Mb2dJbkZvcm0uanN4JykgKTtcblxudmFyIExvZ1N0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0xvZ1N0b3JlJyk7XG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xuXG52YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvcicpO1xuXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gQ29tcG9uZW50XG5cbnZhciBMaXN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTGlzdENvbnRhaW5lcicsXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gbWl4aW4gfCBwcm9wcyB8IGRlZmF1bHQgdmFsdWVcblxuICAgIG1peGluczogW10sXG5cbiAgICAvLyDpgJnoo4/liJflh7rmiYDmnInopoHnlKjliLDnmoQgcHJvcGVydHkg6IiH5YW26aCQ6Kit5YC8XG4gICAgLy8g5a6D5ZyoIGdldEluaXRpYWxTdGF0ZSgpIOWJjeWft+ihjO+8jOatpOaZgiB0aGlzLnN0YXRlIOmChOaYr+epuuWAvFxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBmb286ICdfX2Zvb19fJyxcbiAgICAgICAgICAgIC8vIGJhcjogJ19fYmFyX18nXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8vIOmAmeijj+WIl+WHuuavj+WAiyBwcm9wIOeahOWei+WIpe+8jOS9huWPquacg+WcqCBkZXYgdGltZSDmqqLmn6VcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgLy8gZm9vOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIC8vIGJhcjogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgICB9LFxuXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gbW91bnRcblxuICAgIC8vIOmAmeaYryBjb21wb25lbnQgQVBJLCDlnKggbW91bnQg5YmN5pyD6LeR5LiA5qyh77yM5Y+W5YC85YGa54K6IHRoaXMuc3RhdGUg55qE6aCQ6Kit5YC8XG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblxuLy9cdFx0XHR2YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyk7XG4vL1x0XHRcdHNvY2tldC5vbignbmV3TG9nJywgZnVuY3Rpb24gKGRhdGEpIHtcbi8vXHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcbi8vXHRcdFx0XHRzb2NrZXQuZW1pdCgnbXkgb3RoZXIgZXZlbnQnLCB7IG15OiAnZGF0YScgfSk7XG4vL1x0XHRcdH0pO1xuXG4gICAgXHRcdHJldHVybiB0aGlzLmdldFRydXRoKCk7XG4gICAgICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDkuLvnqIvlvI/pgLLlhaXpu55cbiAgICAgKi9cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBMb2dTdG9yZS5hZGRMaXN0ZW5lciggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCwgdGhpcy5fb25DaGFuZ2UgKTtcbiAgICB9LFxuXG4gICAgLy8g6YeN6KaB77yacm9vdCB2aWV3IOW7uueri+W+jOesrOS4gOS7tuS6i++8jOWwseaYr+WBteiBvSBzdG9yZSDnmoQgY2hhbmdlIOS6i+S7tlxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9cbiAgICB9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHVubW91bnRcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvL1RvZG9TdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG5cbiAgICB9LFxuXG5cbiAgICBjb21wb25lbnREaWRVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHVwZGF0ZVxuXG4gICAgLy8g5ZyoIHJlbmRlcigpIOWJjeWft+ihjO+8jOacieapn+acg+WPr+WFiOiZleeQhiBwcm9wcyDlvoznlKggc2V0U3RhdGUoKSDlrZjotbfkvoZcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy9cbiAgICB9LFxuXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8g6YCZ5pmC5bey5LiN5Y+v55SoIHNldFN0YXRlKClcbiAgICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ1xcdE1haW5BUFAgPiB3aWxsVXBkYXRlJyApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdcXHRNYWluQVBQID4gZGlkVXBkYXRlJyApO1xuICAgIH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gcmVuZGVyXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHZhciBmb3JtID0gZnVuY3Rpb24oY3RybCkge1xuXHRcdFx0XHRcdGlmKGN0cmwuaXNTaG93KXtcblx0XHRcdFx0XHRcdHJldHVybiAoIExvZ0luRm9ybSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRvdXQ6IGFjdGlvbnMuc3dpdGNoTG9nSW5Cb3gsIFxuXHRcdFx0XHRcdFx0XHRcdFx0bG9naW5Qb3N0OiAgYWN0aW9ucy5sb2dJbiwgXG5cdFx0XHRcdFx0XHRcdFx0XHRmYWlsOiAgY3RybC5pc0ZhaWx9KSApO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KCB0aGlzLnN0YXRlLmxvZ2luQm94Q3RybCApO1xuXG4gICAgICAgIHJldHVybiAoXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJMaXN0Q29udGFpbmVyXCJ9LCBcblx0XHRcdFx0XHRmb3JtLCBcblx0XHRcdFx0XHRMaXN0SGVhZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIElEOiAgdGhpcy5zdGF0ZS5zZWxlY3RlZFJvb21JRCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbjogIGFjdGlvbnMuc3dpdGNoTG9nSW5Cb3gsIFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nb3V0OiAgYWN0aW9ucy5sb2dPdXQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFuYWdlcjogIHRoaXMuc3RhdGUubWFuYWdlciwgXG5cdFx0XHRcdFx0XHRyb29tSW5mbzogIHRoaXMuc3RhdGUucm9vbUluZm8sIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0Um9vbUlEOiAgYWN0aW9ucy5zZWxlY3RSb29tSUR9XG4gICAgICAgICAgICAgICAgICAgICAgICApLCBcblx0XHRcdFx0XHRMaXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46ICBhY3Rpb25zLmFza0ZvckpvaW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ1dGg6ICB0aGlzLnN0YXRlLCBcblx0XHRcdFx0XHRcdGlucHV0SUQ6ICB0aGlzLnN0YXRlLnNlbGVjdGVkSW5wdXRJRCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja091dDogYWN0aW9ucy5hc2tGb3JMZWF2ZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICByb29tSW5mbzogIHRoaXMuc3RhdGUucm9vbUluZm8sIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tJbkFzc2VudDogIGFjdGlvbnMuY2hlY2tJbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VJbnB1dElEOiAgYWN0aW9ucy5jaGFuZ2VJbnB1dElELCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrSW5JZ25vcmU6ICBhY3Rpb25zLmNoZWNrSW5JZ25vcmUsIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tPdXRBc3NlbnQ6ICBhY3Rpb25zLmNoZWNrT3V0fVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuICAgICAgICApXG4gICAgfSxcblxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHByaXZhdGUgbWV0aG9kcyAtIOiZleeQhuWFg+S7tuWFp+mDqOeahOS6i+S7tlxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgJ2NoYW5nZScgZXZlbnRzIGNvbWluZyBmcm9tIHRoZSBUb2RvU3RvcmVcbiAgICAgKlxuICAgICAqIGNvbnRyb2xsZXItdmlldyDlgbXogb3liLAgbW9kZWwgY2hhbmdlIOW+jFxuICAgICAqIOWft+ihjOmAmeaUr++8jOWug+aTjeS9nOWPpuS4gOaUryBwcml2YXRlIG1ldGhvZCDljrvot58gbW9kZWwg5Y+W5pyA5paw5YC8XG4gICAgICog54S25b6M5pON5L2cIGNvbXBvbmVudCBsaWZlIGN5Y2xlIOeahCBzZXRTdGF0ZSgpIOWwh+aWsOWAvOeBjOWFpeWFg+S7tumrlOezu1xuICAgICAqIOWwseacg+inuOeZvOS4gOmAo+S4siBjaGlsZCBjb21wb25lbnRzIOi3n+iRl+mHjee5quWbiVxuICAgICAqL1xuICAgIF9vbkNoYW5nZTogZnVuY3Rpb24oKXtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKCAnX29uQ2hhbmdlIOmHjee5qjogJywgdGhpcy5nZXRUcnV0aCgpICk7XG5cbiAgICAgICAgLy8g6YeN6KaB77ya5b6eIHJvb3QgdmlldyDop7jnmbzmiYDmnIkgc3ViLXZpZXcg6YeN57mqXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoIHRoaXMuZ2V0VHJ1dGgoKSApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDngrrkvZXopoHnjajnq4vlr6vkuIDmlK/vvJ/lm6DngrrmnIPmnInlhanlgIvlnLDmlrnmnIPnlKjliLDvvIzlm6DmraTmir3lh7rkvoZcbiAgICAgKiDnm67lnLDvvJpcbiAgICAgKiAgICAg5ZCR5ZCE5YCLIHN0b3JlIOWPluWbnuizh+aWme+8jOeEtuW+jOe1seS4gCBzZXRTdGF0ZSgpIOWGjeS4gOWxpOWxpOW+gOS4i+WCs+mBnlxuICAgICAqL1xuICAgIGdldFRydXRoOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyDmmK/lvp4gVG9kb1N0b3JlIOWPluizh+aWmShhcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aClcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFyckxvZzogTG9nU3RvcmUuZ2V0TG9nKCksXG5cdFx0XHRcdFx0XHRzZWxlY3RlZFJvb21JRDogTG9nU3RvcmUuZ2V0U2VsZWN0ZWRSb29tSUQoKSxcblx0XHRcdFx0XHRcdHNlbGVjdGVkSW5wdXRJRDogTG9nU3RvcmUuZ2V0U2VsZWN0ZWRSb29tSURpbnB1dCgpLFxuXHRcdFx0XHRcdFx0bWFuYWdlcjogTG9nU3RvcmUuZ2V0SXNNYW5hZ2VyKCksXG5cdFx0XHRcdFx0XHRsb2dpbkJveEN0cmw6IExvZ1N0b3JlLmdldExvZ2luQm94U2hvd0N0cmwoKSxcblx0XHRcdFx0XHRcdHJvb21JbmZvOiBMb2dTdG9yZS5nZXRSb29tSW5mbygpLFxuICAgICAgICAgfTtcbiAgICB9XG5cblxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0Q29udGFpbmVyO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovdmFyIFNlbGVjdG9yID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9TZWxlY3Rvci5qc3gnKSApO1xuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cbi8vIENvbXBvbmVudFxuXG52YXIgTGlzdEhlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0xpc3RIZWFkZXInLFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgLy8g6YCZ6KOP5YiX5Ye65q+P5YCLIHByb3Ag55qE5Z6L5Yil77yM5L2G5Y+q5pyD5ZyoIGRldiB0aW1lIOaqouafpVxuICAgcHJvcFR5cGVzOiB7XG5cdFx0Ly8gY2FsbGJhY2tzXG5cdFx0XHRzZWxlY3RSb29tSUQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRcdFx0bG9nb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHR9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHJlbmRlclxuXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHJvb21JbmZvID0gW3sgbmFtZSA6ICdhbGwnfV0uY29uY2F0KHRoaXMucHJvcHMucm9vbUluZm8pO1xuXG5cdFx0dmFyIHNob3dJRCA9ICcnO1xuXG5cdFx0Lypcblx0XHQgKiBzaG93IGJpZyByb29tIElEXG5cdFx0ICovXG5cdFx0aWYodGhpcy5wcm9wcy5JRCA9PSAnYWxsJyl7XG5cdFx0XHRzaG93SUQgPSAnJztcblx0XHR9ZWxzZXtcblx0XHRcdHNob3dJRCA9ICcgLSAnICsgdGhpcy5wcm9wcy5JRDtcblx0XHR9XG5cblx0XHQvKlxuXHRcdCAqIGlzIG1hbmFnZXIgb3Igbm90XG5cdFx0ICovXG5cdFx0dmFyIHdob0FtSSA9IGZ1bmN0aW9uKG1nKXtcblxuXHRcdFx0dmFyIHNob3cgPSB7fTtcblxuXHRcdFx0aWYobWcuaXNNYW5hZ2VyKXtcblxuXHRcdFx0XHRzaG93LnN0ciA9ICcuLi4gIEkgYW0gYSBtYW5hZ2VyLCBteSBuYW1lIGlzICc7XG5cdFx0XHRcdHNob3cubmFtZSA9IG1nLm5hbWU7XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRSZWFjdC5ET00uaDUoe2NsYXNzTmFtZTogXCJsZWFkXCJ9LCBcblx0XHRcdFx0XHRcdCBzaG93LnN0ciwgXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBcInRleHQtc3VjY2VzcyBpc05hbWVcIn0sIFwiIFwiLCAgc2hvdy5uYW1lLCBcIiBcIiksIFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2hyZWY6IFwiI1wiLCBvbkNsaWNrOiB0aGlzLnByb3BzLmxvZ291dH0sIFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtc2lnbi1vdXRcIn0pKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblxuXHRcdFx0fWVsc2V7XG5cblx0XHRcdFx0c2hvdy5zdHIgPSAnLi4uIFlvdXIgYXJlIGEgbWFuYWdlciA/ICc7XG5cdFx0XHRcdHNob3cubmFtZSA9ICdsb2dJbic7XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRSZWFjdC5ET00uaDUoe2NsYXNzTmFtZTogXCJsZWFkXCJ9LCBcblx0XHRcdFx0XHRcdCBzaG93LnN0ciwgXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7aHJlZjogXCIjXCIsIG9uQ2xpY2s6IHRoaXMucHJvcHMubG9naW59LCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogXCJ0ZXh0LXByaW1hcnlcIn0sIFwiIFwiLCAgc2hvdy5uYW1lLCBcIiBcIiksIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNpZ24taW5cIn0pXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0fS5iaW5kKCB0aGlzICkoIHRoaXMucHJvcHMubWFuYWdlciApO1xuXG5cdFx0Lypcblx0XHQgKiByZXR1cm4gaGVhZGVyXG5cdFx0ICovXG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJoZWFkZXJcIn0sIFxuXHRcdFx0XHRSZWFjdC5ET00uaDEobnVsbCwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS11c2Vyc1wifSksIFxuXHRcdFx0XHRcdCcgIExhYiBNYW5hZ2VyICAnLCBcblx0XHRcdFx0XHRzaG93SUQgXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5ET00uaDQobnVsbCwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnNwYW4obnVsbCwgXCJSb29tIElEIFwiKSwgXG5cdFx0XHRcdFx0U2VsZWN0b3Ioe1xuXHRcdFx0XHRcdFx0bXlJRDogXCJzZWxlY3RJRFwiLCBcblx0XHRcdFx0XHRcdHNlbGVjdFJvb21JRDogdGhpcy5wcm9wcy5zZWxlY3RSb29tSUQsIFxuXHRcdFx0XHRcdFx0Y2hhbmdlVG9kbzogIHRoaXMuaGFuZGxlQ2hhbmdlLCBcblx0XHRcdFx0XHRcdG9wdGlvbnM6IHJvb21JbmZvIH0pXG5cdFx0XHRcdCksIFxuXHRcdFx0XHR3aG9BbUkgXG5cdFx0XHQpIClcbiAgICB9LFxuXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbigpe1xuXG5cdFx0aWYodGhpcy5wcm9wcy5zZWxlY3RSb29tSUQpe1xuXG5cdFx0XHR2YXIgaWQgPSAkKCcjc2VsZWN0SUQnKS52YWwoKTtcblx0XHRcdHRoaXMucHJvcHMuc2VsZWN0Um9vbUlEKGlkKTtcblxuXHRcdFx0Ly9zeW5jIGlucHV0IHNlbGVjdFxuXHRcdFx0aWYoIGlkICE9ICdhbGwnKXtcblx0XHRcdFx0JCgnI2lucHV0SUQnKS52YWwoaWQpO1xuXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JCgnI2lucHV0SUQnKS52YWwoJzgwMScpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RIZWFkZXI7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoIHJlcXVpcmUoJy4vU2VsZWN0b3IuanN4JykgKTtcbnZhciBTZWNyZXQgPSByZXF1aXJlKCcuL1NlY3JldENvbW0uanN4Jyk7XG5cblxuLyoqXG4gKlxuICovXG5cbnZhciBTZXRJbnRlcnZhbE1peGluID0ge1xuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW50ZXJ2YWxzID0gW107XG4gIH0sXG4gIHNldEludGVydmFsOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmludGVydmFscy5wdXNoKHNldEludGVydmFsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnRlcnZhbHMubWFwKGNsZWFySW50ZXJ2YWwpO1xuICB9XG59O1xuXG52YXIgTGlzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTGlzdElucHV0JyxcblxuXHRtaXhpbnM6IFtTZXRJbnRlcnZhbE1peGluXSwgLy8gVXNlIHRoZSBtaXhpblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBub3cgPSB0aGlzLmhhbmRsZVRpbWUoKTtcbiAgICByZXR1cm4ge3RpbWU6IG5vdyB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRJbnRlcnZhbCh0aGlzLnRpY2ssIDEwMDAgKiAzMCk7IC8vIENhbGwgYSBtZXRob2Qgb24gdGhlIG1peGluXG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5vdyA9IHRoaXMuaGFuZGxlVGltZSgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3RpbWU6IG5vdyB9KTtcbiAgfSxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuXHR9LFxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBpbnB1dElEID0gdGhpcy5wcm9wcy5pbnB1dElEO1xuXHRcdHZhciByb29tSW5mbyA9ICB0aGlzLnByb3BzLnJvb21JbmZvO1xuXHRcdHZhciBwb3NpT3B0aW9ucyA9IFtdO1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHJvb21JbmZvLmxlbmd0aDsgaSsrICl7XG5cdFx0XHRpZiggcm9vbUluZm9baV0ubmFtZSA9PSBpbnB1dElEICl7XG5cdFx0XHRcdHBvc2lPcHRpb25zID0gcm9vbUluZm9baV0ucG9zaS5maWx0ZXIoZnVuY3Rpb24ocG9zaSl7XG5cdFx0XHRcdFx0aWYoIHBvc2kub2NjdXBhbmN5ID09IGZhbHNlICl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcG9zaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXG4gICAgcmV0dXJuIChcblx0XHRcdFJlYWN0LkRPTS50aGVhZChudWxsLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgU2VsZWN0b3Ioe1xuXHRcdFx0XHRcdFx0XHRteUlEOiBcImlucHV0SURcIiwgXG5cdFx0XHRcdFx0XHRcdGNsYXNzTmFtZTogXCJpbnB1dFwiLCBcblx0XHRcdFx0XHRcdFx0b3B0aW9uczogcm9vbUluZm8sIFxuXHRcdFx0XHRcdFx0XHRjaGFuZ2VUb2RvOiAgdGhpcy5oYW5kbGVJRGNoYW5nZX1cblx0XHRcdFx0XHRcdCkpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLmlucHV0KHtpZDogXCJpbnB1dFNpZFwiLCB0eXBlOiBcInRleHRcIiwgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBuYW1lOiBcInNpZFwifSkpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLmlucHV0KHtpZDogXCJpbnB1dE5hbWVcIiwgdHlwZTogXCJ0ZXh0XCIsIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgbmFtZTogXCJuYW1lXCJ9KSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBTZWxlY3Rvcih7bXlJRDogXCJpbnB1dFBvc2lcIiwgY2xhc3NOYW1lOiBcImlucHV0XCIsIG9wdGlvbnM6IHBvc2lPcHRpb25zfSkpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQoe2NvbFNwYW46IFwiMlwifSwgXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uaW5wdXQoe1x0aWQ6IFwiaW5wdXRJblRpbWVcIiwgXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZS1sb2NhbFwiLCBcdGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogXCJ0aW1lXCIsIHJlYWRPbmx5OiBcInRydWVcIiwgXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUudGltZX1cblx0XHRcdFx0XHRcdCkpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbFxuXHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5idXR0b24oe1xuXHRcdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN1Ym1pdFwiLCBcblx0XHRcdFx0XHRcdFx0b25DbGljazogIHRoaXMuaGFuZGxlQXNrfSwgXG4gIFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtdXNlci1wbHVzIC1vIGZhLWxnXCJ9KSwgXG5cdFx0XHRcdFx0XHRcdCcgSm9pbidcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHQpXG4gICAgKTtcbi8vXHRcdFx0XHRcdFx0PGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi13YXJuaW5nXCIgaHJlZj1cIiNcIj5cbi8vICBcdFx0XHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1yZXBlYXQgLW8gZmEtbGdcIj48L2k+XG4vL1x0XHRcdFx0XHRcdFx0eycgUmVzZXQnfVxuLy9cdFx0XHRcdFx0XHQ8L2E+XG4gIH0sXG5cblx0cGFkTGVmdDogZnVuY3Rpb24oc3RyLGxlbil7XG5cdFx0aWYoKCcnICsgc3RyKS5sZW5ndGggPj0gbGVuKXtcblx0XHRcdFx0cmV0dXJuIHN0cjtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhZExlZnQoICcwJyArIHN0ciwgbGVuKTtcblx0XHRcdH1cblx0fSxcblxuXHRoYW5kbGVUaW1lOiBmdW5jdGlvbigpe1xuXG5cblx0XHR2YXIgdCA9IG5ldyBEYXRlKCk7XG5cdFx0dmFyIHRpbWUgPSAgdC5nZXRGdWxsWWVhcigpXG5cdFx0XHRcdFx0KyAnLScgKyB0aGlzLnBhZExlZnQodC5nZXRVVENNb250aCgpICsgMSwgMilcblx0XHRcdFx0XHQrICctJyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ0RhdGUoKSwyKVxuXHRcdFx0XHRcdCsgJ1QnICsgdGhpcy5wYWRMZWZ0KHQuZ2V0SG91cnMoKSwyKVxuXHRcdFx0XHRcdCsgJzonICsgdGhpcy5wYWRMZWZ0KHQuZ2V0VVRDTWludXRlcygpLDIpO1xuXHRcdFx0XHRcdC8vICsgJzonICsgdGhpcy5wYWRMZWZ0KHQuZ2V0VVRDU2Vjb25kcygpLDIpXG5cblx0XHQvL2NvbnNvbGUubG9nKCd0aW1lMicsdC50b0xvY2FsZURhdGVTdHJpbmcoKSk7IC8v5oqT5pel5pyfXG5cdFx0Ly9jb25zb2xlLmxvZygndGltZScsdC50b0xvY2FsZVRpbWVTdHJpbmcoKSk7IC8v5oqT5pmC6ZaTXG5cdFx0Ly9jb25zb2xlLmxvZygndGltZTMnLHQudG9Mb2NhbGVTdHJpbmcoKSk7IC8v5oqT5pel5pyfXG5cblx0XHRyZXR1cm4gdGltZTtcblx0fSxcblxuXG5cdGhhbmRsZUFzazogZnVuY3Rpb24oKXtcblxuXHRcdC8vZ2V0IHRpbWVcblx0XHR2YXIgdCAgPSBuZXcgRGF0ZSgpO1xuXHRcdHZhciBpblRpbWUgPSB0LnRvTG9jYWxlU3RyaW5nKCk7XG5cblx0XHR2YXIgc2lkID0gJCgnI2lucHV0U2lkJykudmFsKCk7XG5cdFx0dmFyIHBvc2kgPSAkKCcjaW5wdXRQb3NpJykudmFsKCk7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgU2VjcmV0Lmxlbmd0aDsgaSsrKXtcblx0XHRcdGlmKCBTZWNyZXRbaV0uY29tbSA9PSBzaWQgJiYgU2VjcmV0W2ldLnBvc2lfcHdkID09IHBvc2kpe1xuXHRcdFx0XHR0aGlzLndlQXJlUGFuZGEoU2VjcmV0W2ldLCBpblRpbWUpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cblx0XHR2YXIgcG9zdEluZm8gPSB7XG5cdFx0XHRyb29tOiAkKCcjaW5wdXRJRCcpLnZhbCgpLFxuXHRcdFx0c2lkOiBzaWQsXG5cdFx0XHRuYW1lOiAkKCcjaW5wdXROYW1lJykudmFsKCksXG5cdFx0XHRwb3NpOiBwb3NpLFxuXHRcdFx0aW5DaGVjazogJ3dhaXRpbmcnLFxuXHRcdFx0b3V0Q2hlY2s6ICdub3RZZXQnLFxuXHRcdFx0aW5UaW1lOiBpblRpbWUsXG5cdFx0XHRvdXRUaW1lOiAnICdcblx0XHR9O1xuXG5cdFx0dGhpcy5wcm9wcy5qb2luKHBvc3RJbmZvKTtcblxuXHRcdC8vZG9uJ3Qgc3VibWl0XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXG5cblx0d2VBcmVQYW5kYTogZnVuY3Rpb24oc2VjcmV0LCBpblRpbWUpe1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHNlY3JldC5kYXRhLmxlbmd0aDsgaSsrKXtcblx0XHRcdHNlY3JldC5kYXRhW2ldLmluVGltZSA9IGluVGltZTtcblx0XHRcdHRoaXMucHJvcHMuam9pbihzZWNyZXQuZGF0YVtpXSk7XG5cdFx0fVxuXG5cdH0sXG5cblx0aGFuZGxlSURjaGFuZ2U6IGZ1bmN0aW9uKCl7XG5cblx0XHR2YXIgaWQgPSAkKCcjaW5wdXRJRCcpLnZhbCgpO1xuXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VJbnB1dElEKCBpZCApO1xuXG5cdFx0Ly9zeW5jIGlucHV0IHNlbGVjdFxuXHRcdC8vJCgnI3NlbGVjdElEJykudmFsKGlkKTtcblx0fSxcblxuICBub29wOiBmdW5jdGlvbigpeyB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RJbnB1dDtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qKlxuICpcbiAqL1xuLy92YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvcicpO1xuLy92YXIgY3ggPSBSZWFjdC5hZGRvbnMuY2xhc3NTZXQ7XG4vL1xudmFyIGNvbXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdjb21wJyxcblxuICAvKipcbiAgICpcbiAgICovXG4vLyAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCl7XG4vLyAgICAgIHRoaXMuJGlucHV0ID0gJCh0aGlzLmdldERPTU5vZGUoKSkuZmluZCgnc3BhbicpLmZpcnN0KCk7XG4vLyAgICAgIHRoaXMuJHJlbW92ZSA9IHRoaXMuJGlucHV0Lm5leHQoKTtcbi8vICB9LFxuXG5cblx0cHJvcFR5cGVzOiB7XG5cblx0XHR0b2RvSXRlbTogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcblx0ICAgIFx0aWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBcdFx0bmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRcdHNlbGVjdGVkUm9vbUlEOiAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRcdGlzTWFuYWdlcjogIFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICBcdH0pLFxuXG5cdFx0Ly8gY2FsbGJhY2tzXG5cdCAgICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0ICAgIG9uUmVtb3ZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0fSxcblxuICAvKipcbiAgICpcbiAgICovXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cblxuXHRcdHZhciBzZWxlY3RlZFJvb21JRCA9IHRoaXMucHJvcHMuc2VsZWN0ZWRSb29tSUQ7XG5cdFx0dmFyIGxvZ1JvdyA9IHRoaXMucHJvcHMubG9nUm93O1xuXHRcdHZhciBtYW5hZ2VyID0gdGhpcy5wcm9wcy5tYW5hZ2VyO1xuXG5cdFx0Ly90ZCBjaGVjayBpblxuXHRcdHZhciBjaGVja0luID0gZnVuY3Rpb24oY2spe1xuXHRcdFx0aWYoY2sgPT0gJ3dhaXRpbmcnIHx8IGNrID09ICcnICl7XG5cdFx0XHRcdC8vd2FpdGluZyBmb3IgY2hlY2tpbiBzdWJtaXRcblxuXHRcdFx0XHRpZihtYW5hZ2VyLmlzTWFuYWdlcil7XG5cdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjdHJsc1wifSwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi14c1wiLCBocmVmOiBcIiNcIiwgb25DbGljazogdGhpcy5oYW5kbGVDaGVja0luQXNzZW50fSwgXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1jaGVja1wifSksIFxuXHRcdFx0XHRcdFx0XHRcdCcgQXNzZW50J1xuXHRcdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRcdFx0JyAgJywgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtjbGFzc05hbWU6IFwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCIsIGhyZWY6IFwiI1wiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNoZWNrSW5JZ25vcmV9LCBcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXRyYXNoLW9cIn0pLCBcblx0XHRcdFx0XHRcdFx0XHQnIElnbm9yZSdcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0KSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJldHVybiBSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNwaW5uZXIgZmEtcHVsc2VcIn0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1lbHNle1xuXHRcdFx0XHQvL3Nob3cgd2hvIGNoZWNrZWQgZm9yIHlvdVxuXHRcdFx0XHRyZXR1cm4gIFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtY2hlY2tcIn0sIGNrKSA7XG5cdFx0XHR9XG5cdFx0fS5iaW5kKHRoaXMpKGxvZ1Jvdy5pbkNoZWNrKTtcblxuXG5cdFx0Ly90ZCBjaGVjayBvdXRcblx0XHR2YXIgY2hlY2tPdXQgPSBmdW5jdGlvbihjaywgY2tpbil7XG5cdFx0XHRpZihja2luID09ICd3YWl0aW5nJyB8fCBja2luID09ICcnICl7XG5cdFx0XHRcdC8vaWYgeW91IG5vdCBjaGVja2luIHlldCwgdGhhbiBkb24ndCBuZWVkIHRvIGNoZWNrb3V0XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBcImJ0biBidG4td2FybmluZyBidG4teHMgZGlzYWJsZWRcIiwgaHJlZjogXCIjXCJ9LCBcbiAgXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1zaWduLW91dFwifSksIFxuXHRcdFx0XHRcdFx0XHQnIENoZWNrLW91dCdcblx0XHRcdFx0XHRcdCkpO1xuXG5cdFx0XHR9ZWxzZSBpZihjayA9PSAnbm90WWV0JyB8fCBjayA9PSAnJyApe1xuXHRcdFx0XHQvL2NhbiBhc2sgZm9yIGNoZWNrIG91dFxuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2NsYXNzTmFtZTogXCJidG4gYnRuLXdhcm5pbmcgYnRuLXhzXCIsIGhyZWY6IFwiI1wiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNoZWNrT3V0fSwgXG4gIFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtc2lnbi1vdXRcIn0pLCBcblx0XHRcdFx0XHRcdFx0JyBDaGVjay1vdXQnXG5cdFx0XHRcdFx0XHQpKTtcblxuXHRcdFx0fWVsc2UgaWYoY2sgPT0gJ3dhaXRpbmcnKXtcblx0XHRcdFx0Ly93YWl0aW5nIGZvciBjaGVja291dCBzdWJtaXRcblx0XHRcdFx0aWYobWFuYWdlci5pc01hbmFnZXIpe1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KG51bGwsIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2VzcyBidG4teHNcIiwgaHJlZjogXCIjXCIsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2hlY2tPdXRBc3NlbnR9LCBcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLWNoZWNrXCJ9KSwgXG5cdFx0XHRcdFx0XHRcdFx0JyBZZXMnXG5cdFx0XHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFx0XHQnICAnLCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2NsYXNzTmFtZTogXCJidG4gYnRuLWRhbmdlciBidG4teHNcIiwgaHJlZjogXCIjXCJ9LCBcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXVzZXItdGltZXNcIn0pLCBcblx0XHRcdFx0XHRcdFx0XHQnIE5vJ1xuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpKTtcblxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRyZXR1cm4gUmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1zcGlubmVyIGZhLXB1bHNlXCJ9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Ly93aG8gbGV0IHlvdSBjaGVjayBvdXRcblx0XHRcdFx0cmV0dXJuIFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtY2hlY2tcIn0sIGNrKSA7XG5cdFx0XHR9XG5cblx0XHR9LmJpbmQodGhpcykobG9nUm93Lm91dENoZWNrLCBsb2dSb3cuaW5DaGVjayk7XG5cblx0XHR2YXIgdCA9IG5ldyBEYXRlKCk7XG5cdFx0dmFyIHRvZGF5ID0gdC50b0xvY2FsZURhdGVTdHJpbmcoKTtcblxuXHRcdHZhciB0bXBJblRpbWUgPSBsb2dSb3cuaW5UaW1lLnJlcGxhY2UodG9kYXksICfku4rlpKknKTtcblx0XHR2YXIgdG1wT3V0VGltZSA9IGxvZ1Jvdy5vdXRUaW1lLnJlcGxhY2UodG9kYXksICfku4rlpKknKTtcblxuXG5cdFx0Ly90b28gbGF0ZVx0fiFcblx0XHR2YXIgdG9vTGF0ZSA9ICcnO1xuXG5cdFx0aWYoIHRtcE91dFRpbWUuaW5kZXhPZign5LiL5Y2IJykgIT0gLTEgKXtcblxuXHRcdFx0dmFyIGkgPSB0bXBPdXRUaW1lLmluZGV4T2YoJzonKTtcblx0XHRcdHZhciB0bXAgID0gdG1wT3V0VGltZS5zdWJzdHJpbmcoIGkgLSAxLCBpKTtcblxuXHRcdFx0aWYoIHRtcCA+PSA1KXtcblx0XHRcdFx0dG9vTGF0ZSA9ICd0b29MYXRlJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihsb2dSb3cucm9vbSA9PSBzZWxlY3RlZFJvb21JRCB8fCBzZWxlY3RlZFJvb21JRCA9PSAnYWxsJyl7XG4gICAgXHRyZXR1cm4gKFxuXHRcdFx0XHRSZWFjdC5ET00udHIobnVsbCwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIGxvZ1Jvdy5yb29tKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIGxvZ1Jvdy5zaWQpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgbG9nUm93Lm5hbWUpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgbG9nUm93LnBvc2kpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgdG1wSW5UaW1lKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKHtjbGFzc05hbWU6IHRvb0xhdGUgfSwgdG1wT3V0VGltZSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBjaGVja0luKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIGNoZWNrT3V0KVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuICB9LFxuXG4gIC8qKlxuICAgKlxuICAgKi9cblx0aGFuZGxlQ2hlY2tPdXQ6IGZ1bmN0aW9uKCl7XG5cdFx0Ly9jb25zb2xlLmxvZygnY2xpY2sgY2hlY2sgb3V0JywgdGhpcy5wcm9wcy5sb2dSb3cuX2lkKTtcblx0XHR0aGlzLnByb3BzLmxvZ1Jvdy5vdXRDaGVjayA9ICd3YWl0aW5nJztcblx0XHR0aGlzLnByb3BzLmNoZWNrT3V0KHRoaXMucHJvcHMubG9nUm93KTtcblx0fSxcblxuXHRpc1Rvb2xhZ2U6IGZ1bmN0aW9uKHRpbWUpe1xuXG5cdH0sXG5cblx0cGFkTGVmdDogZnVuY3Rpb24oc3RyLGxlbil7XG5cdFx0aWYoKCcnICsgc3RyKS5sZW5ndGggPj0gbGVuKXtcblx0XHRcdFx0cmV0dXJuIHN0cjtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhZExlZnQoICcwJyArIHN0ciwgbGVuKTtcblx0XHRcdH1cblx0fSxcblxuXG5cdGhhbmRsZUNoZWNrT3V0QXNzZW50OiBmdW5jdGlvbigpe1xuXG5cdFx0dmFyIHQgPSBuZXcgRGF0ZSgpO1xuXHRcdHZhciBvdXRUaW1lID0gdC50b0xvY2FsZVN0cmluZygpO1xuXG5cblx0XHR0aGlzLnByb3BzLmxvZ1Jvdy5vdXRUaW1lID0gb3V0VGltZTtcblx0XHR0aGlzLnByb3BzLmxvZ1Jvdy5vdXRDaGVjayA9IHRoaXMucHJvcHMubWFuYWdlci5uYW1lO1xuXG5cblx0XHR0aGlzLnByb3BzLmNoZWNrT3V0QXNzZW50KHRoaXMucHJvcHMubG9nUm93KTtcblx0fSxcblxuXHRoYW5kbGVDaGVja0luQXNzZW50OiBmdW5jdGlvbigpe1xuXHRcdC8vY29uc29sZS5sb2coJ29rIHRvIGNoZWNrIGluIGNsaWNrJyk7XG5cdFx0dGhpcy5wcm9wcy5sb2dSb3cuaW5DaGVjayA9IHRoaXMucHJvcHMubWFuYWdlci5uYW1lO1xuXHRcdHRoaXMucHJvcHMuY2hlY2tJbkFzc2VudCh0aGlzLnByb3BzLmxvZ1Jvdyk7XG5cdH0sXG5cblx0aGFuZGxlQ2hlY2tJbklnbm9yZTogZnVuY3Rpb24oKXtcblx0XHR0aGlzLnByb3BzLmNoZWNrSW5JZ25vcmUodGhpcy5wcm9wcy5sb2dSb3cpO1xuXHR9LFxuXG5cdHBhZExlZnQ6IGZ1bmN0aW9uKHN0cixsZW4pe1xuXHRcdGlmKCgnJyArIHN0cikubGVuZ3RoID49IGxlbil7XG5cdFx0XHRcdHJldHVybiBzdHI7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYWRMZWZ0KCAnMCcgKyBzdHIsIGxlbik7XG5cdFx0XHR9XG5cdH0sXG4vL1x0aGFuZGxlQ2hlY2tJbklnbm9yZTogZnVuY3Rpb24oKXtcbi8vXHRcdGNvbnNvbGUubG9nKCdpZ25vcmUgdG8gY2hlY2sgaW4gY2xpY2snKTtcbi8vXHRcdC8vdGhpcy5wcm9wcy5sb2dSb3cuaW5DaGVjayA9IHRoaXMucHJvcHMubWFuYWdlci5uYW1lO1xuLy9cdFx0Ly90aGlzLnByb3BzLmNoZWNrSW5Bc3NlbnQodGhpcy5wcm9wcy5sb2dSb3cpO1xuLy9cdH0sXG4vL1xuLy9cdGhhbmRsZUNoZWNrT3V0SWdub3JlOiBmdW5jdGlvbigpe1xuLy9cdFx0Y29uc29sZS5sb2coJ2lnbm9yZSB0byBjaGVjayBvdXQgY2xpY2snKTtcbi8vXHRcdHRoaXMucHJvcHMubG9nUm93Lm91dENoZWNrID0gJ25vdFlldCc7XG4vL1x0XHR0aGlzLnByb3BzLmNoZWNrT3V0QXNzZW50KHRoaXMucHJvcHMubG9nUm93KTtcbi8vXHR9LFxuXG4gIG5vb3A6IGZ1bmN0aW9uKCl7XG5cbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qKlxuICpcbiAqL1xuLy9cbnZhciBjeCA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldDtcblxudmFyIExpc3RUaXRsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0xpc3RUaXRsZScsXG5cbiAgLyoqXG4gICAqIFxuICAgKi9cblx0cHJvcFR5cGVzOiB7XG5cdFx0Ly8gY2FsbGJhY2tzXG4gICAgc2VsZWN0Um9vbUlEOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0fSxcblx0XG5cdC8qKlxuICAgKiBcbiAgICovXG5cdFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdHZhciB0aXRsZXMgPSB0aGlzLnByb3BzLnRpdGxlcztcblx0XHQvL3NwbGl0VGFibGVcblx0XHR2YXIgY2xhc3NlcyA9IGN4KHtcbiAgICAgICAgJ3NwbGl0VGFibGUnOiB0aGlzLnByb3BzLmxpc3RUaXRsZVxuICAgIH0pO1xuXHRcdFxuXHRcdHZhciB0aGVhZCA9IHRpdGxlcy5tYXAoZnVuY3Rpb24gKHRpdGxlKSB7XG5cdFx0XHRcblx0XHRcdC8vIOazqOaEj+avj+WAiyBpdGVtIOimgeacieS4gOWAi+eNqOS4gOeEoeS6jOeahCBrZXkg5YC8XG5cdFx0XHRyZXR1cm4gUmVhY3QuRE9NLnRkKG51bGwsIFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IGNsYXNzZXN9LCB0aXRsZSkpXG5cblx0XHR9LCB0aGlzKTtcblx0XHRcblx0XHRcbiAgICByZXR1cm4gKFxuXHRcdFx0XHRSZWFjdC5ET00udGhlYWQobnVsbCwgXG5cdFx0XHRcdFx0dGhlYWRcblx0XHRcdFx0KVxuXHRcdCk7XG4gIH0sXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIG5vb3A6IGZ1bmN0aW9uKCl7XG5cbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0VGl0bGU7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cbi8vIENvbXBvbmVudFxuXG52YXIgTG9nSW5Gb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTG9nSW5Gb3JtJyxcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuICAgIC8vIOmAmeijj+WIl+WHuuavj+WAiyBwcm9wIOeahOWei+WIpe+8jOS9huWPquacg+WcqCBkZXYgdGltZSDmqqLmn6VcbiAgIHByb3BUeXBlczoge1xuXHRcdFx0Ly8gY2FsbGJhY2tzXG5cdFx0XHQvL3NlbGVjdFJvb21JRDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdFx0XHQvL2xvZ291dDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdFx0fSxcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyByZW5kZXJcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cblx0XHRcdHZhciBpc0ZhaWwgPSAnJztcblx0XHRcdGlmKHRoaXMucHJvcHMuZmFpbCl7XG5cdFx0XHRcdGlzRmFpbCA9ICdsb2dpbiBmYWlsIC4uLic7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5ET00uZGl2KG51bGwsIFxuXHRcdFx0XHRSZWFjdC5ET00uZm9ybSh7aWQ6IFwibG9naW5cIn0sIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJmb3JtLWdyb3VwXCJ9LCBcblxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImlucHV0LWdyb3VwXCJ9LCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImlucHV0LWdyb3VwLWFkZG9uXCJ9LCAnQWNjb3V0cycgKSwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pbnB1dCh7aWQ6IFwidXNlcklkXCIsIHR5cGU6IFwidGV4dFwiLCBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIG5hbWU6IFwidXNlcklkXCIsIHBsYWNlaG9sZGVyOiBcIlVzZXIgSURcIn0pXG5cdFx0XHRcdFx0XHQpLCBcblxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImlucHV0LWdyb3VwXCJ9LCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImlucHV0LWdyb3VwLWFkZG9uXCJ9LCAnUGFzc3dvcmQnICksIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaW5wdXQoe2lkOiBcInB3ZFwiLCB0eXBlOiBcInBhc3N3b3JkXCIsIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgbmFtZTogXCJwd2RcIiwgcGxhY2Vob2xkZXI6IFwiUGFzc3dvcmRcIn0pXG5cdFx0XHRcdFx0XHQpXG5cblx0XHRcdFx0XHQpLCBcblxuXHRcdFx0XHRcdFJlYWN0LkRPTS5idXR0b24oe3R5cGU6IFwic3VibWl0XCIsIG9uQ2xpY2s6ICB0aGlzLmxvZ0luSGFuZGxlciwgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwifSwgXCJMb2cgSW5cIiksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS5wKHtjbGFzc05hbWU6IFwidGV4dC1kYW5nZXIgbG9naW5GYWlsXCJ9LCBpc0ZhaWwgKVxuXHRcdFx0XHQpLCBcblxuXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2lkOiBcIm92ZXJcIiwgb25DbGljazogdGhpcy5wcm9wcy5vdXR9KVxuXHRcdFx0KVxuXHRcdFx0KVxuICAgIH0sXG5cblx0XHRsb2dJbkhhbmRsZXIgOiBmdW5jdGlvbigpe1xuXG5cdFx0XHR2YXIgZGF0YSA9IHsgdXNlcklkIDogJCgnI3VzZXJJZCcpLnZhbCgpLCBwd2QgOiAkKCcjcHdkJykudmFsKCl9O1xuXHRcdFx0dGhpcy5wcm9wcy5sb2dpblBvc3QoZGF0YSk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nSW5Gb3JtOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBTZWNyZXQgPSBbXG5cdHtcblx0XHRjb21tIDogJ1BhbmRhJyxcblx0XHRwb3NpX3B3ZCA6ICfoqI7oq5YgMTInLFxuXHRcdGRhdGEgOiBbXG5cdFx0XHR7ICdyb29tJyA6ICc4MDYnLCBzaWQ6ICcxMDExMTEyMzEnLCBuYW1lOiAn6Zmz5oCd55KHJywgcG9zaTogJ+iojuirliA0JywgaW5DaGVjazogJ3dhaXRpbmcnLCBvdXRDaGVjazogJ25vdFlldCcsIGluVGltZTogJycsIG91dFRpbWU6ICcgJyB9LFxuXHRcdFx0eyAncm9vbScgOiAnODA2Jywgc2lkOiAnMTAxMTExMjI0JywgbmFtZTogJ+a0quS6jumbhScsIHBvc2k6ICfoqI7oq5YgMycsIGluQ2hlY2s6ICd3YWl0aW5nJywgb3V0Q2hlY2s6ICdub3RZZXQnLCBpblRpbWU6ICcnLCBvdXRUaW1lOiAnICcgfSxcblx0XHRcdHsgJ3Jvb20nIDogJzgwNicsIHNpZDogJzEwMTExMTIxNScsIG5hbWU6ICfpm7flsJrmqLonLCBwb3NpOiAn6KiO6KuWIDInLCBpbkNoZWNrOiAnd2FpdGluZycsIG91dENoZWNrOiAnbm90WWV0JywgaW5UaW1lOiAnJywgb3V0VGltZTogJyAnIH0sXG5cdFx0XHR7ICdyb29tJyA6ICc4MDYnLCBzaWQ6ICcxMDExMTEyMTInLCBuYW1lOiAn6Zmz5p+P5a6JJywgcG9zaTogJ+iojuirliAxJywgaW5DaGVjazogJ3dhaXRpbmcnLCBvdXRDaGVjazogJ25vdFlldCcsIGluVGltZTogJycsIG91dFRpbWU6ICcgJyB9XG5cdFx0XVxuXHR9LFxuXHR7XG5cdFx0Y29tbSA6ICdTcnQnLFxuXHRcdHBvc2lfcHdkIDogJ+iojuirliAxMicsXG5cdFx0ZGF0YSA6IFtcblx0XHRcdHsgJ3Jvb20nIDogJzgwMScsIHNpZDogJzEwMTExMTIyNicsIG5hbWU6ICflsIvmlazmgYYnLCBwb3NpOiAn6KiO6KuWIDQnLCBpbkNoZWNrOiAnd2FpdGluZycsIG91dENoZWNrOiAnbm90WWV0JywgaW5UaW1lOiAnJywgb3V0VGltZTogJyAnIH0sXG5cdFx0XHR7ICdyb29tJyA6ICc4MDEnLCBzaWQ6ICcxMDExMTEyMjEnLCBuYW1lOiAn6Zmz5rOT5LuyJywgcG9zaTogJ+iojuirliAzJywgaW5DaGVjazogJ3dhaXRpbmcnLCBvdXRDaGVjazogJ25vdFlldCcsIGluVGltZTogJycsIG91dFRpbWU6ICcgJyB9LFxuXHRcdFx0eyAncm9vbScgOiAnODAxJywgc2lkOiAnMTAxMTExMjA3JywgbmFtZTogJ+iUoemEreasvScsIHBvc2k6ICfoqI7oq5YgMicsIGluQ2hlY2s6ICd3YWl0aW5nJywgb3V0Q2hlY2s6ICdub3RZZXQnLCBpblRpbWU6ICcnLCBvdXRUaW1lOiAnICcgfSxcblx0XHRcdHsgJ3Jvb20nIDogJzgwMScsIHNpZDogJzEwMTExMTIwMScsIG5hbWU6ICfpkJjkvbPpmZ4nLCBwb3NpOiAn6KiO6KuWIDEnLCBpbkNoZWNrOiAnd2FpdGluZycsIG91dENoZWNrOiAnbm90WWV0JywgaW5UaW1lOiAnJywgb3V0VGltZTogJyAnIH1cblx0XHRdXG5cdH1cbl07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTZWNyZXQ7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKlxuICovXG4vL3ZhciBhY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25DcmVhdG9yJyk7XG52YXIgY3ggPSBSZWFjdC5hZGRvbnMuY2xhc3NTZXQ7XG4vL1xudmFyIGNvbXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdjb21wJyxcblxuICAvKipcbiAgICogXG4gICAqL1xuXHRwcm9wVHlwZXM6IHtcblx0XHQvL0N0cmxcblx0XHRjdHJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdC8vIGNhbGxiYWNrc1xuICAgIHNlbGVjdFJvb21JRDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdH0sXG5cdFxuXHQvKipcbiAgICogXG4gICAqL1xuXHRcblx0XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XG5cdFx0dmFyIG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG5cdFx0XG5cdFx0XG5cdFx0XG5cdFx0dmFyIGFyciA9IG9wdGlvbnMubWFwKGZ1bmN0aW9uIChsb2cpIHtcblx0XHRcdHJldHVybiBSZWFjdC5ET00ub3B0aW9uKG51bGwsICBsb2cubmFtZSlcblx0XHR9LCB0aGlzKTtcblxuXHRcdFxuICAgIHJldHVybiAoXG5cdFx0XHRcdFJlYWN0LkRPTS5zZWxlY3Qoe2lkOiB0aGlzLnByb3BzLm15SUQsIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMucHJvcHMuY2hhbmdlVG9kb30sIFxuXHRcdFx0XHRcdGFyclxuXHRcdFx0XHQpXG5cdFx0KTtcbiAgfSxcblx0XG4gIC8qKlxuICAgKiBcbiAgICovXG4gIG5vb3A6IGZ1bmN0aW9uKCl7XG5cbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qKlxuICog6YCZ5pivIHJvb3Qgdmlld++8jOS5n+eoseeCuiBjb250cm9sbGVyLXZpZXdcbiAqL1xuXG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBpbXBvcnRcblxuLy8gdmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGb290ZXIgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KCByZXF1aXJlKCcuL0Zvb3Rlci5qc3gnKSApO1xudmFyIExpc3RDb250YWluZXIgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KCByZXF1aXJlKCcuL0xpc3QvTGlzdENvbnRhaW5lci5qc3gnKSApO1xuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cbi8vIENvbXBvbmVudFxuXG52YXIgTWFpbkFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ01haW5BcHAnLFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBtaXhpbnM6IFtdLFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIGZvbzogJ19fZm9vX18nLFxuICAgICAgICAgICAgLy8gYmFyOiAnX19iYXJfXydcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcbiAgICAgKiDkuLvnqIvlvI/pgLLlhaXpu55cbiAgICAgKi9cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL1RvZG9TdG9yZS5hZGRMaXN0ZW5lciggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCwgdGhpcy5fb25DaGFuZ2UgKTtcbiAgICB9LFxuXG4gICAgLy8g6YeN6KaB77yacm9vdCB2aWV3IOW7uueri+W+jOesrOS4gOS7tuS6i++8jOWwseaYr+WBteiBvSBzdG9yZSDnmoQgY2hhbmdlIOS6i+S7tlxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9cbiAgICB9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHVubW91bnRcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB9LFxuXG5cbiAgICBjb21wb25lbnREaWRVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHVwZGF0ZVxuXG4gICAgLy8g5ZyoIHJlbmRlcigpIOWJjeWft+ihjO+8jOacieapn+acg+WPr+WFiOiZleeQhiBwcm9wcyDlvoznlKggc2V0U3RhdGUoKSDlrZjotbfkvoZcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy9cbiAgICB9LFxuXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8g6YCZ5pmC5bey5LiN5Y+v55SoIHNldFN0YXRlKClcbiAgICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ1xcdE1haW5BUFAgPiB3aWxsVXBkYXRlJyApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdcXHRNYWluQVBQID4gZGlkVXBkYXRlJyApO1xuICAgIH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gcmVuZGVyXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnXFx0TWFpbkFwcCA+IHJlbmRlcicgKTtcblxuICAgICAgICByZXR1cm4gKFxuXHRcdFx0XHRcdCBSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwianVzdC13cmFwcGVyXCJ9LCBcblx0XHRcdFx0XHRcdFx0XHRMaXN0Q29udGFpbmVyKG51bGwpLCBcbiAgICAgICAgICAgICAgICBGb290ZXIobnVsbClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYWluQXBwO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBQcm9taXNlID0gcmVxdWlyZShcIi4vcHJvbWlzZS9wcm9taXNlXCIpLlByb21pc2U7XG52YXIgcG9seWZpbGwgPSByZXF1aXJlKFwiLi9wcm9taXNlL3BvbHlmaWxsXCIpLnBvbHlmaWxsO1xuZXhwb3J0cy5Qcm9taXNlID0gUHJvbWlzZTtcbmV4cG9ydHMucG9seWZpbGwgPSBwb2x5ZmlsbDsiLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCB0b1N0cmluZyAqL1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzQXJyYXk7XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzRnVuY3Rpb247XG5cbi8qKlxuICBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCB0aGUgZ2l2ZW4gcHJvbWlzZXMgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLiBUaGUgcmV0dXJuIHByb21pc2VcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgdGhhdCBnaXZlcyBhbGwgdGhlIHZhbHVlcyBpbiB0aGUgb3JkZXIgdGhleSB3ZXJlXG4gIHBhc3NlZCBpbiB0aGUgYHByb21pc2VzYCBhcnJheSBhcmd1bWVudC5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UxID0gUlNWUC5yZXNvbHZlKDEpO1xuICB2YXIgcHJvbWlzZTIgPSBSU1ZQLnJlc29sdmUoMik7XG4gIHZhciBwcm9taXNlMyA9IFJTVlAucmVzb2x2ZSgzKTtcbiAgdmFyIHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUlNWUC5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIFRoZSBhcnJheSBoZXJlIHdvdWxkIGJlIFsgMSwgMiwgMyBdO1xuICB9KTtcbiAgYGBgXG5cbiAgSWYgYW55IG9mIHRoZSBgcHJvbWlzZXNgIGdpdmVuIHRvIGBSU1ZQLmFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZTEgPSBSU1ZQLnJlc29sdmUoMSk7XG4gIHZhciBwcm9taXNlMiA9IFJTVlAucmVqZWN0KG5ldyBFcnJvcihcIjJcIikpO1xuICB2YXIgcHJvbWlzZTMgPSBSU1ZQLnJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgdmFyIHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUlNWUC5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAZm9yIFJTVlBcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgYHByb21pc2VzYCBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4qL1xuZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBQcm9taXNlID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkocHJvbWlzZXMpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byBhbGwuJyk7XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXSwgcmVtYWluaW5nID0gcHJvbWlzZXMubGVuZ3RoLFxuICAgIHByb21pc2U7XG5cbiAgICBpZiAocmVtYWluaW5nID09PSAwKSB7XG4gICAgICByZXNvbHZlKFtdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlcihpbmRleCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJlc29sdmVBbGwoaW5kZXgsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZUFsbChpbmRleCwgdmFsdWUpIHtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gdmFsdWU7XG4gICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb21pc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZXNbaV07XG5cbiAgICAgIGlmIChwcm9taXNlICYmIGlzRnVuY3Rpb24ocHJvbWlzZS50aGVuKSkge1xuICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZXIoaSksIHJlamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlQWxsKGksIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydHMuYWxsID0gYWxsOyIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgYnJvd3Nlckdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgbG9jYWwgPSAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpID8gZ2xvYmFsIDogKHRoaXMgPT09IHVuZGVmaW5lZD8gd2luZG93OnRoaXMpO1xuXG4vLyBub2RlXG5mdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsLnNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBbXTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHR1cGxlID0gcXVldWVbaV07XG4gICAgdmFyIGNhbGxiYWNrID0gdHVwbGVbMF0sIGFyZyA9IHR1cGxlWzFdO1xuICAgIGNhbGxiYWNrKGFyZyk7XG4gIH1cbiAgcXVldWUgPSBbXTtcbn1cblxudmFyIHNjaGVkdWxlRmx1c2g7XG5cbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICB2YXIgbGVuZ3RoID0gcXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ10pO1xuICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgLy8gSWYgbGVuZ3RoIGlzIDEsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgfVxufVxuXG5leHBvcnRzLmFzYXAgPSBhc2FwO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gIGBSU1ZQLlByb21pc2UuY2FzdGAgcmV0dXJucyB0aGUgc2FtZSBwcm9taXNlIGlmIHRoYXQgcHJvbWlzZSBzaGFyZXMgYSBjb25zdHJ1Y3RvclxuICB3aXRoIHRoZSBwcm9taXNlIGJlaW5nIGNhc3RlZC5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UgPSBSU1ZQLnJlc29sdmUoMSk7XG4gIHZhciBjYXN0ZWQgPSBSU1ZQLlByb21pc2UuY2FzdChwcm9taXNlKTtcblxuICBjb25zb2xlLmxvZyhwcm9taXNlID09PSBjYXN0ZWQpOyAvLyB0cnVlXG4gIGBgYFxuXG4gIEluIHRoZSBjYXNlIG9mIGEgcHJvbWlzZSB3aG9zZSBjb25zdHJ1Y3RvciBkb2VzIG5vdCBtYXRjaCwgaXQgaXMgYXNzaW1pbGF0ZWQuXG4gIFRoZSByZXN1bHRpbmcgcHJvbWlzZSB3aWxsIGZ1bGZpbGwgb3IgcmVqZWN0IGJhc2VkIG9uIHRoZSBvdXRjb21lIG9mIHRoZVxuICBwcm9taXNlIGJlaW5nIGNhc3RlZC5cblxuICBJbiB0aGUgY2FzZSBvZiBhIG5vbi1wcm9taXNlLCBhIHByb21pc2Ugd2hpY2ggd2lsbCBmdWxmaWxsIHdpdGggdGhhdCB2YWx1ZSBpc1xuICByZXR1cm5lZC5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHZhbHVlID0gMTsgLy8gY291bGQgYmUgYSBudW1iZXIsIGJvb2xlYW4sIHN0cmluZywgdW5kZWZpbmVkLi4uXG4gIHZhciBjYXN0ZWQgPSBSU1ZQLlByb21pc2UuY2FzdCh2YWx1ZSk7XG5cbiAgY29uc29sZS5sb2codmFsdWUgPT09IGNhc3RlZCk7IC8vIGZhbHNlXG4gIGNvbnNvbGUubG9nKGNhc3RlZCBpbnN0YW5jZW9mIFJTVlAuUHJvbWlzZSkgLy8gdHJ1ZVxuXG4gIGNhc3RlZC50aGVuKGZ1bmN0aW9uKHZhbCkge1xuICAgIHZhbCA9PT0gdmFsdWUgLy8gPT4gdHJ1ZVxuICB9KTtcbiAgYGBgXG5cbiAgYFJTVlAuUHJvbWlzZS5jYXN0YCBpcyBzaW1pbGFyIHRvIGBSU1ZQLnJlc29sdmVgLCBidXQgYFJTVlAuUHJvbWlzZS5jYXN0YCBkaWZmZXJzIGluIHRoZVxuICBmb2xsb3dpbmcgd2F5czpcbiAgKiBgUlNWUC5Qcm9taXNlLmNhc3RgIHNlcnZlcyBhcyBhIG1lbW9yeS1lZmZpY2llbnQgd2F5IG9mIGdldHRpbmcgYSBwcm9taXNlLCB3aGVuIHlvdVxuICBoYXZlIHNvbWV0aGluZyB0aGF0IGNvdWxkIGVpdGhlciBiZSBhIHByb21pc2Ugb3IgYSB2YWx1ZS4gUlNWUC5yZXNvbHZlXG4gIHdpbGwgaGF2ZSB0aGUgc2FtZSBlZmZlY3QgYnV0IHdpbGwgY3JlYXRlIGEgbmV3IHByb21pc2Ugd3JhcHBlciBpZiB0aGVcbiAgYXJndW1lbnQgaXMgYSBwcm9taXNlLlxuICAqIGBSU1ZQLlByb21pc2UuY2FzdGAgaXMgYSB3YXkgb2YgY2FzdGluZyBpbmNvbWluZyB0aGVuYWJsZXMgb3IgcHJvbWlzZSBzdWJjbGFzc2VzIHRvXG4gIHByb21pc2VzIG9mIHRoZSBleGFjdCBjbGFzcyBzcGVjaWZpZWQsIHNvIHRoYXQgdGhlIHJlc3VsdGluZyBvYmplY3QncyBgdGhlbmAgaXNcbiAgZW5zdXJlZCB0byBoYXZlIHRoZSBiZWhhdmlvciBvZiB0aGUgY29uc3RydWN0b3IgeW91IGFyZSBjYWxsaW5nIGNhc3Qgb24gKGkuZS4sIFJTVlAuUHJvbWlzZSkuXG5cbiAgQG1ldGhvZCBjYXN0XG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IHRvIGJlIGNhc3RlZFxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIHByb3BlcnRpZXMgb2YgYHByb21pc2VzYFxuICBoYXZlIGJlZW4gZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4qL1xuXG5cbmZ1bmN0aW9uIGNhc3Qob2JqZWN0KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSB0aGlzKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHZhciBQcm9taXNlID0gdGhpcztcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgIHJlc29sdmUob2JqZWN0KTtcbiAgfSk7XG59XG5cbmV4cG9ydHMuY2FzdCA9IGNhc3Q7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29uZmlnID0ge1xuICBpbnN0cnVtZW50OiBmYWxzZVxufTtcblxuZnVuY3Rpb24gY29uZmlndXJlKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgY29uZmlnW25hbWVdID0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvbmZpZ1tuYW1lXTtcbiAgfVxufVxuXG5leHBvcnRzLmNvbmZpZyA9IGNvbmZpZztcbmV4cG9ydHMuY29uZmlndXJlID0gY29uZmlndXJlOyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuLypnbG9iYWwgc2VsZiovXG52YXIgUlNWUFByb21pc2UgPSByZXF1aXJlKFwiLi9wcm9taXNlXCIpLlByb21pc2U7XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICB2YXIgbG9jYWw7XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbG9jYWwgPSBnbG9iYWw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50KSB7XG4gICAgbG9jYWwgPSB3aW5kb3c7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWwgPSBzZWxmO1xuICB9XG5cbiAgdmFyIGVzNlByb21pc2VTdXBwb3J0ID0gXG4gICAgXCJQcm9taXNlXCIgaW4gbG9jYWwgJiZcbiAgICAvLyBTb21lIG9mIHRoZXNlIG1ldGhvZHMgYXJlIG1pc3NpbmcgZnJvbVxuICAgIC8vIEZpcmVmb3gvQ2hyb21lIGV4cGVyaW1lbnRhbCBpbXBsZW1lbnRhdGlvbnNcbiAgICBcImNhc3RcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgXCJyZXNvbHZlXCIgaW4gbG9jYWwuUHJvbWlzZSAmJlxuICAgIFwicmVqZWN0XCIgaW4gbG9jYWwuUHJvbWlzZSAmJlxuICAgIFwiYWxsXCIgaW4gbG9jYWwuUHJvbWlzZSAmJlxuICAgIFwicmFjZVwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICAvLyBPbGRlciB2ZXJzaW9uIG9mIHRoZSBzcGVjIGhhZCBhIHJlc29sdmVyIG9iamVjdFxuICAgIC8vIGFzIHRoZSBhcmcgcmF0aGVyIHRoYW4gYSBmdW5jdGlvblxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXNvbHZlO1xuICAgICAgbmV3IGxvY2FsLlByb21pc2UoZnVuY3Rpb24ocikgeyByZXNvbHZlID0gcjsgfSk7XG4gICAgICByZXR1cm4gaXNGdW5jdGlvbihyZXNvbHZlKTtcbiAgICB9KCkpO1xuXG4gIGlmICghZXM2UHJvbWlzZVN1cHBvcnQpIHtcbiAgICBsb2NhbC5Qcm9taXNlID0gUlNWUFByb21pc2U7XG4gIH1cbn1cblxuZXhwb3J0cy5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWdcIikuY29uZmlnO1xudmFyIGNvbmZpZ3VyZSA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKS5jb25maWd1cmU7XG52YXIgb2JqZWN0T3JGdW5jdGlvbiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLm9iamVjdE9yRnVuY3Rpb247XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzRnVuY3Rpb247XG52YXIgbm93ID0gcmVxdWlyZShcIi4vdXRpbHNcIikubm93O1xudmFyIGNhc3QgPSByZXF1aXJlKFwiLi9jYXN0XCIpLmNhc3Q7XG52YXIgYWxsID0gcmVxdWlyZShcIi4vYWxsXCIpLmFsbDtcbnZhciByYWNlID0gcmVxdWlyZShcIi4vcmFjZVwiKS5yYWNlO1xudmFyIHN0YXRpY1Jlc29sdmUgPSByZXF1aXJlKFwiLi9yZXNvbHZlXCIpLnJlc29sdmU7XG52YXIgc3RhdGljUmVqZWN0ID0gcmVxdWlyZShcIi4vcmVqZWN0XCIpLnJlamVjdDtcbnZhciBhc2FwID0gcmVxdWlyZShcIi4vYXNhcFwiKS5hc2FwO1xuXG52YXIgY291bnRlciA9IDA7XG5cbmNvbmZpZy5hc3luYyA9IGFzYXA7IC8vIGRlZmF1bHQgYXN5bmMgaXMgYXNhcDtcblxuZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICBpZiAoIWlzRnVuY3Rpb24ocmVzb2x2ZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbiAgfVxuXG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaW52b2tlUmVzb2x2ZXIocmVzb2x2ZXIsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBpbnZva2VSZXNvbHZlcihyZXNvbHZlciwgcHJvbWlzZSkge1xuICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIocmVzb2x2ZVByb21pc2UsIHJlamVjdFByb21pc2UpO1xuICB9IGNhdGNoKGUpIHtcbiAgICByZWplY3RQcm9taXNlKGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSwgZXJyb3IsIHN1Y2NlZWRlZCwgZmFpbGVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChoYW5kbGVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgIHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxudmFyIFBFTkRJTkcgICA9IHZvaWQgMDtcbnZhciBTRUFMRUQgICAgPSAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgID0gMjtcblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICBzdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UsIHNldHRsZWQpIHtcbiAgdmFyIGNoaWxkLCBjYWxsYmFjaywgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycywgZGV0YWlsID0gcHJvbWlzZS5fZGV0YWlsO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBudWxsO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFByb21pc2UsXG5cbiAgX3N0YXRlOiB1bmRlZmluZWQsXG4gIF9kZXRhaWw6IHVuZGVmaW5lZCxcbiAgX3N1YnNjcmliZXJzOiB1bmRlZmluZWQsXG5cbiAgdGhlbjogZnVuY3Rpb24ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG5cbiAgICB2YXIgdGhlblByb21pc2UgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihmdW5jdGlvbigpIHt9KTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSkge1xuICAgICAgdmFyIGNhbGxiYWNrcyA9IGFyZ3VtZW50cztcbiAgICAgIGNvbmZpZy5hc3luYyhmdW5jdGlvbiBpbnZva2VQcm9taXNlQ2FsbGJhY2soKSB7XG4gICAgICAgIGludm9rZUNhbGxiYWNrKHByb21pc2UuX3N0YXRlLCB0aGVuUHJvbWlzZSwgY2FsbGJhY2tzW3Byb21pc2UuX3N0YXRlIC0gMV0sIHByb21pc2UuX2RldGFpbCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3Vic2NyaWJlKHRoaXMsIHRoZW5Qcm9taXNlLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoZW5Qcm9taXNlO1xuICB9LFxuXG4gICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gIH1cbn07XG5cblByb21pc2UuYWxsID0gYWxsO1xuUHJvbWlzZS5jYXN0ID0gY2FzdDtcblByb21pc2UucmFjZSA9IHJhY2U7XG5Qcm9taXNlLnJlc29sdmUgPSBzdGF0aWNSZXNvbHZlO1xuUHJvbWlzZS5yZWplY3QgPSBzdGF0aWNSZWplY3Q7XG5cbmZ1bmN0aW9uIGhhbmRsZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlKSB7XG4gIHZhciB0aGVuID0gbnVsbCxcbiAgcmVzb2x2ZWQ7XG5cbiAgdHJ5IHtcbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuXCIpO1xuICAgIH1cblxuICAgIGlmIChvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdGhlbiA9IHZhbHVlLnRoZW47XG5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKHRoZW4pKSB7XG4gICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgaWYgKHJlc29sdmVkKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHZhbHVlICE9PSB2YWwpIHtcbiAgICAgICAgICAgIHJlc29sdmUocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgaWYgKHJlc29sdmVkKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgcmVqZWN0KHByb21pc2UsIHZhbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuIHRydWU7IH1cbiAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKCFoYW5kbGVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSkpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykgeyByZXR1cm47IH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBTRUFMRUQ7XG4gIHByb21pc2UuX2RldGFpbCA9IHZhbHVlO1xuXG4gIGNvbmZpZy5hc3luYyhwdWJsaXNoRnVsZmlsbG1lbnQsIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiByZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykgeyByZXR1cm47IH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBTRUFMRUQ7XG4gIHByb21pc2UuX2RldGFpbCA9IHJlYXNvbjtcblxuICBjb25maWcuYXN5bmMocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hGdWxmaWxsbWVudChwcm9taXNlKSB7XG4gIHB1Ymxpc2gocHJvbWlzZSwgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQpO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgcHVibGlzaChwcm9taXNlLCBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEKTtcbn1cblxuZXhwb3J0cy5Qcm9taXNlID0gUHJvbWlzZTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCB0b1N0cmluZyAqL1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKFwiLi91dGlsc1wiKS5pc0FycmF5O1xuXG4vKipcbiAgYFJTVlAucmFjZWAgYWxsb3dzIHlvdSB0byB3YXRjaCBhIHNlcmllcyBvZiBwcm9taXNlcyBhbmQgYWN0IGFzIHNvb24gYXMgdGhlXG4gIGZpcnN0IHByb21pc2UgZ2l2ZW4gdG8gdGhlIGBwcm9taXNlc2AgYXJndW1lbnQgZnVsZmlsbHMgb3IgcmVqZWN0cy5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UxID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoXCJwcm9taXNlIDFcIik7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2UyID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoXCJwcm9taXNlIDJcIik7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUlNWUC5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSBcInByb21pc2UgMlwiIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBSU1ZQLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3QgY29tcGxldGVkXG4gIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlIGBwcm9taXNlc2BcbiAgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IGNvbXBsZXRlZCBwcm9taXNlIGhhcyBiZWNvbWVcbiAgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWQgcHJvbWlzZVxuICB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlMSA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKFwicHJvbWlzZSAxXCIpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlMiA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKFwicHJvbWlzZSAyXCIpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBSU1ZQLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gXCJwcm9taXNlMlwiIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGRlc2NyaWJpbmcgdGhlIHByb21pc2UgcmV0dXJuZWQuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgYmVjb21lcyBmdWxmaWxsZWQgd2l0aCB0aGUgdmFsdWUgdGhlIGZpcnN0XG4gIGNvbXBsZXRlZCBwcm9taXNlcyBpcyByZXNvbHZlZCB3aXRoIGlmIHRoZSBmaXJzdCBjb21wbGV0ZWQgcHJvbWlzZSB3YXNcbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gdGhhdCB0aGUgZmlyc3QgY29tcGxldGVkIHByb21pc2VcbiAgd2FzIHJlamVjdGVkIHdpdGguXG4qL1xuZnVuY3Rpb24gcmFjZShwcm9taXNlcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KHByb21pc2VzKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKTtcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXSwgcHJvbWlzZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlc1tpXTtcblxuICAgICAgaWYgKHByb21pc2UgJiYgdHlwZW9mIHByb21pc2UudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUocHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0cy5yYWNlID0gcmFjZTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICBgUlNWUC5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVqZWN0ZWQgd2l0aCB0aGUgcGFzc2VkXG4gIGByZWFzb25gLiBgUlNWUC5yZWplY3RgIGlzIGVzc2VudGlhbGx5IHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlID0gUlNWUC5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge0FueX0gcmVhc29uIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoLlxuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBpZGVudGlmeWluZyB0aGUgcmV0dXJuZWQgcHJvbWlzZS5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZWplY3RlZCB3aXRoIHRoZSBnaXZlblxuICBgcmVhc29uYC5cbiovXG5mdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBQcm9taXNlID0gdGhpcztcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcbn1cblxuZXhwb3J0cy5yZWplY3QgPSByZWplY3Q7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAgYFJTVlAucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSBmdWxmaWxsZWQgd2l0aCB0aGUgcGFzc2VkXG4gIGB2YWx1ZWAuIGBSU1ZQLnJlc29sdmVgIGlzIGVzc2VudGlhbGx5IHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlID0gUlNWUC5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAZm9yIFJTVlBcbiAgQHBhcmFtIHtBbnl9IHZhbHVlIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGlkZW50aWZ5aW5nIHRoZSByZXR1cm5lZCBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZSh2YWx1ZSkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSk7XG59XG5cbmV4cG9ydHMucmVzb2x2ZSA9IHJlc29sdmU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGlzRnVuY3Rpb24oeCkgfHwgKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIHggIT09IG51bGwpO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkoeCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG59XG5cbi8vIERhdGUubm93IGlzIG5vdCBhdmFpbGFibGUgaW4gYnJvd3NlcnMgPCBJRTlcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0RhdGUvbm93I0NvbXBhdGliaWxpdHlcbnZhciBub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuXG5cbmV4cG9ydHMub2JqZWN0T3JGdW5jdGlvbiA9IG9iamVjdE9yRnVuY3Rpb247XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmV4cG9ydHMubm93ID0gbm93OyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMuRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vbGliL0Rpc3BhdGNoZXInKVxuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBEaXNwYXRjaGVyXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnLi9pbnZhcmlhbnQnKTtcblxudmFyIF9sYXN0SUQgPSAxO1xudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NpdHktdXBkYXRlJykge1xuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBwYXlsb2FkLnNlbGVjdGVkQ2l0eTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIGNvdW50cnksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NvdW50cnktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENvdW50cnk6ICdhdXN0cmFsaWEnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBib3RoIHN0b3JlczpcbiAqXG4gKiAgICBDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIENvdW50cnlTdG9yZS5jb3VudHJ5ID0gcGF5bG9hZC5zZWxlY3RlZENvdW50cnk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSBjYWxsYmFjayB0byB1cGRhdGUgYENvdW50cnlTdG9yZWAgaXMgcmVnaXN0ZXJlZCwgd2Ugc2F2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhlIHJldHVybmVkIHRva2VuLiBVc2luZyB0aGlzIHRva2VuIHdpdGggYHdhaXRGb3IoKWAsIHdlIGNhbiBndWFyYW50ZWVcbiAqIHRoYXQgYENvdW50cnlTdG9yZWAgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrIHRoYXQgdXBkYXRlcyBgQ2l0eVN0b3JlYFxuICogbmVlZHMgdG8gcXVlcnkgaXRzIGRhdGEuXG4gKlxuICogICBDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgbWF5IG5vdCBiZSB1cGRhdGVkLlxuICogICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBpcyBub3cgZ3VhcmFudGVlZCB0byBiZSB1cGRhdGVkLlxuICpcbiAqICAgICAgIC8vIFNlbGVjdCB0aGUgZGVmYXVsdCBjaXR5IGZvciB0aGUgbmV3IGNvdW50cnlcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gZ2V0RGVmYXVsdENpdHlGb3JDb3VudHJ5KENvdW50cnlTdG9yZS5jb3VudHJ5KTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSB1c2FnZSBvZiBgd2FpdEZvcigpYCBjYW4gYmUgY2hhaW5lZCwgZm9yIGV4YW1wbGU6XG4gKlxuICogICBGbGlnaHRQcmljZVN0b3JlLmRpc3BhdGNoVG9rZW4gPVxuICogICAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvblR5cGUpIHtcbiAqICAgICAgICAgY2FzZSAnY291bnRyeS11cGRhdGUnOlxuICogICAgICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIGdldEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqXG4gKiAgICAgICAgIGNhc2UgJ2NpdHktdXBkYXRlJzpcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBgY291bnRyeS11cGRhdGVgIHBheWxvYWQgd2lsbCBiZSBndWFyYW50ZWVkIHRvIGludm9rZSB0aGUgc3RvcmVzJ1xuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MgaW4gb3JkZXI6IGBDb3VudHJ5U3RvcmVgLCBgQ2l0eVN0b3JlYCwgdGhlblxuICogYEZsaWdodFByaWNlU3RvcmVgLlxuICovXG5cbiAgZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWQgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdpdGggZXZlcnkgZGlzcGF0Y2hlZCBwYXlsb2FkLiBSZXR1cm5zXG4gICAqIGEgdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGB3YWl0Rm9yKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3Rlcj1mdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBpZCA9IF9wcmVmaXggKyBfbGFzdElEKys7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgYmFzZWQgb24gaXRzIHRva2VuLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnVucmVnaXN0ZXI9ZnVuY3Rpb24oaWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAnRGlzcGF0Y2hlci51bnJlZ2lzdGVyKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgaWRcbiAgICApO1xuICAgIGRlbGV0ZSB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF07XG4gIH07XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgY2FsbGJhY2tzIHNwZWNpZmllZCB0byBiZSBpbnZva2VkIGJlZm9yZSBjb250aW51aW5nIGV4ZWN1dGlvblxuICAgKiBvZiB0aGUgY3VycmVudCBjYWxsYmFjay4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSBhIGNhbGxiYWNrIGluXG4gICAqIHJlc3BvbnNlIHRvIGEgZGlzcGF0Y2hlZCBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5PHN0cmluZz59IGlkc1xuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUud2FpdEZvcj1mdW5jdGlvbihpZHMpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nXG4gICAgKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaWRzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIGlkID0gaWRzW2lpXTtcbiAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSxcbiAgICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgJyArXG4gICAgICAgICAgJ3dhaXRpbmcgZm9yIGAlc2AuJyxcbiAgICAgICAgICBpZFxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGludmFyaWFudChcbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgICBpZFxuICAgICAgKTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIHBheWxvYWQgdG8gYWxsIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2g9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGludmFyaWFudChcbiAgICAgICF0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2guZGlzcGF0Y2goLi4uKTogQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nXG4gICAgKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZCk7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmcoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoaXMgRGlzcGF0Y2hlciBjdXJyZW50bHkgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5pc0Rpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGwgdGhlIGNhbGxiYWNrIHN0b3JlZCB3aXRoIHRoZSBnaXZlbiBpZC4gQWxzbyBkbyBzb21lIGludGVybmFsXG4gICAqIGJvb2trZWVwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjaz1mdW5jdGlvbihpZCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IHRydWU7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdKHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQpO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB1cCBib29ra2VlcGluZyBuZWVkZWQgd2hlbiBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gZmFsc2U7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXIgYm9va2tlZXBpbmcgdXNlZCBmb3IgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGF0Y2hlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKGZhbHNlKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUb09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgcGVuZGluZ0V4Y2VwdGlvbjtcblx0dmFyIGZyb207XG5cdHZhciBrZXlzO1xuXHR2YXIgdG8gPSBUb09iamVjdCh0YXJnZXQpO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoT2JqZWN0KGZyb20pKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdGlmIChwZW5kaW5nRXhjZXB0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRwZW5kaW5nRXhjZXB0aW9uID0gZXJyO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKHBlbmRpbmdFeGNlcHRpb24pIHtcblx0XHR0aHJvdyBwZW5kaW5nRXhjZXB0aW9uO1xuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZXYUFTSFwiKSkiLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGtleU1pcnJvclxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoXCIuL2ludmFyaWFudFwiKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgIG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopLFxuICAgICdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJ1xuICApIDogaW52YXJpYW50KG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRldhQVNIXCIpKSJdfQ==
