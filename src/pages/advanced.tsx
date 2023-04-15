import { Metrics } from "~/components/metrics";
import { Tablita } from "~/components/tablita";
import { H2 } from "~/components/ui/typography";
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
  const { data: coveringIndex } = api.advanced.coveringIndex.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: noCovering } = api.advanced.noCovering.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: wildcard } = api.advanced.wildcard.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: noWildcard } = api.advanced.noWildcard.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: fulltext } = api.advanced.fulltext.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: booleanModeLess } = api.advanced.booleanModeLess.useQuery(
    undefined,
    trpcOpts,
  );

  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <H2>reseed if unseeded! 🔧</H2>
      <Tablita data={indexTable} title="show indexes" />
      <Tablita data={explainQuery} title="explain first index" />
      <Tablita data={explainQuery2} title="explain 2 indexes" />
      <Tablita data={skipIndex} title="skip middle" />
      <Tablita data={avoidIndex} title="avoid index" />
      <Tablita data={explainRange} title="stop at first range" />
      <Tablita data={coveringIndex} title="using covering index" />
      <Tablita data={noCovering} title="not using covering index" />
      <Tablita data={wildcard} title="wildcard search" />
      <Tablita data={noWildcard} title="no indexed wildcard search" />
      <Tablita data={fulltext} title="fulltext search 💖" />
      <Tablita data={booleanModeLess} title="boolean search 💖" />
    </div>
  );
}
