"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSingleParam = void 0;
const AppError_1 = require("../errors/AppError");
const toSingleParam = (value, name) => {
    if (!value) {
        throw new AppError_1.AppError(`Missing required param: ${name}`, 400);
    }
    if (Array.isArray(value)) {
        if (value.length === 0 || !value[0]) {
            throw new AppError_1.AppError(`Invalid param: ${name}`, 400);
        }
        return value[0];
    }
    return value;
};
exports.toSingleParam = toSingleParam;
