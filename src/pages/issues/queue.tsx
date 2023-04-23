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
  const utils = api.useContext();
  const { data: get } = api.queue.get.useQuery(undefined, trpcOpts);
  const { data: available } = api.queue.available.useQuery(undefined, trpcOpts);
  const { data: claiming } = api.queue.claiming.useQuery(undefined, {
    ...trpcOpts,
    onSuccess() {
      utils.queue.get.invalidate();
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita
        data={get}
        title="get!"
      />
      <Tablita
        data={available}
        title="available!"
      />
      <Tablita
        data={claiming}
        title="claiming!"
      />
    </div>
  );
}
