import { useEffect, useState } from "react";
import { PerfSvg } from "~/components/icons/performance";
import { H2 } from "~/components/ui/typography";
import { api } from "~/utils/api";

export default function Sqlito() {
	const [timings, setTimings] = useState<[string, number][]>([]);
	const { data } = api.example.join.useQuery();

	useEffect(() => {
		const entries = window.performance.timing;
		// const entries2 = window.performance.getEntries();
		// console.log(entries2);
		setTimings(
			Object.entries(
				JSON.parse(JSON.stringify(entries)) as { [s: string]: number },
			)
				.sort((a, b) => a[1] - b[1]),
		);
		// console.log(entries2);
		console.log(window.scriptStart);
	}, []);

	// if (isLoading)
	// 	return <div>Fetching messages...</div>;

	return (
		<div className="flex flex-col gap-4">
			<div className="bg-slate-200">
				<PerfSvg />
			</div>

			<details>
				<summary>metrics</summary>
				{timings.map((x) => {
					return (
						<pre key={x[0]}>{x[0]}: {x[1]} : {x[1] - window.scriptStart}</pre>
					);
				})}
			</details>

			<div className="overflow-x-auto">
				<H2>Simple Join</H2>
				<table className="table table-compact w-full">
					<thead>
						<tr>
							{data?.rows && data.rows.length > 0 &&
								Object.keys(data?.rows?.[0] as unknown as string[]).map(
									(key) => <th key={key + "top"}>{key}</th>,
								)}
						</tr>
					</thead>
					<tbody>
						{data?.rows.map((item, idx) => {
							const keys = Object.keys(item);
							const [cuid] = keys;
							if (!cuid) return null;
							return (
								<tr key={cuid + idx.toString()}>
									{keys.map((keyName) => (
										<td
											key={keyName + "data"}
											className="truncate max-w-[3rem]"
										>
											{(item as Record<string, unknown>)[keyName] as string}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr>
							{data?.rows && data.rows.length > 0 &&
								Object.keys(data?.rows?.[0] as unknown as string[]).map(
									(key) => <th key={key + "bottom"}>{key}</th>,
								)}
						</tr>
					</tfoot>
				</table>
			</div>

			<script>
				{`
						window.scriptStart = new Date().valueOf();
      			const scriptStart = window.scriptStart
						const requestStart = window.performance.timing.requestStart;
						const fullTime = scriptStart - requestStart;

						console.log({scriptStart, fullTime, requestStart});
        `}
			</script>
		</div>
	);
}
