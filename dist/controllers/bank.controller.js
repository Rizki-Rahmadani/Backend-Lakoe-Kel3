"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBank = createBank;
exports.getBank = getBank;
exports.deleteBank = deleteBank;
exports.editBank = editBank;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createBank(req, res) {
    /*
        #swagger.tags = ['Bank']
        #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/createBankDTO"
                      }
                  }
              }
          }
      */
    const { bank, acc_number, acc_name, storesId } = req.body;
    console.log(req.body);
    try {
        if (!bank && !acc_number && !acc_name) {
            return res.status(400).json({ message: 'Bank details are required' });
        }
        const message_data = await prisma.bank_accounts.create({
            data: {
                bank: bank,
                acc_name,
                acc_number,
                storesId,
            },
        });
        res.status(201).json({ message: 'Message sent', message_data });
    }
    catch (error) {
        res.status(500).json({ message: 'error adding bank details.', error });
    }
}
async function getBank(req, res) {
    /*
          #swagger.tags = ['Bank']
          #swagger.description = "to display all banks"
      */
    // const {id} = req.body;
    try {
        const message_data = await prisma.bank_accounts.findMany({
            select: {
                acc_number: true,
                acc_name: true,
                bank: true,
            },
        });
        res.status(201).json({ message: 'Message sent', message_data });
    }
    catch (error) {
        res.status(500).json({ message: 'error adding bank details.', error });
    }
}
async function deleteBank(req, res) {
    /*
          #swagger.tags = ['Bank']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/deleteBankDTO"
                      }
                  }
              }
          }
      */
    const { id } = req.body;
    try {
        const bankExist = await prisma.bank_accounts.findUnique({
            where: {
                id: id,
            },
        });
        if (!bankExist) {
            res.status(404).json({ messsage: 'bank not found' });
        }
        await prisma.bank_accounts.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({ message: 'Bank deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'error adding bank details.', error });
    }
}
async function editBank(res, req) {
    /*
          #swagger.tags = ['Bank']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/editBankDTO"
                      }
                  }
              }
          }
      */
    const { id, acc_name, acc_number, bank } = req.body;
    try {
        const bankExist = await prisma.bank_accounts.findUnique({
            where: {
                id: id,
            },
        });
        if (!bankExist) {
            res.status(404).json({ messsage: 'bank not found' });
        }
        const bank_edit = await prisma.bank_accounts.update({
            where: {
                id: id,
            },
            data: {
                acc_name: acc_name || bankExist?.acc_name,
                acc_number: acc_number || bankExist?.acc_number,
                bank: bank || bankExist?.bank,
            },
        });
        res.status(201).json({ message: 'Bank edited', bank_edit });
    }
    catch (error) {
        res.status(500).json({ message: 'error adding bank details.', error });
    }
}
