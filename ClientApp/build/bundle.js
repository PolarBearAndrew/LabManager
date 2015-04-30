(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 *
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Promise = require('es6-promise').Promise;

var IPaddress = 'localhost:8080';
//var IPaddress = '120.96.78.88:8080';

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
			

        //$.ajax('http://' + IPaddress + '/session/manager',
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

        $.ajax('http://' + IPaddress + '/session/manager/signout',
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

        $.ajax('http://' + IPaddress + '/session/manager',
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

            // type 是為了方便將來所有 Store 內部判斷是否要處理這個 action
            actionType: AppConstants.TODO_CREATE,

            // 這裏是真正要傳出去的值
            item: newlog
        });
			
				//console.log('askForJoin', newlog);


        $.ajax('http://' + IPaddress + '/api/join',
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

        $.ajax('http://' + IPaddress + '/api/ckeckOut/' + log._id,
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

        $.ajax('http://' + IPaddress + '/api/ckeckIn/assent/' + log._id,
        {

            type:"PUT",

            data: log,

            //
            success: function(data, status, jqxhr){

							console.log('ajax-/api/ckeckOut/assent/- SUCCESS');
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
	
		checkOut: function( log ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_UPDATE,
            item: log
        });

        $.ajax('http://' + IPaddress + '/api/ckeckOut/assent/' + log._id,
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

        $.ajax('http://' + IPaddress + '/api/ckeckIn/ignore/' + log._id,
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

},{"../constants/AppConstants":3,"../dispatcher/AppDispatcher":4,"es6-promise":19}],2:[function(require,module,exports){
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

},{"./actions/AppActionCreator":1,"./constants/AppConstants":3,"./views/MainApp.jsx":16}],3:[function(require,module,exports){
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


},{"react/lib/keyMirror":35}],4:[function(require,module,exports){

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

},{"../constants/AppConstants":3,"flux":30}],5:[function(require,module,exports){
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

// 所有 todo 資料
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

            console.log( 'Store 收到資料: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.TODO_CREATE:

            arrLog.push( action.item );
				
						renewRoomInfo( action.item );

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
						
						renewRoomInfo( action.item );

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
						
						renewRoomInfo( action.item );

            console.log( 'Store 更新: ', arrLog );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
//        case AppConstants.TODO_SELECT:
//
//            //console.log( 'Store 選取: ', action.roomID );
//
//            // 選取同樣的 item 就不用處理下去了
//            if( selectedRoomID != action.roomID ){
//                selectedRoomID = action.roomID;
//                Store.emit( AppConstants.CHANGE_EVENT );
//            }
//
//
//            break;
				
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
	
	
		//show room info
    console.log('roomInfo', roomInfo);

})


//-----renew roomInfo func
function renewRoomInfo(data){
	
	console.log('start : ', data);
	
	for(var i = 0; i < roomInfo.length; i++){
		
		if( roomInfo[i].name == data.room ){
			
			for(var j = 0; j < roomInfo[i].posi.length; j++){
				
				if( roomInfo[i].posi[j].name == data.posi ){
					roomInfo[i].posi[j].occupancy = !roomInfo[i].posi[j].occupancy;
					
					console.log('roomInfo[i].posi[j].occupancy', roomInfo[i].posi[j].occupancy);
					break;
				}
			}
			
			break;
		}
	}
}

//
module.exports = Store;

},{"../actions/AppActionCreator":1,"../constants/AppConstants":3,"../dispatcher/AppDispatcher":4,"./RoomInfo.js":6,"events":17,"object-assign":33}],6:[function(require,module,exports){
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
				logRow: log, 
				key: log.id, 
				manager: manager, 
				checkOut: this.props.checkOut, 
				selectedRoomID: selectedRoomID, 
				checkOutAssent: this.props.checkOutAssent, 
				checkInAssent: this.props.checkInAssent, 
				checkInIgnore: this.props.checkInIgnore}
				)

		}, this);
		
		var inputTitle = ['Lab', 'Your ID', 'Your Name', 'Posi', 'Check in', '', '', 'Operate'];
		var theadTitle = ['Lab', 'ID', 'Name', 'Posi', 'Check in', 'Check out', 'Checked(in)', 'Checked(out)'];
		
		
    return (
			React.DOM.form(null, 
      React.DOM.table({className: "table table-hover"}, 
				ListTitle({
					titles: inputTitle, 
					listTitle: false}), 
				ListInput({
					join: this.props.join, 
					roomInfo:  this.props.roomInfo, 
					inputID:  this.props.inputID, 
					changeInputID:  this.props.changeInputID}
			
					), 
				ListTitle({
					titles: theadTitle, 
					listTitle: true}), 
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
											fail:  ctrl.isFail}
										) );
					}else{
						return null;
					}
				}(this.state.loginBoxCtrl);
			
        return (
							React.DOM.div({className: "ListContainer"}, 
								form, 
								ListHeader({
										ID: this.state.selectedRoomID, 
										selectRoomID: actions.selectRoomID, 
										manager: this.state.manager, 
										logout:  actions.logOut, 
										login:  actions.switchLogInBox, 
										roomInfo:  this.state.roomInfo}
									), 
								List({
									join: actions.askForJoin, 
									truth: this.state, 
									checkOut: actions.askForLeave, 
									checkOutAssent: actions.checkOut, 
									roomInfo:  this.state.roomInfo, 
									inputID:  this.state.selectedInputID, 
									changeInputID:  actions.changeInputID, 
					
									checkInAssent: actions.checkIn, 
									checkInIgnore: actions.checkInIgnore}
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

},{"../../actions/AppActionCreator":1,"../../constants/AppConstants":3,"../../stores/LogStore":5,"./List.jsx":8,"./ListHeader.jsx":10,"./LogInForm.jsx":14,"./Selector.jsx":15}],10:[function(require,module,exports){
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
			
				//var options = ['all', '801', '802', '803', '806', '813'];
				var roomInfo = [{ name : 'all'}].concat(this.props.roomInfo);
			
				var showID = '';
			
			  // room ID
				if(this.props.ID == 'all'){
					showID = '';
				}else{
					showID = ' - ' + this.props.ID;
				}
			
				//isManager
				//
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
					
				}.bind(this)(this.props.manager);
			
				//header
				//
        return (
						React.DOM.div({className: "header"}, 
							React.DOM.h1(null, 
									React.DOM.i({className: "fa fa-users"}), 
									'  Lab Manager  ', 
									showID 
							), 
							React.DOM.h4(null, React.DOM.span(null, "Room ID "), 
									Selector({
										myID: "selectID", 
										selectRoomID: this.props.selectRoomID, 
										changeTodo:  this.handleChange, 
										options: roomInfo }
									)
							), 
							whoAmI 
						)
        )
    },
	
	
		handleChange: function(){
			if(this.props.selectRoomID){
				var id = $('#selectID').val();
				this.props.selectRoomID(id);
			}
		},
});

module.exports = ListHeader;

},{"./Selector.jsx":15}],11:[function(require,module,exports){
/** @jsx React.DOM */
var Selector = React.createFactory( require('./Selector.jsx') );

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
    this.setInterval(this.tick, 1000); // Call a method on the mixin
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
					React.DOM.td(null, Selector({myID: "inputID", className: "input", options: roomInfo, changeTodo:  this.handleIDchange})), 
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
						React.DOM.button({className: "btn btn-primary", type: "submit", href: "#", 
							onClick: this.handleAsk}, 
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
		return time = t.getFullYear() + '-' + this.padLeft(t.getMonth(), 2)+ '-' + this.padLeft(t.getUTCDate(),2) + 'T' + this.padLeft(t.getHours(),2) + ':' + this.padLeft(t.getUTCMinutes(),2) + ':' + this.padLeft(t.getUTCSeconds(),2);
	},
	
	handleAsk: function(){
		var t = new Date($('#inputInTime').val());
		var inTime = t.getFullYear() + '/' + this.padLeft(t.getUTCMonth(), 2)+ '/' + this.padLeft(t.getUTCDate(),2) + '-' + this.padLeft(t.getUTCHours(),2) + ':' + this.padLeft(t.getUTCMinutes(),2) ;
		var postInfo = {
			room: $('#inputID').val(),
			sid: $('#inputSid').val(),
			name: $('#inputName').val(),
			posi: $('#inputPosi').val(),
			inCheck: 'waiting',
			outCheck: 'notYet',
			inTime: inTime,
		};
		this.props.join(postInfo);
		
		//don't submit
		return false;
	},
	
	handleIDchange: function(){
		this.props.changeInputID( $('#inputID').val());
	},
	
  noop: function(){ }

});

