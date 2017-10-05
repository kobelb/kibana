import path from 'path';
import FsOptimizer from '../optimize/fs_optimizer';

(async function () {
  const optimizer = new FsOptimizer({
    env: {
      workingDir: path.join(__dirname, 'built'),
      context: {
        env: 'development',
      },
      noParse: [],
      aliases: {
        ui: path.resolve(__dirname, '../ui/public')
      }
    },
    bundles: {
      toWebpackEntries: () => {
        return path.join(__dirname, 'index.js');
      }
    }
  });

  await optimizer.init();
  optimizer.compiler.watch({
  }, function (err, stats) {
    if (err) return console.error(err);

    console.log(stats);
  });
}());


