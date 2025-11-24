
const ts = () => new Date().toISOString();

function info(msg, obj) {
  if (obj) {
    console.log(`✔ ${msg}`, obj);
  } else {
    console.log(`✔ ${msg}`);
  }
}

function error(msg, err) {
  if (err) {
    console.error(`❌ ${msg}`, err.message ?? err);
  } else {
    console.error(`❌ ${msg}`);
  }
}

function debug(msg, obj) {
  console.log(`[${ts()}] ${msg}`, obj ?? "");
}

module.exports = { info, error, debug };
