mkdir .flattened
for f in $(find contracts -name *.sol)
  do if [ `basename $f` != "Migrations.sol" ]; then
    file=`basename $f`
    npx truffle-flattener "$f" > .flattened/"$file"
  fi
done
