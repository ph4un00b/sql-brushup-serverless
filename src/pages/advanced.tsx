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
  const { data: explainQuery } = api.advanced.partial.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: explainQuery2 } = api.advanced.full.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: explainRange } = api.advanced.range.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: skipIndex } = api.advanced.skipIndex.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: avoidIndex } = api.advanced.avoidIndex.useQuery(
    undefined,
    trpcOpts,
  );

  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita data={indexTable} title="show indexes" />
      <Tablita data={explainQuery} title="explain first index" />
      <Tablita data={explainQuery2} title="explain 2 indexes" />
      <Tablita data={skipIndex} title="skip middle" />
      <Tablita data={avoidIndex} title="avoid index" />
      <Tablita data={explainRange} title="stop at first range" />
    </div>
  );
}
