import { getPost } from "@/actions/post.action";

type Post = Awaited<ReturnType<typeof getPost>>["post"];

export type {
  Post,
}
