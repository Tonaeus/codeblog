import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from "svix";

const webhookSecret: string = process.env.CLERK_WEBHOOK_SECRET!;

type ClerkWebhookMessage = {
  data: {
    deleted: boolean;
    id: string;
    object: string;
  };
  event_attributes: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };
  object: string;
  timestamp: number;
  type: string;
};

const POST = async (req: NextRequest) => {
  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";

  const body = await req.text();

  const sivx = new Webhook(webhookSecret);

  let msg: ClerkWebhookMessage;
  
  try {
    msg = sivx.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookMessage;
  } 
  catch (error) {
    return NextResponse.json(null, { status: 400 });
  }

  const clerkId = msg.data.id;

  try {
    await prisma.user.delete({
      where: {
        clerkId,
      },
    });
  } 
  catch (error) {
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(null, { status: 200 });
}

export {
  POST
}
