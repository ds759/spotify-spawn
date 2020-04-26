const waitFor = ms => new Promise(r => setTimeout(r, ms));
const random = (max, min) => Math.floor(Math.random() * max + min);

async function run() {
  return new Promise((resolve, reject) => {
    console.log("here");
    waitFor(random(3000, 1000)).then(() => {
      console.log("now here");
      waitFor(random(5000, 2000)).then(() => {
        console.log("done");
        resolve();
      });
    });
  });
}

const main = () => {
  run().then(() => main());
};

main();
