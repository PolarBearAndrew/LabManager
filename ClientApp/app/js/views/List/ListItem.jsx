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
			selectedRoomID:  React.PropTypes.string,
			isManager:  React.PropTypes.string
			
    }),
		
		// callbacks
    onClick: React.PropTypes.func,
    onRemove: React.PropTypes.func,
	},
	
  /**
   * 
   */
  render: function() {
		
		//console.log('this.props.checkInAssent', this.props.checkInAssent);
		
		var selectedRoomID = this.props.selectedRoomID;
		var logRow = this.props.logRow;
		var manager = this.props.manager;
		
		//td check in
		var checkIn = function(ck){
			if(ck == 'waiting' || ck == '' ){
				//waiting for checkin submit
				
				if(manager.isManager){
					return (
						<div className="ctrls">
							<a className="btn btn-success btn-xs" href="#" onClick={this.handleCheckInAssent}>
								<i className="fa fa-check"></i> 
								{' Assent'}
							</a>
							{'  '}
							<a className="btn btn-danger btn-xs" href="#" onClick={this.handleCheckInIgnore}>
								<i className="fa fa-trash-o"></i> 
								{' Ignore'}
							</a>
						</div>);
				}else{
					return <i className="fa fa-spinner fa-pulse"></i>;
				}
				
			}else{
				//show who checked for you
				return  <i className="fa fa-check">{ck}</i> ;
			}
		}.bind(this)(logRow.inCheck);
		
		
		//td check out
		var checkOut = function(ck, ckin){
			if(ckin == 'waiting' || ckin == '' ){
				//if you not checkin yet, than don't need to checkout
				return (
						<a className="btn btn-warning btn-xs disabled" href="#">
  						<i className="fa fa-sign-out"></i> 
							{' Check-out'}
						</a>);
					
			}else if(ck == 'notYet' || ck == '' ){
				//can ask for check out
				return (
						<a className="btn btn-warning btn-xs" href="#" onClick={this.handleCheckOut}>
  						<i className="fa fa-sign-out"></i> 
							{' Check-out'}
						</a>);
					
			}else if(ck == 'waiting'){
				//waiting for checkout submit
				if(manager.isManager){
					return (
						<div>
							<a className="btn btn-success btn-xs" href="#" onClick={this.handleCheckOutAssent}>
								<i className="fa fa-check"></i> 
								{' Yes'}
							</a>
							{'  '}
							<a className="btn btn-danger btn-xs" href="#">
								<i className="fa fa-user-times"></i> 
								{' No'}
							</a>
						</div>);
						
				}else{
					return <i className="fa fa-spinner fa-pulse"></i>;	
				}
					
			}else{
				//who let you check out
				return <i className="fa fa-check">{ck}</i> ;
			}
					
		}.bind(this)(logRow.outCheck, logRow.inCheck);
		
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
		}
  },
		
  /**
   * 
   */
	handleCheckOut: function(){
		//console.log('click check out', this.props.logRow._id);
		this.props.logRow.outCheck = 'waiting';
		this.props.checkOut(this.props.logRow);
	},

		
	handleCheckOutAssent: function(){
		//console.log('ok to check out click');
		var t = new Date($('#inputInTime').val());
		var outTime = t.getFullYear() + '/' + this.padLeft(t.getUTCMonth(), 2)+ '/' + this.padLeft(t.getUTCDate(),2) + '-' + this.padLeft(t.getUTCHours(),2) + ':' + this.padLeft(t.getUTCMinutes(),2) ;
		
		this.props.logRow.outTime = outTime;
		this.props.logRow.outCheck = this.props.manager.name;
		this.props.checkOutAssent(this.props.logRow);
	},
		
	handleCheckInAssent: function(){
		//console.log('ok to check in click');
		this.props.logRow.inCheck = this.props.manager.name;
		this.props.checkInAssent(this.props.logRow);
	},
		
	handleCheckInIgnore: function(){
		this.props.checkInIgnore(this.props.logRow);
	},
		
	padLeft: function(str,len){
		if(('' + str).length >= len){
				return str;
			}
			else{
				return this.padLeft( '0' + str, len);
			}
	},
//	handleCheckInIgnore: function(){
//		console.log('ignore to check in click');
//		//this.props.logRow.inCheck = this.props.manager.name;
//		//this.props.checkInAssent(this.props.logRow);
//	},
//		
//	handleCheckOutIgnore: function(){
//		console.log('ignore to check out click');
//		this.props.logRow.outCheck = 'notYet';
//		this.props.checkOutAssent(this.props.logRow);
//	},

  noop: function(){

  }

});

module.exports = comp;