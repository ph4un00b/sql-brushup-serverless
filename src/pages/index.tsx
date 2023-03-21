import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function Home() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <main className="flex flex-col items-center pt-4">Loading...</main>;
	}

	return (
		<main className="flex flex-col items-center bg-stone-800">
			<h1 className="text-3xl pt-4">Guestbook</h1>

			<p>
				Phau's <code>testing out SQL's libraries.</code>
			</p>
			<div>
				{session
					? (
						<>
							<p>hi {session.user?.name}</p>
							<Button
								onClick={() => {
									signOut().catch(console.log);
								}}
								variant="subtle"
							>
								Logout
							</Button>
						</>
					)
					: (
						<Button
							onClick={() => {
								signIn("discord").catch(console.log);
							}}
							variant="subtle"
						>
							Login with Discord
						</Button>
					)}

				<div className="pt-10">
					<GuestbookEntries />
				</div>
			</div>
		</main>
	);
}

const GuestbookEntries = () => {
	const { data: guestbookEntries, isLoading } = api.guestbook.getAll.useQuery();

	if (isLoading) return <div>Fetching messages...</div>;

	return (
		<div className="flex flex-col gap-4">
			{guestbookEntries?.map((entry, index) => {
				return (
					<div key={index}>
						<p>{entry.message}</p>
						<span>- {entry.name}</span>
					</div>
				);
			})}
		</div>
	);
};
