
const API_URI = '{SERVER_URI}';

const PlaynixOptions = {
    /**
     * @type {Boolean}
     * @default false
     */
    debug: false,
    /**
     * @type {String}
     */
    uri: `${API_URI}`,
    /**
     * @type {String}
     * @default POST
     */
    method: 'POST',
    /**
     * @type {String}
     * @default https
     */
    protocol: 'https',
    /**
     * @type {String}
     */
    environment: null,
    /**
     * @type {{log:String, event:String, error:String}}
     */
    paths: {}
};

export default PlaynixOptions;