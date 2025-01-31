"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_store = void 0;
const express_1 = __importDefault(require("express"));
exports.app_store = (0, express_1.default)();
const authmiddleware_1 = require("../../middlewares/authmiddleware");
const upload_file_1 = require("../../middlewares/upload-file");
const store_controller_1 = require("../../controllers/store.controller");
exports.app_store.post('/', authmiddleware_1.authentication, upload_file_1.upload.fields([
    { name: 'logo_attachment', maxCount: 1 },
    { name: 'banner_attachment', maxCount: 1 },
]), store_controller_1.createStore, (req, res) => {
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
});
exports.app_store.get('/current-store', authmiddleware_1.authentication, store_controller_1.getStoreByLogin);
exports.app_store.get('/', store_controller_1.getAllStore, (req, res) => {
    /*
          #swagger.tags["stores"]
          #swagger.description = "to display all stores"
      */
});
exports.app_store.put('/update', authmiddleware_1.authentication, upload_file_1.upload.fields([
    { name: 'logo_attachment', maxCount: 1 },
    { name: 'banner_attachment', maxCount: 1 },
]), store_controller_1.updateStore, (req, res) => {
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
});
exports.app_store.delete('/:id', authmiddleware_1.authentication, store_controller_1.deleteStore, (req, res) => {
    /*
          #swagger.tags["stores"]
          #swagger.description = "to display all stores"
      */
});
exports.default = exports.app_store;
