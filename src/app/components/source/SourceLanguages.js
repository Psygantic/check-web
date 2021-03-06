import React from 'react';
import Relay from 'react-relay';
import { injectIntl, defineMessages } from 'react-intl';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import AboutRoute from '../../relay/AboutRoute';
import difference from 'lodash.difference';
import intersection from 'lodash.intersection';

const messages = defineMessages({
  languages: {
    id: "sourceLanguages.label",
    defaultMessage: "Languages",
  },
});

class LanguageComponent extends React.Component {
  getAvailableLanguages() {
    const usedLanguages = this.props.usedLanguages
      .map(tr => JSON.parse(tr.node.content).find(it => it.field_name === 'language'))
      .map(it => it.value);

    const supportedLanguages = JSON.parse(this.props.about.languages_supported);

    const projectLanguages = this.props.projectLanguages ? JSON.parse(this.props.projectLanguages) : null;

    return difference(projectLanguages ? intersection(Object.keys(supportedLanguages), projectLanguages) : Object.keys(supportedLanguages), usedLanguages)
      .map(l => {
        return { value: l, label: supportedLanguages[l] };
      });
  }

  renderLanguages(){
    const usedLanguages = this.props.usedLanguages
      .map(tr => ({ id: tr.node.id, content: JSON.parse(tr.node.content).find(it => it.field_name === 'language') }));

    const supportedLanguages = JSON.parse(this.props.about.languages_supported);

    return (
      <div className="source-tags__tags">
        {usedLanguages.map(language =>
          <Chip key={language.id}
            className="source-tags__tag"
            onRequestDelete={this.props.onDelete ? () => {
              this.props.onDelete(language.id);
            } : null}
          >
            {supportedLanguages[language.content.value]}
          </Chip>
        )}
      </div>
    );
  }

  renderLanguagesView(){
    return this.renderLanguages();
  }

  renderLanguagesEdit(){
    const clearInput = () => {
      document.getElementById('sourceLanguageInput').value = "";
      this.setState({ searchText: '' });
    };

    const selectCallback = (value) => {
      clearInput();
      this.props.onSelect(value);
    };

    return <div>
      <AutoComplete
        id="sourceLanguageInput"
        filter={AutoComplete.caseInsensitiveFilter}
        floatingLabelText={this.props.intl.formatMessage(messages.languages)}
        dataSource={this.getAvailableLanguages()}
        dataSourceConfig={{ text: 'label' , value: 'value'}}
        onFocus={clearInput}
        onNewRequest={selectCallback}
        fullWidth
      />
      {this.renderLanguages()}
    </div>;
  }

  render() {
    return (this.props.isEditing ? this.renderLanguagesEdit() : this.renderLanguagesView());
  }
}

const LanguageContainer = Relay.createContainer(injectIntl(LanguageComponent), {
  fragments: {
    about: () => Relay.QL`
      fragment on About {
        languages_supported
      }
    `,
  },
});

class SourceLanguages extends React.Component {
  render() {
    const route = new AboutRoute();
    return (<Relay.RootContainer Component={LanguageContainer} route={route} renderFetched={data => <LanguageContainer {...this.props} {...data} />} />);
  }
}

export default SourceLanguages;
