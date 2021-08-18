import LoggingConfig from './config';
import Message from './message';

export default class Exception extends Message
{
    /**
     * @param {Error} error 
     */
    constructor(error, handled = true)
    {
        super(error.message);
        this.name = LoggingConfig.LOG_TRIGGER.ERROR;
                
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
       
        let stack = {args:[], line:-1, column:-1, func:'', context:'', url:''};
        
        if (error.stack || error.stacktrace) 
            stack.context = error.stack || error.stacktrace;

        if (error.fileName) 
            stack.url = error.fileName;
        
        if (error.lineNumber)
            stack.line = error.lineNumber;

        if (error.columnNumber)
            stack.column = error.columnNumber;

        if (error.toSource && !error.stack && !error.stacktrace)
            stack.context = error.toSource();
        this.stack.push(stack);
    }
}