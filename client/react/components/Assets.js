/* eslint-env browser */
import React, {PropTypes} from 'react'
import {Table, Column, Cell} from 'fixed-data-table';
import {connect} from 'react-redux'
import {getAllAssets, deleteAsset } from '../actions/AppActions'
import {Link} from 'react-router';
import { List, Map } from 'immutable';

export const Assets = React.createClass({
  propTypes: {
    assets: PropTypes.instanceOf(List).isRequired,
    deleteAsset: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      columnWidths: {
        mimetype: 100,
        title: 150,
        filename: 50
      }
    };
  },
  deleteAsset: function(id) {
    var r = confirm("Sure you wanna delete this asset?");
    if (r) {
      this.props.deleteAsset(id);
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
    if (!this.props.assets) {
      return (<div>Loading assets!</div>);
    }

    var assets = this.props.assets;

    return (
      <div>
        <h1>Assets</h1>
        <div>
          <Table
            rowHeight={50}
            rowsCount={assets.size}
            width={1000}
            height={200}
            headerHeight={50}
            isColumnResizing={false}
            onColumnResizeEndCallback={this._onColumnResizeEndCallback}
            >
            <Column
              columnKey="title"
              flexGrow={2}
              header={<Cell>Title</Cell>}
              width={this.state.columnWidths.title}
              isResizable={true}
              cell={({rowIndex, props}) => (
                <Cell {...props}>
                  {assets.get(rowIndex).get('title')}
                </Cell>
              )}
            />
            <Column
              columnKey="filename"
              flexGrow={1}
              header={<Cell>filename</Cell>}
              width={this.state.columnWidths.filename}
              isResizable={true}
              cell={({rowIndex, props}) => (
                <Cell {...props}>
                  {assets.get(rowIndex).get('filename')}
                </Cell>
              )}
            />
            <Column
              columnKey="mimetype"
              header={<Cell>mimetype</Cell>}
              width={this.state.columnWidths.mimetype}
              isResizable={true}
              cell={({rowIndex, props}) => (
                <Cell {...props}>
                  {assets.get(rowIndex).get('mimetype')}
                </Cell>
              )}
            />
            <Column
              header={<Cell>preview</Cell>}
              width={100}
            />
            <Column
              header={<Cell>Delete</Cell>}
              cell={({rowIndex, props}) => (
                <Cell {...props}>
                  <a onClick={() => {this.deleteAsset(assets.get(rowIndex).get('id'))}}>Delete</a>
                </Cell>
              )}
              width={100}
            />
          </Table>
        </div>
        <Link to={`/admin/assets/add`}>add new asset</Link>
        <div className="detail">
          {this.props.children && React.cloneElement(this.props.children, {
            posts: this.props.assets
          })}
        </div>
      </div>
    )
  }
})

function mapStateToProps(state) {
  return {
    assets: state.assets
  }
}

export default connect(
  mapStateToProps,
  { deleteAsset }
)(Assets)
