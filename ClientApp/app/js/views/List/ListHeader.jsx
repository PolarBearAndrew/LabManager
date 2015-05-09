var Selector = React.createFactory( require('./Selector.jsx') );

//========================================================================
//
// Component

var ListHeader = React.createClass({

    //========================================================================


    // 這裏列出每個 prop 的型別，但只會在 dev time 檢查
   propTypes: {
		// callbacks
			selectRoomID: React.PropTypes.func,
			logout: React.PropTypes.func,
		},

    //========================================================================
    //
    // render


    render: function() {

		var roomInfo = [{ name : 'all'}].concat(this.props.roomInfo);

		var showID = '';

		/*
		 * show big room ID
		 */
		if(this.props.ID == 'all'){
			showID = '';
		}else{
			showID = ' - ' + this.props.ID;
		}

		/*
		 * is manager or not
		 */
		var whoAmI = function(mg){

			var show = {};

			if(mg.isManager){

				show.str = '...  I am a manager, my name is ';
				show.name = mg.name;

				return (
					<h5 className="lead">
						{ show.str }
						<span className="text-success isName"> { show.name } </span>
						<a href="#" onClick={ this.props.logout }><i className="fa fa-sign-out"></i></a>
					</h5>
				);

			}else{

				show.str = '... Your are a manager ? ';
				show.name = 'logIn';

				return (
					<h5 className="lead">
						{ show.str }
						<a onClick={ this.props.login }>
							<span className="text-primary"> { show.name } </span>
							<i className="fa fa-sign-in"></i>
						</a>
					</h5>
				);
			}

		}.bind( this )( this.props.manager );

		/*
		 * return header
		 */
		return (
			<div className="header">
				<h1>
					<i className="fa fa-users"></i>
					{'  Lab Manager  '}
					{ showID }
				</h1>
				<h4>
					<span>{"Room ID "}</span>
					<a className="btn btn-info refresh" onClick={ this.props.refresh }>
						<i className="fa fa-refresh"></i>
					</a>
					<Selector
						myID="selectID"
						selectRoomID = {this.props.selectRoomID }
						changeTodo = { this.handleChange }
						options = { roomInfo } />
				</h4>
				{ whoAmI }
			</div> )
    },


	handleChange: function(){

		if(this.props.selectRoomID){

			var id = $('#selectID').val();
			this.props.selectRoomID(id);

			//sync input select
			if( id != 'all'){
				$('#inputID').val(id);

			}else{
				$('#inputID').val('801');
			}
		}
	},
});

module.exports = ListHeader;
