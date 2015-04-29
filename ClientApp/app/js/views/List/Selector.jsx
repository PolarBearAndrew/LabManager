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
		
		//console.log('onChange', this.props.onChange);
		
		
		var arr = options.map(function (log) {
			
			// 注意每個 item 要有一個獨一無二的 key 值
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