"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_hour = void 0;
const express_1 = __importDefault(require("express"));
exports.app_hour = (0, express_1.default)();
const operation_hour_controller_1 = require("../../controllers/operation_hour.controller");
exports.app_hour.get('/get-operation', operation_hour_controller_1.getOperationHour);
exports.app_hour.post('/create-operation', operation_hour_controller_1.createOperationHour);
exports.app_hour.put('/update-operation', operation_hour_controller_1.editOperationHour);
exports.app_hour.delete('/delete-operation', operation_hour_controller_1.deleteOperationHour);
exports.default = exports.app_hour;
