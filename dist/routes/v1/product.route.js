"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_product = void 0;
const express_1 = __importDefault(require("express"));
exports.app_product = (0, express_1.default)();
const product_controller_1 = require("../../controllers/product.controller");
const upload_file_1 = require("../../middlewares/upload-file");
exports.app_product.post('/create-product', upload_file_1.upload.single('attachments'), product_controller_1.createProduct);
exports.app_product.get('/get-product', product_controller_1.getAllProduct);
exports.app_product.delete('/delete-product', product_controller_1.deleteProduct);
exports.app_product.put('/toggle-product', product_controller_1.toggleActive);
exports.app_product.get('/search-product', product_controller_1.search);
exports.app_product.put('/update-product', upload_file_1.upload.single('attachments'), product_controller_1.updateProduct);
exports.default = exports.app_product;
