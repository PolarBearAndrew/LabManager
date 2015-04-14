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
  componentDidMount: function(){
      this.$input = $(this.getDOMNode()).find('span').first();
      this.$remove = this.$input.next();
  },

	
	propTypes: {

		todoItem: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      memo: React.PropTypes.number
    }),
		
		// callbacks
    onClick: React.PropTypes.func,
    onRemove: React.PropTypes.func,
	},
	
  /**
   * 
   */
  render: function() {
    
    var classes = cx({
        'list-item': true,
        'selected': this.props.selected
    });

	
		var logRow = this.props.logRow;
		
    return (
      <tr>
				<td>{logRow.room}</td>
				<td>{logRow.sid}</td>
				<td>{logRow.name}</td>
				<td>{logRow.inTime}</td>
				<td>{logRow.outTime}</td>
				<td>{logRow.inCheck}</td>
				<td>{logRow.outCheck}</td>
			</tr>
    );
//      <div className={classes} >
//          <span>{todoItem.name}</span>
//          
//          <span className="glyphicon glyphicon-remove right hide" 
//                onClick={this.props.onRemove} ></span>
//
//      </div>
  
  },

  /**
   * 
   */
  noop: function(){

  }

});

module.exports = comp;