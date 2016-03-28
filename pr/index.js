/**
 * Created by gasya on 20.02.16.
 * DigitalOutlooks corporation.
 */
console.log("PR v0.0.1 created by Gasya");

const Commands = require('./lib/actions');

var arguments = process.argv.slice(2);

const command = arguments.splice(0, 1)[0];

Commands.execute(command, arguments);

