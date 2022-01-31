const threshold = 0.7;

export function isCongested(
    speed: number,
    average: number,
    reference: number,
): boolean {
    const congestion = 1 - speed / average;
    if (reference >= 30) {
        return congestion >= threshold;
    } else {
        return false;
    }
}
