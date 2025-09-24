// 代码生成时间: 2025-09-24 19:31:04
 * and follows best practices for maintainability and scalability.
 */

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Define a collection to store process information
const Processes = new Mongo.Collection('processes');

// Define a schema for the collection using SimpleSchema
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
const ProcessSchema = new SimpleSchema({
    command: {
        type: String,
        label: 'Command',
        max: 200
    },
    pid: {
        type: String,
        label: 'Process ID',
        max: 50
    },
    status: {
        type: String,
        label: 'Status',
        allowedValues: ['running', 'stopped', 'error']
    },
    startTime: {
        type: Date,
        label: 'Start Time',
        optional: true
    },
    endTime: {
        type: Date,
        label: 'End Time',
        optional: true
    }
});

// Attach the schema to the collection
Processes.attachSchema(ProcessSchema);

// Method to start a process
Meteor.methods({
    'startProcess': function(command) {
        // Check if the command is a string
        check(command, String);
        
        // Error handling for command
        if (command.length > 200) {
            throw new Meteor.Error('command-too-long', 'Command exceeds 200 characters');
        }
        
        // Start the process
        const { pid } = spawn(command, [], {
            stdio: 'inherit',
            shell: true
        });
        
        // Insert the process into the collection
        const processId = Processes.insert({
            command,
            pid,
            status: 'running',
            startTime: new Date()
        });
        
        // Return the process ID
        return processId;
    }
});

// Method to stop a process
Meteor.methods({
    'stopProcess': function(processId) {
        // Check if the processId is a valid string
        check(processId, String);
        
        // Find the process in the collection
        const process = Processes.findOne(processId);
        
        // Error handling if process doesn't exist
        if (!process) {
            throw new Meteor.Error('process-not-found', 'Process not found');
        }
        
        // Error handling if process is not running
        if (process.status !== 'running') {
            throw new Meteor.Error('process-not-running', 'Process is not running');
        }
        
        // Stop the process
        try {
            process.kill();
            Processes.update(processId, {
                $set: {
                    status: 'stopped',
                    endTime: new Date()
                }
            });
        } catch (error) {
            // Handle the error if process can't be stopped
            throw new Meteor.Error('process-stop-error', 'Failed to stop process');
        }
    }
});

// Publish the processes collection
Meteor.publish('allProcesses', function() {
    return Processes.find();
});

// Client-side code to handle process management
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.processManager.onCreated(function() {
    this.processStatus = new ReactiveVar('');
});

Template.processManager.helpers({
    processStatus() {
        return Template.instance().processStatus.get();
    }
});

Template.processManager.events({
    'click #startProcessButton' (event, instance) {
        event.preventDefault();
        const command = event.target.command.value;
        Meteor.call('startProcess', command, (error, processId) => {
            if (error) {
                instance.processStatus.set(error.reason);
            } else {
                instance.processStatus.set(`Process started with ID: ${processId}`);
            }
        });
    },
    'click #stopProcessButton' (event, instance) {
        event.preventDefault();
        const processId = event.target.processId.value;
        Meteor.call('stopProcess', processId, (error) => {
            if (error) {
                instance.processStatus.set(error.reason);
            } else {
                instance.processStatus.set(`Process stopped with ID: ${processId}`);
            }
        });
    }
});