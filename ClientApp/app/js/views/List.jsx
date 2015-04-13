/**
 *
 */


var ListItem = React.createFactory(require('./ListItem.jsx'));

//
var comp = React.createClass({
	
	propTypes: {

		log: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      room: React.PropTypes.string,
			inTime: React.PropTypes.string,
      outTime: React.PropTypes.string,
      inCheck: React.PropTypes.string,
      outCheck: React.PropTypes.string,
    }),
		
		// callbacks
    onClick: React.PropTypes.func,
    onRemove: React.PropTypes.func,
	},
  /**
   *
   */
  render: function() {

    // 取出所有要繪製的資料
    var arrlog = this.props.truth.arrLog;
		
		// 跑 loop 一筆筆建成 ListItem 元件
		var arr = arrlog.map(function (row) {

			var log = row;
		

			// 注意每個 item 要有一個獨一無二的 key 值
			return <ListItem
				logRow = {log}
				key = {log.id}
				onClick = {this.props.onClick.bind(this, log)}
				onRemove = {this.props.onRemove.bind(this, log)}
				/>

		}, this);
		
    return (
      <table className="table table-hover">
          {arr}
      </table>
    );

  },

  noop: function(){  }
});

module.exports = comp;
