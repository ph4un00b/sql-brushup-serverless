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
  const { data: suboptimal } = api.queries.suboptimal.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: optimal } = api.queries.optimal.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: redundant } = api.queries.redundant.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: pivotBad } = api.queries.pivotBad.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: pivotCool } = api.queries.pivotCool.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: subqueryBad } = api.queries.subqueryBad.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: subqueryCool } = api.queries.subqueryCool.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: cte } = api.queries.cte.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: recursiveCTE } = api.queries.recursiveCTE.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: union } = api.queries.union.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: windowFunc } = api.queries.windowFunc.useQuery(
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
      <Tablita
        data={suboptimal}
        title="exact set + suboptimal query 😒!"
      />
      <Tablita
        data={optimal}
        title="approximated set + optimal query 😒!"
      />
      <Tablita
        data={redundant}
        title="exact set + optimal query 😍!"
      />
      <Tablita
        data={pivotBad}
        title="bad pivot query!"
      />
      <Tablita
        data={pivotCool}
        title="cool pivot query!"
      />
      <Tablita
        data={subqueryBad}
        title="bad subquery with temporal table 😒!"
      />
      <Tablita
        data={subqueryCool}
        title="cool subquery 😍!"
      />
      <Tablita
        data={cte}
        title="cte 😍!"
      />
      <Tablita
        data={recursiveCTE}
        title="recursive CTE 😍!"
      />
      <Tablita
        data={union}
        title="union!"
      />
      <Tablita
        data={windowFunc}
        title="window-func!"
      />
    </div>
  );
}
