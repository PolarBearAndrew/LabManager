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
		},

    //========================================================================
    //
    // render
	

    render: function() {
			
				var options = ['all', '801', '802', '803', '806', '813'];
			
				var showID = '';
			
				if(this.props.ID == 'all'){
					showID = '';
				}else{
					showID = ' - ' + this.props.ID;
				}
			
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
						</div>
        )
    },
});

module.exports = ListHeader;
