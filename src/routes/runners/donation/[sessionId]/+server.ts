import type { RequestHandler } from "@sveltejs/kit";
import { getPaymentDetail } from "$lib/strapi/stripe";

export const GET: RequestHandler<{ sessionId: string }> = async ({ params }) => {
  try {
    const { sessionId } = params;
    if (!sessionId) return {};
    const transaction = await getPaymentDetail(sessionId as string);
    
    return { body: transaction };
  } catch (err: any) {
    return {
      status: 500,
      body: err.message ?? err.toString()
    };
  }
};
