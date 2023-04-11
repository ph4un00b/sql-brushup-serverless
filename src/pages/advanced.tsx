import { Metrics } from "~/components/metrics";
import { Tablita } from "~/components/tablita";
import { api } from "~/utils/api";

const trpcOpts = {
  enabled: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
  cacheTime: Infinity,
};

export default function Indexes() {
  const { data: indexTable } = api.advanced.indexTable.useQuery(
    undefined,
    trpcOpts,
  );

  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita data={indexTable} title="show indexes" />
    </div>
  );
}
