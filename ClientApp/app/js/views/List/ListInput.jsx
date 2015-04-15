
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
	
  /**
   *
   */
  render: function() {

		var roomOptions = ['801', '802', '803', '806', '813'];
		var posiOptions = ['討論1', '討論2', '討論3', '電腦1', '電腦2'];
		//<td colSpan="2"><input type="datetime-local" className="form-control" name="name" value="2014-01-02T11:42" ></input></td>
		
		
    return (
			<thead>
					<td><Selector className="input" options = {roomOptions} /></td>
					<td><input type="text" className="form-control" name="sid"></input></td>
					<td><input type="text" className="form-control" name="name"></input></td>
					<td><Selector className="input" options = {posiOptions} /></td>
					<td colSpan="2"><input type="datetime-local" className="form-control"  name="name" value={this.state.time}></input></td>
					<td>
						<a className="btn btn-success" href="#">
  						<i className="fa fa-user-plus -o fa-lg"></i> 
							{' Join'}
						</a>
					</td>
					<td>
						<a className="btn btn-warning" href="#">
  						<i className="fa fa-repeat -o fa-lg"></i> 
							{' Reset'}
						</a>
					</td>
			</thead>
    );
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
	
  noop: function(){  }

});

module.exports = ListInput;
