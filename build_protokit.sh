
DIRECTORY='framework'
DEP_DIRECTORY='protokit-framework'

if [ -d "$DEP_DIRECTORY" ]; then
  echo "$DEP_DIRECTORY does exist."
  exit 0
fi

mkdir -p "$DIRECTORY"
mkdir -p "$DEP_DIRECTORY"

git clone https://github.com/proto-kit/framework "$DIRECTORY"
cd "$DIRECTORY" && git checkout "feature/o1js-upgrade-1" && npm i && npm run build && cd ../
mv "$DIRECTORY" "$DEP_DIRECTORY"





