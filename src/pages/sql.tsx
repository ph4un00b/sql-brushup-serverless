import { api } from "~/utils/api";

export default function Sqlito() {
	const { data, isLoading } = api.example.getAll.useQuery();

	if (isLoading)
		return <div>Fetching messages...</div>;

	return (
		<div className="flex flex-col gap-4">
			<pre>
				{data && JSON.stringify(data, null, 2)}
			</pre>
		</div>
	);
}
