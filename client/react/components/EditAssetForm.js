/* eslint-env browser */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {editAssetFormSubmitted} from '../actions/AppActions';
import { Field, reduxForm } from 'redux-form/immutable'
import {findAsset} from '../reducers/assets';
import FileInput from './FileInput';
export const fields = ['id', 'title', 'file'];

// const renderInput = field =>   // Define stateless component to render input and errors
//   <div>
//   <input {...field.input} type={field.type} />
//   {field.meta.touched &&
//    field.meta.error &&
//    <span className="error">{field.meta.error}</span>}
//   </div>


const EditAssetForm = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    uploadAsset: PropTypes.func.isRequired
  },
  handleFile: function(e) {
    console.log(e.toJSON());
    const reader = new FileReader();
    const file = e.get('file');

    reader.onload = (upload) => {
      this.props.uploadAsset({
        title: e.get('title'),
        data_uri: upload.target.result,
        filename: file.name
      });
    };

    reader.readAsDataURL(file);
  },

  theSubmit: function() {

  },
  render: function() {
    const { error, handleSubmit, pristine, reset, submitting } = this.props
    // console.log(FileInput);
    return(<form onSubmit={handleSubmit(this.handleFile)}>
      <label>file</label>
      <Field
        type="file"
        name="file"
        component={FileInput}
      />

      <Field
        type="text"
        name="title"
        component="input"
      />

      <div className="row">
        <button type="submit" disabled={submitting}>Save</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>);
  }
});

function mapStateToProps(state, ownProps) {
  // const id = ownProps.params.assetId;
  // var defaults = {
  //   id: null,
  //   title: ""
  // };
  // const asset = findAsset(state.assets, id);
  //
  // const initialValues = (id && asset) ? asset.toJS() : defaults;
  //
  // return {
  //   id,
  //   initialValues
  // };
  return ownProps;
}

// export default
//   reduxForm({
//     form: 'editAsset'
//   })(EditAssetForm);
// , {onSubmit: editAssetFormSubmitted}
export default connect(mapStateToProps, {uploadAsset: editAssetFormSubmitted}) (
  reduxForm({
    form: 'editAsset'
  })(EditAssetForm));
