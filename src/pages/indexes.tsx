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
  const { data: q500k } = api.indexes.q500k.useQuery(undefined, trpcOpts);
  const { data: q500kCuid } = api.indexes.q500kCuid.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: q500kIdx } = api.indexes.q500kIdx.useQuery(undefined, trpcOpts);
  const { data: q500kCuidIdx } = api.indexes.q500kCuidIdx.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: cuidPrefix6 } = api.indexes.cuidPrefix6.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: cuidPrefix8 } = api.indexes.cuidPrefix8.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: cuidPrefix9 } = api.indexes.cuidPrefix9.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: cuidPrefix10 } = api.indexes.cuidPrefix10.useQuery(
    undefined,
    trpcOpts,
  );

  // if (isLoading)
  // 	return <div>Fetching messages...</div>;

  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita data={q500k} title="500k names" />
      <Tablita data={q500kIdx} title="500k idx names" />
      <Tablita data={q500kCuid} title="500k cuid names" />
      <Tablita data={q500kCuidIdx} title="500k cuid idx names" />
      <Tablita data={cuidPrefix6} title="test prefix 6" />
      <Tablita data={cuidPrefix8} title="test prefix 8" />
      <Tablita data={cuidPrefix9} title="test prefix 9, no index" />
      <Tablita data={cuidPrefix10} title="test prefix 10" />
    </div>
  );
}
