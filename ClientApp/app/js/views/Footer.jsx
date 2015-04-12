/**
 *
 */
var ReactPropTypes = React.PropTypes;
var actions = require('../actions/AppActionCreator');

var Footer = React.createClass({

  propTypes: {
  },

  /**
   * @return {object}
   */
  render: function() {

  	return (
      <footer className="footer">
        <span className="author">
            <h1>Andrew Chen for OIT / May,2015</h1>
			
        </span>
      </footer>
    );
  },


});

module.exports = Footer;
