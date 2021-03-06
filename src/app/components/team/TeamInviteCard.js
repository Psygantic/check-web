import React, { Component } from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import MdPaste from 'react-icons/lib/md/content-paste';
import MdDone from 'react-icons/lib/md/done';
import config from 'config';
import rtlDetect from 'rtl-detect';
import {
  encodeSvgDataUri,
} from '../../styles/js/helpers';

import {
  checkBlue,
  white,
  title,
  units,
  breakpointMobile,
  FlexRow,
} from '../../styles/js/variables';

class TeamInviteCard extends Component {
  constructor(props) {
    super(props);
    this.state = { copyValue: '', copied: false };
  }

  render() {
    const teamUrl = `${window.location.protocol}//${config.selfHost}/${this.props.team.slug}`;
    const joinUrl = `${teamUrl}/join`;
    const locale = this.props.intl.locale;
    const isRtl = rtlDetect.isRtlLang(locale);
    const fromDirection = isRtl ? 'right' : 'left';
    const toDirection = isRtl ? 'left' : 'right';

    // TODO: Render SVG via react, eg:
    // https://gist.github.com/kevinweber/3c519c32db6c976e9cbb5565dc3822f1
    // CGB 2017-6-29
    const teamInviteSvg = '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" opacity="0.2" width="24" height="24" viewBox="0 0 24 24"><path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/></svg>';

    const StyledMdCard = styled(Card)`
      background-color: ${checkBlue} !important;
      margin-bottom: ${units(2)};
      padding-top: 0;
      p, a {
        color: ${white} !important;
      }
    `;

    const BackgroundImageRow = styled.div`
      background-image: url("${encodeSvgDataUri(teamInviteSvg)}");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: top ${fromDirection};
      padding-${fromDirection}: ${units(21)};
      @media all and (max-width: ${breakpointMobile}) {
        padding-${fromDirection}: ${units(12)};
        background-size: ${units(10)};
      }
    `;

    const StyledMdCardTitle = styled.h2`
      font: ${title};
      color: ${white};
    `;

    const StyledMdRaisedButton = styled(RaisedButton)`
      svg {
        margin-${fromDirection}: 12px!important;
        margin-${toDirection}: 0!important;
      }
    `;

    return (
      <StyledMdCard>
        <CardText>
          <BackgroundImageRow>
            <StyledMdCardTitle>
              <FormattedMessage
                id="teamInviteCard.title"
                defaultMessage={'Build Your Team'}
              />
            </StyledMdCardTitle>

            <p><FormattedMessage
              id="teamMembersComponent.inviteLink"
              defaultMessage={'To invite colleagues to join {teamName}, send them this link:'}
              values={{ teamName: this.props.team.name }}
            /></p>
            <p>{joinUrl}</p>
            <CopyToClipboard
              text={joinUrl}
              onCopy={() => this.setState({ copied: true })}
            >
              <FlexRow>
                {this.state.copied ? <StyledMdRaisedButton
                  style={{ marginLeft: 'auto' }}
                  icon={<MdDone />}
                  label={<FormattedMessage
                    id="teamInviteCard.copy"
                    defaultMessage={'COPIED!'}
                  />}
                /> : <StyledMdRaisedButton
                  icon={<MdPaste />}
                  style={{ marginLeft: 'auto' }}
                  label={<FormattedMessage
                    id="teamInviteCard.copied"
                    defaultMessage={'COPY'}
                  />}
                />}
              </FlexRow>
            </CopyToClipboard>
          </BackgroundImageRow>
        </CardText>
      </StyledMdCard>
    );
  }
}

export default injectIntl(TeamInviteCard);
