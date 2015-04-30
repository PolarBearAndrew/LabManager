/**
 *
 */
//var actions = require('../../actions/AppActionCreator');
var cx = React.addons.classSet;
//
var comp = React.createClass({

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
			return <option>{ log.name }</option>
		}, this);

		
    return (
				<select id={this.props.myID} className="form-control" 
					onChange = {this.props.changeTodo} >
					{arr}
				</select>
		);
  },
	
  /**
   * 
   */
  noop: function(){

  }

});

module.exports = comp;