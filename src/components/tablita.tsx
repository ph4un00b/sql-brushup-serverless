import { H2 } from "./ui/typography";

type TablaProps = {
  title: string;
  show?: boolean;
  data: {
    time: number;
    serverQueryTime: number;
    rows: (unknown[] | Record<string, unknown>)[];
  } | undefined;
};

export function Tablita({ title, data, show = true }: TablaProps) {
  return (
    <section className="overflow-x-auto">
      <H2>
        {title} -{" "}
        {data?.serverQueryTime ? `${data.serverQueryTime.toFixed(0)}ms` : ""}
        {data?.time ? `, ${data?.time.toFixed(0)}ms` : ""}
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
