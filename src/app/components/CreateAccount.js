import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import PenderCard from './PenderCard';
import CreateAccountMutation from '../relay/CreateAccountMutation';
import Message from './Message';
import config from 'config';

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
      message: null
    };
  }

  handleSubmit(redirect) {
    var url = document.getElementById('create-account-url').value;

    var onFailure = (transaction) => {
      this.setState({ message: 'Sorry, could not create the source' });
    };
     
    var onSuccess = (response) => {
      var sid = response.createAccount.account.source_id;
      this.props.history.push('/source/' + sid);
      this.setState({ message: null });
    };

    Relay.Store.commitUpdate(
      new CreateAccountMutation({
        url: url
      }),
      { onSuccess, onFailure }
    );
  }

  handlePreview() {
    var url = document.getElementById('create-account-url').value;
    this.setState({ url: url, message: null });
  }

  render() {
    return (
      <div className="create-account">
        <Message message={this.state.message} />

        <div id="account-url-container" className="create-account-col">
          <h4>Create a source</h4>
          <h2>Source URL</h2>
          <TextField hintText="Twitter, Facebook, YouTube..." fullWidth={true} name="url" id="create-account-url" /><br />
          <FlatButton id="create-account-submit" primary={true} onClick={this.handleSubmit.bind(this)} label="Create" />
          <FlatButton id="create-account-preview" secondary={true} onClick={this.handlePreview.bind(this)} label="Preview" />
        </div>
        
        <div id="account-preview" className="create-account-col">
          <h4>Preview</h4>

          {(() => {
            if (this.state.url != '') {
              return (<PenderCard url={this.state.url} penderUrl={config.penderUrl} />);
            }
          })()}
        </div>
      </div>
    );
  }
}

export default CreateAccount;