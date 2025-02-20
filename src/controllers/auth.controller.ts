import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createStore } from './store.controller';

const SECRET_KEY =
  process.env.SECRET_KEY || 'aksjdkl2aj3djaklfji32dj2dj9ld92jd92j';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
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
          equals: 'seller', // make sure you're comparing it to a lowercase string
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

    const findRegister = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true },
    });
    function formatString(input: string): string {
      return input.toLowerCase().replace(/\s+/g, '');
    }
    const findStore = await prisma.stores.findUnique({
      where: { username: formatString(fullname) },
    });
    if (findStore) {
      return res.status(403).json({ message: 'Store Name already taken' });
    }
    const addstore = await prisma.stores.create({
      data: {
        name: fullname,
        username: formatString(fullname),
        userId: findRegister!.id,
      },
    });

    res.status(201).json({
      message: 'User & store registered',
      user: newUser,
      store: addstore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}

export async function login(req: Request, res: Response) {
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
    const user = await prisma.user.findUnique({
      where: { email },
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

export async function currentUser(req: Request, res: Response) {
  const id = (req as any).user.id;
  try {
    const getUser = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        fullname: true,
        email: true,
        role_id: true,
      },
    });
    if (!getUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User found', user: getUser });
  } catch {
    return res.status(400).json({ message: 'Error fetching User' });
  }
}
