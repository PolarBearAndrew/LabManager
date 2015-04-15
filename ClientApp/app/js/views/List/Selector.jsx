/**
 *
 */
var actions = require('../../actions/AppActionCreator');
var cx = React.addons.classSet;
//
var comp = React.createClass({

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
	
		var logRow = this.props.logRow;
		//console.log('in select.jsx', this.props.selectRoomID);
		//this.props.selectRoomID
		
    return (
				<select id="selectID" className="form-control"
					onChange = {this.handleChange} >
					<option>all</option>
					<option>801</option>
					<option>802</option>
					<option>804</option>
					<option>806</option>
					<option>813</option>
				</select>
		);
  },
	
	handleChange: function(){
		//console.log('handleChange func', this.props.selectRoomID);
			//console.log('value', $('#selectID').val());
		var id = $('#selectID').val();
		this.props.selectRoomID(id);
	},

  /**
   * 
   */
  noop: function(){

  }

});

module.exports = comp;