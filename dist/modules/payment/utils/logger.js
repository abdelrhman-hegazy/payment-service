"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.log = void 0;
function log(...args) {
    console.log(...args);
}
exports.log = log;
function error(...args) {
    console.error(...args);
}
exports.error = error;
