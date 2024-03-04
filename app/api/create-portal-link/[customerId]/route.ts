import * as sentry from '@sentry/nextjs';
import { redirect } from 'next/navigation';
import { stripe } from '@/utils/stripe/config';

const selectedEnv =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(req: Request, { params }: any) {
  try {
    const { customerId } = params;
    const link = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${selectedEnv}`,
    });

    return new Response(JSON.stringify({ url: link.url }), { status: 200 });
  } catch (error) {
    sentry.captureException(error);
    return redirect('/error');
  }
}
