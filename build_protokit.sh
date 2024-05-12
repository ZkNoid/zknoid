
DIRECTORY='framework'
DEP_DIRECTORY='protokit-framework'

PATCH_CONTENT="
export function equalProvable(received, expected) {
    expect(received).toHaveLength(expected.length);
    const receivedBigInts = received.map((f) => f.toBigInt());
    const expectedBigInts = expected.map((f) => f.toBigInt());
    const pass = receivedBigInts.every((v, index) => v === expectedBigInts[index]);
    return {
        message: () => \`Expected ${expectedBigInts}, received ${receivedBigInts}\`,
        pass,
    };
}
"

if [ -d "$DEP_DIRECTORY" ]; then
  echo "$DEP_DIRECTORY does exist."
  exit 0
fi

rm -rf "$DIRECTORY"

mkdir -p "$DIRECTORY"
mkdir -p "$DEP_DIRECTORY"

git clone https://github.com/proto-kit/framework "$DIRECTORY"
cd "$DIRECTORY" && git checkout "feature/o1js-upgrade-1" && git merge origin/fix/mempool-transaction-drop -m "Merge" && npm i && npm run build && echo "$PATCH_CONTENT" > "packages/common/dist/test/equalProvable.js" && cd ../
mv "$DIRECTORY" "$DEP_DIRECTORY"





