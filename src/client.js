import PlaynixOptions from './options';
import Exception from './exception';
import Response from './response';
import Message from './message';

export default class BaseLogClient
{
    constructor()
    {
        if (!BaseLogClient.singleton)
        {
            /**
             * @type {PlaynixOptions}
             */
            this.options = null;
            /**
             * @private
             * @type {String}
             */
            this._app_key = null;
            /**
             * @private
             * @type {XMLHttpRequest}
             */
            this._xhttp = null;
            /**
             * @private
             */
            this._meta = null;
            /**
             * @private
             * @type {String}
             */
            this._user = null;
            /**
             * @private
             * @type {String}
             */
            this._user_version = null;
            /**
             * @private
             * @type {String}
             */
            this._client_id = null;

            BaseLogClient.singleton = this;
        }

        return BaseLogClient.singleton;
    }

    /**
     * @protected
     */
    _onreadystatechange ()
    {
        if (this._xhttp instanceof XMLHttpRequest)
        {
            if (this._xhttp.readyState === XMLHttpRequest.DONE && this._xhttp.status === 200)
            {
                let response = Object.assign(new Response, JSON.parse(this._xhttp.responseText));
            }
            else
            {
                console.log(this._xhttp.responseText);
            }
        }
    }

    /**
     * @protected
     * @param {Error} error
     * @returns {Exception}
     */
    _createException(error) {}

    /**
     * @protected
     * @param {Message} data 
     */
    _commit(data)
    {
        if (this._meta)
        {
            data.meta = this._meta;
        }
        if (this._user)
        {
            data.user = this._user;
        }
        if (this._user_version)
        {
            data.appVersion = this._user_version;
        }
        if (this._client_id)
        {
            data.clientId = this._client_id;
        }
        if (this._app_key)
        {
            data.secret = this._app_key;
        }
        if (this.options.environment)
        {
            data.environment = this.options.environment;
        }
        if (this._xhttp)
        {    
            let path = '';
            if (PlaynixOptions.uri.indexOf(this.options.uri) != -1)
            {
                path = '/api/log';
            } 
            this._xhttp.open(this.options.method, `${this.options.protocol}:${this.options.uri}${path}`, true);
            if (this._xhttp instanceof XMLHttpRequest)
            {
                this._xhttp.setRequestHeader('Content-Type', 'application/json');
            }        
            this._xhttp.send(JSON.stringify(data));
        }        
    }
    
    /**
    * @public
    * @param {String} key - the client application api key
    * @param {Object} options
    * @param {Boolean} options.debug
    * @param {String} options.uri
    * @param {String} options.method
    * @param {String} options.protocol
    * @param {String} options.environment
    */
    init(key, options)
    {      
        options = options || {};   
        if (!key)
        {
            throw new Error('InvalidArgument: Application client id cannot be null');
        }
        if (typeof key != 'string')
        {
            throw new Error('InvalidArgument: Client id is expecting a string value');
        }
        options = Object.assign(PlaynixOptions, options);
        if (options.uri.indexOf('https:')!=-1)
        {
            options.uri = options.uri.replace('https:', '');
            options.protocol = 'https';
        }
        else if (options.uri.indexOf('http:')!=-1)
        {
            options.uri = options.uri.replace('http:', '');
            options.protocol = 'http';
        } 
        options.method = options.method.toUpperCase();
        if (['POST','PUT','DELETE'].indexOf(options.method) == -1)
        {
            throw new Error('InvalidArgument: Client submit method must either POST, PUT or DELETE');
        }
        this._app_key = key;
        this.options = options;
        this.generateClientId();
    }

    /**
     * @public
     * @description Generate and set a unique client Id
     */
    generateClientId() {}

    /**
    * @public
    * @description Sends a custom info-level message.
    * @param {String} message the custom message to log
    */
    writeMessage(message) {}

    /**
    * @public
    * @description Captures an event message
    * @param {String} id event id
    * @param {String} message event message
    * @param {String} action event action
    */
    writeEvent(id, message, action) {}

    /**
    * @public
    * @description Sends a custom error exception.
    * @param {Error} error Error object to log.
    * @param {Object} data additional data to send(must contains values of string, number, or boolean)
    */
    writeException(error, data) {}

    /**
    * @public
    * @description Sets custom metadata that will be submitted with each message
    * @param {Object|Array} data custom meta data, can be user to store user details
    */
    setMetaContext(data) {}

    /**
    * @public
    * @description Sets the user client version metadata
    * @param {String} version App version info
    */
    setAppVersion(version) {}

    /**
    * @public
    * @description Sets the client's current user metadata
    * @param {String} username Username of the currently logged on user
    */
    setAppUser(username) {}
}