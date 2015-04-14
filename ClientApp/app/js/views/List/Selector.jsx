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
	
  render: function() {
	
		var logRow = this.props.logRow;
		
    return (
				<select className="form-control">
					<option>all</option>
					<option>801</option>
					<option>802</option>
					<option>804</option>
					<option>806</option>
					<option>813</option>
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