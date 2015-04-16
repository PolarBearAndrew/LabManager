/**
 *
 */
//var actions = require('../../actions/AppActionCreator');
//var cx = React.addons.classSet;
//
var comp = React.createClass({

  /**
   * 
   */
//  componentDidMount: function(){
//      this.$input = $(this.getDOMNode()).find('span').first();
//      this.$remove = this.$input.next();
//  },

	
	propTypes: {

		todoItem: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
			selectedRoomID:  React.PropTypes.string
			
    }),
		
		// callbacks
    onClick: React.PropTypes.func,
    onRemove: React.PropTypes.func,
	},
	
  /**
   * 
   */
  render: function() {
    
		var selectedRoomID = this.props.selectedRoomID;
		var logRow = this.props.logRow;

		//td check in
		var checkIn = function(ck){
			if(ck == 'waiting' || ck == '' ){
				return <i className="fa fa-spinner fa-pulse"></i>;
			}
			return  <i className="fa fa-check">{ck}</i> ;
		}(logRow.inCheck);
		
		
		//td check out
		var checkOut = function(ck, ckin){
			if(ckin == 'waiting' || ckin == '' ){
				return (
						<a className="btn btn-warning btn-xs" href="#" disabled="false">
  						<i className="fa fa-sign-out"></i> 
							{' Check-out'}
						</a>);
			}else if(ck == 'notYet' || ck == '' ){
				return (
						<a className="btn btn-warning btn-xs" href="#">
  						<i className="fa fa-sign-out"></i> 
							{' Check-out'}
						</a>);
			}else if(ck == 'waiting'){
				return <i className="fa fa-spinner fa-pulse"></i>;
			}
			return <i className="fa fa-check">{ck}</i> ;
		}(logRow.outCheck, logRow.inCheck);
		
		//console.log('checkOut',checkOut);
		//console.log('logRow',logRow.outCheck );
		
		if(logRow.room == selectedRoomID || selectedRoomID == 'all'){
    	return (
				<tr>
					<td>{logRow.room}</td>
					<td>{logRow.sid}</td>
					<td>{logRow.name}</td>
					<td>{logRow.posi}</td>
					<td>{logRow.inTime}</td>
					<td>{logRow.outTime}</td>
					<td>{checkIn}</td>
					<td>{checkOut}</td>
				</tr>
			);
		}else{
			return null;
//			return (
//				<tr></tr>
//			);
		}
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