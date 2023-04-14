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
  const { data: historyUnique } = api.issues.historyUnique.useQuery(
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
      <Tablita
        data={historyUnique}
        title="history composite unique solution"
      />
      <ReactIssue />
      <CompositePk />
      <CompositeUnique />
    </div>
  );
}

function CompositeUnique() {
  const utils = api.useContext();

  const addHistoryUnique = api.issues.addHistoryUnique.useMutation({
    ...trpcOpts,
    onSuccess() {
      utils.issues.historyUnique.invalidate();
    },
  });

  useEffect(() => {
    addHistoryUnique.mutate({
      ...user,
      ...product,
    });
  }, []);

  return <></>;
}

function CompositePk() {
  const utils = api.useContext();

  const addHistorySafe = api.issues.addHistorySafe.useMutation({
    ...trpcOpts,
    onSuccess() {
      utils.issues.historySafe.invalidate();
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
