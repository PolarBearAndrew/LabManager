
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

var ListInput = React.createClass({

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
			<thead>
				<td>
					<Selector
						myID="inputID"
						className="input"
						options = { roomInfo }
						changeTodo ={ this.handleIDchange } />
				</td>
				<td><input id="inputSid" type="text" className="form-control" name="sid"></input></td>
				<td><input id="inputName" type="text" className="form-control" name="name"></input></td>
				<td><Selector myID="inputPosi" className="input" options = { posiOptions } /></td>
				<td colSpan="2">
					<input	id="inputInTime"
							type="datetime-local" 	className="form-control"
							name="time" readOnly="true"
							value={this.state.time}>
					</input>
				</td>
				<td></td>
				<td>
					<button
						className="btn btn-primary"
						type="submit"
						onClick= { this.handleAsk }>
						<i className="fa fa-user-plus -o fa-lg"></i>
						{' Join'}
					</button>
				</td>
			</thead> );
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
