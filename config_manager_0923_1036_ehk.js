// 代码生成时间: 2025-09-23 10:36:14
// Importing necessary Meteor packages and modules
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import fs from 'fs';
import path from 'path';

// Define a collection to store configuration file metadata
const ConfigCollection = new Mongo.Collection('configFiles');

// Function to load configuration from a file
function loadConfig(filePath) {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        throw new Error(`Configuration file not found: ${filePath}`);
    }

    // Read and return the configuration content
    return fs.readFileSync(filePath, 'utf8');
}

// Function to save configuration to a file
function saveConfig(filePath, configData) {
    // Write the configuration data to the file
    fs.writeFileSync(filePath, configData);

    // Log the action
    console.log(`Configuration saved to ${filePath}`);
}

// Function to update configuration in the collection
function updateConfigCollection(configId, configData) {
    // Update the configuration file metadata in the collection
    ConfigCollection.update(configId, {
        $set: {
            data: configData
        }
    });
}

// Meteor method to handle loading a configuration file
Meteor.methods({
    'configManager.loadConfig': function (filePath) {
        // Check if the user is authorized to access configuration files
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to load configuration files.');
        }

        // Load and return the configuration file content
        return loadConfig(filePath);
    },

    'configManager.saveConfig': function (configId, configData) {
        // Check if the user is authorized to save configuration files
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to save configuration files.');
        }

        // Find the configuration file metadata by ID
        const configFile = ConfigCollection.findOne(configId);
        if (!configFile) {
            throw new Meteor.Error('not-found', 'Configuration file not found.');        }

        // Save the configuration to the file system
        const filePath = path.join(process.env.PWD, configFile.filePath);
        saveConfig(filePath, configData);

        // Update the configuration in the collection
        updateConfigCollection(configId, configData);
    }
});

// Publication to provide configuration file data to the client
Meteor.publish('configFiles', function () {
    // Check if the user is authorized to access configuration files
    if (!this.userId) {
        return this.ready();
    }

    // Return the configuration file metadata from the collection
    return ConfigCollection.find({}, {
        fields: {
            data: 0
        }
    });
});