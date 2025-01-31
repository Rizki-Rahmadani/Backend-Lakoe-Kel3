"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_message = void 0;
const express_1 = __importDefault(require("express"));
exports.app_message = (0, express_1.default)();
const message_controller_1 = require("../../controllers/message.controller");
exports.app_message.post('/create-message', message_controller_1.createMessage);
exports.app_message.get('/get-message', message_controller_1.getMessage);
exports.app_message.get('/detail-message', message_controller_1.getMessageDetailed);
exports.app_message.put('/update-message', message_controller_1.editMessage);
exports.app_message.delete('/delete-message', message_controller_1.deleteMessage);
exports.default = exports.app_message;
