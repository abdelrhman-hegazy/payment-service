"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: process.env.PORT || 3000,
    stripe: {
        STRIPE_API_KEY: process.env.STRIPE_API_KEY || 'sk_test_PLACEHOLDER',
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_PLACEHOLDER',
    },
    db: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORTDB || 5432,
        user: process.env.USER || 'user',
        password: process.env.PASSWORD || 'password',
        database: process.env.DATABASE || 'database',
    },
};
