import React, { Component, PropTypes } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import TeamHeader from './team/TeamHeader';
import TeamPublicHeader from './team/TeamPublicHeader';
import ProjectHeader from './project/ProjectHeader';
import Breadcrumb from './layout/Breadcrumb';
import MediaHeader from './media/MediaHeader';
import HeaderActions from './HeaderActions';
import Can from './Can';

const messages = defineMessages({
  projectLabel: {
    id: 'header.projectLabel',
    defaultMessage: 'Project'
  },
  teamLabel: {
    id: 'header.teamLabel',
    defaultMessage: 'Team'
  },
  teamsLabel: {
    id: 'header.teamsLabel',
    defaultMessage: 'Teams'
  }
});

class Header extends Component {
  render() {
    const { state } = this.props;
    const path = this.props.location ? this.props.location.pathname : null;
    const { formatMessage } = this.props.intl;

    const defaultHeader = (
      <header className="header header--default">
        <div className="header__container">
          <div className="header__breadcrumb"><Breadcrumb url="/check/teams" label={null} /></div>
          <HeaderActions {...this.props} />
        </div>
      </header>
    );

    if (!path) {
      return defaultHeader;
    }

    if (path.match(/media\/[0-9]+/)) {
      const projectUrl = path.match(/(.*)\/media\/[0-9]+/)[1];
      return (
        <header className="header header--media">
          <div className="header__container">
            <span style={{ display: 'none' }}><TeamHeader {...this.props} /></span>
            <div className="header__breadcrumb"><Breadcrumb url={projectUrl} label={formatMessage(messages.projectLabel)} /></div>
            <MediaHeader {...this.props} />
            <HeaderActions {...this.props} />
          </div>
        </header>
      );
    }

    if (path.match(/project\/[0-9]+\/edit/)) {
      const projectUrl = path.match(/(.*)\/edit$/)[1];
      return (
        <header className="header header--project-edit">
          <div className="header__container">
            <span style={{ display: 'none' }}><TeamHeader {...this.props} /></span>
            <div className="header__breadcrumb"><Breadcrumb url={projectUrl} label={formatMessage(messages.projectLabel)} /></div>
            <ProjectHeader {...this.props} />
            <HeaderActions {...this.props} />
          </div>
        </header>
      );
    }

    if (path.match(/project\/[0-9]+/)) {
      return (
        <header className="header header--project">
          <div className="header__container">
            <div className="header__team"><TeamHeader {...this.props} /></div>
            <ProjectHeader {...this.props} />
            <HeaderActions {...this.props} />
          </div>
        </header>
      );
    }

    if (path.match(/search\/?/)) {
      return (
        <header className="header header--default">
          <div className="header__container">
            <span style={{ display: 'none' }}><TeamHeader {...this.props} /></span>
            <div className="header__breadcrumb"><Breadcrumb url={`/${this.props.params.team}`} label={null} /></div>
            <HeaderActions {...this.props} />
          </div>
        </header>
      );
    }

    if (path.match(/\/members/)) {
      return (
        <header className="header header--team-subpage">
          <div className="header__container">
            <span style={{ display: 'none' }}><TeamHeader {...this.props} /></span>
            <div className="header__breadcrumb"><Breadcrumb url={`/${this.props.params.team}`} label={formatMessage(messages.teamLabel)} /></div>
            <HeaderActions {...this.props} />
          </div>
        </header>
      );
    }

    if (path.match(/\/join/)) {
      return (
        <header className="header header--team-subpage">
          <div className="header__container">
            <TeamPublicHeader {...this.props} />
          </div>
        </header>
      );
    }

    if (path.match(/\/(teams\/new)?$/)) {
      return (
        <header className="header header--team">
          <div className="header__container">
            <div className="header__breadcrumb"><Breadcrumb url="/check/teams" label={formatMessage(messages.teamsLabel)} /></div>
            <HeaderActions {...this.props} />
          </div>
        </header>
      );
    }

    return defaultHeader;
  }
}

Header.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(Header);
