"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger/swagger-output.json"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const index_route_1 = __importDefault(require("./routes/v1/index.route"));
exports.app.use(body_parser_1.default.json());
exports.app.use((0, cors_1.default)());
dotenv_1.default.config();
const PORT = process.env.PORT;
exports.app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default, {
    explorer: true,
    swaggerOptions: {
        persisAuthorization: true,
        displayRequestDuration: true,
    },
}));
exports.app.use('/api', index_route_1.default);
exports.app.get('/', (request, response) => {
    response.status(200).send('Hello World');
});
exports.app
    .listen(PORT, () => {
    console.log('Server running at PORT:', PORT);
})
    .on('error', (error) => {
    throw new Error(error.message);
});
