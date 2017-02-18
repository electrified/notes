/* eslint-env browser */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import Footer from './Footer';

export const Page = React.createClass({
  propTypes: {
    sitetitle: React.PropTypes.string,
    sitesubtitle: React.PropTypes.string,
    user: React.PropTypes.object
  },
  render() {
    return (
      <div>
      <div className="title-bar" data-responsive-toggle="main-menu" data-hide-for="medium">
        <button className="menu-icon" type="button" data-toggle></button>
        <div className="title-bar-title">Menu</div>
      </div>

<div className="top-bar" id="main-menu">
  <div className="top-bar-left">
    <ul className="dropdown menu" data-dropdown-menu>
      <li className="menu-text">{this.props.sitetitle}</li>
    </ul>
  </div>
  <div className="top-bar-right">
    <ul className="menu" data-responsive-menu="drilldown medium-dropdown">
      <li className="has-submenu">
        <a href="#">Admin</a>
        <ul className="submenu menu vertical" data-submenu>
            <li><Link to={`/admin/users`}>List users</Link></li>
            <li><Link to={`/admin/users/add`}>Add user</Link></li>
            <li className="divider"></li>
            <li><Link to={`/admin/posts/add`}>Add post</Link></li>
            <li><Link to={`/admin/posts`}>List posts</Link></li>
            <li><Link to={`/admin/assets`}>List assets</Link></li>
            <li><Link to={`/admin/assets/add`}>Add assets</Link></li>
        </ul>
      </li>
      <li><a href="/logout">Logout</a></li>
                <li>{this.props.user &&
                    <Link to={`/admin/`}> {this.props.user.name}</Link>}</li>
    </ul>
  </div>
</div>
          <section className="main-section">
            <div className="row">
              <div className="large-12 columns">
                <h1><a href="/">{this.props.sitetitle}</a> <small>{this.props.sitesubtitle}</small></h1>
                <hr />
              </div>
            </div>
            <div className="row">
            <div className="large-12 columns" role="content">
              {this.props.children}
            </div>
          </div>
          <Footer sitetitle={this.props.sitetitle} />
          </section>
</div>
    );
  }
});

function mapStateToProps(state, ownProps) {
  return {
    sitetitle: state.config.sitetitle,
    sitesubtitle: state.config.sitesubtitle,
    user: {name : "Ed"}
  };
}

export default connect(mapStateToProps, null)(Page);
