mkdir .flattened
for f in $(find contracts -name *.sol)
  do if [ `basename $f` != "Migrations.sol" ]; then
    file=`basename $f`
    node_modules/.bin/truffle-flattener "$f" > .flattened/"$file"
  fi
done
