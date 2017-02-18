/* eslint-env browser */
import React, {PropTypes} from 'react'
import { List, Map } from 'immutable';
import {Table, Column, Cell} from 'fixed-data-table';
import {connect} from 'react-redux'
import { deletePost } from '../actions/AppActions'
import {Link} from 'react-router';

const DateCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {new Date(data.get(rowIndex).get(col)).toLocaleString()}
  </Cell>
);

const Posts = React.createClass({
  propTypes: {
    posts: PropTypes.instanceOf(List).isRequired,
    deletePost: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      columnWidths: {
        url: 100,
        title: 150,
        author: 50
      }
    };
  },
  deletePost: function(id) {
    var r = confirm("Sure you wanna delete this post?");
    if (r) {
      this.props.deletePost(id);
    }
  },
  _onColumnResizeEndCallback: function(newColumnWidth, columnKey) {
    console.log('_onColumnResizeEndCallback');
    this.setState(({columnWidths}) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }));
  },
  render() {
    if (!this.props.posts) {
      return (<div>Loading posts!</div>);
    }

    var posts = this.props.posts;
    return (
      <div>
        <h1>Posts</h1>
        <div>
          <Table
            rowHeight={50}
            rowsCount={posts.size}
            width={1000}
            maxHeight={800}
            headerHeight={50}
            isColumnResizing={false}
            onColumnResizeEndCallback={this._onColumnResizeEndCallback}
            >
            <Column
              columnKey="title"
              flexGrow={2}
              header={<Cell>Title</Cell>}
              cell={({rowIndex, props}) => (
                <Cell>
                  <Link to={`/admin/posts/post/${posts.get(rowIndex).get('id')}`}>{posts.get(rowIndex).get('title')}</Link>
                </Cell>
              )}
              width={this.state.columnWidths.title}
              isResizable={true}
            />
            <Column
              columnKey="url"
              flexGrow={1}
              header={<Cell>URL</Cell>}
              cell={({rowIndex, props}) => (
                <Cell {...props}>
                  <a href={'/page/' + posts.get(rowIndex).get('path')}>{posts.get(rowIndex).get('path')}</a>
                </Cell>
              )}
              width={this.state.columnWidths.url}
              isResizable={true}
            />
            <Column
              columnKey="author"
              header={<Cell>Author</Cell>}
              cell={({rowIndex, props}) => (
                <Cell {...props}>
                  {posts.get(rowIndex).get('user').get('username')}
                </Cell>
              )}
              width={this.state.columnWidths.author}
              isResizable={true}
            />
            <Column
              header={<Cell>Published?</Cell>}
              cell={({rowIndex, props}) => (
                <Cell {...props}>
                  {posts.get(rowIndex).get('published') ? 'yes' : 'no'}
                </Cell>
              )}
              width={100}
            />
            <Column
              header={<Cell>Created on</Cell>}
              cell={<DateCell data={posts} col="created_at" />}
              width={100}
            />
            <Column
              header={<Cell>Updated on</Cell>}
              cell={<DateCell data={posts} col="updated_at" />}
              width={100}
            />
            <Column
              header={<Cell>Delete</Cell>}
              cell={({rowIndex, props}) => (
                <Cell {...props}>
                  <a onClick={() => {this.deletePost(posts.get(rowIndex).get('id'))}}>Delete</a>
                </Cell>
              )}
              width={100}
            />
          </Table>
        </div>
        <Link className="button" to={`/admin/posts/add`}>add new post</Link>
        <div className="detail">
          {this.props.children && React.cloneElement(this.props.children, {
            posts: this.props.posts
          })}
        </div>
      </div>
    )
  }
})

function mapStateToProps(state) {
  console.log("mapStateToProps");
  return {
    posts: state.posts
  }
}

export default connect(mapStateToProps,{ deletePost })(Posts)
