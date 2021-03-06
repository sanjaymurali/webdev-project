/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {

    var api = {
        createUser: createUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        findUsersByType: findUsersByType,
        findUserByClientID: findUserByClientID,
        allUsers: allUsers
    };

    var mongoose = require('mongoose');

    var q = require('q');

    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    var options = {discriminatorKey: 'userType'};

    // This is not a new Model, instead its something like inheritance
    // Link to DOCS: http://mongoosejs.com/docs/discriminators.html

    var AppOwnerModel = UserModel.discriminator('appOwner',
        new mongoose.Schema({
            appname: String,
            about: String,
            appurl: String,
            secret: String,
            clientId: String,
            redirectUri: String
        }, options));

    UserModel.discriminator('normalUser', new mongoose.Schema({
        followers: [{
            userid: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            username: String
        }],
        following: [{
            userid: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            username: String
        }]
    }, options));

    UserModel.discriminator('admin', new mongoose.Schema({
        followers: [{
            userid: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            username: String
        }],
        following: [{
            userid: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            username: String
        }]
    }, options));

    return api;


    function allUsers() {
        var deferred = q.defer();
        UserModel.find({}, function (err, users) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(users);
        });

        return deferred.promise;
    }

    function createUser(user) {
        var deferred = q.defer();
        UserModel.create(user, function (err, user) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(user)
        });

        return deferred.promise;
    }

    function deleteUser(userId) {

        var deferred = q.defer();
        UserModel.remove({_id: userId}, function (err, status) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(status)
        });

        return deferred.promise;
    }

    function updateUser(userId, changedUser) {
        var deferred = q.defer();

        var modelToChoose = UserModel;
        if(changedUser.userType === "appOwner")
            modelToChoose = AppOwnerModel;

        modelToChoose.findByIdAndUpdate({_id: userId}, { $set: changedUser, $setOnInsert: changedUser}, {new: true}, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    }

    function findUserById(userId) {
        var deferred = q.defer();

        UserModel.findById(userId, function (err, user) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(user);
        });

        return deferred.promise;
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        UserModel.findOne({username: username, password: password}, function (err, user) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(user);
        });

        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();
        UserModel.findOne({username: username}, function (err, user) {
            if(err)
                deferred.reject(err);
            else {
                deferred.resolve(user);
            }

        });

        return deferred.promise;
    }

    function findUsersByType(userType) {
        var deferred = q.defer();
        UserModel.find({userType: userType}, function (err, users) {
            if(err)
                deferred.reject(err);
            else {
                deferred.resolve(users);
            }

        });

        return deferred.promise;
    }

    function findUserByClientID(clientID) {
        var deferred = q.defer();
        UserModel.findOne({'clientId': clientID}, function (err, user) {
            if(err)
                deferred.reject(err);
            else {
                deferred.resolve(user);
            }

        });

        return deferred.promise;
    }
};