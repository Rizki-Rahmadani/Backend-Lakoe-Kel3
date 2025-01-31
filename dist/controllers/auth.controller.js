"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || 'aksjdkl2aj3djaklfji32dj2dj9ld92jd92j';
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
async function register(req, res) {
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
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
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
                OR: [{ email }],
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
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const newUser = await prisma.user.create({
            data: {
                fullname,
                email,
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
        function formatString(input) {
            return input.toLowerCase().replace(/\s+/g, '');
        }
        const addstore = await prisma.stores.create({
            data: {
                name: fullname,
                username: formatString(fullname),
                userId: findRegister.id,
            },
        });
        res.status(201).json({
            message: 'User & store registered',
            user: newUser,
            store: addstore,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
}
async function login(req, res) {
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
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                fullname: user.fullname,
                email: user.email,
            }, SECRET_KEY, { expiresIn: '12h' });
            res.status(200).json({
                message: 'Login Successful',
                user: {
                    fullname: user.fullname,
                    email: user.email,
                },
                token,
            });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
}
