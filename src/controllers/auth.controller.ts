import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY =
  process.env.SECRET_KEY || 'aksjdkl2aj3djaklfji32dj2dj9ld92jd92j';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  const { fullname, email, phone_number, password, role_id } = req.body;

  if (!fullname || !email || !phone_number || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone_number }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email or phone number already exists' });
    }
    let userRole = null;
    if (role_id) {
      userRole = await prisma.roles.findUnique({
        where: { id: role_id },
      });

      if (!userRole) {
        return res.status(400).json({ message: 'Invalid role_id' });
      }
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        phone_number,
        password: hashedPassword,
        rolesId: role_id
      },
    });

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}

export async function login(req: Request, res: Response) {
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
