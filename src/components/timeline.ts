// Moves the drawings that grow. Every element with data-span="from to"
// takes part between those two shares of the whole, and is given --t, how
// far along it is, from 0 to 1. The styles turn --t into a line being
// drawn, a box being set down, or a label settling, so a drawing can be
// played, held, and dragged to any point, backwards too.

const ease = (t: number) => 1 - (1 - t) ** 3;

export function spans(root: Element) {
	const parts = [...root.querySelectorAll<HTMLElement | SVGElement>('[data-span]')].map(
		(element) => {
			const [from, to] = element.dataset.span!.split(' ').map(Number);

			return { element, from, to, shown: '' };
		},
	);

	return (progress: number) => {
		for (const part of parts) {
			const local = Math.min(1, Math.max(0, (progress - part.from) / (part.to - part.from)));
			const value = ease(local).toFixed(3);

			if (value !== part.shown) {
				part.shown = value;
				part.element.style.setProperty('--t', value);
			}
		}
	};
}

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Calls back once, when the element is first seen.
export function whenSeen(element: Element, seen: () => void, share = 0.25) {
	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				observer.disconnect();
				seen();
			}
		},
		{ threshold: share },
	);

	observer.observe(element);
}
