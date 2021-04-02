export default class Response
{
    /**
     * @param {String} id
     * @param {Number} status
     * @param {String} detail
     */
    constructor(id, status, detail)
    {
        /**
         * @type {String}
         */
        this.id = id || null;
        /**
         * @type {String}
         */
        this.status = status || -1;
        /**
         * @type {String}
         */
        this.detail = detail || null;
    }
}