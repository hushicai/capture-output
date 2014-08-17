var util = {};

/**
 * 打印log
 * 
 * @public
 */
util.log = function(msg) {
    if (process.env.DEBUG) {
        console.log(msg);
    }
};

module.exports = exports = util;
