declare module 'playnix-types/client' {
  export default class BaseLogClient {
      static get CONSTANTS(): Readonly<{
          LOGS: {
              INFO: string;
              WARN: string;
              ERROR: string;
          };
          LOG_ACTION: {
              MESSAGE: string;
              ERROR: string;
              EVENT: string;
          };
      }>;
      /**
       * @type {PlaynixOptions}
       */
      options: {
          debug: boolean;
          uri: string;
          method: string;
          protocol: string; /**
           * @private
           * @type {String}
           */
          environment: string;
          paths: {
              message: string;
              event: string; /**
               * @private
               * @type {XMLHttpRequest}
               */
              error: string;
          };
          console: {
              log: boolean;
              warn: boolean;
              error: boolean;
          };
      };
      /**
       * @private
       * @type {String}
       */
      private _app_key;
      /**
       * @private
       * @type {XMLHttpRequest}
       */
      private _xhttp;
      /**
       * @private
       */
      private _meta;
      /**
       * @private
       * @type {String}
       */
      private _user;
      /**
       * @private
       * @type {String}
       */
      private _user_version;
      /**
       * @private
       * @type {String}
       */
      private _client_id;
      /**
       * @private
       * @type {{category:String, message:String, timestamp:Date, data:Object}[]}
       */
      private _breadcrumbs;
      /**
       * @protected
       */
      protected _onreadystatechange(): void;
      /**
       * @protected
       * @param {Error} error
       * @returns {Exception}
       */
      protected _createException(error: Error): Exception;
      /**
       * @protected
       * @param {Message} data
       */
      protected _commit(data: Message): void;
      /**
       * @protected
       * @param {Object} breadcrumb
       * @param {String} breadcrumb.category
       * @param {String} breadcrumb.message
       * @param {Date} breadcrumb.timestamp
       * @param {Object} breadcrumb.data
       */
      protected _extractBreadcrumb(breadcrumb: {
          category: string;
          message: string;
          timestamp: Date;
          data: any;
      }): {
          category: string;
          message: string;
          timestamp: number;
          data: any;
      };
      /**
      * @public
      * @param {String} key - the client application api key
      * @param {Object} options
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
      public init(key: string, options: {
          debug: boolean;
          uri: string;
          method: string;
          protocol: string;
          environment: string;
          paths: {
              message: string;
              event: string;
              error: string;
          };
          console: {
              log: boolean;
              warn: boolean;
              error: boolean;
          };
      }): void;
      /**
      * @public
      * @description Sets breadcrumbs that will be attached to any outgoing message
      * @param {Object} breadcrumb Breadcrumb data
      */
      public addBreadcrumb(breadcrumb: any): boolean;
      /**
      * @public
      * @description Clear breadcrumbs
      */
      public clearBreadcrumbs(): void;
      /**
       * @public
       * @description Generate and set a unique client Id
       */
      public generateClientId(): void;
      /**
      * @public
      * @description Sends a custom info-level message.
      * @param {String} message the custom message to log
      */
      public writeMessage(message: string): void;
      /**
      * @public
      * @description Captures an event message
      * @param {String} id event id
      * @param {String} message event message
      * @param {String} category event category
      */
      public writeEvent(id: string, message: string, category: string): void;
      /**
      * @public
      * @description Sends a custom error exception.
      * @param {Error} error Error object to log.
      * @param {Object} data additional data to send(must contains values of string, number, or boolean)
      */
      public writeException(error: Error, data: any): void;
      /**
      * @public
      * @description Sets custom metadata that will be submitted with each message
      * @param {Object|Array} data custom meta data, can be user to store user details
      */
      public setMetaContext(data: any | any[]): void;
      /**
      * @public
      * @description Sets the user client version metadata
      * @param {String} version App version info
      */
      public setAppVersion(version: string): void;
      /**
      * @public
      * @description Sets the client's current user metadata
      * @param {String} username Username of the currently logged on user
      */
      public setAppUser(username: string): void;
  }
  import Exception from "playnix-types/exception";
  import Message from "playnix-types/message";

}
declare module 'playnix-types/config' {
  export default LoggingConfig;
  const LoggingConfig: Readonly<{
      LOGS: {
          INFO: string;
          WARN: string;
          ERROR: string;
      };
      LOG_ACTION: {
          MESSAGE: string;
          ERROR: string;
          EVENT: string;
      };
  }>;

}
declare module 'playnix-types/event' {
  export default class Event extends Message {
      /**
       * @param {String} id
       * @param {String} message
       * @param {String} category
       */
      constructor(id: string, message: string, category: string);
      /**
       * @type {String}
       */
      eventId: string;
      /**
       * @type {String}
       */
      category: string;
  }
  import Message from "playnix-types/message";

}
declare module 'playnix-types/exception' {
  export default class Exception extends Message {
      /**
       * @param {Error} error
       */
      constructor(error: Error, handled?: boolean);
      /**
       * @type {Boolean}
       */
      handled: boolean;
      /**
       * @type {Object[]}
       */
      stack: any[];
      /**
       * @type {Object}
       */
      extra: any;
      /**
       * @type {String}
       */
      level: string;
      addStack(error: any): void;
  }
  import Message from "playnix-types/message";

}
declare module 'playnix-types/index' {
  export { default as BaseLogClient } from "playnix-types/client";
  export { default as Event } from "playnix-types/event";
  export { default as Exception } from "playnix-types/exception";
  export { default as Message } from "playnix-types/message";
  export { default as Response } from "playnix-types/response";
  export { default as LoggingConfig } from "playnix-types/config";
  export { default as PlaynixOptions } from "playnix-types/options";

}
declare module 'playnix-types/message' {
  export default class Message {
      /**
       * @param {String} message
       */
      constructor(message: string);
      /**
       * @type {String}
       */
      name: string;
      /**
       * @type {String}
       */
      message: string;
      /**
       * @type {Object}
       */
      device: any;
      /**
       * @type {Object}
       */
      engine: any;
      /**
       * @type {Object}
       */
      os: any;
      /**
       * @type {{category:String, message:String, timestamp:Date, data:Object}[]}
       */
      breadcrumbs: {
          category: string;
          message: string;
          timestamp: Date;
          data: any;
      }[];
      /**
       * @type {Number}
       */
      timestamp: number;
      /**
       * @type {String}
       */
      secret: string;
      /**
       * @type {String}
       */
      appVersion: string;
      /**
       * @type {String}
       */
      page: string;
      /**
       * @type {String}
       */
      clientId: string;
      /**
       * @type {String}
       */
      environment: string;
      /**
       * @type {String}
       */
      runtime: string;
      /**
       * @type {String}
       */
      user: string;
      /**
       * @type {Object}
       */
      meta: any;
      /**
       * @type {string}
       */
      get version(): string;
  }

}
declare module 'playnix-types/options' {
  export default PlaynixOptions;
  namespace PlaynixOptions {
      const debug: boolean;
      const uri: string;
      const method: string;
      const protocol: string;
      const environment: string;
      const paths: {
          message: string;
          event: string;
          error: string;
      };
      const console: {
          log: boolean;
          warn: boolean;
          error: boolean;
      };
  }

}
declare module 'playnix-types/response' {
  export default class Response {
      /**
       * @param {String} id
       * @param {Number} status
       * @param {String} detail
       */
      constructor(id: string, status: number, detail: string);
      /**
       * @type {String}
       */
      id: string;
      /**
       * @type {String}
       */
      status: string;
      /**
       * @type {String}
       */
      detail: string;
  }

}
declare module 'playnix-types' {
  import main = require('playnix-types/index');
  export = main;
}