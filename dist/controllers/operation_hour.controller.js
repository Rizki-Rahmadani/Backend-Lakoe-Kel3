"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperationHour = createOperationHour;
exports.getOperationHour = getOperationHour;
exports.deleteOperationHour = deleteOperationHour;
exports.editOperationHour = editOperationHour;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createOperationHour(req, res) {
    try {
        const { storesId, day, open_at, close_at, is_off } = req.body;
        const storeExist = prisma.stores.findUnique({
            where: { id: storesId },
        });
        if (!storeExist) {
            res.status(404).json({ message: 'store not found' });
        }
        await prisma.operation_hours.create({
            data: {
                storesId,
                day,
                open_at,
                close_at,
                is_off,
            },
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'error on creating operation hour', error });
    }
}
async function getOperationHour(req, res) {
    try {
        const { id } = req.body;
        const opExist = prisma.operation_hours.findUnique({
            where: { id: id },
        });
        if (!opExist) {
            res.status(404).json({ message: 'operation hour not found' });
        }
        const op_hour = await prisma.operation_hours.findUnique({
            where: {
                id: id,
            },
            select: {
                day: true,
                open_at: true,
                close_at: true,
            },
        });
        res.status(200).json({ message: 'operation hour: ', op_hour });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'error on creating operation hour', error });
    }
}
async function deleteOperationHour(req, res) {
    try {
        const { id } = req.body;
        const opExist = prisma.operation_hours.findUnique({
            where: { id: id },
        });
        if (!opExist) {
            res.status(404).json({ message: 'operation hour not found' });
        }
        await prisma.operation_hours.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({ message: 'operation hour deleted' });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'error on creating operation hour', error });
    }
}
async function editOperationHour(req, res) {
    try {
        const { id, day, open_at, close_at } = req.body;
        const opExist = await prisma.operation_hours.findUnique({
            where: { id: id },
        });
        if (!opExist) {
            res.status(404).json({ message: 'operation hour not found' });
        }
        const edited_op = await prisma.operation_hours.update({
            where: {
                id: id,
            },
            data: {
                day: day || opExist?.day,
                open_at: open_at || opExist?.open_at,
                close_at: close_at || opExist?.close_at,
            },
        });
        res.status(200).json({ message: 'operation hour edited', edited_op });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'error on creating operation hour', error });
    }
}
