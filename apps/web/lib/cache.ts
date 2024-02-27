export interface ContractCache {
  cachePath: string;
  files: string[];
}

export interface FetchedCache {
  fetchedCacheInfo: Map<string, { file: string; header: string; data: string }>;
}

export async function fetchCache(
  cacheInfo: ContractCache
): Promise<FetchedCache> {
  const fetchedCacheObject = await Promise.all(
    cacheInfo.files.map((file) => {
      return Promise.all([
        fetch(`${cacheInfo.cachePath}/${file}.header`).then((res) =>
          res.text()
        ),
        fetch(`${cacheInfo.cachePath}/${file}`).then((res) => res.text()),
      ]).then(([header, data]) => ({ file, header, data }));
    })
  ).then((cacheList) =>
    cacheList.reduce((acc: any, { file, header, data }) => {
      acc[file] = { file, header, data };

      return acc;
    }, {})
  );

  return {
    fetchedCacheInfo: new Map(Object.entries(fetchedCacheObject)),
  };
}

export const WebFileSystem = (fetchedCache: FetchedCache): any => ({
  read({ persistentId, uniqueId, dataType }: any) {
    // read current uniqueId, return data if it matches
    if (!fetchedCache.fetchedCacheInfo.get(persistentId)) {
      console.log('read');
      console.log({ persistentId, uniqueId, dataType });

      return undefined;
    }

    const currentId = fetchedCache.fetchedCacheInfo.get(persistentId)!.header;

    if (currentId !== uniqueId) {
      console.log(
        'current id did not match persistent id',
        persistentId,
        currentId,
        uniqueId
      );

      return undefined;
    }

    if (dataType === 'string') {
      console.log('found in cache', { persistentId, uniqueId, dataType });

      return new TextEncoder().encode(
        fetchedCache.fetchedCacheInfo.get(persistentId)!.data
      );
    }

    return undefined;
  },
  write({ persistentId, uniqueId, dataType }: any, data: any) {
    console.log('write');
    console.log({ persistentId, uniqueId, dataType });
  },
  canWrite: true,
});
