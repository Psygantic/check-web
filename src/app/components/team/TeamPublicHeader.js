import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import PublicTeamRoute from '../../relay/PublicTeamRoute';
import MdArrowDropDown from 'react-icons/lib/md/arrow-drop-down';
import TeamHeaderComponent from './TeamHeaderComponent';

const TeamPublicHeaderContainer = Relay.createContainer(TeamHeaderComponent, {
  fragments: {
    team: () => Relay.QL`
      fragment on PublicTeam {
        name,
        avatar,
        dbid,
        slug
      }
    `,
  },
});

class TeamPublicHeader extends Component {
  render() {
    const teamSlug = (this.props.params && this.props.params.team) ? this.props.params.team : '';
    const route = new PublicTeamRoute({ teamSlug });
    return (
      <Relay.RootContainer
        Component={TeamPublicHeaderContainer}
        route={route}
      />
    );
  }
}

export default TeamPublicHeader;
