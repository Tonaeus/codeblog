import { getProfile } from "@/actions/profile.action";

type Profile = Awaited<ReturnType<typeof getProfile>>["profile"];

export type {
  Profile
}