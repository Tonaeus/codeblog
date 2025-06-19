import type { Profile } from "@/types/Profile";
import { Avatar, AvatarImage } from "../ui/avatar";

const ProfileCard = ({ profile }: { profile: Profile }) => {
	return (
		<div className="flex flex-col justify-center items-center gap-2 p-8">
			<Avatar className="w-45 h-45 aspect-square">
				<AvatarImage src={profile?.image ?? "/avatar.png"} />
			</Avatar>
			<div className="flex flex-col w-full overflow-hidden">
				<div className="text-2xl font-bold text-primary truncate w-full text-center">
					{`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`}
				</div>
				<div className="truncate w-full text-center">@{profile?.username}</div>
			</div>
		</div>
	);
};

export default ProfileCard;