module.exports = ListInput;

},{"./Selector.jsx":15}],12:[function(require,module,exports){
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
		
		//console.log('this.props.checkInAssent', this.props.checkInAssent);
		
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
		
		//console.log('checkOut',checkOut);
		//console.log('logRow',logRow.outCheck );
		
		if(logRow.room == selectedRoomID || selectedRoomID == 'all'){
    	return (
				React.DOM.tr(null, 
					React.DOM.td(null, logRow.room), 
					React.DOM.td(null, logRow.sid), 
					React.DOM.td(null, logRow.name), 
					React.DOM.td(null, logRow.posi), 
					React.DOM.td(null, logRow.inTime), 
					React.DOM.td(null, logRow.outTime), 
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

		
	handleCheckOutAssent: function(){
		//console.log('ok to check out click');
		var t = new Date($('#inputInTime').val());
		var outTime = t.getFullYear() + '/' + this.padLeft(t.getUTCMonth(), 2)+ '/' + this.padLeft(t.getUTCDate(),2) + '-' + this.padLeft(t.getUTCHours(),2) + ':' + this.padLeft(t.getUTCMinutes(),2) ;
		
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
			console.log('login onClick');
			
			var data = { userId : $('#userId').val(), pwd : $('#pwd').val()};
			this.props.loginPost(data);
			
			return false;
		},
});

module.exports = LogInForm;
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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

},{"./Footer.jsx":7,"./List/ListContainer.jsx":9}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
"use strict";
var Promise = require("./promise/promise").Promise;
var polyfill = require("./promise/polyfill").polyfill;
exports.Promise = Promise;
exports.polyfill = polyfill;
},{"./promise/polyfill":24,"./promise/promise":25}],20:[function(require,module,exports){
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
},{"./utils":29}],21:[function(require,module,exports){
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
},{"FWaASH":18}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{"./promise":25,"./utils":29}],25:[function(require,module,exports){
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
},{"./all":20,"./asap":21,"./cast":22,"./config":23,"./race":26,"./reject":27,"./resolve":28,"./utils":29}],26:[function(require,module,exports){
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
},{"./utils":29}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":31}],31:[function(require,module,exports){
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

},{"./invariant":32}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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
},{"FWaASH":18}],35:[function(require,module,exports){
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
},{"./invariant":34,"FWaASH":18}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvci5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL2Jvb3QuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL2FwcC9qcy9jb25zdGFudHMvQXBwQ29uc3RhbnRzLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvc3RvcmVzL0xvZ1N0b3JlLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvc3RvcmVzL1Jvb21JbmZvLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvRm9vdGVyLmpzeCIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdC5qc3giLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL2FwcC9qcy92aWV3cy9MaXN0L0xpc3RDb250YWluZXIuanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9MaXN0SGVhZGVyLmpzeCIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdElucHV0LmpzeCIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvYXBwL2pzL3ZpZXdzL0xpc3QvTGlzdEl0ZW0uanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9MaXN0VGl0bGUuanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9Mb2dJbkZvcm0uanN4IiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9hcHAvanMvdmlld3MvTGlzdC9TZWxlY3Rvci5qc3giLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL2FwcC9qcy92aWV3cy9NYWluQXBwLmpzeCIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL21haW4uanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvYWxsLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2FzYXAuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvY2FzdC5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9jb25maWcuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcG9seWZpbGwuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcHJvbWlzZS5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9yYWNlLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3JlamVjdC5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9yZXNvbHZlLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3V0aWxzLmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvZmx1eC9pbmRleC5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9mbHV4L2xpYi9pbnZhcmlhbnQuanMiLCIvVXNlcnMvYW5kcmV3L0xhYk1hbmFnZXIvQ2xpZW50QXBwL25vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiL1VzZXJzL2FuZHJldy9MYWJNYW5hZ2VyL0NsaWVudEFwcC9ub2RlX21vZHVsZXMvcmVhY3QvbGliL2ludmFyaWFudC5qcyIsIi9Vc2Vycy9hbmRyZXcvTGFiTWFuYWdlci9DbGllbnRBcHAvbm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9rZXlNaXJyb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKlxuICovXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnZXM2LXByb21pc2UnKS5Qcm9taXNlO1xuXG52YXIgSVBhZGRyZXNzID0gJ2xvY2FsaG9zdDo4MDgwJztcbi8vdmFyIElQYWRkcmVzcyA9ICcxMjAuOTYuNzguODg6ODA4MCc7XG5cbi8vIOWwseaYr+WAi+WWrue0lOeahCBoYXNoIHRhYmxlXG4vLyDlm6DmraTkuIvpnaLmiYDmnInmjIfku6Tnmoblj6/oppbngrogQWN0aW9uIHN0YXRpYyBtZXRob2RcbnZhciBBcHBBY3Rpb25DcmVhdG9ycyA9IHtcblxuICAgIC8qKlxuICAgICAqIGFwcCBpbml0LCBmaXJzdCBsb2FkXG4gICAgICovXG4gICAgbG9hZDogZnVuY3Rpb24oKXtcblxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9hcGkvbG9nLycsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6XCJHRVRcIixcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxeGhyKXtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAneGhyIOWPluWbnuizh+aWmTogJywgZGF0YSApO1xuICAgICAgICAgICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdHlwZSDmmK/ngrrkuobmlrnkvr/lsIfkvobmiYDmnIkgU3RvcmUg5YWn6YOo5Yik5pa35piv5ZCm6KaB6JmV55CG6YCZ5YCLIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19MT0FELFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIOmAmeijj+aYr+ecn+ato+imgeWCs+WHuuWOu+eahOWAvFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhy6Yyv6KqkOiAnLCB4aHIucmVzcG9uc2VUZXh0ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblx0XHRcdFx0XG4gICAgfSxcblx0XG5cdFx0bG9nSW46IGZ1bmN0aW9uKCBwb3N0RGF0YSApe1xuXHRcdFx0XG5cbiAgICAgICAgLy8kLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9zZXNzaW9uL21hbmFnZXInLFxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy91c2Vycy9hcGkvY2hlY2snLFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOlwiUE9TVFwiLFxuXHRcdFx0XHRcdFx0ZGF0YTogeyB1c2VySWQgOiBwb3N0RGF0YS51c2VySWQsIHB3ZCA6IHBvc3REYXRhLnB3ZCB9LFxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXHRcdFx0XHRcdFx0XHQvL2RvIG5vdGhpbmdcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnW1BPU1RdIHNldCBzZXNzaW9uJyk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRpZihkYXRhLmlzTWFuYWdlcil7XG5cdFx0XHRcdFx0XHRcdFx0QXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuSlVTVF9SRUZSRVNILFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW06IGRhdGFcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oeyBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuU1dJVENIX0xPR0lOQk9YIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oeyBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuTE9HSU5fRkFJTCB9KTtcblx0XHRcdFx0XHRcdFx0fVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hocumMr+iqpDogJywgeGhyLnJlc3BvbnNlVGV4dCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cdFx0XHRcdFxuICAgIH0sXG5cdFxuXHRcdGxvZ091dDogZnVuY3Rpb24oKXtcblxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9zZXNzaW9uL21hbmFnZXIvc2lnbm91dCcsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6XCJERUxFVEVcIixcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxeGhyKXtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1tERUxFVEVdIHNpZ24gb3V0Jyk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuSlVTVF9SRUZSRVNILFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtOiBkYXRhXG5cdFx0XHRcdFx0XHRcdH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hocumMr+iqpDogJywgeGhyLnJlc3BvbnNlVGV4dCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cdFx0XHRcdFxuICAgIH0sXG5cdFxuXHRcdENoZWNrSXNNYW5nZXI6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvc2Vzc2lvbi9tYW5hZ2VyJyxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTpcIkdFVFwiLFxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXHRcdFx0XHRcdFx0XHQvL2RvIG5vdGhpbmdcblx0XHRcdFx0XHRcdFx0aWYoIWRhdGEuaXNNYW5hZ2VyKXtcblx0XHRcdFx0XHRcdFx0XHRkYXRhLmlzTWFuYWdlciA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuSlVTVF9SRUZSRVNILFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtOiBkYXRhXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1tHRVRdIGdldCBzZXNzaW9uIC0tPicsIGRhdGEuaXNNYW5hZ2VyKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHhociwgc3RhdHVzLCBlcnJUZXh0ICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICd4aHLpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXHRcdFx0XHRcbiAgICB9LFxuXHRcblx0XHRzZWxlY3RSb29tSUQ6IGZ1bmN0aW9uKCByb29tSUQgKSB7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnc2VsZWN0IGFjdGlvbicsIHJvb21JRCk7XG5cdFx0XHRcbiAgICAgICAgQXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5UT0RPX1NFTEVDVCxcbiAgICAgICAgICAgIHJvb21JRDogcm9vbUlEXG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIC8qIFxuXHRcdCAqXG4gICAgICovXG4gICAgYXNrRm9ySm9pbjogZnVuY3Rpb24oIG5ld2xvZyApIHtcblxuICAgICAgICAvLyAxLiDlu6Pmkq3ntaYgc3RvcmUg55+l6YGT5Y67IG9wdGltaXN0aWMg5pu05pawIHZpZXdcbiAgICAgICAgQXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcblxuICAgICAgICAgICAgLy8gdHlwZSDmmK/ngrrkuobmlrnkvr/lsIfkvobmiYDmnIkgU3RvcmUg5YWn6YOo5Yik5pa35piv5ZCm6KaB6JmV55CG6YCZ5YCLIGFjdGlvblxuICAgICAgICAgICAgYWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLlRPRE9fQ1JFQVRFLFxuXG4gICAgICAgICAgICAvLyDpgJnoo4/mmK/nnJ/mraPopoHlgrPlh7rljrvnmoTlgLxcbiAgICAgICAgICAgIGl0ZW06IG5ld2xvZ1xuICAgICAgICB9KTtcblx0XHRcdFxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdhc2tGb3JKb2luJywgbmV3bG9nKTtcblxuXG4gICAgICAgICQuYWpheCgnaHR0cDovLycgKyBJUGFkZHJlc3MgKyAnL2FwaS9qb2luJyxcbiAgICAgICAge1xuXG4gICAgICAgICAgICB0eXBlOlwiUE9TVFwiLFxuXG4gICAgICAgICAgICAvLyDms6jmhI/opoHmraPnorroqK3lrpogaGVhZGVyIOizh+aWmeWei+WIpVxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuXG4gICAgICAgICAgICAvLyDnhLblvozlsIcgaXRlbSDovYnmiJAganNvbiBzdHJpbmcg5YaN6YCB5Ye6XG4gICAgICAgICAgICAvLyDpgJnmqKPlj6/norrkv50gTnVtYmVyIOiIhyBCb29sZWFuIOWAvOWIsCBzZXJ2ZXIg5b6M6IO95q2j56K65L+d55WZ5Z6L5YilXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdsb2cpLFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ+aWsOWinuizh+aWmee1kOaenDogJywgZGF0YS5pZCApO1xuICAgICAgICAgICAgICAgIC8vIOWwhyBzZXJ2ZXIg55Sf5oiQ55qEIGlkIOabtOaWsOWIsOaXqeWFiOW7uueri+eahOeJqeS7tu+8jOS5i+W+jOizh+aWmeaJjeacg+S4gOiHtFxuICAgICAgICAgICAgICAgIG5ld2xvZy5faWQgPSBkYXRhLmlkO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHQkKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLnZhbCgnJyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhyIOmMr+iqpDogJywgeGhyLnJlc3BvbnNlVGV4dCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBhc2tGb3JMZWF2ZTogZnVuY3Rpb24oIGxvZyApIHtcblx0XHRcdFxuICAgICAgICBBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLlRPRE9fVVBEQVRFLFxuICAgICAgICAgICAgaXRlbTogbG9nXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQuYWpheCgnaHR0cDovLycgKyBJUGFkZHJlc3MgKyAnL2FwaS9ja2Vja091dC8nICsgbG9nLl9pZCxcbiAgICAgICAge1xuXG4gICAgICAgICAgICB0eXBlOlwiUFVUXCIsXG5cbiAgICAgICAgICAgIGRhdGE6IGxvZyxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICfnt6jovK/os4fmlpnntZDmnpw6ICcsIGRhdGEgKTtcblxuICAgICAgICAgICAgICAgIC8vIOWwhyBzZXJ2ZXIg55Sf5oiQ55qEIHVpZCDmm7TmlrDliLDml6nlhYjlu7rnq4vnmoTnianku7bvvIzkuYvlvozos4fmlpnmiY3mnIPkuIDoh7RcbiAgICAgICAgICAgICAgICAvL2l0ZW0uaWQgPSBkYXRhLmlkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hociDpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblxuXHRcdGNoZWNrSW46IGZ1bmN0aW9uKCBsb2cgKSB7XG5cdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKGxvZy5faWQpO1xuXG4gICAgICAgIEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBBcHBDb25zdGFudHMuVE9ET19VUERBVEUsXG4gICAgICAgICAgICBpdGVtOiBsb2dcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5hamF4KCdodHRwOi8vJyArIElQYWRkcmVzcyArICcvYXBpL2NrZWNrSW4vYXNzZW50LycgKyBsb2cuX2lkLFxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHR5cGU6XCJQVVRcIixcblxuICAgICAgICAgICAgZGF0YTogbG9nLFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2FqYXgtL2FwaS9ja2Vja091dC9hc3NlbnQvLSBTVUNDRVNTJyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICfnt6jovK/os4fmlpnntZDmnpw6ICcsIGRhdGEgKTtcblxuICAgICAgICAgICAgICAgIC8vIOWwhyBzZXJ2ZXIg55Sf5oiQ55qEIHVpZCDmm7TmlrDliLDml6nlhYjlu7rnq4vnmoTnianku7bvvIzkuYvlvozos4fmlpnmiY3mnIPkuIDoh7RcbiAgICAgICAgICAgICAgICAvL2l0ZW0uaWQgPSBkYXRhLmlkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggeGhyLCBzdGF0dXMsIGVyclRleHQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3hociDpjK/oqqQ6ICcsIHhoci5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfSxcblx0XG5cdFx0Y2hlY2tPdXQ6IGZ1bmN0aW9uKCBsb2cgKSB7XG5cbiAgICAgICAgQXBwRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5UT0RPX1VQREFURSxcbiAgICAgICAgICAgIGl0ZW06IGxvZ1xuICAgICAgICB9KTtcblxuICAgICAgICAkLmFqYXgoJ2h0dHA6Ly8nICsgSVBhZGRyZXNzICsgJy9hcGkvY2tlY2tPdXQvYXNzZW50LycgKyBsb2cuX2lkLFxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHR5cGU6XCJQVVRcIixcblxuICAgICAgICAgICAgZGF0YTogbG9nLFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcXhocil7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ+e3qOi8r+izh+aWmee1kOaenDogJywgZGF0YSApO1xuXG4gICAgICAgICAgICAgICAgLy8g5bCHIHNlcnZlciDnlJ/miJDnmoQgdWlkIOabtOaWsOWIsOaXqeWFiOW7uueri+eahOeJqeS7tu+8jOS5i+W+jOizh+aWmeaJjeacg+S4gOiHtFxuICAgICAgICAgICAgICAgIC8vaXRlbS5pZCA9IGRhdGEuaWQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhyIOmMr+iqpDogJywgeGhyLnJlc3BvbnNlVGV4dCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9LFxuXHRcblx0XHRjaGVja0luSWdub3JlOiBmdW5jdGlvbiggbG9nICkge1xuXHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZyhsb2cuX2lkKTtcblxuICAgICAgICBBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLlRPRE9fUkVNT1ZFLFxuICAgICAgICAgICAgaXRlbTogbG9nXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQuYWpheCgnaHR0cDovLycgKyBJUGFkZHJlc3MgKyAnL2FwaS9ja2Vja0luL2lnbm9yZS8nICsgbG9nLl9pZCxcbiAgICAgICAge1xuXG4gICAgICAgICAgICB0eXBlOlwiREVMRVRFXCIsXG5cbiAgICAgICAgICAgIGRhdGE6IGxvZyxcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganF4aHIpe1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCB4aHIsIHN0YXR1cywgZXJyVGV4dCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAneGhyIOmMr+iqpDogJywgeGhyLnJlc3BvbnNlVGV4dCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9LFxuXHRcblx0XHRzd2l0Y2hMb2dJbkJveDogZnVuY3Rpb24oKXtcblx0XHRcdEFwcERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7IGFjdGlvblR5cGU6IEFwcENvbnN0YW50cy5TV0lUQ0hfTE9HSU5CT1ggfSk7XG5cdFx0fSxcblx0XG5cdFx0Y2hhbmdlSW5wdXRJRDogZnVuY3Rpb24oIGlucHV0SUQgKXtcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHRBcHBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oeyBcblx0XHRcdFx0YWN0aW9uVHlwZTogQXBwQ29uc3RhbnRzLkNIQU5HRV9JTlBVVElELFxuXHRcdFx0XHRpbnB1dElEOiBpbnB1dElEXG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcbiAgICAvLyBkdW1teVxuICAgIG5vb3A6IGZ1bmN0aW9uKCl7fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBBY3Rpb25DcmVhdG9ycztcbiIsIi8qXG4gKiDpgJnmlK/mmK/nqIvlvI/pgLLlhaXpu57vvIzlroPosqDosqzlu7rnq4sgcm9vdCB2aWV3IChjb250cm9sbGVyIHZpZXcp77yMXG4gKiDkuZ/lsLHmmK8gVG9kb0FwcCDpgJnlgIvlhYPku7ZcbiAqXG4gKiBib290LmpzIOWtmOWcqOeahOebruWcsO+8jOaYr+WboOeCuumAmuW4uCBhcHAg5ZWf5YuV5pmC5pyJ6Kix5aSa5YWI5pyf5bel5L2c6KaB5a6M5oiQ77yMXG4gKiDkvovlpoLpoJDovInos4fmlpnliLAgc3RvcmUg5YWn44CB5qqi5p+l5pys5Zyw56uvIGRiIOeLgOaFi+OAgeWIh+aPm+S4jeWQjOiqnuezu+Wtl+S4suOAgVxuICog6YCZ5Lqb5bel5L2c6YO95YWI5ZyoIGJvb3QuanMg5YWn5YGa5a6M77yM5YaN5ZWf5YuVIFRvZG9BcHAgdmlldyDlu7rnq4vnlavpnaLmmK/mr5TovIPlpb3nmoRcbiAqXG4gKi9cblxuLy8gdjAuMTIg6ZaL5aeL6KaB55SoIGZhY3Rvcnkg5YyF5LiA5qyh5omN6IO955u05o6l5ZG85Y+rXG52YXIgTWFpbkFwcCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi92aWV3cy9NYWluQXBwLmpzeCcpKTtcblxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xudmFyIGFjdGlvbnMgPSByZXF1aXJlKCcuL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvcicpO1xuXG4kKGZ1bmN0aW9uKCl7XG5cbiAgLy8g5ouJ5Zue56ys5LiA5YyF6LOH5paZ57Wm55Wr6Z2i55SoXG4gIGFjdGlvbnMubG9hZCgpO1xuXG5cdC8vIOWVn+WLlSByb290IHZpZXcg5pmC6KaB5YKz5YWl5YGH6LOH5paZXG5cdFJlYWN0LnJlbmRlciggTWFpbkFwcCgpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJykgKTtcblxufSlcbiIsIi8qKlxuICogVG9kb0NvbnN0YW50c1xuICovXG5cbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdyZWFjdC9saWIva2V5TWlycm9yJyk7XG5cbi8vIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuLy8g5Lmf5bCx5piv6K6TIGhhc2gg55qEIGtleSDoiIcgdmFsdWUg5YC85LiA5qijXG4vLyDkuI3nhLbljp/mnKwgdmFsdWUg6YO95pivIG51bGxcbi8vIOS4jemBjuaXoueEtuWmguatpO+8jOeCuuS9leS4jeS5vuiEhueUqCBzZXQg5LmL6aGe5Y+q5pyJa2V5IOeahOWwseWlvVxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuXG5cdFNPVVJDRV9WSUVXX0FDVElPTjogbnVsbCxcblx0U09VUkNFX1NFUlZFUl9BQ1RJT046IG51bGwsXG5cdFNPVVJDRV9ST1VURVJfQUNUSU9OOiBudWxsLFxuXG4gIFx0Q0hBTkdFX0VWRU5UOiBudWxsLFxuXG4gICAgVE9ET19MT0FEOiBudWxsLFxuICBcdFRPRE9fQ1JFQVRFOiBudWxsLFxuICBcdFRPRE9fUkVNT1ZFOiBudWxsLFxuICBcdFRPRE9fVVBEQVRFOiBudWxsLFxuICBcdFRPRE9fU0VMRUNUOiBudWxsLFxuXHRcblx0XHRKVVNUX1JFRlJFU0g6IG51bGwsXG5cdFx0U1dJVENIX0xPR0lOQk9YOiBudWxsLFxuXHRcdExPR0lOX0ZBSUw6IG51bGwsXG5cdFx0Q0hBTkdFX0lOUFVUSUQ6IG51bGwsXG5cbiAgXHRub29wOiBudWxsXG59KTtcblxuIiwiXG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xuXG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5cbi8qKlxuICogZmx1eC1jaGF0IOWFp+acgOaWsOeahCBkaXNwYXRjaGVyXG4gKi9cbnZhciBBcHBEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcblxuLy8g5rOo5oSP77ya6YCZ6KOP562J5pa85piv57m85om/IERpc3BhdGNoZXIgY2xhc3Mg6Lqr5LiK5omA5pyJ5oyH5Luk77yM55uu5YmN5piv6K6T5q2k54mp5Lu25L+x5pyJ5buj5pKt6IO95YqfXG4vLyDlkIzmqKPlip/og73kuZ/lj6/nlKggdW5kZXJzY29yZS5leHRlbmQg5oiWIE9iamVjdC5hc3NpZ24oKSDlgZrliLBcbi8vIOS7iuWkqeWboOeCuuacieeUqCBqcXVlcnkg5bCx6KuL5a6D5Luj5Yue5LqGXG4kLmV4dGVuZCggQXBwRGlzcGF0Y2hlciwge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFjdGlvbiBUaGUgZGV0YWlscyBvZiB0aGUgYWN0aW9uLCBpbmNsdWRpbmcgdGhlIGFjdGlvbidzXG4gICAgICogdHlwZSBhbmQgYWRkaXRpb25hbCBkYXRhIGNvbWluZyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICovXG4gICAgaGFuZGxlU2VydmVyQWN0aW9uOiBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICAgICAgICBzb3VyY2U6IEFwcENvbnN0YW50cy5TT1VSQ0VfU0VSVkVSX0FDVElPTixcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaChwYXlsb2FkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICovXG4gICAgaGFuZGxlVmlld0FjdGlvbjogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgICAgc291cmNlOiBBcHBDb25zdGFudHMuU09VUkNFX1ZJRVdfQUNUSU9OLFxuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGlzcGF0Y2gocGF5bG9hZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWwh+S+huWVn+eUqCByb3V0ZXIg5pmC77yM6YCZ6KOP6JmV55CG5omA5pyJIHJvdXRlciBldmVudFxuICAgICAqL1xuICAgIGhhbmRsZVJvdXRlckFjdGlvbjogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoKHtcbiAgICAgICAgICAgIHNvdXJjZTogQXBwQ29uc3RhbnRzLlNPVVJDRV9ST1VURVJfQUNUSU9OLFxuICAgICAgICAgICAgYWN0aW9uOiBwYXRoXG4gICAgICAgIH0pO1xuICAgIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwRGlzcGF0Y2hlcjtcbiIsIi8qKlxuICogVG9kb1N0b3JlXG4gKi9cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBJTVBPUlRcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XG52YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvcicpO1xuXG52YXIgUm9vbUluZm8gPSByZXF1aXJlKCcuL1Jvb21JbmZvLmpzJyk7XG5cbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyOyAvLyDlj5blvpfkuIDlgIsgcHViL3N1YiDlu6Pmkq3lmahcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBQdWJsaWMgQVBJXG5cbi8vIOetieWQjOaWvCBUb2RvU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbi8vIOW+nuatpOWPluW+l+W7o+aSreeahOiDveWKm1xuLy8g55Sx5pa85bCH5L6G5pyD6L+U6YKEIFRvZG9TdG9yZSDlh7rljrvvvIzlm6DmraTkuIvpnaLlr6vnmoTmnIPlhajororngrogcHVibGljIG1ldGhvZHNcbnZhciBTdG9yZSA9IHt9O1xuXG4vLyDmiYDmnIkgdG9kbyDos4fmlplcbnZhciBhcnJMb2cgPSBbXTtcblxuLy8g55uu5YmN6YG45Y+W55qEIHJvb20gSURcbnZhciBzZWxlY3RlZFJvb21JRCA9ICdhbGwnO1xudmFyIHNlbGVjdGVkUm9vbUlEaW5wdXQgPSAnODAxJztcblxuLy8g5piv5ZCm54K6bWFuYWdlclxudmFyIG1hbmFnZXIgPSB7XG5cdGlzTWFuYWdlciA6IGZhbHNlLFxuXHRuYW1lIDogJ2d1ZXN0J1xufVxuXG4vL2xvZ2luIGlucHV0IGJveFxudmFyIGxvZ2luQm94ID0ge1xuXHRpc1Nob3cgOiBmYWxzZSxcblx0aXNGYWlsIDogZmFsc2Vcbn07IFxuXG4vL3Jvb20gaW5mb1xudmFyIHJvb21JbmZvID0gUm9vbUluZm87XG5cbi8qKlxuICog5bu656uLIFN0b3JlIGNsYXNz77yM5Lim5LiU57m85om/IEV2ZW50RU1pdHRlciDku6Xmk4HmnInlu6Pmkq3lip/og71cbiAqL1xub2JqZWN0QXNzaWduKCBTdG9yZSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgLyoqXG4gICAgICogUHVibGljIEFQSVxuICAgICAqIOS+m+WklueVjOWPluW+lyBzdG9yZSDlhafpg6jos4fmlplcbiAgICAgKi9cbiAgICBnZXRMb2c6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBhcnJMb2c7XG4gICAgfSxcblxuICAgIGdldFNlbGVjdGVkUm9vbUlEOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gc2VsZWN0ZWRSb29tSUQ7XG4gICAgfSxcblx0XG5cdFx0Z2V0U2VsZWN0ZWRSb29tSURpbnB1dDogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkUm9vbUlEaW5wdXQ7XG5cdFx0fSxcblx0XG5cdFx0Z2V0TG9naW5Cb3hTaG93Q3RybDogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIGxvZ2luQm94O1xuXHRcdH0sXG5cblx0XHRnZXRSb29tSW5mbzogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIHJvb21JbmZvO1xuXHRcdH0sXG5cdFxuXHRcdGdldElzTWFuYWdlcjogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIG1hbmFnZXI7XG5cdFx0fSxcblx0XG5cdFx0c2V0TWFuYWdlcjogZnVuY3Rpb24oaW5mbyl7XG5cdFx0XHRcdG1hbmFnZXIgPSBpbmZvO1xuXHRcdH0sXG5cdFxuICAgIC8vXG4gICAgbm9vcDogZnVuY3Rpb24oKXt9XG59KTtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBldmVudCBoYW5kbGVyc1xuXG5TdG9yZS5kaXNwYXRjaFRva2VuID0gQXBwRGlzcGF0Y2hlci5yZWdpc3RlciggZnVuY3Rpb24gZXZlbnRIYW5kbGVycyhldnQpe1xuXG4gICAgLy8gZXZ0IC5hY3Rpb24g5bCx5pivIHZpZXcg55W25pmC5buj5pKt5Ye65L6G55qE5pW05YyF54mp5Lu2XG4gICAgLy8g5a6D5YWn5ZCrIGFjdGlvblR5cGVcbiAgICB2YXIgYWN0aW9uID0gZXZ0LmFjdGlvbjtcblxuICAgIHN3aXRjaCAoYWN0aW9uLmFjdGlvblR5cGUpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLlRPRE9fTE9BRDpcblxuICAgICAgICAgICAgYXJyTG9nID0gYWN0aW9uLml0ZW1zO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ1N0b3JlIOaUtuWIsOizh+aWmTogJywgYXJyTG9nICk7XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5UT0RPX0NSRUFURTpcblxuICAgICAgICAgICAgYXJyTG9nLnB1c2goIGFjdGlvbi5pdGVtICk7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmVuZXdSb29tSW5mbyggYWN0aW9uLml0ZW0gKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICdTdG9yZSDmlrDlop46ICcsIGFyckxvZyApO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuVE9ET19SRU1PVkU6XG5cbiAgICAgICAgICAgIGFyckxvZyA9IGFyckxvZy5maWx0ZXIoIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtICE9IGFjdGlvbi5pdGVtO1xuICAgICAgICAgICAgfSlcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmVuZXdSb29tSW5mbyggYWN0aW9uLml0ZW0gKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICdTdG9yZSDliKrlrow6ICcsIGFyckxvZyApO1xuXG4gICAgICAgICAgICBTdG9yZS5lbWl0KCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5UICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuVE9ET19VUERBVEU6XG5cdFx0XHRcdFxuXHRcdFx0XHRcdFx0YXJyTG9nID0gYXJyTG9nLmZpbHRlciggZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdFx0XHRcdGlmKGl0ZW0uX2lkID09IGFjdGlvbi5pdGVtLl9pZCl7XG5cdFx0XHRcdFx0XHRcdFx0aXRlbSA9IGFjdGlvbi5pdGVtO1xuXHRcdFx0XHRcdFx0XHR9XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtIDtcbiAgICAgICAgICAgIH0pXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHJlbmV3Um9vbUluZm8oIGFjdGlvbi5pdGVtICk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnU3RvcmUg5pu05pawOiAnLCBhcnJMb2cgKTtcblxuICAgICAgICAgICAgU3RvcmUuZW1pdCggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCApO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4vLyAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuVE9ET19TRUxFQ1Q6XG4vL1xuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnU3RvcmUg6YG45Y+WOiAnLCBhY3Rpb24ucm9vbUlEICk7XG4vL1xuLy8gICAgICAgICAgICAvLyDpgbjlj5blkIzmqKPnmoQgaXRlbSDlsLHkuI3nlKjomZXnkIbkuIvljrvkuoZcbi8vICAgICAgICAgICAgaWYoIHNlbGVjdGVkUm9vbUlEICE9IGFjdGlvbi5yb29tSUQgKXtcbi8vICAgICAgICAgICAgICAgIHNlbGVjdGVkUm9vbUlEID0gYWN0aW9uLnJvb21JRDtcbi8vICAgICAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcbi8vICAgICAgICAgICAgfVxuLy9cbi8vXG4vLyAgICAgICAgICAgIGJyZWFrO1xuXHRcdFx0XHRcblx0XHRcdFx0LyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5KVVNUX1JFRlJFU0g6XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdTdG9yZSBKdXN0IFJlZnJlc2gnKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0XHRtYW5hZ2VyID0gYWN0aW9uLml0ZW07XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cdFx0XHRcdFxuXHRcdFx0XHQvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLlNXSVRDSF9MT0dJTkJPWDpcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJ1N0b3JlIHN3aXRjaCBsb2dpbiBib3gnKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0XHRsb2dpbkJveC5pc1Nob3cgPSAhbG9naW5Cb3guaXNTaG93O1xuXHRcdFx0XHRcdFx0bG9naW5Cb3guaXNGYWlsID0gZmFsc2U7XG5cbiAgICAgICAgICAgIFN0b3JlLmVtaXQoIEFwcENvbnN0YW50cy5DSEFOR0VfRVZFTlQgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cdFx0XHRcdFxuXHRcdFx0XHQvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLkxPR0lOX0ZBSUw6XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdsb2dpbiBmYWlsJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdFx0bG9naW5Cb3guaXNGYWlsID0gdHJ1ZTtcblxuICAgICAgICAgICAgU3RvcmUuZW1pdCggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCApO1xuXG4gICAgICAgICAgICBicmVhaztcblx0XHRcdFx0LyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjYXNlIEFwcENvbnN0YW50cy5DSEFOR0VfSU5QVVRJRDpcblxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2NoYW5nZSBpbnB1dCBpZCcpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRcdHNlbGVjdGVkUm9vbUlEaW5wdXQgPSBhY3Rpb24uaW5wdXRJRDtcblxuICAgICAgICAgICAgU3RvcmUuZW1pdCggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCApO1xuXG4gICAgICAgICAgICBicmVhaztcblx0XHRcdFx0XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICB9XG5cdFxuXHRcblx0XHQvL3Nob3cgcm9vbSBpbmZvXG4gICAgY29uc29sZS5sb2coJ3Jvb21JbmZvJywgcm9vbUluZm8pO1xuXG59KVxuXG5cbi8vLS0tLS1yZW5ldyByb29tSW5mbyBmdW5jXG5mdW5jdGlvbiByZW5ld1Jvb21JbmZvKGRhdGEpe1xuXHRcblx0Y29uc29sZS5sb2coJ3N0YXJ0IDogJywgZGF0YSk7XG5cdFxuXHRmb3IodmFyIGkgPSAwOyBpIDwgcm9vbUluZm8ubGVuZ3RoOyBpKyspe1xuXHRcdFxuXHRcdGlmKCByb29tSW5mb1tpXS5uYW1lID09IGRhdGEucm9vbSApe1xuXHRcdFx0XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgcm9vbUluZm9baV0ucG9zaS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiggcm9vbUluZm9baV0ucG9zaVtqXS5uYW1lID09IGRhdGEucG9zaSApe1xuXHRcdFx0XHRcdHJvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5ID0gIXJvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5O1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdyb29tSW5mb1tpXS5wb3NpW2pdLm9jY3VwYW5jeScsIHJvb21JbmZvW2ldLnBvc2lbal0ub2NjdXBhbmN5KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuLy9cbm1vZHVsZS5leHBvcnRzID0gU3RvcmU7XG4iLCJ2YXIgUm9vbUluZm8gPSBbXG5cdHtcblx0XHRuYW1lIDogJzgwMScsXG5cdFx0cG9zaUluZm8gOiB7IHBjIDogMjQsIGNvbiA6IDEyfSxcblx0XHRwb3NpIDogW11cblx0fSxcblx0e1xuXHRcdG5hbWUgOiAnODAyJyxcblx0XHRwb3NpSW5mbyA6IHsgcGMgOiAxMiwgY29uIDogMTJ9LFxuXHRcdHBvc2kgOiBbXVxuXHR9LFxuXHR7XG5cdFx0bmFtZSA6ICc4MDQnLFxuXHRcdHBvc2lJbmZvIDogeyBwYyA6IDEyLCBjb24gOiAxMn0sXG5cdFx0cG9zaSA6IFtdXG5cdH0sXG5cdHtcblx0XHRuYW1lIDogJzgwNicsXG5cdFx0cG9zaUluZm8gOiB7IHBjIDogMTIsIGNvbiA6IDEyfSxcblx0XHRwb3NpIDogW11cblx0fSxcblx0e1xuXHRcdG5hbWUgOiAnODEzJyxcblx0XHRwb3NpSW5mbyA6IHsgcGMgOiAxMiwgY29uIDogMTJ9LFxuXHRcdHBvc2kgOiBbXVxuXHR9LFxuXHR7XG5cdFx0bmFtZSA6ICc4MDAnLFxuXHRcdHBvc2lJbmZvIDogeyBwYyA6IDAsIGNvbiA6IDEyfSxcblx0XHRwb3NpIDogW11cblx0fVxuXVxuXG4vL2luaXQgYXJyYXlcbnZhciBwb3NpQXJ5ID0gZnVuY3Rpb24ocGMsIGNvbil7XG5cdHZhciB0bXAgPSBbXTtcblx0XG5cdGZvcih2YXIgaSA9IDE7IGkgPD0gcGM7IGkrKyApe1xuXHRcdHRtcC5wdXNoKHsgbmFtZTogJ1BDICcgKyBpLCBvY2N1cGFuY3k6IGZhbHNlIH0pO1xuXHR9XG5cdFxuXHRmb3IodmFyIGkgPSAxOyBpIDw9IGNvbjsgaSsrICl7XG5cdFx0dG1wLnB1c2goeyBuYW1lOiAn6KiO6KuWICcgKyBpLCBvY2N1cGFuY3k6IGZhbHNlIH0pO1xuXHR9XG5cdHJldHVybiB0bXBcbn07XG5cbmZvcih2YXIgaSA9IDA7IGkgPCBSb29tSW5mby5sZW5ndGg7IGkrKyl7XG5cdFJvb21JbmZvW2ldLnBvc2kgPSBwb3NpQXJ5KCBSb29tSW5mb1tpXS5wb3NpSW5mby5wYywgUm9vbUluZm9baV0ucG9zaUluZm8uY29uKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSb29tSW5mbzsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcbiAqXG4gKi9cbnZhciBSZWFjdFByb3BUeXBlcyA9IFJlYWN0LlByb3BUeXBlcztcbnZhciBhY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9BcHBBY3Rpb25DcmVhdG9yJyk7XG5cbnZhciBGb290ZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdGb290ZXInLFxuXG4gIHByb3BUeXBlczoge1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gIFx0cmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5mb290ZXIoe2NsYXNzTmFtZTogXCJmb290ZXJcIn0sIFxuICAgICAgICBSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBcImF1dGhvclwifSwgXG4gICAgICAgICAgICBcIkF1dGhvciB8IEFuZHJldyBDaGVuICBcIiwgJyggTWF5IC8gMjAxNSApJ1xuXHRcdFx0XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuXG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvb3RlcjtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qKlxuICpcbiAqL1xuXG52YXIgTGlzdEl0ZW0gPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vTGlzdEl0ZW0uanN4JykpO1xudmFyIExpc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9MaXN0SW5wdXQuanN4JykpO1xudmFyIExpc3RUaXRsZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9MaXN0VGl0bGUuanN4JykpO1xuXG4vL1xudmFyIGNvbXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdjb21wJyxcblx0XG5cdHByb3BUeXBlczoge1xuXG5cdFx0bG9nOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgcm9vbTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRcdGluVGltZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIG91dFRpbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBpbkNoZWNrOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgb3V0Q2hlY2s6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSksXG5cdFx0XG5cdFx0Ly8gY2FsbGJhY2tzXG4gICAgY2hlY2tPdXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGNoZWNrSW5JZ25vcmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHR9LFxuICAvKipcbiAgICpcbiAgICovXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyDlj5blh7rmiYDmnInopoHnuaroo73nmoTos4fmlplcbiAgICB2YXIgYXJybG9nID0gdGhpcy5wcm9wcy50cnV0aC5hcnJMb2c7XG5cdFx0dmFyIHNlbGVjdGVkUm9vbUlEID0gdGhpcy5wcm9wcy50cnV0aC5zZWxlY3RlZFJvb21JRDtcblx0XHR2YXIgbWFuYWdlciA9IHRoaXMucHJvcHMudHJ1dGgubWFuYWdlcjtcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMuY2hlY2tJbkFzc2VudCk7XG5cdFx0XG5cdFx0XG5cdFx0Ly8g6LeRIGxvb3Ag5LiA562G562G5bu65oiQIExpc3RJdGVtIOWFg+S7tlxuXHRcdHZhciBhcnIgPSBhcnJsb2cubWFwKGZ1bmN0aW9uIChsb2cpIHtcblx0XHRcdFxuXHRcdFx0Ly8g5rOo5oSP5q+P5YCLIGl0ZW0g6KaB5pyJ5LiA5YCL542o5LiA54Sh5LqM55qEIGtleSDlgLxcblx0XHRcdHJldHVybiBMaXN0SXRlbSh7XG5cdFx0XHRcdGxvZ1JvdzogbG9nLCBcblx0XHRcdFx0a2V5OiBsb2cuaWQsIFxuXHRcdFx0XHRtYW5hZ2VyOiBtYW5hZ2VyLCBcblx0XHRcdFx0Y2hlY2tPdXQ6IHRoaXMucHJvcHMuY2hlY2tPdXQsIFxuXHRcdFx0XHRzZWxlY3RlZFJvb21JRDogc2VsZWN0ZWRSb29tSUQsIFxuXHRcdFx0XHRjaGVja091dEFzc2VudDogdGhpcy5wcm9wcy5jaGVja091dEFzc2VudCwgXG5cdFx0XHRcdGNoZWNrSW5Bc3NlbnQ6IHRoaXMucHJvcHMuY2hlY2tJbkFzc2VudCwgXG5cdFx0XHRcdGNoZWNrSW5JZ25vcmU6IHRoaXMucHJvcHMuY2hlY2tJbklnbm9yZX1cblx0XHRcdFx0KVxuXG5cdFx0fSwgdGhpcyk7XG5cdFx0XG5cdFx0dmFyIGlucHV0VGl0bGUgPSBbJ0xhYicsICdZb3VyIElEJywgJ1lvdXIgTmFtZScsICdQb3NpJywgJ0NoZWNrIGluJywgJycsICcnLCAnT3BlcmF0ZSddO1xuXHRcdHZhciB0aGVhZFRpdGxlID0gWydMYWInLCAnSUQnLCAnTmFtZScsICdQb3NpJywgJ0NoZWNrIGluJywgJ0NoZWNrIG91dCcsICdDaGVja2VkKGluKScsICdDaGVja2VkKG91dCknXTtcblx0XHRcblx0XHRcbiAgICByZXR1cm4gKFxuXHRcdFx0UmVhY3QuRE9NLmZvcm0obnVsbCwgXG4gICAgICBSZWFjdC5ET00udGFibGUoe2NsYXNzTmFtZTogXCJ0YWJsZSB0YWJsZS1ob3ZlclwifSwgXG5cdFx0XHRcdExpc3RUaXRsZSh7XG5cdFx0XHRcdFx0dGl0bGVzOiBpbnB1dFRpdGxlLCBcblx0XHRcdFx0XHRsaXN0VGl0bGU6IGZhbHNlfSksIFxuXHRcdFx0XHRMaXN0SW5wdXQoe1xuXHRcdFx0XHRcdGpvaW46IHRoaXMucHJvcHMuam9pbiwgXG5cdFx0XHRcdFx0cm9vbUluZm86ICB0aGlzLnByb3BzLnJvb21JbmZvLCBcblx0XHRcdFx0XHRpbnB1dElEOiAgdGhpcy5wcm9wcy5pbnB1dElELCBcblx0XHRcdFx0XHRjaGFuZ2VJbnB1dElEOiAgdGhpcy5wcm9wcy5jaGFuZ2VJbnB1dElEfVxuXHRcdFx0XG5cdFx0XHRcdFx0KSwgXG5cdFx0XHRcdExpc3RUaXRsZSh7XG5cdFx0XHRcdFx0dGl0bGVzOiB0aGVhZFRpdGxlLCBcblx0XHRcdFx0XHRsaXN0VGl0bGU6IHRydWV9KSwgXG5cdFx0XHRcdFJlYWN0LkRPTS50Ym9keShudWxsLCBcbiAgICAgICAgICBhcnJcblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LkRPTS50Zm9vdChudWxsLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQoe2NsYXNzTmFtZTogXCJ0YWJsZUVuZFwiLCBjb2xTcGFuOiBcIjhcIn0sIFwiLS0tIFtFbmRdIC0tLVwiKVxuXHRcdFx0XHQpXG4gICAgICApXG5cdFx0XHQpXG4gICAgKTtcblxuICB9LFxuXG4gIG5vb3A6IGZ1bmN0aW9uKCl7ICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKiDpgJnmmK8gcm9vdCB2aWV377yM5Lmf56ix54K6IGNvbnRyb2xsZXItdmlld1xuICovXG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBpbXBvcnRcblxuLy8gdmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbi8vdmFyIElucHV0Qm94ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9JbnB1dEJveC5qc3gnKSApO1xudmFyIExpc3QgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KCByZXF1aXJlKCcuL0xpc3QuanN4JykgKTtcbnZhciBMaXN0SGVhZGVyID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9MaXN0SGVhZGVyLmpzeCcpICk7XG52YXIgU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KCByZXF1aXJlKCcuL1NlbGVjdG9yLmpzeCcpICk7XG52YXIgTG9nSW5Gb3JtID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9Mb2dJbkZvcm0uanN4JykgKTtcblxudmFyIExvZ1N0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0xvZ1N0b3JlJyk7XG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xuXG52YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvcicpO1xuXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gQ29tcG9uZW50XG5cbnZhciBMaXN0Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTGlzdENvbnRhaW5lcicsXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gbWl4aW4gfCBwcm9wcyB8IGRlZmF1bHQgdmFsdWVcblxuICAgIG1peGluczogW10sXG5cbiAgICAvLyDpgJnoo4/liJflh7rmiYDmnInopoHnlKjliLDnmoQgcHJvcGVydHkg6IiH5YW26aCQ6Kit5YC8XG4gICAgLy8g5a6D5ZyoIGdldEluaXRpYWxTdGF0ZSgpIOWJjeWft+ihjO+8jOatpOaZgiB0aGlzLnN0YXRlIOmChOaYr+epuuWAvFxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBmb286ICdfX2Zvb19fJyxcbiAgICAgICAgICAgIC8vIGJhcjogJ19fYmFyX18nXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8vIOmAmeijj+WIl+WHuuavj+WAiyBwcm9wIOeahOWei+WIpe+8jOS9huWPquacg+WcqCBkZXYgdGltZSDmqqLmn6VcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgLy8gZm9vOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIC8vIGJhcjogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgICB9LFxuXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gbW91bnRcblxuICAgIC8vIOmAmeaYryBjb21wb25lbnQgQVBJLCDlnKggbW91bnQg5YmN5pyD6LeR5LiA5qyh77yM5Y+W5YC85YGa54K6IHRoaXMuc3RhdGUg55qE6aCQ6Kit5YC8XG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldFRydXRoKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOS4u+eoi+W8j+mAsuWFpem7nlxuICAgICAqL1xuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICBMb2dTdG9yZS5hZGRMaXN0ZW5lciggQXBwQ29uc3RhbnRzLkNIQU5HRV9FVkVOVCwgdGhpcy5fb25DaGFuZ2UgKTtcbiAgICB9LFxuXG4gICAgLy8g6YeN6KaB77yacm9vdCB2aWV3IOW7uueri+W+jOesrOS4gOS7tuS6i++8jOWwseaYr+WBteiBvSBzdG9yZSDnmoQgY2hhbmdlIOS6i+S7tlxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9cbiAgICB9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHVubW91bnRcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvL1RvZG9TdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG5cbiAgICB9LFxuXG5cbiAgICBjb21wb25lbnREaWRVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHVwZGF0ZVxuXG4gICAgLy8g5ZyoIHJlbmRlcigpIOWJjeWft+ihjO+8jOacieapn+acg+WPr+WFiOiZleeQhiBwcm9wcyDlvoznlKggc2V0U3RhdGUoKSDlrZjotbfkvoZcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy9cbiAgICB9LFxuXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8g6YCZ5pmC5bey5LiN5Y+v55SoIHNldFN0YXRlKClcbiAgICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ1xcdE1haW5BUFAgPiB3aWxsVXBkYXRlJyApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdcXHRNYWluQVBQID4gZGlkVXBkYXRlJyApO1xuICAgIH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gcmVuZGVyXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XG5cdFx0XHRcdHZhciBmb3JtID0gZnVuY3Rpb24oY3RybCkge1xuXHRcdFx0XHRcdGlmKGN0cmwuaXNTaG93KXtcblx0XHRcdFx0XHRcdHJldHVybiAoIExvZ0luRm9ybSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3V0OiBhY3Rpb25zLnN3aXRjaExvZ0luQm94LCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb2dpblBvc3Q6ICBhY3Rpb25zLmxvZ0luLCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmYWlsOiAgY3RybC5pc0ZhaWx9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCkgKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSh0aGlzLnN0YXRlLmxvZ2luQm94Q3RybCk7XG5cdFx0XHRcbiAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIkxpc3RDb250YWluZXJcIn0sIFxuXHRcdFx0XHRcdFx0XHRcdGZvcm0sIFxuXHRcdFx0XHRcdFx0XHRcdExpc3RIZWFkZXIoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRJRDogdGhpcy5zdGF0ZS5zZWxlY3RlZFJvb21JRCwgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGVjdFJvb21JRDogYWN0aW9ucy5zZWxlY3RSb29tSUQsIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtYW5hZ2VyOiB0aGlzLnN0YXRlLm1hbmFnZXIsIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb2dvdXQ6ICBhY3Rpb25zLmxvZ091dCwgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvZ2luOiAgYWN0aW9ucy5zd2l0Y2hMb2dJbkJveCwgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvb21JbmZvOiAgdGhpcy5zdGF0ZS5yb29tSW5mb31cblx0XHRcdFx0XHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFx0XHRcdExpc3Qoe1xuXHRcdFx0XHRcdFx0XHRcdFx0am9pbjogYWN0aW9ucy5hc2tGb3JKb2luLCBcblx0XHRcdFx0XHRcdFx0XHRcdHRydXRoOiB0aGlzLnN0YXRlLCBcblx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrT3V0OiBhY3Rpb25zLmFza0ZvckxlYXZlLCBcblx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrT3V0QXNzZW50OiBhY3Rpb25zLmNoZWNrT3V0LCBcblx0XHRcdFx0XHRcdFx0XHRcdHJvb21JbmZvOiAgdGhpcy5zdGF0ZS5yb29tSW5mbywgXG5cdFx0XHRcdFx0XHRcdFx0XHRpbnB1dElEOiAgdGhpcy5zdGF0ZS5zZWxlY3RlZElucHV0SUQsIFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hhbmdlSW5wdXRJRDogIGFjdGlvbnMuY2hhbmdlSW5wdXRJRCwgXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHRjaGVja0luQXNzZW50OiBhY3Rpb25zLmNoZWNrSW4sIFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tJbklnbm9yZTogYWN0aW9ucy5jaGVja0luSWdub3JlfVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0KVxuICAgICAgICApXG4gICAgfSxcblx0XHRcdFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHByaXZhdGUgbWV0aG9kcyAtIOiZleeQhuWFg+S7tuWFp+mDqOeahOS6i+S7tlxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgJ2NoYW5nZScgZXZlbnRzIGNvbWluZyBmcm9tIHRoZSBUb2RvU3RvcmVcbiAgICAgKlxuICAgICAqIGNvbnRyb2xsZXItdmlldyDlgbXogb3liLAgbW9kZWwgY2hhbmdlIOW+jFxuICAgICAqIOWft+ihjOmAmeaUr++8jOWug+aTjeS9nOWPpuS4gOaUryBwcml2YXRlIG1ldGhvZCDljrvot58gbW9kZWwg5Y+W5pyA5paw5YC8XG4gICAgICog54S25b6M5pON5L2cIGNvbXBvbmVudCBsaWZlIGN5Y2xlIOeahCBzZXRTdGF0ZSgpIOWwh+aWsOWAvOeBjOWFpeWFg+S7tumrlOezu1xuICAgICAqIOWwseacg+inuOeZvOS4gOmAo+S4siBjaGlsZCBjb21wb25lbnRzIOi3n+iRl+mHjee5quWbiVxuICAgICAqL1xuICAgIF9vbkNoYW5nZTogZnVuY3Rpb24oKXtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKCAnX29uQ2hhbmdlIOmHjee5qjogJywgdGhpcy5nZXRUcnV0aCgpICk7XG5cbiAgICAgICAgLy8g6YeN6KaB77ya5b6eIHJvb3QgdmlldyDop7jnmbzmiYDmnIkgc3ViLXZpZXcg6YeN57mqXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoIHRoaXMuZ2V0VHJ1dGgoKSApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDngrrkvZXopoHnjajnq4vlr6vkuIDmlK/vvJ/lm6DngrrmnIPmnInlhanlgIvlnLDmlrnmnIPnlKjliLDvvIzlm6DmraTmir3lh7rkvoZcbiAgICAgKiDnm67lnLDvvJpcbiAgICAgKiAgICAg5ZCR5ZCE5YCLIHN0b3JlIOWPluWbnuizh+aWme+8jOeEtuW+jOe1seS4gCBzZXRTdGF0ZSgpIOWGjeS4gOWxpOWxpOW+gOS4i+WCs+mBnlxuICAgICAqL1xuICAgIGdldFRydXRoOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyDmmK/lvp4gVG9kb1N0b3JlIOWPluizh+aWmShhcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aClcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFyckxvZzogTG9nU3RvcmUuZ2V0TG9nKCksXG5cdFx0XHRcdFx0XHRzZWxlY3RlZFJvb21JRDogTG9nU3RvcmUuZ2V0U2VsZWN0ZWRSb29tSUQoKSxcblx0XHRcdFx0XHRcdHNlbGVjdGVkSW5wdXRJRDogTG9nU3RvcmUuZ2V0U2VsZWN0ZWRSb29tSURpbnB1dCgpLFxuXHRcdFx0XHRcdFx0bWFuYWdlcjogTG9nU3RvcmUuZ2V0SXNNYW5hZ2VyKCksXG5cdFx0XHRcdFx0XHRsb2dpbkJveEN0cmw6IExvZ1N0b3JlLmdldExvZ2luQm94U2hvd0N0cmwoKSxcblx0XHRcdFx0XHRcdHJvb21JbmZvOiBMb2dTdG9yZS5nZXRSb29tSW5mbygpLFxuICAgICAgICAgfTtcbiAgICB9XG5cblx0XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDb250YWluZXI7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi92YXIgU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KCByZXF1aXJlKCcuL1NlbGVjdG9yLmpzeCcpICk7XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gQ29tcG9uZW50XG5cbnZhciBMaXN0SGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTGlzdEhlYWRlcicsXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbiAgICAvLyDpgJnoo4/liJflh7rmr4/lgIsgcHJvcCDnmoTlnovliKXvvIzkvYblj6rmnIPlnKggZGV2IHRpbWUg5qqi5p+lXG4gICBwcm9wVHlwZXM6IHtcblx0XHQvLyBjYWxsYmFja3Ncblx0XHRcdHNlbGVjdFJvb21JRDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdFx0XHRsb2dvdXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRcdH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gcmVuZGVyXG5cdFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFxuXHRcdFx0XHQvL3ZhciBvcHRpb25zID0gWydhbGwnLCAnODAxJywgJzgwMicsICc4MDMnLCAnODA2JywgJzgxMyddO1xuXHRcdFx0XHR2YXIgcm9vbUluZm8gPSBbeyBuYW1lIDogJ2FsbCd9XS5jb25jYXQodGhpcy5wcm9wcy5yb29tSW5mbyk7XG5cdFx0XHRcblx0XHRcdFx0dmFyIHNob3dJRCA9ICcnO1xuXHRcdFx0XG5cdFx0XHQgIC8vIHJvb20gSURcblx0XHRcdFx0aWYodGhpcy5wcm9wcy5JRCA9PSAnYWxsJyl7XG5cdFx0XHRcdFx0c2hvd0lEID0gJyc7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHNob3dJRCA9ICcgLSAnICsgdGhpcy5wcm9wcy5JRDtcblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRcdC8vaXNNYW5hZ2VyXG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciB3aG9BbUkgPSBmdW5jdGlvbihtZyl7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dmFyIHNob3cgPSB7fTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZihtZy5pc01hbmFnZXIpe1xuXHRcdFx0XHRcdFx0c2hvdy5zdHIgPSAnLi4uICBJIGFtIGEgbWFuYWdlciwgbXkgbmFtZSBpcyAnO1xuXHRcdFx0XHRcdFx0c2hvdy5uYW1lID0gbWcubmFtZTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaDUoe2NsYXNzTmFtZTogXCJsZWFkXCJ9LCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0IHNob3cuc3RyLCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogXCJ0ZXh0LXN1Y2Nlc3MgaXNOYW1lXCJ9LCBcIiBcIiwgIHNob3cubmFtZSwgXCIgXCIpLCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2hyZWY6IFwiI1wiLCBvbkNsaWNrOiB0aGlzLnByb3BzLmxvZ291dH0sIFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtc2lnbi1vdXRcIn0pKVxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHNob3cuc3RyID0gJy4uLiBZb3VyIGFyZSBhIG1hbmFnZXIgPyAnO1xuXHRcdFx0XHRcdFx0c2hvdy5uYW1lID0gJ2xvZ0luJztcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmg1KHtjbGFzc05hbWU6IFwibGVhZFwifSwgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCBzaG93LnN0ciwgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtocmVmOiBcIiNcIiwgb25DbGljazogdGhpcy5wcm9wcy5sb2dpbn0sIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwidGV4dC1wcmltYXJ5XCJ9LCBcIiBcIiwgIHNob3cubmFtZSwgXCIgXCIpLCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNpZ24taW5cIn0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH0uYmluZCh0aGlzKSh0aGlzLnByb3BzLm1hbmFnZXIpO1xuXHRcdFx0XG5cdFx0XHRcdC8vaGVhZGVyXG5cdFx0XHRcdC8vXG4gICAgICAgIHJldHVybiAoXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaGVhZGVyXCJ9LCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmgxKG51bGwsIFxuXHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS11c2Vyc1wifSksIFxuXHRcdFx0XHRcdFx0XHRcdFx0JyAgTGFiIE1hbmFnZXIgICcsIFxuXHRcdFx0XHRcdFx0XHRcdFx0c2hvd0lEIFxuXHRcdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmg0KG51bGwsIFJlYWN0LkRPTS5zcGFuKG51bGwsIFwiUm9vbSBJRCBcIiksIFxuXHRcdFx0XHRcdFx0XHRcdFx0U2VsZWN0b3Ioe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRteUlEOiBcInNlbGVjdElEXCIsIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RSb29tSUQ6IHRoaXMucHJvcHMuc2VsZWN0Um9vbUlELCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hhbmdlVG9kbzogIHRoaXMuaGFuZGxlQ2hhbmdlLCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogcm9vbUluZm8gfVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRcdFx0d2hvQW1JIFxuXHRcdFx0XHRcdFx0KVxuICAgICAgICApXG4gICAgfSxcblx0XG5cdFxuXHRcdGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oKXtcblx0XHRcdGlmKHRoaXMucHJvcHMuc2VsZWN0Um9vbUlEKXtcblx0XHRcdFx0dmFyIGlkID0gJCgnI3NlbGVjdElEJykudmFsKCk7XG5cdFx0XHRcdHRoaXMucHJvcHMuc2VsZWN0Um9vbUlEKGlkKTtcblx0XHRcdH1cblx0XHR9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdEhlYWRlcjtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFNlbGVjdG9yID0gUmVhY3QuY3JlYXRlRmFjdG9yeSggcmVxdWlyZSgnLi9TZWxlY3Rvci5qc3gnKSApO1xuXG4vKipcbiAqXG4gKi9cblxudmFyIFNldEludGVydmFsTWl4aW4gPSB7XG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnRlcnZhbHMgPSBbXTtcbiAgfSxcbiAgc2V0SW50ZXJ2YWw6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW50ZXJ2YWxzLnB1c2goc2V0SW50ZXJ2YWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmludGVydmFscy5tYXAoY2xlYXJJbnRlcnZhbCk7XG4gIH1cbn07XG5cbnZhciBMaXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdMaXN0SW5wdXQnLFxuXHRcblx0bWl4aW5zOiBbU2V0SW50ZXJ2YWxNaXhpbl0sIC8vIFVzZSB0aGUgbWl4aW5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbm93ID0gdGhpcy5oYW5kbGVUaW1lKCk7XG4gICAgcmV0dXJuIHt0aW1lOiBub3cgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0SW50ZXJ2YWwodGhpcy50aWNrLCAxMDAwKTsgLy8gQ2FsbCBhIG1ldGhvZCBvbiB0aGUgbWl4aW5cbiAgfSxcblx0XG4gIHRpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBub3cgPSB0aGlzLmhhbmRsZVRpbWUoKTtcbiAgICB0aGlzLnNldFN0YXRlKHt0aW1lOiBub3cgfSk7XG4gIH0sXG5cdFxuXHRwcm9wVHlwZXM6IHtcblx0XHRvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuXHR9LFxuXHRcbiAgLyoqXG4gICAqXG4gICAqL1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdHZhciBpbnB1dElEID0gdGhpcy5wcm9wcy5pbnB1dElEO1xuXHRcdHZhciByb29tSW5mbyA9ICB0aGlzLnByb3BzLnJvb21JbmZvO1xuXHRcdHZhciBwb3NpT3B0aW9ucyA9IFtdO1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHJvb21JbmZvLmxlbmd0aDsgaSsrICl7XG5cdFx0XHRpZiggcm9vbUluZm9baV0ubmFtZSA9PSBpbnB1dElEICl7XG5cdFx0XHRcdHBvc2lPcHRpb25zID0gcm9vbUluZm9baV0ucG9zaS5maWx0ZXIoZnVuY3Rpb24ocG9zaSl7XG5cdFx0XHRcdFx0aWYoIHBvc2kub2NjdXBhbmN5ID09IGZhbHNlICl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcG9zaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcbiAgICByZXR1cm4gKFxuXHRcdFx0UmVhY3QuRE9NLnRoZWFkKG51bGwsIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBTZWxlY3Rvcih7bXlJRDogXCJpbnB1dElEXCIsIGNsYXNzTmFtZTogXCJpbnB1dFwiLCBvcHRpb25zOiByb29tSW5mbywgY2hhbmdlVG9kbzogIHRoaXMuaGFuZGxlSURjaGFuZ2V9KSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBSZWFjdC5ET00uaW5wdXQoe2lkOiBcImlucHV0U2lkXCIsIHR5cGU6IFwidGV4dFwiLCBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIG5hbWU6IFwic2lkXCJ9KSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBSZWFjdC5ET00uaW5wdXQoe2lkOiBcImlucHV0TmFtZVwiLCB0eXBlOiBcInRleHRcIiwgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBuYW1lOiBcIm5hbWVcIn0pKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIFNlbGVjdG9yKHtteUlEOiBcImlucHV0UG9zaVwiLCBjbGFzc05hbWU6IFwiaW5wdXRcIiwgb3B0aW9uczogcG9zaU9wdGlvbnN9KSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7Y29sU3BhbjogXCIyXCJ9LCBcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pbnB1dCh7XHRpZDogXCJpbnB1dEluVGltZVwiLCBcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lLWxvY2FsXCIsIFx0Y2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBcInRpbWVcIiwgcmVhZE9ubHk6IFwidHJ1ZVwiLCBcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS50aW1lfVxuXHRcdFx0XHRcdFx0KSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsXG5cdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmJ1dHRvbih7Y2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBocmVmOiBcIiNcIiwgXG5cdFx0XHRcdFx0XHRcdG9uQ2xpY2s6IHRoaXMuaGFuZGxlQXNrfSwgXG4gIFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtdXNlci1wbHVzIC1vIGZhLWxnXCJ9KSwgXG5cdFx0XHRcdFx0XHRcdCcgSm9pbidcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHQpXG4gICAgKTtcbi8vXHRcdFx0XHRcdFx0PGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi13YXJuaW5nXCIgaHJlZj1cIiNcIj5cbi8vICBcdFx0XHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1yZXBlYXQgLW8gZmEtbGdcIj48L2k+IFxuLy9cdFx0XHRcdFx0XHRcdHsnIFJlc2V0J31cbi8vXHRcdFx0XHRcdFx0PC9hPlxuICB9LFxuXHRcdFxuXHRwYWRMZWZ0OiBmdW5jdGlvbihzdHIsbGVuKXtcblx0XHRpZigoJycgKyBzdHIpLmxlbmd0aCA+PSBsZW4pe1xuXHRcdFx0XHRyZXR1cm4gc3RyO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFkTGVmdCggJzAnICsgc3RyLCBsZW4pO1xuXHRcdFx0fVxuXHR9LFxuXHRcblx0aGFuZGxlVGltZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgdCA9IG5ldyBEYXRlKCk7XG5cdFx0cmV0dXJuIHRpbWUgPSB0LmdldEZ1bGxZZWFyKCkgKyAnLScgKyB0aGlzLnBhZExlZnQodC5nZXRNb250aCgpLCAyKSsgJy0nICsgdGhpcy5wYWRMZWZ0KHQuZ2V0VVRDRGF0ZSgpLDIpICsgJ1QnICsgdGhpcy5wYWRMZWZ0KHQuZ2V0SG91cnMoKSwyKSArICc6JyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ01pbnV0ZXMoKSwyKSArICc6JyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ1NlY29uZHMoKSwyKTtcblx0fSxcblx0XG5cdGhhbmRsZUFzazogZnVuY3Rpb24oKXtcblx0XHR2YXIgdCA9IG5ldyBEYXRlKCQoJyNpbnB1dEluVGltZScpLnZhbCgpKTtcblx0XHR2YXIgaW5UaW1lID0gdC5nZXRGdWxsWWVhcigpICsgJy8nICsgdGhpcy5wYWRMZWZ0KHQuZ2V0VVRDTW9udGgoKSwgMikrICcvJyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ0RhdGUoKSwyKSArICctJyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ0hvdXJzKCksMikgKyAnOicgKyB0aGlzLnBhZExlZnQodC5nZXRVVENNaW51dGVzKCksMikgO1xuXHRcdHZhciBwb3N0SW5mbyA9IHtcblx0XHRcdHJvb206ICQoJyNpbnB1dElEJykudmFsKCksXG5cdFx0XHRzaWQ6ICQoJyNpbnB1dFNpZCcpLnZhbCgpLFxuXHRcdFx0bmFtZTogJCgnI2lucHV0TmFtZScpLnZhbCgpLFxuXHRcdFx0cG9zaTogJCgnI2lucHV0UG9zaScpLnZhbCgpLFxuXHRcdFx0aW5DaGVjazogJ3dhaXRpbmcnLFxuXHRcdFx0b3V0Q2hlY2s6ICdub3RZZXQnLFxuXHRcdFx0aW5UaW1lOiBpblRpbWUsXG5cdFx0fTtcblx0XHR0aGlzLnByb3BzLmpvaW4ocG9zdEluZm8pO1xuXHRcdFxuXHRcdC8vZG9uJ3Qgc3VibWl0XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRcblx0aGFuZGxlSURjaGFuZ2U6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VJbnB1dElEKCAkKCcjaW5wdXRJRCcpLnZhbCgpKTtcblx0fSxcblx0XG4gIG5vb3A6IGZ1bmN0aW9uKCl7IH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdElucHV0O1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKlxuICovXG4vL3ZhciBhY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25DcmVhdG9yJyk7XG4vL3ZhciBjeCA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldDtcbi8vXG52YXIgY29tcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2NvbXAnLFxuXG4gIC8qKlxuICAgKiBcbiAgICovXG4vLyAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCl7XG4vLyAgICAgIHRoaXMuJGlucHV0ID0gJCh0aGlzLmdldERPTU5vZGUoKSkuZmluZCgnc3BhbicpLmZpcnN0KCk7XG4vLyAgICAgIHRoaXMuJHJlbW92ZSA9IHRoaXMuJGlucHV0Lm5leHQoKTtcbi8vICB9LFxuXG5cdFxuXHRwcm9wVHlwZXM6IHtcblxuXHRcdHRvZG9JdGVtOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdFx0c2VsZWN0ZWRSb29tSUQ6ICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdFx0aXNNYW5hZ2VyOiAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHRcdFx0XG4gICAgfSksXG5cdFx0XG5cdFx0Ly8gY2FsbGJhY2tzXG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25SZW1vdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHR9LFxuXHRcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLnByb3BzLmNoZWNrSW5Bc3NlbnQnLCB0aGlzLnByb3BzLmNoZWNrSW5Bc3NlbnQpO1xuXHRcdFxuXHRcdHZhciBzZWxlY3RlZFJvb21JRCA9IHRoaXMucHJvcHMuc2VsZWN0ZWRSb29tSUQ7XG5cdFx0dmFyIGxvZ1JvdyA9IHRoaXMucHJvcHMubG9nUm93O1xuXHRcdHZhciBtYW5hZ2VyID0gdGhpcy5wcm9wcy5tYW5hZ2VyO1xuXHRcdFxuXHRcdC8vdGQgY2hlY2sgaW5cblx0XHR2YXIgY2hlY2tJbiA9IGZ1bmN0aW9uKGNrKXtcblx0XHRcdGlmKGNrID09ICd3YWl0aW5nJyB8fCBjayA9PSAnJyApe1xuXHRcdFx0XHQvL3dhaXRpbmcgZm9yIGNoZWNraW4gc3VibWl0XG5cdFx0XHRcdFxuXHRcdFx0XHRpZihtYW5hZ2VyLmlzTWFuYWdlcil7XG5cdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjdHJsc1wifSwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi14c1wiLCBocmVmOiBcIiNcIiwgb25DbGljazogdGhpcy5oYW5kbGVDaGVja0luQXNzZW50fSwgXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1jaGVja1wifSksIFxuXHRcdFx0XHRcdFx0XHRcdCcgQXNzZW50J1xuXHRcdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRcdFx0JyAgJywgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtjbGFzc05hbWU6IFwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCIsIGhyZWY6IFwiI1wiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNoZWNrSW5JZ25vcmV9LCBcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXRyYXNoLW9cIn0pLCBcblx0XHRcdFx0XHRcdFx0XHQnIElnbm9yZSdcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0KSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJldHVybiBSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNwaW5uZXIgZmEtcHVsc2VcIn0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdC8vc2hvdyB3aG8gY2hlY2tlZCBmb3IgeW91XG5cdFx0XHRcdHJldHVybiAgUmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1jaGVja1wifSwgY2spIDtcblx0XHRcdH1cblx0XHR9LmJpbmQodGhpcykobG9nUm93LmluQ2hlY2spO1xuXHRcdFxuXHRcdFxuXHRcdC8vdGQgY2hlY2sgb3V0XG5cdFx0dmFyIGNoZWNrT3V0ID0gZnVuY3Rpb24oY2ssIGNraW4pe1xuXHRcdFx0aWYoY2tpbiA9PSAnd2FpdGluZycgfHwgY2tpbiA9PSAnJyApe1xuXHRcdFx0XHQvL2lmIHlvdSBub3QgY2hlY2tpbiB5ZXQsIHRoYW4gZG9uJ3QgbmVlZCB0byBjaGVja291dFxuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2NsYXNzTmFtZTogXCJidG4gYnRuLXdhcm5pbmcgYnRuLXhzIGRpc2FibGVkXCIsIGhyZWY6IFwiI1wifSwgXG4gIFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtc2lnbi1vdXRcIn0pLCBcblx0XHRcdFx0XHRcdFx0JyBDaGVjay1vdXQnXG5cdFx0XHRcdFx0XHQpKTtcblx0XHRcdFx0XHRcblx0XHRcdH1lbHNlIGlmKGNrID09ICdub3RZZXQnIHx8IGNrID09ICcnICl7XG5cdFx0XHRcdC8vY2FuIGFzayBmb3IgY2hlY2sgb3V0XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBcImJ0biBidG4td2FybmluZyBidG4teHNcIiwgaHJlZjogXCIjXCIsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2hlY2tPdXR9LCBcbiAgXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1zaWduLW91dFwifSksIFxuXHRcdFx0XHRcdFx0XHQnIENoZWNrLW91dCdcblx0XHRcdFx0XHRcdCkpO1xuXHRcdFx0XHRcdFxuXHRcdFx0fWVsc2UgaWYoY2sgPT0gJ3dhaXRpbmcnKXtcblx0XHRcdFx0Ly93YWl0aW5nIGZvciBjaGVja291dCBzdWJtaXRcblx0XHRcdFx0aWYobWFuYWdlci5pc01hbmFnZXIpe1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KG51bGwsIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2VzcyBidG4teHNcIiwgaHJlZjogXCIjXCIsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2hlY2tPdXRBc3NlbnR9LCBcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLWNoZWNrXCJ9KSwgXG5cdFx0XHRcdFx0XHRcdFx0JyBZZXMnXG5cdFx0XHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFx0XHQnICAnLCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2NsYXNzTmFtZTogXCJidG4gYnRuLWRhbmdlciBidG4teHNcIiwgaHJlZjogXCIjXCJ9LCBcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXVzZXItdGltZXNcIn0pLCBcblx0XHRcdFx0XHRcdFx0XHQnIE5vJ1xuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpKTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRyZXR1cm4gUmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1zcGlubmVyIGZhLXB1bHNlXCJ9KTtcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Ly93aG8gbGV0IHlvdSBjaGVjayBvdXRcblx0XHRcdFx0cmV0dXJuIFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtY2hlY2tcIn0sIGNrKSA7XG5cdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0fS5iaW5kKHRoaXMpKGxvZ1Jvdy5vdXRDaGVjaywgbG9nUm93LmluQ2hlY2spO1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coJ2NoZWNrT3V0JyxjaGVja091dCk7XG5cdFx0Ly9jb25zb2xlLmxvZygnbG9nUm93Jyxsb2dSb3cub3V0Q2hlY2sgKTtcblx0XHRcblx0XHRpZihsb2dSb3cucm9vbSA9PSBzZWxlY3RlZFJvb21JRCB8fCBzZWxlY3RlZFJvb21JRCA9PSAnYWxsJyl7XG4gICAgXHRyZXR1cm4gKFxuXHRcdFx0XHRSZWFjdC5ET00udHIobnVsbCwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIGxvZ1Jvdy5yb29tKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIGxvZ1Jvdy5zaWQpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgbG9nUm93Lm5hbWUpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgbG9nUm93LnBvc2kpLCBcblx0XHRcdFx0XHRSZWFjdC5ET00udGQobnVsbCwgbG9nUm93LmluVGltZSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBsb2dSb3cub3V0VGltZSksIFxuXHRcdFx0XHRcdFJlYWN0LkRPTS50ZChudWxsLCBjaGVja0luKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRkKG51bGwsIGNoZWNrT3V0KVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuICB9LFxuXHRcdFxuICAvKipcbiAgICogXG4gICAqL1xuXHRoYW5kbGVDaGVja091dDogZnVuY3Rpb24oKXtcblx0XHQvL2NvbnNvbGUubG9nKCdjbGljayBjaGVjayBvdXQnLCB0aGlzLnByb3BzLmxvZ1Jvdy5faWQpO1xuXHRcdHRoaXMucHJvcHMubG9nUm93Lm91dENoZWNrID0gJ3dhaXRpbmcnO1xuXHRcdHRoaXMucHJvcHMuY2hlY2tPdXQodGhpcy5wcm9wcy5sb2dSb3cpO1xuXHR9LFxuXG5cdFx0XG5cdGhhbmRsZUNoZWNrT3V0QXNzZW50OiBmdW5jdGlvbigpe1xuXHRcdC8vY29uc29sZS5sb2coJ29rIHRvIGNoZWNrIG91dCBjbGljaycpO1xuXHRcdHZhciB0ID0gbmV3IERhdGUoJCgnI2lucHV0SW5UaW1lJykudmFsKCkpO1xuXHRcdHZhciBvdXRUaW1lID0gdC5nZXRGdWxsWWVhcigpICsgJy8nICsgdGhpcy5wYWRMZWZ0KHQuZ2V0VVRDTW9udGgoKSwgMikrICcvJyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ0RhdGUoKSwyKSArICctJyArIHRoaXMucGFkTGVmdCh0LmdldFVUQ0hvdXJzKCksMikgKyAnOicgKyB0aGlzLnBhZExlZnQodC5nZXRVVENNaW51dGVzKCksMikgO1xuXHRcdFxuXHRcdHRoaXMucHJvcHMubG9nUm93Lm91dFRpbWUgPSBvdXRUaW1lO1xuXHRcdHRoaXMucHJvcHMubG9nUm93Lm91dENoZWNrID0gdGhpcy5wcm9wcy5tYW5hZ2VyLm5hbWU7XG5cdFx0dGhpcy5wcm9wcy5jaGVja091dEFzc2VudCh0aGlzLnByb3BzLmxvZ1Jvdyk7XG5cdH0sXG5cdFx0XG5cdGhhbmRsZUNoZWNrSW5Bc3NlbnQ6IGZ1bmN0aW9uKCl7XG5cdFx0Ly9jb25zb2xlLmxvZygnb2sgdG8gY2hlY2sgaW4gY2xpY2snKTtcblx0XHR0aGlzLnByb3BzLmxvZ1Jvdy5pbkNoZWNrID0gdGhpcy5wcm9wcy5tYW5hZ2VyLm5hbWU7XG5cdFx0dGhpcy5wcm9wcy5jaGVja0luQXNzZW50KHRoaXMucHJvcHMubG9nUm93KTtcblx0fSxcblx0XHRcblx0aGFuZGxlQ2hlY2tJbklnbm9yZTogZnVuY3Rpb24oKXtcblx0XHR0aGlzLnByb3BzLmNoZWNrSW5JZ25vcmUodGhpcy5wcm9wcy5sb2dSb3cpO1xuXHR9LFxuXHRcdFxuXHRwYWRMZWZ0OiBmdW5jdGlvbihzdHIsbGVuKXtcblx0XHRpZigoJycgKyBzdHIpLmxlbmd0aCA+PSBsZW4pe1xuXHRcdFx0XHRyZXR1cm4gc3RyO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFkTGVmdCggJzAnICsgc3RyLCBsZW4pO1xuXHRcdFx0fVxuXHR9LFxuLy9cdGhhbmRsZUNoZWNrSW5JZ25vcmU6IGZ1bmN0aW9uKCl7XG4vL1x0XHRjb25zb2xlLmxvZygnaWdub3JlIHRvIGNoZWNrIGluIGNsaWNrJyk7XG4vL1x0XHQvL3RoaXMucHJvcHMubG9nUm93LmluQ2hlY2sgPSB0aGlzLnByb3BzLm1hbmFnZXIubmFtZTtcbi8vXHRcdC8vdGhpcy5wcm9wcy5jaGVja0luQXNzZW50KHRoaXMucHJvcHMubG9nUm93KTtcbi8vXHR9LFxuLy9cdFx0XG4vL1x0aGFuZGxlQ2hlY2tPdXRJZ25vcmU6IGZ1bmN0aW9uKCl7XG4vL1x0XHRjb25zb2xlLmxvZygnaWdub3JlIHRvIGNoZWNrIG91dCBjbGljaycpO1xuLy9cdFx0dGhpcy5wcm9wcy5sb2dSb3cub3V0Q2hlY2sgPSAnbm90WWV0Jztcbi8vXHRcdHRoaXMucHJvcHMuY2hlY2tPdXRBc3NlbnQodGhpcy5wcm9wcy5sb2dSb3cpO1xuLy9cdH0sXG5cbiAgbm9vcDogZnVuY3Rpb24oKXtcblxuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXA7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXG4gKlxuICovXG4vL1xudmFyIGN4ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0O1xuXG52YXIgTGlzdFRpdGxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTGlzdFRpdGxlJyxcblxuICAvKipcbiAgICogXG4gICAqL1xuXHRwcm9wVHlwZXM6IHtcblx0XHQvLyBjYWxsYmFja3NcbiAgICBzZWxlY3RSb29tSUQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHR9LFxuXHRcblx0LyoqXG4gICAqIFxuICAgKi9cblx0XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XG5cdFx0dmFyIHRpdGxlcyA9IHRoaXMucHJvcHMudGl0bGVzO1xuXHRcdC8vc3BsaXRUYWJsZVxuXHRcdHZhciBjbGFzc2VzID0gY3goe1xuICAgICAgICAnc3BsaXRUYWJsZSc6IHRoaXMucHJvcHMubGlzdFRpdGxlXG4gICAgfSk7XG5cdFx0XG5cdFx0dmFyIHRoZWFkID0gdGl0bGVzLm1hcChmdW5jdGlvbiAodGl0bGUpIHtcblx0XHRcdFxuXHRcdFx0Ly8g5rOo5oSP5q+P5YCLIGl0ZW0g6KaB5pyJ5LiA5YCL542o5LiA54Sh5LqM55qEIGtleSDlgLxcblx0XHRcdHJldHVybiBSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogY2xhc3Nlc30sIHRpdGxlKSlcblxuXHRcdH0sIHRoaXMpO1xuXHRcdFxuXHRcdFxuICAgIHJldHVybiAoXG5cdFx0XHRcdFJlYWN0LkRPTS50aGVhZChudWxsLCBcblx0XHRcdFx0XHR0aGVhZFxuXHRcdFx0XHQpXG5cdFx0KTtcbiAgfSxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgbm9vcDogZnVuY3Rpb24oKXtcblxuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RUaXRsZTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gQ29tcG9uZW50XG5cbnZhciBMb2dJbkZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdMb2dJbkZvcm0nLFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgLy8g6YCZ6KOP5YiX5Ye65q+P5YCLIHByb3Ag55qE5Z6L5Yil77yM5L2G5Y+q5pyD5ZyoIGRldiB0aW1lIOaqouafpVxuICAgcHJvcFR5cGVzOiB7XG5cdFx0XHQvLyBjYWxsYmFja3Ncblx0XHRcdC8vc2VsZWN0Um9vbUlEOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHRcdC8vbG9nb3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHR9LFxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vIHJlbmRlclxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFxuXHRcdFx0dmFyIGlzRmFpbCA9ICcnO1xuXHRcdFx0aWYodGhpcy5wcm9wcy5mYWlsKXtcblx0XHRcdFx0aXNGYWlsID0gJ2xvZ2luIGZhaWwgLi4uJztcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuICggXG5cdFx0XHRSZWFjdC5ET00uZGl2KG51bGwsIFx0XG5cdFx0XHRcdFJlYWN0LkRPTS5mb3JtKHtpZDogXCJsb2dpblwifSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImZvcm0tZ3JvdXBcIn0sIFxuXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXBcIn0sIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXAtYWRkb25cIn0sICdBY2NvdXRzJyApLCBcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmlucHV0KHtpZDogXCJ1c2VySWRcIiwgdHlwZTogXCJ0ZXh0XCIsIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgbmFtZTogXCJ1c2VySWRcIiwgcGxhY2Vob2xkZXI6IFwiVXNlciBJRFwifSlcblx0XHRcdFx0XHRcdCksIFxuXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXBcIn0sIFxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXAtYWRkb25cIn0sICdQYXNzd29yZCcgKSwgXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pbnB1dCh7aWQ6IFwicHdkXCIsIHR5cGU6IFwicGFzc3dvcmRcIiwgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBuYW1lOiBcInB3ZFwiLCBwbGFjZWhvbGRlcjogXCJQYXNzd29yZFwifSlcblx0XHRcdFx0XHRcdClcblxuXHRcdFx0XHRcdCksIFxuXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmJ1dHRvbih7dHlwZTogXCJzdWJtaXRcIiwgb25DbGljazogIHRoaXMubG9nSW5IYW5kbGVyLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCJ9LCBcIkxvZyBJblwiKSwgXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnAoe2NsYXNzTmFtZTogXCJ0ZXh0LWRhbmdlciBsb2dpbkZhaWxcIn0sIGlzRmFpbCApXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2lkOiBcIm92ZXJcIiwgb25DbGljazogdGhpcy5wcm9wcy5vdXR9KVxuXHRcdFx0KVxuXHRcdFx0KVxuICAgIH0sXG5cdFxuXHRcdGxvZ0luSGFuZGxlciA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRjb25zb2xlLmxvZygnbG9naW4gb25DbGljaycpO1xuXHRcdFx0XG5cdFx0XHR2YXIgZGF0YSA9IHsgdXNlcklkIDogJCgnI3VzZXJJZCcpLnZhbCgpLCBwd2QgOiAkKCcjcHdkJykudmFsKCl9O1xuXHRcdFx0dGhpcy5wcm9wcy5sb2dpblBvc3QoZGF0YSk7XG5cdFx0XHRcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nSW5Gb3JtOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qKlxuICpcbiAqL1xuLy92YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9uQ3JlYXRvcicpO1xudmFyIGN4ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0O1xuLy9cbnZhciBjb21wID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnY29tcCcsXG5cbiAgLyoqXG4gICAqIFxuICAgKi9cblx0cHJvcFR5cGVzOiB7XG5cdFx0Ly9DdHJsXG5cdFx0Y3RybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHQvLyBjYWxsYmFja3NcbiAgICBzZWxlY3RSb29tSUQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHR9LFxuXHRcblx0LyoqXG4gICAqIFxuICAgKi9cblx0XG5cdFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdHZhciBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuXHRcdFxuXHRcdFxuXHRcdFxuXHRcdHZhciBhcnIgPSBvcHRpb25zLm1hcChmdW5jdGlvbiAobG9nKSB7XG5cdFx0XHRyZXR1cm4gUmVhY3QuRE9NLm9wdGlvbihudWxsLCAgbG9nLm5hbWUpXG5cdFx0fSwgdGhpcyk7XG5cblx0XHRcbiAgICByZXR1cm4gKFxuXHRcdFx0XHRSZWFjdC5ET00uc2VsZWN0KHtpZDogdGhpcy5wcm9wcy5teUlELCBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIFxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLnByb3BzLmNoYW5nZVRvZG99LCBcblx0XHRcdFx0XHRhcnJcblx0XHRcdFx0KVxuXHRcdCk7XG4gIH0sXG5cdFxuICAvKipcbiAgICogXG4gICAqL1xuICBub29wOiBmdW5jdGlvbigpe1xuXG4gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcDsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcbiAqIOmAmeaYryByb290IHZpZXfvvIzkuZ/nqLHngrogY29udHJvbGxlci12aWV3XG4gKi9cblxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cbi8vIGltcG9ydFxuXG4vLyB2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEZvb3RlciA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoIHJlcXVpcmUoJy4vRm9vdGVyLmpzeCcpICk7XG52YXIgTGlzdENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoIHJlcXVpcmUoJy4vTGlzdC9MaXN0Q29udGFpbmVyLmpzeCcpICk7XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gQ29tcG9uZW50XG5cbnZhciBNYWluQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTWFpbkFwcCcsXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIG1peGluczogW10sXG5cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8gZm9vOiAnX19mb29fXycsXG4gICAgICAgICAgICAvLyBiYXI6ICdfX2Jhcl9fJ1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuICAgICAqIOS4u+eoi+W8j+mAsuWFpem7nlxuICAgICAqL1xuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vVG9kb1N0b3JlLmFkZExpc3RlbmVyKCBBcHBDb25zdGFudHMuQ0hBTkdFX0VWRU5ULCB0aGlzLl9vbkNoYW5nZSApO1xuICAgIH0sXG5cbiAgICAvLyDph43opoHvvJpyb290IHZpZXcg5bu656uL5b6M56ys5LiA5Lu25LqL77yM5bCx5piv5YG16IG9IHN0b3JlIOeahCBjaGFuZ2Ug5LqL5Lu2XG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL1xuICAgIH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gdW5tb3VudFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIH0sXG5cblxuICAgIGNvbXBvbmVudERpZFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIH0sXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gdXBkYXRlXG5cbiAgICAvLyDlnKggcmVuZGVyKCkg5YmN5Z+36KGM77yM5pyJ5qmf5pyD5Y+v5YWI6JmV55CGIHByb3BzIOW+jOeUqCBzZXRTdGF0ZSgpIOWtmOi1t+S+hlxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuICAgICAgICAvL1xuICAgIH0sXG5cbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyDpgJnmmYLlt7LkuI3lj6/nlKggc2V0U3RhdGUoKVxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnXFx0TWFpbkFQUCA+IHdpbGxVcGRhdGUnICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ1xcdE1haW5BUFAgPiBkaWRVcGRhdGUnICk7XG4gICAgfSxcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyByZW5kZXJcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coICdcXHRNYWluQXBwID4gcmVuZGVyJyApO1xuXG4gICAgICAgIHJldHVybiAoXG5cdFx0XHRcdFx0IFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJqdXN0LXdyYXBwZXJcIn0sIFxuXHRcdFx0XHRcdFx0XHRcdExpc3RDb250YWluZXIobnVsbCksIFxuICAgICAgICAgICAgICAgIEZvb3RlcihudWxsKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW5BcHA7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFByb21pc2UgPSByZXF1aXJlKFwiLi9wcm9taXNlL3Byb21pc2VcIikuUHJvbWlzZTtcbnZhciBwb2x5ZmlsbCA9IHJlcXVpcmUoXCIuL3Byb21pc2UvcG9seWZpbGxcIikucG9seWZpbGw7XG5leHBvcnRzLlByb21pc2UgPSBQcm9taXNlO1xuZXhwb3J0cy5wb2x5ZmlsbCA9IHBvbHlmaWxsOyIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHRvU3RyaW5nICovXG5cbnZhciBpc0FycmF5ID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNBcnJheTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNGdW5jdGlvbjtcblxuLyoqXG4gIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIHRoZSBnaXZlbiBwcm9taXNlcyBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuIFRoZSByZXR1cm4gcHJvbWlzZVxuICBpcyBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSB0aGF0IGdpdmVzIGFsbCB0aGUgdmFsdWVzIGluIHRoZSBvcmRlciB0aGV5IHdlcmVcbiAgcGFzc2VkIGluIHRoZSBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50LlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZTEgPSBSU1ZQLnJlc29sdmUoMSk7XG4gIHZhciBwcm9taXNlMiA9IFJTVlAucmVzb2x2ZSgyKTtcbiAgdmFyIHByb21pc2UzID0gUlNWUC5yZXNvbHZlKDMpO1xuICB2YXIgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBSU1ZQLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYFJTVlAuYWxsYCBhcmUgcmVqZWN0ZWQsIHRoZSBmaXJzdCBwcm9taXNlXG4gIHRoYXQgaXMgcmVqZWN0ZWQgd2lsbCBiZSBnaXZlbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZXMnc1xuICByZWplY3Rpb24gaGFuZGxlci4gRm9yIGV4YW1wbGU6XG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlMSA9IFJTVlAucmVzb2x2ZSgxKTtcbiAgdmFyIHByb21pc2UyID0gUlNWUC5yZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIHZhciBwcm9taXNlMyA9IFJTVlAucmVqZWN0KG5ldyBFcnJvcihcIjNcIikpO1xuICB2YXIgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBSU1ZQLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgLy8gZXJyb3IubWVzc2FnZSA9PT0gXCIyXCJcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgYWxsXG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlc1xuICBAcGFyYW0ge1N0cmluZ30gbGFiZWxcbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiovXG5mdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIFByb21pc2UgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShwcm9taXNlcykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIGFsbC4nKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdLCByZW1haW5pbmcgPSBwcm9taXNlcy5sZW5ndGgsXG4gICAgcHJvbWlzZTtcblxuICAgIGlmIChyZW1haW5pbmcgPT09IDApIHtcbiAgICAgIHJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVyKGluZGV4KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZUFsbChpbmRleCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlQWxsKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlc1tpXTtcblxuICAgICAgaWYgKHByb21pc2UgJiYgaXNGdW5jdGlvbihwcm9taXNlLnRoZW4pKSB7XG4gICAgICAgIHByb21pc2UudGhlbihyZXNvbHZlcihpKSwgcmVqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmVBbGwoaSwgcHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0cy5hbGwgPSBhbGw7IiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcbnZhciBicm93c2VyR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBsb2NhbCA9ICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgPyBnbG9iYWwgOiAodGhpcyA9PT0gdW5kZWZpbmVkPyB3aW5kb3c6dGhpcyk7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gIHZhciBpdGVyYXRpb25zID0gMDtcbiAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgbG9jYWwuc2V0VGltZW91dChmbHVzaCwgMSk7XG4gIH07XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdHVwbGUgPSBxdWV1ZVtpXTtcbiAgICB2YXIgY2FsbGJhY2sgPSB0dXBsZVswXSwgYXJnID0gdHVwbGVbMV07XG4gICAgY2FsbGJhY2soYXJnKTtcbiAgfVxuICBxdWV1ZSA9IFtdO1xufVxuXG52YXIgc2NoZWR1bGVGbHVzaDtcblxuLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbmlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xufSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xufSBlbHNlIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gIHZhciBsZW5ndGggPSBxdWV1ZS5wdXNoKFtjYWxsYmFjaywgYXJnXSk7XG4gIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAvLyBJZiBsZW5ndGggaXMgMSwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgc2NoZWR1bGVGbHVzaCgpO1xuICB9XG59XG5cbmV4cG9ydHMuYXNhcCA9IGFzYXA7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZXYUFTSFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAgYFJTVlAuUHJvbWlzZS5jYXN0YCByZXR1cm5zIHRoZSBzYW1lIHByb21pc2UgaWYgdGhhdCBwcm9taXNlIHNoYXJlcyBhIGNvbnN0cnVjdG9yXG4gIHdpdGggdGhlIHByb21pc2UgYmVpbmcgY2FzdGVkLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZSA9IFJTVlAucmVzb2x2ZSgxKTtcbiAgdmFyIGNhc3RlZCA9IFJTVlAuUHJvbWlzZS5jYXN0KHByb21pc2UpO1xuXG4gIGNvbnNvbGUubG9nKHByb21pc2UgPT09IGNhc3RlZCk7IC8vIHRydWVcbiAgYGBgXG5cbiAgSW4gdGhlIGNhc2Ugb2YgYSBwcm9taXNlIHdob3NlIGNvbnN0cnVjdG9yIGRvZXMgbm90IG1hdGNoLCBpdCBpcyBhc3NpbWlsYXRlZC5cbiAgVGhlIHJlc3VsdGluZyBwcm9taXNlIHdpbGwgZnVsZmlsbCBvciByZWplY3QgYmFzZWQgb24gdGhlIG91dGNvbWUgb2YgdGhlXG4gIHByb21pc2UgYmVpbmcgY2FzdGVkLlxuXG4gIEluIHRoZSBjYXNlIG9mIGEgbm9uLXByb21pc2UsIGEgcHJvbWlzZSB3aGljaCB3aWxsIGZ1bGZpbGwgd2l0aCB0aGF0IHZhbHVlIGlzXG4gIHJldHVybmVkLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgdmFsdWUgPSAxOyAvLyBjb3VsZCBiZSBhIG51bWJlciwgYm9vbGVhbiwgc3RyaW5nLCB1bmRlZmluZWQuLi5cbiAgdmFyIGNhc3RlZCA9IFJTVlAuUHJvbWlzZS5jYXN0KHZhbHVlKTtcblxuICBjb25zb2xlLmxvZyh2YWx1ZSA9PT0gY2FzdGVkKTsgLy8gZmFsc2VcbiAgY29uc29sZS5sb2coY2FzdGVkIGluc3RhbmNlb2YgUlNWUC5Qcm9taXNlKSAvLyB0cnVlXG5cbiAgY2FzdGVkLnRoZW4oZnVuY3Rpb24odmFsKSB7XG4gICAgdmFsID09PSB2YWx1ZSAvLyA9PiB0cnVlXG4gIH0pO1xuICBgYGBcblxuICBgUlNWUC5Qcm9taXNlLmNhc3RgIGlzIHNpbWlsYXIgdG8gYFJTVlAucmVzb2x2ZWAsIGJ1dCBgUlNWUC5Qcm9taXNlLmNhc3RgIGRpZmZlcnMgaW4gdGhlXG4gIGZvbGxvd2luZyB3YXlzOlxuICAqIGBSU1ZQLlByb21pc2UuY2FzdGAgc2VydmVzIGFzIGEgbWVtb3J5LWVmZmljaWVudCB3YXkgb2YgZ2V0dGluZyBhIHByb21pc2UsIHdoZW4geW91XG4gIGhhdmUgc29tZXRoaW5nIHRoYXQgY291bGQgZWl0aGVyIGJlIGEgcHJvbWlzZSBvciBhIHZhbHVlLiBSU1ZQLnJlc29sdmVcbiAgd2lsbCBoYXZlIHRoZSBzYW1lIGVmZmVjdCBidXQgd2lsbCBjcmVhdGUgYSBuZXcgcHJvbWlzZSB3cmFwcGVyIGlmIHRoZVxuICBhcmd1bWVudCBpcyBhIHByb21pc2UuXG4gICogYFJTVlAuUHJvbWlzZS5jYXN0YCBpcyBhIHdheSBvZiBjYXN0aW5nIGluY29taW5nIHRoZW5hYmxlcyBvciBwcm9taXNlIHN1YmNsYXNzZXMgdG9cbiAgcHJvbWlzZXMgb2YgdGhlIGV4YWN0IGNsYXNzIHNwZWNpZmllZCwgc28gdGhhdCB0aGUgcmVzdWx0aW5nIG9iamVjdCdzIGB0aGVuYCBpc1xuICBlbnN1cmVkIHRvIGhhdmUgdGhlIGJlaGF2aW9yIG9mIHRoZSBjb25zdHJ1Y3RvciB5b3UgYXJlIGNhbGxpbmcgY2FzdCBvbiAoaS5lLiwgUlNWUC5Qcm9taXNlKS5cblxuICBAbWV0aG9kIGNhc3RcbiAgQGZvciBSU1ZQXG4gIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgdG8gYmUgY2FzdGVkXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgcHJvcGVydGllcyBvZiBgcHJvbWlzZXNgXG4gIGhhdmUgYmVlbiBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiovXG5cblxuZnVuY3Rpb24gY2FzdChvYmplY3QpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IHRoaXMpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIFByb21pc2UgPSB0aGlzO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZShvYmplY3QpO1xuICB9KTtcbn1cblxuZXhwb3J0cy5jYXN0ID0gY2FzdDsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjb25maWcgPSB7XG4gIGluc3RydW1lbnQ6IGZhbHNlXG59O1xuXG5mdW5jdGlvbiBjb25maWd1cmUobmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICBjb25maWdbbmFtZV0gPSB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29uZmlnW25hbWVdO1xuICB9XG59XG5cbmV4cG9ydHMuY29uZmlnID0gY29uZmlnO1xuZXhwb3J0cy5jb25maWd1cmUgPSBjb25maWd1cmU7IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbCBzZWxmKi9cbnZhciBSU1ZQUHJvbWlzZSA9IHJlcXVpcmUoXCIuL3Byb21pc2VcIikuUHJvbWlzZTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIHZhciBsb2NhbDtcblxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsb2NhbCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgICBsb2NhbCA9IHdpbmRvdztcbiAgfSBlbHNlIHtcbiAgICBsb2NhbCA9IHNlbGY7XG4gIH1cblxuICB2YXIgZXM2UHJvbWlzZVN1cHBvcnQgPSBcbiAgICBcIlByb21pc2VcIiBpbiBsb2NhbCAmJlxuICAgIC8vIFNvbWUgb2YgdGhlc2UgbWV0aG9kcyBhcmUgbWlzc2luZyBmcm9tXG4gICAgLy8gRmlyZWZveC9DaHJvbWUgZXhwZXJpbWVudGFsIGltcGxlbWVudGF0aW9uc1xuICAgIFwiY2FzdFwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICBcInJlc29sdmVcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgXCJyZWplY3RcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgXCJhbGxcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgXCJyYWNlXCIgaW4gbG9jYWwuUHJvbWlzZSAmJlxuICAgIC8vIE9sZGVyIHZlcnNpb24gb2YgdGhlIHNwZWMgaGFkIGEgcmVzb2x2ZXIgb2JqZWN0XG4gICAgLy8gYXMgdGhlIGFyZyByYXRoZXIgdGhhbiBhIGZ1bmN0aW9uXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlc29sdmU7XG4gICAgICBuZXcgbG9jYWwuUHJvbWlzZShmdW5jdGlvbihyKSB7IHJlc29sdmUgPSByOyB9KTtcbiAgICAgIHJldHVybiBpc0Z1bmN0aW9uKHJlc29sdmUpO1xuICAgIH0oKSk7XG5cbiAgaWYgKCFlczZQcm9taXNlU3VwcG9ydCkge1xuICAgIGxvY2FsLlByb21pc2UgPSBSU1ZQUHJvbWlzZTtcbiAgfVxufVxuXG5leHBvcnRzLnBvbHlmaWxsID0gcG9seWZpbGw7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKS5jb25maWc7XG52YXIgY29uZmlndXJlID0gcmVxdWlyZShcIi4vY29uZmlnXCIpLmNvbmZpZ3VyZTtcbnZhciBvYmplY3RPckZ1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikub2JqZWN0T3JGdW5jdGlvbjtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNGdW5jdGlvbjtcbnZhciBub3cgPSByZXF1aXJlKFwiLi91dGlsc1wiKS5ub3c7XG52YXIgY2FzdCA9IHJlcXVpcmUoXCIuL2Nhc3RcIikuY2FzdDtcbnZhciBhbGwgPSByZXF1aXJlKFwiLi9hbGxcIikuYWxsO1xudmFyIHJhY2UgPSByZXF1aXJlKFwiLi9yYWNlXCIpLnJhY2U7XG52YXIgc3RhdGljUmVzb2x2ZSA9IHJlcXVpcmUoXCIuL3Jlc29sdmVcIikucmVzb2x2ZTtcbnZhciBzdGF0aWNSZWplY3QgPSByZXF1aXJlKFwiLi9yZWplY3RcIikucmVqZWN0O1xudmFyIGFzYXAgPSByZXF1aXJlKFwiLi9hc2FwXCIpLmFzYXA7XG5cbnZhciBjb3VudGVyID0gMDtcblxuY29uZmlnLmFzeW5jID0gYXNhcDsgLy8gZGVmYXVsdCBhc3luYyBpcyBhc2FwO1xuXG5mdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihyZXNvbHZlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gIH1cblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xuICB9XG5cbiAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICBpbnZva2VSZXNvbHZlcihyZXNvbHZlciwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGludm9rZVJlc29sdmVyKHJlc29sdmVyLCBwcm9taXNlKSB7XG4gIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XG4gICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXNvbHZlcihyZXNvbHZlUHJvbWlzZSwgcmVqZWN0UHJvbWlzZSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHJlamVjdFByb21pc2UoZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICB2YXIgaGFzQ2FsbGJhY2sgPSBpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgIHZhbHVlLCBlcnJvciwgc3VjY2VlZGVkLCBmYWlsZWQ7XG5cbiAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgZXJyb3IgPSBlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGhhbmRsZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IEZVTEZJTExFRCkge1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG52YXIgUEVORElORyAgID0gdm9pZCAwO1xudmFyIFNFQUxFRCAgICA9IDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCAgPSAyO1xuXG5mdW5jdGlvbiBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgdmFyIGxlbmd0aCA9IHN1YnNjcmliZXJzLmxlbmd0aDtcblxuICBzdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIHN1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBzdWJzY3JpYmVyc1tsZW5ndGggKyBSRUpFQ1RFRF0gID0gb25SZWplY3Rpb247XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSwgc2V0dGxlZCkge1xuICB2YXIgY2hpbGQsIGNhbGxiYWNrLCBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzLCBkZXRhaWwgPSBwcm9taXNlLl9kZXRhaWw7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IG51bGw7XG59XG5cblByb21pc2UucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogUHJvbWlzZSxcblxuICBfc3RhdGU6IHVuZGVmaW5lZCxcbiAgX2RldGFpbDogdW5kZWZpbmVkLFxuICBfc3Vic2NyaWJlcnM6IHVuZGVmaW5lZCxcblxuICB0aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgIHZhciBwcm9taXNlID0gdGhpcztcblxuICAgIHZhciB0aGVuUHJvbWlzZSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGZ1bmN0aW9uKCkge30pO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICB2YXIgY2FsbGJhY2tzID0gYXJndW1lbnRzO1xuICAgICAgY29uZmlnLmFzeW5jKGZ1bmN0aW9uIGludm9rZVByb21pc2VDYWxsYmFjaygpIHtcbiAgICAgICAgaW52b2tlQ2FsbGJhY2socHJvbWlzZS5fc3RhdGUsIHRoZW5Qcm9taXNlLCBjYWxsYmFja3NbcHJvbWlzZS5fc3RhdGUgLSAxXSwgcHJvbWlzZS5fZGV0YWlsKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJzY3JpYmUodGhpcywgdGhlblByb21pc2UsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhlblByb21pc2U7XG4gIH0sXG5cbiAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfVxufTtcblxuUHJvbWlzZS5hbGwgPSBhbGw7XG5Qcm9taXNlLmNhc3QgPSBjYXN0O1xuUHJvbWlzZS5yYWNlID0gcmFjZTtcblByb21pc2UucmVzb2x2ZSA9IHN0YXRpY1Jlc29sdmU7XG5Qcm9taXNlLnJlamVjdCA9IHN0YXRpY1JlamVjdDtcblxuZnVuY3Rpb24gaGFuZGxlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUpIHtcbiAgdmFyIHRoZW4gPSBudWxsLFxuICByZXNvbHZlZDtcblxuICB0cnkge1xuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkEgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS5cIik7XG4gICAgfVxuXG4gICAgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB0aGVuID0gdmFsdWUudGhlbjtcblxuICAgICAgaWYgKGlzRnVuY3Rpb24odGhlbikpIHtcbiAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAodmFsdWUgIT09IHZhbCkge1xuICAgICAgICAgICAgcmVzb2x2ZShwcm9taXNlLCB2YWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmdWxmaWxsKHByb21pc2UsIHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG5cbiAgICAgICAgICByZWplY3QocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoIWhhbmRsZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlKSkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7IHJldHVybjsgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFNFQUxFRDtcbiAgcHJvbWlzZS5fZGV0YWlsID0gdmFsdWU7XG5cbiAgY29uZmlnLmFzeW5jKHB1Ymxpc2hGdWxmaWxsbWVudCwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7IHJldHVybjsgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFNFQUxFRDtcbiAgcHJvbWlzZS5fZGV0YWlsID0gcmVhc29uO1xuXG4gIGNvbmZpZy5hc3luYyhwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gcHVibGlzaEZ1bGZpbGxtZW50KHByb21pc2UpIHtcbiAgcHVibGlzaChwcm9taXNlLCBwcm9taXNlLl9zdGF0ZSA9IEZVTEZJTExFRCk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICBwdWJsaXNoKHByb21pc2UsIHByb21pc2UuX3N0YXRlID0gUkVKRUNURUQpO1xufVxuXG5leHBvcnRzLlByb21pc2UgPSBQcm9taXNlOyIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHRvU3RyaW5nICovXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLmlzQXJyYXk7XG5cbi8qKlxuICBgUlNWUC5yYWNlYCBhbGxvd3MgeW91IHRvIHdhdGNoIGEgc2VyaWVzIG9mIHByb21pc2VzIGFuZCBhY3QgYXMgc29vbiBhcyB0aGVcbiAgZmlyc3QgcHJvbWlzZSBnaXZlbiB0byB0aGUgYHByb21pc2VzYCBhcmd1bWVudCBmdWxmaWxscyBvciByZWplY3RzLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZTEgPSBuZXcgUlNWUC5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZShcInByb21pc2UgMVwiKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICB2YXIgcHJvbWlzZTIgPSBuZXcgUlNWUC5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZShcInByb21pc2UgMlwiKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBSU1ZQLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyByZXN1bHQgPT09IFwicHJvbWlzZSAyXCIgYmVjYXVzZSBpdCB3YXMgcmVzb2x2ZWQgYmVmb3JlIHByb21pc2UxXG4gICAgLy8gd2FzIHJlc29sdmVkLlxuICB9KTtcbiAgYGBgXG5cbiAgYFJTVlAucmFjZWAgaXMgZGV0ZXJtaW5pc3RpYyBpbiB0aGF0IG9ubHkgdGhlIHN0YXRlIG9mIHRoZSBmaXJzdCBjb21wbGV0ZWRcbiAgcHJvbWlzZSBtYXR0ZXJzLiBGb3IgZXhhbXBsZSwgZXZlbiBpZiBvdGhlciBwcm9taXNlcyBnaXZlbiB0byB0aGUgYHByb21pc2VzYFxuICBhcnJheSBhcmd1bWVudCBhcmUgcmVzb2x2ZWQsIGJ1dCB0aGUgZmlyc3QgY29tcGxldGVkIHByb21pc2UgaGFzIGJlY29tZVxuICByZWplY3RlZCBiZWZvcmUgdGhlIG90aGVyIHByb21pc2VzIGJlY2FtZSBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZCBwcm9taXNlXG4gIHdpbGwgYmVjb21lIHJlamVjdGVkOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UxID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoXCJwcm9taXNlIDFcIik7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2UyID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJwcm9taXNlIDJcIikpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFJTVlAucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSBcInByb21pc2UyXCIgYmVjYXVzZSBwcm9taXNlIDIgYmVjYW1lIHJlamVjdGVkIGJlZm9yZVxuICAgIC8vIHByb21pc2UgMSBiZWNhbWUgZnVsZmlsbGVkXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJhY2VcbiAgQGZvciBSU1ZQXG4gIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzIGFycmF5IG9mIHByb21pc2VzIHRvIG9ic2VydmVcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgZGVzY3JpYmluZyB0aGUgcHJvbWlzZSByZXR1cm5lZC5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCBiZWNvbWVzIGZ1bGZpbGxlZCB3aXRoIHRoZSB2YWx1ZSB0aGUgZmlyc3RcbiAgY29tcGxldGVkIHByb21pc2VzIGlzIHJlc29sdmVkIHdpdGggaWYgdGhlIGZpcnN0IGNvbXBsZXRlZCBwcm9taXNlIHdhc1xuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIHdpdGggdGhlIHJlYXNvbiB0aGF0IHRoZSBmaXJzdCBjb21wbGV0ZWQgcHJvbWlzZVxuICB3YXMgcmVqZWN0ZWQgd2l0aC5cbiovXG5mdW5jdGlvbiByYWNlKHByb21pc2VzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBQcm9taXNlID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkocHJvbWlzZXMpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpO1xuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdLCBwcm9taXNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9taXNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2VzW2ldO1xuXG4gICAgICBpZiAocHJvbWlzZSAmJiB0eXBlb2YgcHJvbWlzZS50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnRzLnJhY2UgPSByYWNlOyIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gIGBSU1ZQLnJlamVjdGAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZWplY3RlZCB3aXRoIHRoZSBwYXNzZWRcbiAgYHJlYXNvbmAuIGBSU1ZQLnJlamVjdGAgaXMgZXNzZW50aWFsbHkgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UgPSBuZXcgUlNWUC5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UgPSBSU1ZQLnJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZWplY3RcbiAgQGZvciBSU1ZQXG4gIEBwYXJhbSB7QW55fSByZWFzb24gdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGguXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGlkZW50aWZ5aW5nIHRoZSByZXR1cm5lZCBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlamVjdGVkIHdpdGggdGhlIGdpdmVuXG4gIGByZWFzb25gLlxuKi9cbmZ1bmN0aW9uIHJlamVjdChyZWFzb24pIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIFByb21pc2UgPSB0aGlzO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufVxuXG5leHBvcnRzLnJlamVjdCA9IHJlamVjdDsiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICBgUlNWUC5yZXNvbHZlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBwYXNzZWRcbiAgYHZhbHVlYC4gYFJTVlAucmVzb2x2ZWAgaXMgZXNzZW50aWFsbHkgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UgPSBuZXcgUlNWUC5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVzb2x2ZSgxKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UgPSBSU1ZQLnJlc29sdmUoMSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZXNvbHZlXG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge0FueX0gdmFsdWUgdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGhcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgaWRlbnRpZnlpbmcgdGhlIHJldHVybmVkIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgZnVsZmlsbGVkIHdpdGggdGhlIGdpdmVuXG4gIGB2YWx1ZWBcbiovXG5mdW5jdGlvbiByZXNvbHZlKHZhbHVlKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBQcm9taXNlID0gdGhpcztcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9KTtcbn1cblxuZXhwb3J0cy5yZXNvbHZlID0gcmVzb2x2ZTsiLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICByZXR1cm4gaXNGdW5jdGlvbih4KSB8fCAodHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgeCAhPT0gbnVsbCk7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gaXNBcnJheSh4KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbn1cblxuLy8gRGF0ZS5ub3cgaXMgbm90IGF2YWlsYWJsZSBpbiBicm93c2VycyA8IElFOVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0ZS9ub3cjQ29tcGF0aWJpbGl0eVxudmFyIG5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cblxuZXhwb3J0cy5vYmplY3RPckZ1bmN0aW9uID0gb2JqZWN0T3JGdW5jdGlvbjtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZXhwb3J0cy5ub3cgPSBub3c7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5EaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWIvRGlzcGF0Y2hlcicpXG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIERpc3BhdGNoZXJcbiAqIEB0eXBlY2hlY2tzXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCcuL2ludmFyaWFudCcpO1xuXG52YXIgX2xhc3RJRCA9IDE7XG52YXIgX3ByZWZpeCA9ICdJRF8nO1xuXG4vKipcbiAqIERpc3BhdGNoZXIgaXMgdXNlZCB0byBicm9hZGNhc3QgcGF5bG9hZHMgdG8gcmVnaXN0ZXJlZCBjYWxsYmFja3MuIFRoaXMgaXNcbiAqIGRpZmZlcmVudCBmcm9tIGdlbmVyaWMgcHViLXN1YiBzeXN0ZW1zIGluIHR3byB3YXlzOlxuICpcbiAqICAgMSkgQ2FsbGJhY2tzIGFyZSBub3Qgc3Vic2NyaWJlZCB0byBwYXJ0aWN1bGFyIGV2ZW50cy4gRXZlcnkgcGF5bG9hZCBpc1xuICogICAgICBkaXNwYXRjaGVkIHRvIGV2ZXJ5IHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gKiAgIDIpIENhbGxiYWNrcyBjYW4gYmUgZGVmZXJyZWQgaW4gd2hvbGUgb3IgcGFydCB1bnRpbCBvdGhlciBjYWxsYmFja3MgaGF2ZVxuICogICAgICBiZWVuIGV4ZWN1dGVkLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGlzIGh5cG90aGV0aWNhbCBmbGlnaHQgZGVzdGluYXRpb24gZm9ybSwgd2hpY2hcbiAqIHNlbGVjdHMgYSBkZWZhdWx0IGNpdHkgd2hlbiBhIGNvdW50cnkgaXMgc2VsZWN0ZWQ6XG4gKlxuICogICB2YXIgZmxpZ2h0RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjb3VudHJ5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDb3VudHJ5U3RvcmUgPSB7Y291bnRyeTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjaXR5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDaXR5U3RvcmUgPSB7Y2l0eTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgYmFzZSBmbGlnaHQgcHJpY2Ugb2YgdGhlIHNlbGVjdGVkIGNpdHlcbiAqICAgdmFyIEZsaWdodFByaWNlU3RvcmUgPSB7cHJpY2U6IG51bGx9XG4gKlxuICogV2hlbiBhIHVzZXIgY2hhbmdlcyB0aGUgc2VsZWN0ZWQgY2l0eSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY2l0eS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ2l0eTogJ3BhcmlzJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYENpdHlTdG9yZWA6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY2l0eS11cGRhdGUnKSB7XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IHBheWxvYWQuc2VsZWN0ZWRDaXR5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgY291bnRyeSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY291bnRyeS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ291bnRyeTogJ2F1c3RyYWxpYSdcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGJvdGggc3RvcmVzOlxuICpcbiAqICAgIENvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgQ291bnRyeVN0b3JlLmNvdW50cnkgPSBwYXlsb2FkLnNlbGVjdGVkQ291bnRyeTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIGNhbGxiYWNrIHRvIHVwZGF0ZSBgQ291bnRyeVN0b3JlYCBpcyByZWdpc3RlcmVkLCB3ZSBzYXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGUgcmV0dXJuZWQgdG9rZW4uIFVzaW5nIHRoaXMgdG9rZW4gd2l0aCBgd2FpdEZvcigpYCwgd2UgY2FuIGd1YXJhbnRlZVxuICogdGhhdCBgQ291bnRyeVN0b3JlYCBpcyB1cGRhdGVkIGJlZm9yZSB0aGUgY2FsbGJhY2sgdGhhdCB1cGRhdGVzIGBDaXR5U3RvcmVgXG4gKiBuZWVkcyB0byBxdWVyeSBpdHMgZGF0YS5cbiAqXG4gKiAgIENpdHlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBtYXkgbm90IGJlIHVwZGF0ZWQuXG4gKiAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIGlzIG5vdyBndWFyYW50ZWVkIHRvIGJlIHVwZGF0ZWQuXG4gKlxuICogICAgICAgLy8gU2VsZWN0IHRoZSBkZWZhdWx0IGNpdHkgZm9yIHRoZSBuZXcgY291bnRyeVxuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBnZXREZWZhdWx0Q2l0eUZvckNvdW50cnkoQ291bnRyeVN0b3JlLmNvdW50cnkpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIHVzYWdlIG9mIGB3YWl0Rm9yKClgIGNhbiBiZSBjaGFpbmVkLCBmb3IgZXhhbXBsZTpcbiAqXG4gKiAgIEZsaWdodFByaWNlU3RvcmUuZGlzcGF0Y2hUb2tlbiA9XG4gKiAgICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgZ2V0RmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGBjb3VudHJ5LXVwZGF0ZWAgcGF5bG9hZCB3aWxsIGJlIGd1YXJhbnRlZWQgdG8gaW52b2tlIHRoZSBzdG9yZXMnXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcyBpbiBvcmRlcjogYENvdW50cnlTdG9yZWAsIGBDaXR5U3RvcmVgLCB0aGVuXG4gKiBgRmxpZ2h0UHJpY2VTdG9yZWAuXG4gKi9cblxuICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2l0aCBldmVyeSBkaXNwYXRjaGVkIHBheWxvYWQuIFJldHVybnNcbiAgICogYSB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHdpdGggYHdhaXRGb3IoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIF9sYXN0SUQrKztcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3Rlcj1mdW5jdGlvbihpZCkge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICdEaXNwYXRjaGVyLnVucmVnaXN0ZXIoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICBpZFxuICAgICk7XG4gICAgZGVsZXRlIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gaWRzXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKGlkcykge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLidcbiAgICApO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdLFxuICAgICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICtcbiAgICAgICAgICAnd2FpdGluZyBmb3IgYCVzYC4nLFxuICAgICAgICAgIGlkXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KFxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaD1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgIXRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLidcbiAgICApO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY2FsbGJhY2sgc3RvcmVkIHdpdGggdGhlIGdpdmVuIGlkLiBBbHNvIGRvIHNvbWUgaW50ZXJuYWxcbiAgICogYm9va2tlZXBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrPWZ1bmN0aW9uKGlkKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0odGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHVwIGJvb2trZWVwaW5nIG5lZWRlZCB3aGVuIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmc9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoZmFsc2UpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBwZW5kaW5nRXhjZXB0aW9uO1xuXHR2YXIgZnJvbTtcblx0dmFyIGtleXM7XG5cdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gYXJndW1lbnRzW3NdO1xuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHR0b1trZXlzW2ldXSA9IGZyb21ba2V5c1tpXV07XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0aWYgKHBlbmRpbmdFeGNlcHRpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHBlbmRpbmdFeGNlcHRpb24gPSBlcnI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAocGVuZGluZ0V4Y2VwdGlvbikge1xuXHRcdHRocm93IHBlbmRpbmdFeGNlcHRpb247XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRldhQVNIXCIpKSIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUga2V5TWlycm9yXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZShcIi4vaW52YXJpYW50XCIpO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgb2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaiksXG4gICAgJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nXG4gICkgOiBpbnZhcmlhbnQob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIikpIl19
