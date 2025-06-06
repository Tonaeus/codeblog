import { getProfile } from "@/actions/profile.action";
import { Avatar, AvatarImage } from "./ui/avatar";

type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>["profile"]>;

const ProfileCard = ({ profile }: { profile: Profile }) => {
	return (
		<div className="flex flex-col justify-center items-center bg-green-300">
			<Avatar className="w-45 h-45 aspect-square">
				<AvatarImage src={profile.image ?? "/avatar.png"} />
			</Avatar>
			{/* <div className="w-1/4 aspect-square rounded-full overflow-hidden">
				<img
					src={profile.image ?? "/avatar.png"}
					alt="avatar"
					className="object-cover w-full h-full"
				/>
			</div> */}

			<div>
				{`${profile.firstName} ${profile.lastName}`}
			</div>
			<div>
				{profile.username}
			</div>
		</div>
	);
};

export default ProfileCard;
