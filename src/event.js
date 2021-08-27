import LoggingConfig from './config';
import Message from './message';

export default class Event extends Message
{
    /**
     * @param {String} id
     * @param {String} message
     * @param {String} category
     */
    constructor(id, message, category)
    {
        super(message);
        this.name = LoggingConfig.LOG_ACTION.EVENT;
        /**
         * @type {String}
         */
        this.eventId = id;
        /**
         * @type {String}
         */
        this.category = category;
    }
}