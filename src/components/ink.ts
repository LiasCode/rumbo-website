// Geometry for the site's ink drawings, computed at build time. A brush
// stroke is a filled outline around a centerline, whose width follows a
// pressure profile and wavers a little, so no stroke looks machine-made and
// no filter has to run in the browser while the drawings move.

export type Point = [number, number];

// A small deterministic generator: the same seed draws the same stroke on
// every build, so the pages do not change between builds.
export function random(seed: number) {
	let state = seed;

	return () => {
		state |= 0;
		state = (state + 0x6d2b79f5) | 0;

		let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
		mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;

		return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
	};
}

const round = (value: number) => Math.round(value * 10) / 10;

export function cubic(from: Point, first: Point, second: Point, to: Point, samples = 36): Point[] {
	return Array.from({ length: samples + 1 }, (_, index) => {
		const t = index / samples;
		const u = 1 - t;

		return [
			u ** 3 * from[0] + 3 * u * u * t * first[0] + 3 * u * t * t * second[0] + t ** 3 * to[0],
			u ** 3 * from[1] + 3 * u * u * t * first[1] + 3 * u * t * t * second[1] + t ** 3 * to[1],
		];
	});
}

export function arc(
	center: Point,
	radius: number,
	from: number,
	sweep: number,
	drift = 0,
	samples = 96,
): Point[] {
	return Array.from({ length: samples + 1 }, (_, index) => {
		const t = index / samples;
		const angle = ((from + sweep * t) * Math.PI) / 180;
		const reach = radius + drift * t;

		return [center[0] + Math.cos(angle) * reach, center[1] + Math.sin(angle) * reach];
	});
}

// The centerline as a path, which masks and moving marks follow.
export function line(points: Point[]) {
	return points.map(([x, y], index) => `${index ? 'L' : 'M'}${round(x)} ${round(y)}`).join('');
}

// A smooth waver between -1 and 1 along the stroke: a few slow waves with
// random phases, so the edge swells and thins without turning jagged.
function waver(seed: number) {
	const next = random(seed);
	const waves = Array.from({ length: 4 }, (_, index) => ({
		rate: (index + 1) * (2 + next() * 3),
		phase: next() * Math.PI * 2,
		weight: 1 / (index + 1),
	}));

	return (t: number) =>
		waves.reduce((sum, { rate, phase, weight }) => sum + Math.sin(t * rate + phase) * weight, 0) /
		2;
}

function normals(points: Point[]): Point[] {
	return points.map((_, index) => {
		const before = points[Math.max(index - 1, 0)];
		const after = points[Math.min(index + 1, points.length - 1)];
		const length = Math.hypot(after[0] - before[0], after[1] - before[1]) || 1;

		return [-(after[1] - before[1]) / length, (after[0] - before[0]) / length];
	});
}

// The outline of a brush stroke along points. width says how wide the
// brush is at each share of the way, and roughness how much each edge
// wavers on its own.
export function brush(
	points: Point[],
	width: (t: number) => number,
	seed: number,
	roughness = 0.16,
) {
	const sides = [waver(seed), waver(seed + 7)];
	const across = normals(points);
	const edge = (side: number) =>
		points.map(([x, y], index) => {
			const t = index / (points.length - 1);
			const half = (width(t) / 2) * (1 + sides[side](t) * roughness);
			const sign = side ? -1 : 1;

			return [x + across[index][0] * half * sign, y + across[index][1] * half * sign] as Point;
		});

	return `${line(edge(0))}${line(edge(1).reverse()).replace('M', 'L')}Z`;
}

// The hairs of a brush running dry: thin lines beside the centerline, over
// the last part of a stroke, each starting and ending where it pleases.
export function hairs(points: Point[], spread: number, seed: number, count = 5) {
	const next = random(seed);
	const across = normals(points);

	return Array.from({ length: count }, () => {
		const offset = (next() - 0.5) * spread;
		const start = Math.floor(points.length * (0.35 + next() * 0.3));
		const end = Math.floor(points.length * (0.82 + next() * 0.18));

		return line(
			points
				.slice(start, end)
				.map(([x, y], index) => [
					x + across[start + index][0] * offset,
					y + across[start + index][1] * offset,
				]),
		);
	});
}

// Pressure profiles. A stroke lands heavy and lifts off thin; a branch
// leaves the trunk thick and ends as a twig.
export const pressed = (wide: number) => (t: number) =>
	wide * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 2.4) * 0.5)) * (1 - t ** 2.2 * 0.82);
export const tapered = (wide: number, thin: number) => (t: number) =>
	wide + (thin - wide) * t ** 0.55;

// Drops flicked off the brush around a point.
export function spatter(center: Point, reach: number, seed: number, count = 9) {
	const next = random(seed);

	return Array.from({ length: count }, () => {
		const angle = next() * Math.PI * 2;
		const distance = reach * (0.75 + next() * 0.5);

		return {
			x: round(center[0] + Math.cos(angle) * distance),
			y: round(center[1] + Math.sin(angle) * distance),
			r: round(0.8 + next() ** 2 * 4.2),
		};
	});
}
