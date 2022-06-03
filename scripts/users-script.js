const scheduleScript = (req, res, next) => {
    let cron = require('node-cron');
    cron.schedule('* * * * * *', () => {
        console.log('Running task for every minute.');
    });

    // const Queue = require("bull");
    // const queue = new Queue("myQueue");

    // const main = async () => {
    //     await queue.add({ name: "Vikas", age: 30 });
    // }

    // queue.process((job, done) => {
    //     console.log(job.data);
    //     done();
    // });

    // main().catch(console.error);

    res.send('Cron scheduled');
};

exports.scheduleScript = scheduleScript;