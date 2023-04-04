import { Metrics } from "~/components/metrics";
import { Tablita } from "~/components/tablita";
import { api } from "~/utils/api";

export default function Sqlito() {
  const { data: join } = api.innerJoin.join.useQuery();
  const { data: joinOn } = api.innerJoin.joinOn.useQuery();
  const { data: joinOnWhere } = api.innerJoin.joinOnWhere.useQuery();
  const { data: joinN1 } = api.innerJoin.joinN1.useQuery();
  const { data: joinN1_2Q } = api.innerJoin.joinN1_2Q.useQuery();
  const { data: ignore } = api.innerJoin.ignore.useQuery();
  const { data: notIgnore } = api.innerJoin.notIgnore.useQuery();
  const { data: virtual } = api.innerJoin.virtual.useQuery();
  const { data: stored } = api.innerJoin.stored.useQuery();
  const { data: onConflict } = api.innerJoin.onConflict.useQuery();
  const { data: doUpdate } = api.innerJoin.doUpdate.useQuery();
  const { data: leftJoin } = api.innerJoin.leftJoin.useQuery();
  const { data: rightJoin } = api.innerJoin.rightJoin.useQuery();

  // if (isLoading)
  // 	return <div>Fetching messages...</div>;

  return (
    <div className="flex flex-col gap-4">
      <Metrics />

      <Tablita data={join} title="inner join" />
      <Tablita data={joinOn} title="join on" />
      <Tablita data={joinOnWhere} title="join on where" />
      <Tablita data={joinN1} title="join n+1 problem" />
      <Tablita data={joinN1_2Q} title="join n+1 only 2 queries" />
      <Tablita data={ignore} title="ignoring errors" />
      <Tablita data={notIgnore} title="not ignoring errors" />
      <Tablita data={virtual} title="virtual computed column quoted" />
      <Tablita data={stored} title="stored computed column unquoted" />
      <Tablita data={onConflict} title="on conflict" />
      <Tablita data={leftJoin} title="left join" />
      <Tablita data={rightJoin} title="right join" />
    </div>
  );
}
