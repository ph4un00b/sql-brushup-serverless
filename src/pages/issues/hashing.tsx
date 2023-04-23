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
  const { data: normal } = api.hashing.normal.useQuery(undefined, trpcOpts);
  const { data: normalExp } = api.hashing.normalExp.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: md5 } = api.hashing.md5.useQuery(undefined, trpcOpts);
  const { data: md5Exp } = api.hashing.md5Exp.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: bin } = api.hashing.bin.useQuery(undefined, trpcOpts);
  const { data: binExp } = api.hashing.binExp.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: complexMD5 } = api.hashing.complexMD5.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: complexMD5Exp } = api.hashing.complexMD5Exp.useQuery(
    undefined,
    trpcOpts,
  );
  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita
        data={normal}
        title="normal select!"
      />
      <Tablita
        data={normalExp}
        title="normal select explained!"
      />
      <Tablita
        data={md5}
        title="md5 select!"
      />
      <Tablita
        data={md5Exp}
        title="md5 select explained!"
      />
      <Tablita
        data={bin}
        title="bin select!"
      />
      <Tablita
        data={binExp}
        title="bin select explained!"
      />
      <Tablita
        data={complexMD5}
        title="complex md5 select!"
      />
      <Tablita
        data={complexMD5Exp}
        title="complex md5 select explained!"
      />
    </div>
  );
}
