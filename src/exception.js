import LoggingConfig from './config';
import Message from './message';
import StackTracer from 'stacktracey';

export default class Exception extends Message
{
    /**
     * @param {Error} error 
     */
    constructor(error, handled = true)
    {
        super(error.message);
        this.name = LoggingConfig.LOG_ACTION.ERROR;
                
        /**
         * @type {Boolean}
         */
        this.handled = handled;
        /**
         * @type {Object[]}
         */
        this.stack = [];
        /**
         * @type {Object}
         */
        this.extra = {};
        /**
         * @type {String}
         */
        this.level = LoggingConfig.LOGS.ERROR;

        this.addStack(error);
    }

    addStack(error)
    {
        if (!error) return;

        if (error.description) 
            this.description = error.description;

        if (error.displayName)
            this.display = error.displayName;

        if (error.number)
            this.number = error.number;

        if (error.cause)
            this.cause = error.cause;

        if (error.fileName) 
            this.file = error.fileName;
        
        if (error.lineNumber)
            this.line = error.lineNumber;

        if (error.columnNumber)
            this.column = error.columnNumber;

        if (error.toSource)
            this.source = error.toSource();

        this.stack = new StackTracer(error);
    }
}