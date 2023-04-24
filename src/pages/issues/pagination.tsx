import { Metrics } from "~/components/metrics";
import { api } from "~/utils/api";
import { Tablita } from "~/components/tablita";
import { Button } from "~/components/ui/button";

const trpcOpts = {
  enabled: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
  cacheTime: Infinity,
};

export default function React() {
  const { data: get } = api.pagination.get.useQuery(undefined, trpcOpts);
  const { data: offset } = api.pagination.offset.useQuery({
    limit: 10,
    cursor: 20_000,
  }, trpcOpts);

  const offsetPages = api.pagination.offset.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      ...trpcOpts,
      getNextPageParam: (lastPage) => {
        console.log({ lastPage });
        return lastPage.next;
      },
      // initialCursor: 1, // <-- optional you can pass an initialCursor
    },
  );
  const { data: badCursor } = api.pagination.badCursor.useQuery(
    undefined,
    trpcOpts,
  );
  const { data: bestCursor } = api.pagination.bestCursor.useQuery(
    {
      limit: 10,
      cursor: { id: 186681, birthday: "1947-08-30" },
    },
    trpcOpts,
  );
  const cursorPages = api.pagination.bestCursor.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      ...trpcOpts,
      getNextPageParam: (lastPage) => {
        console.log({ lastPage });
        return lastPage.next;
      },
      initialCursor: { id: 186681, birthday: "1947-08-30" }, // <-- optional you can pass an initialCursor
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <Metrics />
      <Tablita
        data={get}
        title="get!"
      />
      <Tablita
        data={offset}
        title="offset!"
      />

      <div>
        {offsetPages.isLoading ? <p>loading...</p> : (
          <>
            <ul>
              {offsetPages.data?.pages.map((group, i) =>
                group.rows.map((item) => (
                  // @ts-ignore
                  <li key={item.id}>{item.id} : {item.email}</li>
                ))
              )}
            </ul>
            <Button
              onClick={() => offsetPages.fetchNextPage()}
              disabled={!offsetPages.hasNextPage ||
                offsetPages.isFetchingNextPage}
            >
              {offsetPages.isFetchingNextPage
                ? "Loading more..."
                : offsetPages.hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </Button>
          </>
        )}
      </div>

      <Tablita
        data={badCursor}
        title="badCursor!"
      />
      <Tablita
        data={bestCursor}
        title="bestCursor 😍!"
      />

      <div>
        {cursorPages.isLoading ? <p>loading...</p> : (
          <>
            <ul>
              {cursorPages.data?.pages.map((group, i) =>
                group.rows.map((item) => (
                  // @ts-ignore
                  <li key={item.id}>{item.id} : {item.email}</li>
                ))
              )}
            </ul>
            <Button
              onClick={() => cursorPages.fetchNextPage()}
              disabled={!cursorPages.hasNextPage ||
                cursorPages.isFetchingNextPage}
            >
              {cursorPages.isFetchingNextPage
                ? "Loading more..."
                : cursorPages.hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
