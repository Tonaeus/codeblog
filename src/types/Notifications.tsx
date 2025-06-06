import { GET } from "@/app/api/notifications/route";
import { NextResponse } from "next/server";

type Notifications = Awaited<ReturnType<typeof GET>> extends NextResponse<infer T> ? T : never;

type Notification = NonNullable<Notifications>["notifications"][number];

export type { Notification };
