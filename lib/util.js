var util = {};

/**
 * 打印log
 * 
 * @public
 */
util.log = function() {
    if (process.env.DEBUG) {
        console.log.apply(console, arguments);
    }
};

module.exports = exports = util;
