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

  const {
    data: offsetPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.pagination.offset.useInfiniteQuery(
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
        {isLoading ? <p>loading...</p> : (
          <>
            <ul>
              {offsetPages?.pages.map((group, i) =>
                group.rows.map((item) => (
                  // @ts-ignore
                  <li key={item.id}>{item.id} : {item.email}</li>
                ))
              )}
            </ul>
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
