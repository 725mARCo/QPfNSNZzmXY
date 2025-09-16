// 代码生成时间: 2025-09-17 02:08:48
// Import required Meteor packages
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

// Define the structure of a user permission
const PermissionSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    permissionId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
});

// Collection to store user permissions
const Permissions = new Mongo.Collection('permissions');
Permissions.attachSchema(PermissionSchema);

// Function to add a permission to a user
export const addUserPermission = (userId, permissionId) => {
    check(userId, String);
    check(permissionId, String);

    if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), 'admin')) {
        throw new Meteor.Error('not-authorized', 'User not authorized to add permissions');
    }

    if (!Roles.userIsInRole(userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'Cannot add permission to non-admin user');
    }

    // Add the permission to the user
    const permission = Permissions.findOne({ userId, permissionId });
    if (!permission) {
        Permissions.insert({ userId, permissionId });
    }
};

// Function to remove a permission from a user
export const removeUserPermission = (userId, permissionId) => {
    check(userId, String);
    check(permissionId, String);

    if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), 'admin')) {
        throw new Meteor.Error('not-authorized', 'User not authorized to remove permissions');
    }

    // Remove the permission from the user
    const permission = Permissions.findOne({ userId, permissionId });
    if (permission) {
        Permissions.remove(permission._id);
    }
};

// Function to check if a user has a specific permission
export const hasUserPermission = (userId, permissionId) => {
    check(userId, String);
    check(permissionId, String);

    const permission = Permissions.findOne({ userId, permissionId });
    return !!permission;
};

// Meteor method to add a permission via server methods
Meteor.methods({
    'permissions.add': function(permissionId) {
        addUserPermission(this.userId, permissionId);
    },
    'permissions.remove': function(permissionId) {
        removeUserPermission(this.userId, permissionId);
    },
});

// Publish permissions for a user
Meteor.publish('permissions', function(userId) {
    check(userId, String);
    if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
        return Permissions.find({ userId });
    }
    return this.ready();
});