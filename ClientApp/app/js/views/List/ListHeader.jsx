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
			
				var options = ['all', '801', '802', '803', '806', '813'];
			
				var showID = '';
			
			  // room ID
				if(this.props.ID == 'all'){
					showID = '';
				}else{
					showID = ' - ' + this.props.ID;
				}
			
				//isMamger string
				var whoAmI = function(mg){
					
					var show = {};
					
					if(mg.isManager){
						show.str = '...  I am a manager, my name is ';
						show.name = mg.name;
						
						
						return (
							<h5 className="lead">
										{ show.str } 
										<span className="text-success isName"> { show.name } </span>
										<a href="#" onClick={this.props.logout }><i className="fa fa-sign-out"></i></a>
							</h5>
						);
						
						
					}else{
						show.str = '... Your are a manager ? ';
						show.name = 'logIn';
						
						return (
							<h5 className="lead">
										{ show.str } 
										<a href="#" onClick={this.props.login }>
											<span className="text-primary"> { show.name } </span>
											<i className="fa fa-sign-in"></i>
										</a>
							</h5>
						);
					}
					
				}.bind(this)(this.props.manager);
			
			
        return (
						<div className="header">
							<h1>
									<i className="fa fa-users"></i>
									{'  Lab Manager  '}
									{ showID }
							</h1>
							<h4><span>{"Room ID "}</span> 
									<Selector 
										myID="selectID"
										selectRoomID = {this.props.selectRoomID}
										options = {options}
									/>
							</h4>
							{ whoAmI }
						</div>
        )
    },
});

module.exports = ListHeader;
