/* eslint-disable no-console */
const cli = require('./cli');

const handle = async (commands = []) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    // eslint-disable-next-line no-await-in-loop
    await cli(cmd, {}, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
        return;
      }

      if (stderr) {
        console.error(stderr);
        return;
      }

      console.log(stdout);
    });
  }
};

const commands = process.argv.slice(2);
handle(commands)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
