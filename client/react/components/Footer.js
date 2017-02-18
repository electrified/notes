/* eslint-env browser */
var React = require('react');

export default React.createClass({
  render() {
    return (<footer className="row">
      <div className="large-12 columns">
        <hr />
        <div className="row">
          <div className="large-6 columns">
            <p>&copy; 2013-2017 {this.props.sitetitle}.
            </p>
          </div>
          <div className="large-6 columns">
          </div>
        </div>
      </div>
    </footer>);
  }
});
