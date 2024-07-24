
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
  pwd
  ls
  ls "$DEP_DIRECTORY"
  ls "$DEP_DIRECTORY/framework"
  ls "$DEP_DIRECTORY/framework/packages"
  ls "$DEP_DIRECTORY/framework/packages/common"

  exit 0
fi

rm -rf "$DIRECTORY"

mkdir -p "$DIRECTORY"
mkdir -p "$DEP_DIRECTORY"

git clone https://github.com/proto-kit/framework "$DIRECTORY"

# cd "$DIRECTORY" && git checkout "feature/o1js-upgrade-1" && git merge origin/fix/mempool-transaction-drop -m "Merge" && npm i && npm run build && echo "$PATCH_CONTENT" > "packages/common/dist/test/equalProvable.js" && cd ../
cd "$DIRECTORY" && git checkout cb13a02daa4982df03f4f7ab9da86d48e6b7c212 && git remote add protokit-zknoid https://github.com/ZkNoid/proto-kit && git fetch protokit-zknoid shim-connection-fix-1-1-0 && git merge protokit-zknoid/shim-connection-fix-1-1-0 -m "Merge" && npm i && npm run build && cd ../

mv "$DIRECTORY" "$DEP_DIRECTORY"





