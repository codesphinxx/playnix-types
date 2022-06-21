import PlaynixOptions from './options';
import LoggingConfig from './config';
import Exception from './exception';
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
            /**
             * @private
             * @type {{category:String, message:String, timestamp:Date, data:Object}[]}
             */
            this._breadcrumbs = [];

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
            if (this._xhttp.readyState === XMLHttpRequest.DONE && this._xhttp.status != 200 && this.options.debug && !this.options.console.log)
            {
                console.log(this._xhttp.responseText);
            }
        }
    }

    static get CONSTANTS()
    {
        return LoggingConfig;
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
        if (this.options.appKey)
        {
            data.secret = this.options.appKey;
        }
        if (this.options.environment)
        {
            data.environment = this.options.environment;
        }
        if (this._breadcrumbs.length != 0)
        {
            data.breadcrumbs = this._breadcrumbs;
        }
        if (this._xhttp)
        {
            let path = '';
            if (data.name == LoggingConfig.LOG_ACTION.ERROR && this.options.paths && this.options.paths.error)
            {
                path = `/${this.options.paths.error}`;
            } 
            if (data.name == LoggingConfig.LOG_ACTION.EVENT && this.options.paths && this.options.paths.event)
            {
                path = `/${this.options.paths.event}`;
            }
            if (data.name == LoggingConfig.LOG_ACTION.MESSAGE && this.options.paths && this.options.paths.message)
            {
                path = `/${this.options.paths.message}`;
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
     * @protected
     * @param {Object} breadcrumb
     * @param {String} breadcrumb.category
     * @param {String} breadcrumb.message
     * @param {Date} breadcrumb.timestamp
     * @param {Object} breadcrumb.data
     */
    _extractBreadcrumb(breadcrumb)
    {
        if (!breadcrumb) return;

        let values = {};

        if (typeof breadcrumb.category == 'string')
        {
            values.category = breadcrumb.category;
        }
        if (typeof breadcrumb.message == 'string')
        {
            values.message = breadcrumb.message;
        }
        if (breadcrumb.timestamp instanceof Date)
        {
            values.timestamp = breadcrumb.timestamp.getTime();
        }
        else if (typeof breadcrumb.timestamp == 'number' || typeof breadcrumb.timestamp == 'bigint')
        {
            values.timestamp = breadcrumb.timestamp;
        }
        if (breadcrumb.data)
        {
            values.data = JSON.parse(JSON.stringify(breadcrumb.data));
        }
        
        return values;
    }

    /**
    * @protected
    * @param {Object} options
    */
    _validateOptions(options)
    {
        if (options.appKey && typeof options.appKey != 'string')
        {
            throw new Error('InvalidArgument: [appKey] is expecting a string value');
        }
        if ((options.debug != null || options.debug != undefined) && typeof options.debug != 'boolean')
        {
            throw new Error('InvalidArgument: [debug] is expecting a string value');
        }
        if (options.uri && typeof options.uri != 'string')
        {
            throw new Error('InvalidArgument: [uri] is expecting a string value');
        }
        if (['POST','PUT','PATCH','DELETE'].indexOf(options.method) == -1)
        {
            throw new Error('InvalidArgument: Client submit method must either POST, PUT, PATCH or DELETE');
        }
        if (['http','https'].indexOf(options.protocol) == -1)
        {
            throw new Error('InvalidArgument: Client submit protocol must either HTTP or HTTPS');
        }
        if (options.environment && typeof options.environment != 'string')
        {
            throw new Error('InvalidArgument: [environment] is expecting a string value');
        }
        if (options.paths)
        {
            if (options.paths.message && typeof options.paths.message != 'string')
            {
                throw new Error('InvalidArgument: [paths.message] is expecting a string value');
            }
            if (options.paths.event && typeof options.paths.event != 'string')
            {
                throw new Error('InvalidArgument: [paths.event] is expecting a string value');
            }        
            if (options.paths.error && typeof options.paths.error != 'string')
            {
                throw new Error('InvalidArgument: [paths.error] is expecting a string value');
            }
        }        
    }
    
    /**
    * @public
    * @param {Object} options
    * @param {String} options.appKey
    * @param {Boolean} options.debug
    * @param {String} options.uri
    * @param {String} options.method
    * @param {String} options.protocol
    * @param {String} options.environment
    * @param {Object} options.paths
    * @param {String} options.paths.message
    * @param {String} options.paths.event
    * @param {String} options.paths.error
    * @param {Object} options.console
    * @param {Boolean} options.console.log
    * @param {Boolean} options.console.warn
    * @param {Boolean} options.console.error
    */
    init(options)
    {      
        options = options || {};
        options = Object.assign(PlaynixOptions, options);
        options.method = options.method.toUpperCase();
        options.uri = options.uri.toLowerCase();

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
        else if (location.protocol)
        {
            options.protocol = location.protocol.replace(':', '');
        }
        if (options.paths)
        {
            if (options.paths.message)
            {
                if (!options.paths.error) options.paths.error = options.paths.message;
                if (!options.paths.event) options.paths.event = options.paths.message;
            }
            if (options.paths.event)
            {
                if (!options.paths.error) options.paths.error = options.paths.event;
                if (!options.paths.message) options.paths.message = options.paths.event;
            }        
            if (options.paths.error)
            {
                if (!options.paths.event) options.paths.event = options.paths.error;
                if (!options.paths.message) options.paths.message = options.paths.error;
            }
        }

        this._validateOptions(options);
        
        this.options = options;
        this.generateClientId();
    }

    /**
    * @public
    * @description Sets breadcrumbs that will be attached to any outgoing message
    * @param {Object} breadcrumb Breadcrumb data
    * @param {String} breadcrumb.category
    * @param {String} breadcrumb.message
    * @param {Date} breadcrumb.timestamp
    * @param {Object} breadcrumb.data
    */
    addBreadcrumb(breadcrumb) 
    {
        let entry = this._extractBreadcrumb(breadcrumb);
        if (entry)
        {
            this._breadcrumbs.push(entry);
            return true;
        }

        return false;
    }

    /**
    * @public
    * @description Clear breadcrumbs
    */
    clearBreadcrumbs() 
    {
        this._breadcrumbs.length = 0;
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
    * @param {String} category event category
    */
    writeEvent(id, message, category) {}

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