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
			
			// 注意每個 item 要有一個獨一無二的 key 值
			return <option>{log}</option>

		}, this);

		
    return (
				<select id="selectID" className="form-control"
					onChange = {this.handleChange} >
					{arr}
				</select>
		);
  },
	
	handleChange: function(){
		if(this.props.selectRoomID){
			var id = $('#selectID').val();
			this.props.selectRoomID(id);
		}
	},

  /**
   * 
   */
  noop: function(){

  }

});

module.exports = comp;