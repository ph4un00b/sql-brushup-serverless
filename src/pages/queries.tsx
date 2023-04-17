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
  const { data: formatTree } = api.queries.formatTree.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: formatJson } = api.queries.formatJson.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: analyze } = api.queries.analyze.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: obfuscated } = api.queries.obfuscated.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: deobfuscated } = api.queries.deobfuscated.useQuery(
    undefined,
    trpcOpts,
  );

  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <H2>reseed if unseeded! 🔧</H2>
      <Tablita data={formatTree} title="format tree" />
      <Tablita data={formatJson} title="format json" />
      <Tablita data={analyze} title="analyze" />
      <Tablita
        data={obfuscated}
        title="obfuscated using index type (const > ref > fulltext > range > index > all)"
      />
      <Tablita
        data={deobfuscated}
        title="deobfuscated using range type (better)!"
      />
    </div>
  );
}
