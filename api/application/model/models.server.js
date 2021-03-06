/***
 *
 * @returns {{userModel: api, commentModel: api}}
 */
module.exports = function () {

    var userModel = require('./user/user.model.server');
    var commentModel = require('./comment/comment.model.server');

    var model = {
        userModel: userModel(),
        commentModel: commentModel()
    };

    return model;
};