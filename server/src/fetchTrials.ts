import { getCurrentWeek, scrap as scrapTrials } from "./trials";

(async () => {
    switch (process.argv[2]) {
        case 'all':
            for (let i = 1; i < getCurrentWeek(); i++) {
                console.log(`Week ${i}`);
                await scrapTrials(i);
            }
            break;

        case 'last':
            await scrapTrials(getCurrentWeek() - 1);
            break;

        default:
            if (isNaN(Number(process.argv[2]))) {
                throw new Error(`Arg shoul be 'all', 'last' or a week number`);
            }

            await scrapTrials(Number(process.argv[2]));
            break;
    }

    process.exit();
})();