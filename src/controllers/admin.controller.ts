import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY =
  process.env.SECRET_KEY || 'aksjdkl2aj3djaklfji32dj2dj9ld92jd92j';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export async function registerAdmin(req: Request, res: Response) {
  /*  
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RegisterDTO"
                    }  
                }
            }
        } 
    */
  const { fullname, email, phone_number, password } = req.body;

  if (!fullname || !email || !phone_number || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const addroles = await prisma.roles.findFirst({
      where: {
        name: {
          equals: 'admin', // make sure you're comparing it to a lowercase string
          mode: 'insensitive', // this makes the comparison case-insensitive
        },
      },
      select: {
        id: true,
      },
    });
    if (!addroles) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email, phone_number }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email or phone number already exists' });
    }
    // let userRole = null;
    // if (role_id) {
    //   userRole = await prisma.roles.findUnique({
    //     where: { id: role_id },
    //   });

    //   if (!userRole) {
    //     return res.status(400).json({ message: 'Invalid role_id' });
    //   }
    // }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        phone_number: phone_number,
        password: hashedPassword,
        rolesId: addroles.id,
      },
      select: {
        fullname: true,
        email: true,
      },
    });

    res.status(201).json({
      message: 'Admin registered',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}

export async function loginAdmin(req: Request, res: Response) {
  /*  
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/LoginDTO"
                    }  
                }
            }
        } 
    */
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const checkRoles = await prisma.roles.findFirst({
      where: {
        name: {
          equals: 'admin', // make sure you're comparing it to a lowercase string
          mode: 'insensitive', // this makes the comparison case-insensitive
        },
      },
      select: {
        id: true,
      },
    });
    if (!checkRoles) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const user = await prisma.user.findUnique({
      where: { email: email, rolesId: checkRoles.id },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
        },
        SECRET_KEY,
        { expiresIn: '12h' },
      );

      res.status(200).json({
        message: 'Login Successful',
        user: {
          fullname: user.fullname,
          email: user.email,
        },
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
}

export async function showAllRequest(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const checkRoles = await prisma.roles.findFirst({
      where: {
        name: {
          equals: 'admin', // make sure you're comparing it to a lowercase string
          mode: 'insensitive', // this makes the comparison case-insensitive
        },
      },
      select: {
        id: true,
      },
    });
    if (!checkRoles) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId, rolesId: checkRoles.id },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const fetchRequest = await prisma.transaction.findMany({
      where: {
        type: {
          equals: 'withdraw',
          mode: 'insensitive',
        },
      },
    });
    return res
      .status(200)
      .json({ message: 'Withdraw List fetched', request: fetchRequest });
  } catch (error) {
    return res.status(500).json({ message: 'Error accepting withdraw', error });
  }
}
export async function showPendingRequest(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const checkRoles = await prisma.roles.findFirst({
      where: {
        name: {
          equals: 'admin', // make sure you're comparing it to a lowercase string
          mode: 'insensitive', // this makes the comparison case-insensitive
        },
      },
      select: {
        id: true,
      },
    });
    if (!checkRoles) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId, rolesId: checkRoles.id },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const fetchRequest = await prisma.transaction.findMany({
      where: {
        type: {
          equals: 'withdraw',
          mode: 'insensitive',
        },
        status: {
          equals: 'pending',
          mode: 'insensitive',
        },
      },
      include: { store: true },
    });
    return res
      .status(200)
      .json({ message: 'Withdraw List fetched', request: fetchRequest });
  } catch (error) {
    return res.status(500).json({ message: 'Error accepting withdraw', error });
  }
}
export async function showAcceptedRequest(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const checkRoles = await prisma.roles.findFirst({
      where: {
        name: {
          equals: 'admin', // make sure you're comparing it to a lowercase string
          mode: 'insensitive', // this makes the comparison case-insensitive
        },
      },
      select: {
        id: true,
      },
    });
    if (!checkRoles) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId, rolesId: checkRoles.id },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const fetchRequest = await prisma.transaction.findMany({
      where: {
        type: {
          equals: 'withdraw',
          mode: 'insensitive',
        },
        status: {
          equals: 'accepted',
          mode: 'insensitive',
        },
      },
    });
    return res
      .status(200)
      .json({ message: 'Withdraw List fetched', request: fetchRequest });
  } catch (error) {
    return res.status(500).json({ message: 'Error accepting withdraw', error });
  }
}
export async function showRejectedRequest(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const checkRoles = await prisma.roles.findFirst({
      where: {
        name: {
          equals: 'admin', // make sure you're comparing it to a lowercase string
          mode: 'insensitive', // this makes the comparison case-insensitive
        },
      },
      select: {
        id: true,
      },
    });
    if (!checkRoles) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId, rolesId: checkRoles.id },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const fetchRequest = await prisma.transaction.findMany({
      where: {
        type: {
          equals: 'withdraw',
          mode: 'insensitive',
        },
        status: {
          equals: 'rejected',
          mode: 'insensitive',
        },
      },
    });
    return res
      .status(200)
      .json({ message: 'Withdraw List fetched', request: fetchRequest });
  } catch (error) {
    return res.status(500).json({ message: 'Error accepting withdraw', error });
  }
}
export async function acceptWithdraw(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).user.id;
  try {
    const checkRoles = await prisma.roles.findFirst({
      where: {
        name: {
          equals: 'admin', // make sure you're comparing it to a lowercase string
          mode: 'insensitive', // this makes the comparison case-insensitive
        },
      },
      select: {
        id: true,
      },
    });
    if (!checkRoles) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId, rolesId: checkRoles.id },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updateWithdraw = await prisma.transaction.update({
      where: { id: id },
      data: {
        status: 'accepted',
      },
    });
    return res
      .status(200)
      .json({ message: 'Withdraw Accepted', status: updateWithdraw });
  } catch (error) {
    return res.status(500).json({ message: 'Error accepting withdraw', error });
  }
}
export async function rejectWithdraw(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).user.id;
  try {
    const checkRoles = await prisma.roles.findFirst({
      where: {
        name: {
          equals: 'admin', // make sure you're comparing it to a lowercase string
          mode: 'insensitive', // this makes the comparison case-insensitive
        },
      },
      select: {
        id: true,
      },
    });
    if (!checkRoles) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId, rolesId: checkRoles.id },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updateWithdraw = await prisma.transaction.update({
      where: { id: id },
      data: {
        status: 'rejected',
      },
    });
    return res
      .status(200)
      .json({ message: 'Withdraw Rejected', status: updateWithdraw });
  } catch (error) {
    return res.status(500).json({ message: 'Error Rejecting Withdraw', error });
  }
}
