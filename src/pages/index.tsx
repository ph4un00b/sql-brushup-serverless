import { RadioGroup } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { type ComponentPropsWithoutRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Blockquote, H1, H2 } from "~/components/ui/typography";
import { api } from "~/utils/api";

const plans = [
	{
		name: "Guestbook",
		ram: "12GB",
		cpus: "6 CPUs",
		disk: "160 GB SSD disk",
	},
	{
		name: "Prisma / Planetscale",
		ram: "16GB",
		cpus: "8 CPUs",
		disk: "512 GB SSD disk",
	},
	{
		name: "Planetscale serverless",
		ram: "32GB",
		cpus: "12 CPUs",
		disk: "1024 GB SSD disk",
	},
];

/**
 * @todo share sidebar
 * @see https://nextjs.org/docs/basic-features/layouts#per-page-layouts
 * @see https://dev.to/jaredm/guide-to-layouts-and-page-specific-layouts-in-nextjs-k2m
 */

export default function Home() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <main className="flex flex-col items-center pt-4">Loading...</main>;
	}

	return (
		<>
			{session
				? (
					<>
						<section className="flex flex-row justify-between">
							<Blockquote>hi {session.user?.name}</Blockquote>
							<Button
								onClick={() => {
									signOut().catch(console.log);
								}}
								variant="link"
							>
								Logout
							</Button>
						</section>
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

			<section className="flex flex-row mx-auto w-full max-w-md gap-2 px-4 py-16">
				<div className="mx-auto w-1/2">
					<MyRadioGroup />
				</div>

				<div className="mx-auto w-1/2">
					<main className="flex flex-col items-center bg-stone-800 px-2">
						<H1>Guestbook</H1>

						<H2>
							Phau's <code>testing out SQL's libraries.</code>
						</H2>

						<div className="pt-6">
							<Form />
						</div>

						<div>
							<div className="pt-10">
								<GuestbookEntries />
							</div>
						</div>
					</main>
				</div>
			</section>
		</>
	);
}

function MyRadioGroup() {
	const [selected, setSelected] = useState(plans[0]);

	return (
		<RadioGroup value={selected} onChange={setSelected}>
			<RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
			<div className="space-y-2">
				{plans.map((plan) => (
					<RadioGroup.Option
						key={plan.name}
						value={plan}
						className={({ active, checked }) =>
							`${active
								? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
								: ""
							}
                  ${checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
							}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`}
					>
						{({ checked }) => (
							<>
								<div className="flex w-full items-center justify-between">
									<div className="flex items-center">
										<div className="text-sm">
											<RadioGroup.Label
												as="p"
												className={`font-medium  ${checked ? "text-white" : "text-gray-900"
													}`}
											>
												{plan.name}
											</RadioGroup.Label>
											<RadioGroup.Description
												as="span"
												className={`inline ${checked ? "text-sky-100" : "text-gray-500"
													}`}
											>
												<span>
													{plan.ram}/{plan.cpus}
												</span>{" "}
												<span aria-hidden="true">&middot;</span>{" "}
												<span>{plan.disk}</span>
											</RadioGroup.Description>
										</div>
									</div>
									{checked && (
										<div className="shrink-0 text-white">
											<CheckIcon className="h-6 w-6" />
										</div>
									)}
								</div>
							</>
						)}
					</RadioGroup.Option>
				))}
			</div>
		</RadioGroup>
	);
}

/**
 * @see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/
 */
function CheckIcon(props: ComponentPropsWithoutRef<"svg">) {
	return (
		<svg viewBox="0 0 24 24" fill="none" {...props}>
			<circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
			<path
				d="M7 13l3 3 7-7"
				stroke="#fff"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function Form() {
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

	if (status !== "authenticated")
		return null;

	return (
		<form
			className="flex flex-col flex-wrap gap-2"
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
				className="w-full rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
				placeholder="Your message..."
				minLength={2}
				maxLength={100}
				value={message}
				onChange={(event) => setMessage(event.target.value)} />
			<Button
				className=""
				variant="subtle"
				type="submit"
			>
				Submit
			</Button>
		</form>
	);
}

function GuestbookEntries() {
	const { data: guestbookEntries, isLoading } = api.guestbook.getAll.useQuery();

	if (isLoading)
		return <div>Fetching messages...</div>;

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
}
