import { ExecutedQuery } from "@planetscale/database";
import { H2 } from "./ui/typography";

export type QData = {
  tag: string;
  time?: number;
  serverQueryTime: number;
  rows: ExecutedQuery["rows"];
  info?: ReadonlyArray<Record<string, unknown>>;
};

type TablaProps = {
  title: string;
  show?: boolean;
  data?: QData;
};

export function Tablita({ title, data, show = true }: TablaProps) {
  return (
    <section className="overflow-x-auto">
      <H2>
        {title} -{" "}
        {data?.serverQueryTime ? `${data.serverQueryTime.toFixed(0)}ms` : ""}
        {data?.time ? `, ${data?.time.toFixed(0)}ms` : ""}
        {data?.info?.[0]?.cardinality
          ? `, ${data?.info?.[0]?.cardinality}`
          : ""}
        {data?.info?.[0]?.total ? ` / ${data?.info?.[0]?.total}` : ""}
        {data?.info?.[0]?.selectivity
          ? ` = ${data?.info?.[0]?.selectivity} selectivity`
          : ""}
      </H2>
      {show
        ? (
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
                if (!cuid) {
                  return null;
                }
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
        )
        : null}
    </section>
  );
}
