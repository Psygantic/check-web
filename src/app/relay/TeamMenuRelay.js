import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import TeamRoute from './TeamRoute';
import teamFragment from './teamFragment';
import Can from '../components/Can';

class TeamMenu extends Component {
  render() {
    const { team } = this.props;

    return (
      <Can permissions={team.permissions} permission="update Team">
        <li className='header-actions__menu-item' onClick={Checkdesk.history.push.bind(this, '/members')}>Manage team...</li>
      </Can>
    );
  }
}

const TeamMenuContainer = Relay.createContainer(TeamMenu, {
  fragments: {
    team: () => teamFragment
  }
});

class TeamMenuRelay extends Component {
  render() {
    const route = new TeamRoute({ teamId: '' });
    return (<Relay.RootContainer Component={TeamMenuContainer} route={route} />);
  }
}

export default TeamMenuRelay;
