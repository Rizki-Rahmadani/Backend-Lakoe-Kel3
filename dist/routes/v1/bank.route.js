"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_bank = void 0;
const express_1 = __importDefault(require("express"));
exports.app_bank = (0, express_1.default)();
const bank_controller_1 = require("../../controllers/bank.controller");
exports.app_bank.get('/get-bank', bank_controller_1.getBank);
exports.app_bank.post('/create-bank', bank_controller_1.createBank);
exports.app_bank.put('/update-bank', bank_controller_1.editBank);
exports.app_bank.delete('/delete-bank', bank_controller_1.deleteBank);
exports.default = exports.app_bank;
