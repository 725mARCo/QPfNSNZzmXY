// 代码生成时间: 2025-09-23 01:17:29
import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import _ from 'underscore';

// ProcessManager is a class that handles process management
class ProcessManager {
  // Initialize with default settings
  constructor() {
    this.processList = [];
  }

  // Start a new process
  startProcess(options) {
    check(options, {
      name: String,
      command: String,
      args: [String],
    });

    try {
      const process = Meteor.spawn(Meteor.release, options.command, ...options.args);
      this.processList.push({
        name: options.name,
        processId: process.processId,
        status: 'running',
      });
      console.log(`Process ${options.name} started with processId ${process.processId}`);

      process.onExit(() => {
        this.processList = this.processList.filter(p => p.processId !== process.processId);
        console.log(`Process ${options.name} has stopped`);
      });
    } catch (error) {
      console.error('Failed to start process:', error.message);
    }
  }

  // Stop a process by name
  stopProcess(name) {
    const process = this.processList.find(p => p.name === name && p.status === 'running');
    if (process) {
      try {
        Meteor.kill(process.processId);
        console.log(`Process ${name} stopped`);
      } catch (error) {
        console.error('Failed to stop process:', error.message);
      }
    } else {
      console.error(`Process ${name} not found or not running`);
    }
  }

  // Get the list of all processes
  listProcesses() {
    return this.processList;
  }
}

// Export the ProcessManager class
export { ProcessManager };

// Example usage:
// const processManager = new ProcessManager();
// processManager.startProcess({
//   name: 'exampleProcess',
//   command: 'node',
//   args: ['example.js'],
// });
// console.log(processManager.listProcesses());
// processManager.stopProcess('exampleProcess');