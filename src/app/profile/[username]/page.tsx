import { getProfile } from "@/actions/profile.action";
import ProfileCard from "@/components/ProfileCard";
import { notFound } from "next/navigation";
import React from "react";

const profilePage = async ({ params }: { params: { username: string } }) => {
	const { username } = await params;
	const result = await getProfile(username);

	if (!result?.success || result.profile) {
		// notFound();
    console.log("not found");
	}

  const profile = result.profile!;
  console.log("profile", result.profile)

	return (
		<div className="flex flex-col flex-1 w-full items-center bg-blue-300">
			<div className="max-w-3xl w-full p-4 flex flex-col flex-1 bg-orange-300">
				<ProfileCard profile={profile} />
			</div>
		</div>
	);
};

export default profilePage;
