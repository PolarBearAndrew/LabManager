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
            Author | Andrew Chen  {'( May / 2015 )'}
        </span>

        <span className="author_link">
            <a href="https://github.com/PolarBearAndrew/LabManager" >
              <i className="fa fa-2x fa-github"></i> </a>
            <a href="https://www.facebook.com/profile.php?id=100001317746154" >
              <i className="fa fa-2x fa-facebook-official"></i> </a>
        </span>
      </footer>
    );
  },


});

module.exports = Footer;
