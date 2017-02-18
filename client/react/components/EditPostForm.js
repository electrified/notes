/* eslint-env browser */
import React, {PropTypes} from 'react';
import TagsInput from 'react-tagsinput';
import {connect} from 'react-redux';
import {createPost, getPostForEdit} from '../actions/AppActions';
import {fromJS} from 'immutable';
import {Field, reduxForm} from 'redux-form/immutable';
import {isUnusedPath} from '../api/api';
import {findPost} from '../reducers/posts.js';

const validate = values => {
  const errors = {};
  if(!values) {
    return errors;
  }

  if (!values.get('path')) {
    errors.path = 'Required';
  }
  if (!values.get('title')) {
    errors.title = 'Required';
  }
  if (!values.get('body')) {
    errors.body = 'Required';
  }
  return errors;
};

const asyncValidate = (values/*, dispatch */) => {
  return isUnusedPath(values.get('id'), values.get('path'));
};

var EditPostForm = React.createClass({
  propTypes: {
    asyncValidating: PropTypes.string.isRequired,
    id: React.PropTypes.string,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired
  },
  renderField({ input, label, type, meta: { asyncValidating, touched, error } }) {
    return (
      <div>
        <label>{label}</label>
        <div className={asyncValidating ? 'async-validating' : ''}>
          <input {...input} type={type} placeholder={label}/>
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    );
  },
  renderTextarea({ input, label, type, meta: { asyncValidating, touched, error } }) {
    return (
      <div>
        <label>{label}</label>
        <div className={asyncValidating ? 'async-validating' : ''}>
          <textarea {...input} placeholder={label} rows={20} />
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    );
  },
  renderTags({ input, label, meta: { asyncValidating, touched, error } }) {
    return (
      <div>
        <label>{label}</label>
        <div className={asyncValidating ? 'async-validating' : ''}>
          <TagsInput {...input} />
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    );
  },
  render: function() {
    const {asyncValidating, submitting} = this.props;

    return(<form onSubmit={this.props.handleSubmit}>

      <Field
        name="tags"
        label="tags"
        component={this.renderTags}
      />

      <Field
        type="text"
        name="title"
        label="title"
        component={this.renderField}
      />

      <Field
        type="text"
        name="path"
        label="path"
        component={this.renderField}
      />

      <Field
        type="textarea"
        name="body"
        label="body"
        component={this.renderTextarea}
      />

      <Field
        type="checkbox"
        name="published"
        label="published?"
        component={this.renderField}
      />

      <div className="row">
        <button className="button" type="submit" disabled={submitting}>
        {submitting ? <i/> : <i/>}
        Save post
        </button>
      </div>
    </form>);
  }
});

function mapStateToProps(state, ownProps) {
  const id = ownProps.params.postId;
  var defaults = fromJS({
    id: null,
    title: "",
    path: "",
    body: "",
    published: false,
    tags: []
  });
  const post = findPost(state.posts, id);

  const initialValues = (id && post) ? post : defaults;

  return {
    id,
    initialValues
  };
}

export default connect(mapStateToProps, {onSubmit: createPost, getPostForEdit})(reduxForm({
  form: 'editPost',
  validate,
  asyncValidate,
  asyncBlurFields: [ 'path' ],
  enableReinitialize: true
})(EditPostForm));
