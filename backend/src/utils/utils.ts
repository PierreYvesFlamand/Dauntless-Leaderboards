export function getSeasonNumberFromSeasonId(id: string): number {
    return Number(id.slice(15));
}

export function getTimestampFromDate(date: Date): number {
    return Math.floor(new Date(date).getTime() / 1000);
}

export function getCurrentWeek(): number {
    const week1StartDate = new Date(Date.UTC(2019, 7 - 1, 18, 17));
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000;
    return Math.floor((new Date().getTime() - week1StartDate.getTime()) / weekInMs) + 1
}

export function getWeekStartDate(week: number): Date {
    const week1StartDate = new Date(Date.UTC(2019, 7 - 1, 18, 17));
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000;
    return new Date(week1StartDate.getTime() + weekInMs * (week - 1));
}

export function getWeekEndDate(week: number): Date {
    const week1StartDate = new Date(Date.UTC(2019, 7 - 1, 18, 17));
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000;
    return new Date(week1StartDate.getTime() + weekInMs * week);
}