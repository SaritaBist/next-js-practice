import { products } from "../../db/schemas/products";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const productsRouter = router({
  getAllProducts: publicProcedure.query(async () => {
    return await db.select().from(products);
  }),
  getProductById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      return product[0] || null;
    }),

  addProduct: publicProcedure.input(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.number(),
      image: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const result = await db
      .insert(products)
      .values({
        name: input.name,
        description: input.description,
        price: input.price,
        image: input.image,
      })
      .returning();
    return result[0];
  }),

  updateProduct: publicProcedure.input(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().optional(),
      price: z.number(),
      image: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const result = await db
      .update(products)
      .set({
        name: input.name,
        description: input.description,
        price: input.price,
        image: input.image,
      })
      .where(eq(products.id, input.id))
      .returning();
    return result[0];
  }),

  deleteProduct: publicProcedure.input(z.object({id:z.number()})).mutation(async({input})=>{
    await db.delete(products).where(eq(products.id,input.id));
    return {message:"Product deleted"};
  }),
});
