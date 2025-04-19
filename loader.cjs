async function loadApp() {
  console.log("Working");
  await import("./index.js");
}

loadApp();
