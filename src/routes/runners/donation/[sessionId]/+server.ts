import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from "@sveltejs/kit";
import { getPaymentDetail } from "$lib/strapi/stripe";

export const GET: RequestHandler<{ sessionId: string }> = async ({ params }) => {
  try {
    const { sessionId } = params;
    if (!sessionId) return new Response(undefined);
    const transaction = await getPaymentDetail(sessionId as string);
    
    return json(transaction);
  } catch (err: any) {
    throw error(500, err.message ?? err.toString());
  }
};
