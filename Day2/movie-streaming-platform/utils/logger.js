export const info = (msg, obj) => {
  if (obj !== undefined) {
    console.log(`INFO: ${msg}`, obj);
  } else {
    console.log(`INFO: ${msg}`);
  }
};

export const warn = (msg, obj) => {
  if (obj !== undefined) {
    console.warn(`WARN: ${msg}`, obj);
  } else {
    console.warn(`WARN: ${msg}`);
  }
};

export const error = (msg, err) => {
  const m = err?.message ?? err;
  console.error(`ERROR: ${msg}${m ? ` — ${m}` : ""}`);
};
