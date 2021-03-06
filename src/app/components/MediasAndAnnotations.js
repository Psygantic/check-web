import React, { Component, PropTypes } from 'react';
import MediaDetail from './media/MediaDetail';
import Annotation from './source/Annotation';
import AddAnnotation from './source/AddAnnotation';

class MediasAndAnnotations extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  compare(a, b) {
    if (a.timestamp < b.timestamp) {
      return 1;
    }
    if (a.timestamp > b.timestamp) {
      return -1;
    }
    return 0;
  }

  sort(annotations, medias) {
    const items = [];

    annotations.forEach((annotation) => {
      const item = annotation;
      item.itemType = 'annotation';
      item.timestamp = new Date(item.node.updated_at).getTime();
      items.push(item);
    });

    medias.forEach((media) => {
      const item = media;
      item.itemType = 'media';
      item.timestamp = parseInt(item.node.published, 10) * 1000;
      items.push(item);
    });

    items.sort(this.compare);
    this.setState({ items });
  }

  componentWillMount() {
    this.sort(this.props.annotations, this.props.medias);
  }

  componentWillReceiveProps(nextProps) {
    this.sort(nextProps.annotations, nextProps.medias);
  }

  render() {
    const that = this;
    const props = that.props;

    return (
      <div className="medias-and-annotations">
        <ul className="medias-list annotations-list">

          {that.state.items.map((item) => {
            if (item.itemType == 'annotation') {
              return (
                <li><Annotation annotation={item.node} annotated={props.annotated} annotatedType={props.annotatedType} /></li>
              );
            } else if (item.itemType == 'media') {
              return (
                <li className="media-card-link"><MediaDetail media={item.node} annotated={props.annotated} annotatedType={props.annotatedType} condensed /></li>
              );
            }
          })}

        </ul>

        <AddAnnotation annotated={props.annotated} annotatedType={props.annotatedType} types={props.types} />
      </div>
    );
  }
}

export default MediasAndAnnotations;
