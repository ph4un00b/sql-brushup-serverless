import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

export default function Home() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <main>Loading...</main>;
	}

	return (
		<main className="bg-stone-800">
			<h1 className="text-slate-100">Guestbook</h1>

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
			</div>
		</main>
	);
}
