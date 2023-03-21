import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Blockquote, H1, H2 } from "~/components/ui/typography";
import { api } from "~/utils/api";

export default function Home() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <main className="flex flex-col items-center pt-4">Loading...</main>;
	}

	return (
		<main className="flex flex-col items-center bg-stone-800">
			<H1>Guestbook</H1>

			<H2>
				Phau's <code>testing out SQL's libraries.</code>
			</H2>

			<div>
				{session
					? (
						<>
							<Blockquote>hi {session.user?.name}</Blockquote>
							<Button
								onClick={() => {
									signOut().catch(console.log);
								}}
								variant="subtle"
							>
								Logout
							</Button>

							<div className="pt-6">
								<Form />
							</div>
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

const Form = () => {
	const [message, setMessage] = useState("");
	const { data: session, status } = useSession();

	const utils = api.useContext();
	const postMessage = api.guestbook.postMessage.useMutation({
		onMutate: async (newEntry) => {
			// Cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await utils.guestbook.getAll.cancel();
			// Snapshot the previous value
			const previous = utils.guestbook.getAll.getData();
			// Optimistically update to the new value
			utils.guestbook.getAll.setData(undefined, (prevEntries) => {
				return prevEntries ? [newEntry, ...prevEntries] : [newEntry];
			});
			return { previous };
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (_err, _message, context) => {
			utils.guestbook.getAll.setData(undefined, context?.previous);
		},
		onSettled: async () => {
			await utils.guestbook.getAll.invalidate();
		},
	});

	if (status !== "authenticated") return null;

	return (
		<form
			className="flex gap-2"
			onSubmit={(event) => {
				event.preventDefault();
				postMessage.mutate({
					name: session.user?.name as string,
					message,
				});
				setMessage("");
			}}
		>
			<input
				type="text"
				className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
				placeholder="Your message..."
				minLength={2}
				maxLength={100}
				value={message}
				onChange={(event) => setMessage(event.target.value)}
			/>
			<Button
				variant="subtle"
				type="submit"
			>
				Submit
			</Button>
		</form>
	);
};

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
