const { readFile } = require('fs');
const pify = require('pify');
const { safeLoad } = require('js-yaml');
const { initializeMiddleware } = require('swagger-tools');

const parseJSON = json => JSON.parse(json);
const parseYAML = yaml => safeLoad(yaml);
const createMiddleware = options => spec => new Promise(resolve => {
    initializeMiddleware(spec, middleware => {
        const metadata = middleware.swaggerMetadata();
        const apiPath = options.apiPath || '/api-docs';
        const uiPath = options.uiPath || '/docs';

        const swaggerUi = middleware.swaggerUi({
            apiDocs: `${spec.basePath}${apiPath}`,
            swaggerUi: `${spec.basePath}${uiPath}`
            // TODO: The updated ui is nicer. It can be enabled by uncommenting this.
            // Problem is, it does not load `this` spec by default, but rather the petstore sample from the internet.
            // swaggerUiDir: `${__dirname}/dist`
        });

        resolve((req, res, next) => {
            metadata(req, res, () => options.ui ? swaggerUi(req, res, next) : next);
        });
    });
});

module.exports = function(path, options = {}) {
    return pify(readFile)(path)
        .then(parseJSON)
        .catch(parseYAML)
        .then(createMiddleware(options));
};
