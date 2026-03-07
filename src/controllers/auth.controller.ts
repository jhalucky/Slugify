import {Request, Response} from "express";
import { prisma } from "../config/db.js";

export const register = async (req: Request, res: Response) => {
    const {email, name} = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: {email} });
        if(existingUser) {
             res.status(400).json({ message: "User already exists" });
            return;
        }

        const user = await prisma.user.create({
            data: {
                email,
                name
            }
        });

        res.status(201).json({ message: "User registered successfully", 
            user: {
                id: user.id,
                email: user.email,
                apiKey: user.apiKey
     } 
    });
    
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getMe = async (req: Request, res: Response) => {
    const apiKey = req.headers["x-api-key"] as string;

    if(!apiKey) {
        res.status(401).json({ message: "API key is required" });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { apiKey } });
        if(!user) {
            res.status(404).json({ message: "Invalid API key" });
            return;
        }

        res.status(200).json({ user: {
            id: user.id,
            email: user.email,
            name: user.name
        } });
    } catch (error) {
     res.status(500).json({ error: "Internal server error" });   
    }

};

export const loginGoogle = async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) { res.status(400).json({ error: 'Email required' }); return }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) { res.status(404).json({ error: 'User not found' }); return }
    res.json({ apiKey: user.apiKey })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
}