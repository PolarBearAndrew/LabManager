
//========================================================================
//
// Component

var LogInForm = React.createClass({

    //========================================================================


    // 這裏列出每個 prop 的型別，但只會在 dev time 檢查
   propTypes: {
			// callbacks
			//selectRoomID: React.PropTypes.func,
			//logout: React.PropTypes.func,
		},

    //========================================================================
    //
    // render

    render: function() {
			
			return ( 
			<div>	
				<form id="login">
					<div className="form-group">

						<div className="input-group">
							<div className="input-group-addon">{ 'Accouts' }</div>
							<input id="userId" type="text" className="form-control" name="userId" placeholder="User ID"></input>
						</div>

						<div className="input-group">
							<div className="input-group-addon">{ 'Password' }</div>
							<input id="pwd" type="password" className="form-control" name="pwd" placeholder="Password"></input>
						</div>

					</div>

					<button type="submit" onClick={ this.props.loginPost }  className="btn btn-primary">Log In</button>
				</form>
				
				
				<div id="over" onClick={this.props.out}></div>
			</div>
			)
    },
	
		logInHandler : function(){
			console.log('login onClick');
		},
});

module.exports = LogInForm;