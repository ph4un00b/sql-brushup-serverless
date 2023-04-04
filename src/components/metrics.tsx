import { useEffect, useState } from "react";
import { PerfSvg } from "./icons/performance";

export function Metrics() {
  const [timings, setTimings] = useState<[string, number][]>([]);
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

  return (
    <section>
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
      <script>
        {`
						window.scriptStart = new Date().valueOf();
      			const scriptStart = window.scriptStart
						const requestStart = window.performance.timing.requestStart;
						const fullTime = scriptStart - requestStart;

						console.log({scriptStart, fullTime, requestStart});
        `}
      </script>
    </section>
  );
}
