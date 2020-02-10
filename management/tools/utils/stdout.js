module.exports.title = (...args) => print.apply(null, [true, ...args]);// eslint-disable-line no-useless-call

module.exports.log = (...args) => print.apply(null, [false, ...args]);// eslint-disable-line no-useless-call

const print = (isTitle = false, label, text, divided = false) => {

  if (process.env.TESTING) {
    return; // Suppress logs in testing mode
  }

  if (divided || isTitle) {
    console.log('\x1b[36m' + '='.repeat(80), '\x1b[0m');
  }

  console.log(
    label ? `${isTitle ? '\x1b[32m' : '\x1b[36m'}${label}${text ? ':' : ''} \x1b[0m` : '',
    text ? text : ''// eslint-disable-line no-unneeded-ternary
  );
};
module.exports.print = print;
