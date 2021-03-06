import Relay from 'react-relay';
import util from 'util';

class CheckNetworkLayer extends Relay.DefaultNetworkLayer {
  sendQueries(requests: Array<RelayQueryRequest>): ?Promise<any> {
    return Promise.all(requests.map(request => (
      this._sendQuery(request).then(
        (result) => {
          const history = this._init.history;
          if (result.status === 404 && window.location.pathname != '/check/404') {
            history.push('/check/404');
          } else if (result.status === 401 || result.status === 403) {
            const team = this._init.team();
            if (team != '') {
              history.push(`/${team}/join`);
            } else {
              history.push('/check/forbidden');
            }
          }
          return result.json();
        }).then((payload) => {
          if (payload.hasOwnProperty('errors')) {
            const error = createRequestError(request, '200', payload);
            request.reject(error);
          } else if (!payload.hasOwnProperty('data')) {
            request.reject(new Error(
                'Server response was missing for query ' +
                `\`${request.getDebugName()}\`.`,
                ));
          } else {
            request.resolve({ response: payload.data });
          }
        }).catch(
          (error) => {
            request.reject(error);
          },
        )
      )));
  }

  _sendQuery(request: RelayQueryRequest): Promise<any> {
    return fetch(this._uri, {
      ...this._init,
      body: JSON.stringify({
        query: request.getQueryString(),
        variables: request.getVariables(),
        team: this._init.team(),
      }),
      headers: {
        ...this._init.headers,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }

  _sendMutation(request) {
    const _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { default: obj }; };

    let init = void 0;
    const files = request.getFiles();
    const _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));
    const _stringify2 = _interopRequireDefault(require('babel-runtime/core-js/json/stringify'));

    const that = this;

    if (files) {
      if (!global.FormData) {
        throw new Error('Uploading files without `FormData` not supported.');
      }
      const formData = new FormData();
      formData.append('query', request.getQueryString());
      formData.append('variables', (0, _stringify2.default)(request.getVariables()));
      formData.append('team', that._init.team());
      for (const filename in files) {
        if (files.hasOwnProperty(filename)) {
          formData.append(filename, files[filename]);
        }
      }
      init = (0, _extends3.default)({}, this._init, {
        body: formData,
        method: 'POST',
      });
    } else {
      init = (0, _extends3.default)({}, this._init, {
        body: (0, _stringify2.default)({
          query: request.getQueryString(),
          variables: request.getVariables(),
          team: that._init.team(),
        }),
        headers: (0, _extends3.default)({}, this._init.headers, {
          Accept: '*/*',
          'Content-Type': 'application/json',
        }),
        method: 'POST',
      });
    }
    return fetch(this._uri, init).then(response => throwOnServerError(request, response));
  }
}

function throwOnServerError(request, response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return response.text().then((payload) => {
    throw createRequestError(request, response.status, payload);
  });
}

function createRequestError(request, responseStatus, payload) {
  const errorReason: string = `Server response had an error status ${responseStatus} and error ${util.inspect(payload)}`;

  const error = new Error(errorReason);
  (error: any).source = payload;
  (error: any).status = responseStatus;

  return error;
}

export default CheckNetworkLayer;
