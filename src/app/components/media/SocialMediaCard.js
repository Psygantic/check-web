import React, { Component, PropTypes } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';
import MediaUtil from './MediaUtil';
import MediaInspector from './MediaInspector';
import AuthorPicture from '../AuthorPicture';
import TimeBefore from '../TimeBefore';
import { bemClass } from '../../helpers';
import deepEqual from 'deep-equal';
import ParsedText from '../ParsedText';

const messages = defineMessages({
  link: {
    id: 'socialMediaCard.link',
    defaultMessage: 'Link',
  },
});

class SocialMediaCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInspectorActive: false,
    };
  }

  handleBodyClick(e) {
    if (!this.props.condensed) { // only open inspector on media page
      this.setState({ isInspectorActive: true });
    }
  }

  handleInspectorDismiss(e) {
    this.setState({ isInspectorActive: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEqual(nextProps, this.props) || !deepEqual(nextState, this.state);
  }

  render() {
    const { media, data, condensed } = this.props;
    const url = MediaUtil.url(media, data);
    const embedPublishedAt = MediaUtil.embedPublishedAt(media, data);
    const authorName = MediaUtil.authorName(media, data);
    const authorUsername = MediaUtil.authorUsername(media, data);
    const authorUrl = MediaUtil.authorUrl(media, data);
    const bodyText = MediaUtil.bodyText(media, data);
    const bodyImageUrl = MediaUtil.bodyImageUrl(media, data);
    const stats = MediaUtil.stats(media, data, this.props.intl);

    return (
      <article className="social-media-card">
        <MediaInspector media={media} isActive={this.state.isInspectorActive} dismiss={this.handleInspectorDismiss.bind(this)} />
        <div className="social-media-column-alpha">
          <div className="social-media-card__header / card-header">
            <AuthorPicture media={media} data={data} />
            <div className="social-media-card__header-text-primary / header-text-primary">
              <a href={authorUrl} target="_blank" rel="noopener noreferrer" className="social-media-card__name">{authorName || authorUsername}</a>
              { ((authorName && authorUsername) && (authorName !== authorUsername)) ?
                <a href={authorUrl} target="_blank" rel="noopener noreferrer" className="social-media-card__username">{authorUsername}</a> : null
              }
            </div>
          </div>

          <div className={bemClass('social-media-card__body', condensed, '--condensed')} onClick={this.handleBodyClick.bind(this)}>
            <div className="social-media-card__body-text"><ParsedText text={bodyText} /></div>
          </div>

          <span className="social-media-card__header-text-secondary">
            { MediaUtil.socialIcon(media.domain) }
            <a href={url} target="_blank" rel="noopener noreferrer">
              {embedPublishedAt ? <TimeBefore date={embedPublishedAt} /> : this.props.intl.formatMessage(messages.link)}
            </a>
          </span>
          <div className="social-media-card__footer">
            {stats.map(stat => <span className="social-media-card__footer-stat">{stat}</span>)}
          </div>
        </div>

        <div className="social-media-column-omega">
          {bodyImageUrl ?
            <div className="social-media-card__body-image" style={{ backgroundImage: `url(${bodyImageUrl})` }} />
          : null }
        </div>
      </article>
    );
  }
}

SocialMediaCard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SocialMediaCard);
