import { scrap as scrapGauntlets } from "./gauntlets";
import { getCurrentWeek, scrap as scrapTrials } from "./trials";

(async () => {
    await scrapGauntlets();
    await scrapTrials(getCurrentWeek(), true);

    setInterval(scrapGauntlets, 1000 * 60 * 3);
    setInterval(() => { scrapTrials(getCurrentWeek(), true); }, 1000 * 60 * 3);
})();