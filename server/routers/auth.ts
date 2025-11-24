import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schemas/users';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const authRouter = router({
  signup: publicProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      const existingEmail = await db.select().from(users).where(eq(users.email, input.email));
      if (existingEmail.length > 0) {
        throw new Error('Email already exists');
      }
      const existingName = await db.select().from(users).where(eq(users.name, input.name));
      if (existingName.length > 0) {
        throw new Error('Username already exists');
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      await db.insert(users).values({ name: input.name, email: input.email, password: hashedPassword });
      return { message: 'User created successfully' };
    }),
  signin: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      const userArr = await db.select().from(users).where(eq(users.email, input.email));
      const user = userArr[0];
      if (!user || !user.password) {
        throw new Error('Invalid credentials');
      }
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }
      // Here you would set a session or JWT
      return { message: 'Signed in successfully' };
    }),

  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    // Example: get user from cookie (replace with real session/JWT logic)
    // For demo, just return the first user (replace with your logic)
    const userArr = await db.select().from(users).limit(1);
    const user = userArr[0];
    if (!user) return null;
    return { name: user.name, email: user.email };
  }),
});
