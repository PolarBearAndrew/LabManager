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
    //selectRoomID: React.PropTypes.func,
	},
  /**
   *
   */
  render: function() {

    // 取出所有要繪製的資料
    var arrlog = this.props.truth.arrLog;
		var selectedRoomID = this.props.truth.selectedRoomID;
		
		console.log('selectedRoomID',selectedRoomID);
		
		// 跑 loop 一筆筆建成 ListItem 元件
		var arr = arrlog.map(function (log) {
			
			// 注意每個 item 要有一個獨一無二的 key 值
			return <ListItem
				logRow = {log}
				key = {log.id}
				selectedRoomID = {selectedRoomID}
				/>

		}, this);
		
    return (
      <table className="table table-hover">
				<thead>
						<td>Lab</td>
						<td>ID</td>
						<td>Name</td>
						<td>{"Check in time"}</td>
						<td>Check out time</td>
						<td>{"Checked (in)"}</td>
						<td>{"Checked (out)"}</td>
				</thead>
				<tbody>
          {arr}
				</tbody>
      </table>
    );

  },

  noop: function(){  }
});

module.exports = comp;
