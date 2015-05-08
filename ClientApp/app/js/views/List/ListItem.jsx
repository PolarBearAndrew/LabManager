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
							<a className="btn btn-success btn-xs" onClick={this.handleCheckInAssent}>
								<i className="fa fa-check"></i>
								{' Assent'}
							</a>
							{'  '}
							<a className="btn btn-danger btn-xs" onClick={this.handleCheckInIgnore}>
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
						<a className="btn btn-warning btn-xs disabled">
  						<i className="fa fa-sign-out"></i>
							{' Check-out'}
						</a>);

			}else if(ck == 'notYet' || ck == '' ){
				//can ask for check out
				return (
						<a className="btn btn-warning btn-xs" onClick={this.handleCheckOut}>
  						<i className="fa fa-sign-out"></i>
							{' Check-out'}
						</a>);

			}else if(ck == 'waiting'){
				//waiting for checkout submit
				if(manager.isManager){
					return (
						<div>
							<a className="btn btn-success btn-xs" onClick={this.handleCheckOutAssent}>
								<i className="fa fa-check"></i>
								{' Yes'}
							</a>
							{'  '}
							<a className="btn btn-danger btn-xs">
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

		var t = new Date();
		var today = t.toLocaleDateString();

		var tmpInTime = logRow.inTime.replace(today, '今天');
		var tmpOutTime = logRow.outTime.replace(today, '今天');


		//too late	~!
		var tooLate = '';

		if( tmpOutTime.indexOf('下午') != -1 ){

			var i = tmpOutTime.indexOf(':');
			var tmp  = tmpOutTime.substring( i - 1, i);

			if( tmp >= 5){
				tooLate = 'tooLate';
			}
		}

		if(logRow.room == selectedRoomID || selectedRoomID == 'all'){
    	return (
				<tr>
					<td>{logRow.room}</td>
					<td>{logRow.sid}</td>
					<td>{logRow.name}</td>
					<td>{logRow.posi}</td>
					<td>{tmpInTime}</td>
					<td className={ tooLate }>{tmpOutTime}</td>
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

	isToolage: function(time){

	},

	padLeft: function(str,len){
		if(('' + str).length >= len){
				return str;
			}
			else{
				return this.padLeft( '0' + str, len);
			}
	},


	handleCheckOutAssent: function(){

		var t = new Date();
		var outTime = t.toLocaleString();


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