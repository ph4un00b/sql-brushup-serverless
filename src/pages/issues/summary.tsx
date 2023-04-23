import { Metrics } from "~/components/metrics";
import { api } from "~/utils/api";
import { Tablita } from "~/components/tablita";

const trpcOpts = {
  enabled: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
  cacheTime: Infinity,
};

export default function React() {
  const { data: get } = api.sum.get.useQuery(undefined, trpcOpts);
  const { data: filtering } = api.sum.filtering.useQuery(undefined, trpcOpts);
  const { data: grouping } = api.sum.grouping.useQuery(undefined, trpcOpts);
  const { data: populate } = api.sum.populate.useQuery(undefined, trpcOpts);
  const { data: live } = api.sum.live.useQuery(undefined, trpcOpts);
  const { data: cte } = api.sum.cte.useQuery(undefined, trpcOpts);

  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita
        data={get}
        title="get!"
      />
      <Tablita
        data={filtering}
        title="filtering!"
      />
      <Tablita
        data={grouping}
        title="grouping!"
      />
      <Tablita
        data={populate}
        title="populate!"
      />
      <Tablita
        data={live}
        title="live!"
      />
      <Tablita
        data={cte}
        title="cte!"
      />
    </div>
  );
}
