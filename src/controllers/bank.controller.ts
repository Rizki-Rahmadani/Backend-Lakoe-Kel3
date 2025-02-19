import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export async function createBank(req: Request, res: Response) {
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
  const userId = (req as any).user.id;
  const { bank, acc_number, acc_name } = req.body;

  console.log(req.body);
  try {
    if (!bank && !acc_number && !acc_name) {
      return res.status(400).json({ message: 'Bank details are required' });
    }
    const checkStore = await prisma.stores.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!checkStore) {
      return res.status(404).json({ message: 'Store not Found' });
    }
    const message_data = await prisma.bank_accounts.create({
      data: {
        bank: bank,
        acc_name,
        acc_number,
        storesId: checkStore.id,
      },
    });
    res.status(201).json({ message: 'Message sent', message_data });
  } catch (error) {
    res.status(500).json({ message: 'error adding bank details.', error });
  }
}

export async function getBank(req: Request, res: Response) {
  /*  
        #swagger.tags = ['Bank']
        #swagger.description = "to display all banks"
    */

  // const {id} = req.body;
  try {
    const bankdata = await prisma.bank_accounts.findMany({
      select: {
        acc_number: true,
        acc_name: true,
        bank: true,
      },
    });
    res.status(201).json({ message: 'Message sent', bankdata });
  } catch (error) {
    res.status(500).json({ message: 'error adding bank details.', error });
  }
}
export async function getBankByStore(req: Request, res: Response) {
  /*  
        #swagger.tags = ['Bank']
        #swagger.description = "to display all banks"
    */

  // const {id} = req.body;
  const userId = (req as any).user.id;
  try {
    const checkStore = await prisma.stores.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!checkStore) {
      return res.status(404).json({ message: 'Store not Found' });
    }
    const bankdata = await prisma.bank_accounts.findMany({
      where: { storesId: checkStore.id },
      select: {
        acc_number: true,
        id: true,
        acc_name: true,
        bank: true,
      },
    });
    res.status(201).json({ message: 'Message sent', bank: bankdata });
  } catch (error) {
    res.status(500).json({ message: 'error adding bank details.', error });
  }
}
export async function getBankById(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).user.id;
  try {
    const checkStore = await prisma.stores.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!checkStore) {
      return res.status(404).json({ message: 'Store not Found' });
    }
    const bankdata = await prisma.bank_accounts.findUnique({
      where: { id: id, storesId: checkStore.id },
    });
    return res
      .status(200)
      .json({ message: 'Bank account found', bank: bankdata });
  } catch (error) {
    res.status(500).json({ message: 'error adding bank details.', error });
  }
}
export async function deleteBank(req: Request, res: Response) {
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
  const { id } = req.params;
  try {
    const bankExist = await prisma.bank_accounts.findUnique({
      where: {
        id: id,
      },
    });

    if (!bankExist) {
      return res.status(404).json({ messsage: 'bank not found' });
    }

    await prisma.bank_accounts.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ message: 'Bank deleted' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'error adding bank details.', error });
  }
}

// export async function editBank(res: Response, req: Request) {
//   /*
//         #swagger.tags = ['Bank']
//         #swagger.requestBody = {
//             required: true,
//             content: {
//                 "application/json": {
//                     schema: {
//                         $ref: "#/components/schemas/editBankDTO"
//                     }
//                 }
//             }
//         }
//     */
//   const { id, acc_name, acc_number, bank } = req.body;

//   try {
//     const bankExist = await prisma.bank_accounts.findUnique({
//       where: {
//         id: id,
//       },
//     });

//     if (!bankExist) {
//       res.status(404).json({ messsage: 'bank not found' });
//     }

//     const bank_edit = await prisma.bank_accounts.update({
//       where: {
//         id: id,
//       },
//       data: {
//         acc_name: acc_name || bankExist?.acc_name,
//         acc_number: acc_number || bankExist?.acc_number,
//         bank: bank || bankExist?.bank,
//       },
//     });

//     res.status(201).json({ message: 'Bank edited', bank_edit });
//   } catch (error) {
//     res.status(500).json({ message: 'error adding bank details.', error });
//   }
// }
