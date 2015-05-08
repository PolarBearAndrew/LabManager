/**
 *
 */
var Footer = React.createFactory( require('./Footer.jsx') );
var ListContainer = React.createFactory( require('./List/ListContainer.jsx') );


var MainApp = React.createClass({

    mixins: [],

    getDefaultProps: function() {
        return;
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    render: function() {

        // console.log( '\tMainApp > render' );

        return (
			<div className="just-wrapper">
				<ListContainer />
                <Footer />
            </div>
        )
    },
});

module.exports = MainApp;
