import { useEffect } from "react";
import { Metrics } from "~/components/metrics";
import { api } from "~/utils/api";
import { faker } from "@faker-js/faker";
import { Tablita } from "~/components/tablita";

const trpcOpts = {
  enabled: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
  cacheTime: Infinity,
};

const user = {
  userId: crypto.randomUUID(),
  username: faker.internet.userName(),
};

const product = {
  productId: crypto.randomUUID(),
  product: faker.commerce.productName(),
};

export default function React() {
  const { data: history } = api.issues.history.useQuery(undefined, trpcOpts);
  const { data: historySafe } = api.issues.historySafe.useQuery(
    undefined,
    trpcOpts,
  );
  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita data={history} title="history double issue" />
      <Tablita
        data={historySafe}
        title="history composite primary key solution"
      />
      <ReactIssue />
      <CompositePk />
    </div>
  );
}

function CompositePk() {
  const utils = api.useContext();

  const addHistorySafe = api.issues.addHistorySafe.useMutation({
    ...trpcOpts,
    onSuccess() {
      utils.issues.history.invalidate();
    },
  });

  useEffect(() => {
    addHistorySafe.mutate({
      ...user,
      ...product,
    });
  }, []);

  return <></>;
}

function ReactIssue() {
  const utils = api.useContext();

  const addHistory = api.issues.addHistory.useMutation({
    ...trpcOpts,
    onSuccess() {
      utils.issues.history.invalidate();
    },
  });

  useEffect(() => {
    addHistory.mutate({
      ...user,
      ...product,
    });
  }, []);

  return <></>;
}
