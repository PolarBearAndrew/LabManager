
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

var ListInput = React.createClass({
	
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
			<thead>
					<td><Selector myID="inputID" className="input" options = { roomInfo } changeTodo ={ this.handleIDchange } /></td>
					<td><input id="inputSid" type="text" className="form-control" name="sid"></input></td>
					<td><input id="inputName" type="text" className="form-control" name="name"></input></td>
					<td><Selector myID="inputPosi" className="input" options = {posiOptions} /></td>
					<td colSpan="2">
						<input	id="inputInTime"
								type="datetime-local" 	className="form-control"  
								name="time" readOnly="true"
								value={this.state.time}>
						</input></td>
					<td>
					</td>
					<td>
						<button 
							className="btn btn-primary" 
							type="submit"
							onClick= { this.handleAsk }>
  						<i className="fa fa-user-plus -o fa-lg"></i> 
							{' Join'}
						</button>
					</td>
			</thead>
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
		
		//get time 
		var t = new Date($('#inputInTime').val());
		var inTime = t.getFullYear() + '/' + this.padLeft(t.getUTCMonth(), 2)+ '/' + this.padLeft(t.getUTCDate(),2) + '-' + this.padLeft(t.getUTCHours(),2) + ':' + this.padLeft(t.getUTCMinutes(),2) ;
		
		
		var sid = $('#inputSid').val();
		var posi = $('#inputPosi').val();
		
		if( sid == 'panda' && posi == '討論 12'){
			this.weArePanda(inTime);
			return false;
		}
		
		var postInfo = {
			room: $('#inputID').val(),
			sid: sid,
			name: $('#inputName').val(),
			posi: posi,
			inCheck: 'waiting',
			outCheck: 'notYet',
			inTime: inTime,
		};
		
		this.props.join(postInfo);
		
		//don't submit
		return false;
	},
	
	
	weArePanda: function(inTime){
		
		var panda = [
			{ 'room' : '806', sid: '101111212', name: '陳柏安', posi: '討論 1', inCheck: 'waiting', outCheck: 'notYet', inTime: inTime },
			{ 'room' : '806', sid: '101111215', name: '雷尚樺', posi: '討論 2', inCheck: 'waiting', outCheck: 'notYet', inTime: inTime },
			{ 'room' : '806', sid: '101111224', name: '洪于雅', posi: '討論 3', inCheck: 'waiting', outCheck: 'notYet', inTime: inTime },
			{ 'room' : '806', sid: '101111231', name: '陳思璇', posi: '討論 4', inCheck: 'waiting', outCheck: 'notYet', inTime: inTime }
		];
		
		
		for(var i = 0; i < 4; i++){
			this.props.join(panda[i]);
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
