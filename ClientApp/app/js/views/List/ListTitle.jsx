/**
 *
 */
//
var cx = React.addons.classSet;

var ListTitle = React.createClass({

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
			return <td><span className={classes}>{title}</span></td>

		}, this);
		
		
    return (
				<thead>
					{thead}
				</thead>
		);
  },
  /**
   * 
   */
  noop: function(){

  }

});

module.exports = ListTitle;