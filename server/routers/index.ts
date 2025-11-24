import { products } from '@/db/schemas/products';
import { router } from '../trpc';
import { authRouter } from './auth';
import { productsRouter } from './products';

export const appRouter = router({
  auth: authRouter,
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
