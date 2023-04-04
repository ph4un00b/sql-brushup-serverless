import { Metrics } from "~/components/metrics";
import { Tablita } from "~/components/tablita";
import { api } from "~/utils/api";

export default function Indexes() {
  const { data: q100 } = api.indexes.q100.useQuery();
  const { data: q1k } = api.indexes.q1k.useQuery();
  const { data: q10k } = api.indexes.q10k.useQuery();
  const { data: q50k } = api.indexes.q50k.useQuery();

  // if (isLoading)
  // 	return <div>Fetching messages...</div>;

  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita show={false} data={q100} title="100 names" />
      <Tablita show={false} data={q1k} title="1k names" />
      <Tablita show={false} data={q10k} title="10k names" />
      <Tablita data={q50k} title="50k names" />
    </div>
  );
}
