import { useState, useSyncExternalStore } from "hono/jsx";
import { createRoot } from "hono/jsx/dom/client";

// works with react
// import { useState, useSyncExternalStore } from "react";
// import { createRoot } from "react-dom/client";

const createCounter = (initialValue: number) => {
	let value = initialValue;
	const subscribers = new Set<VoidFunction>();

	return {
		value: value,
		subscribers: subscribers,
		subscribe: (callback: VoidFunction) => {
			subscribers.add(callback);
			return () => subscribers.delete(callback);
		},
		getValue: () => value,
		increment: () => {
			value++;
			subscribers.forEach((callback) => callback());
		},
	};
};

const App = () => {
	const [counter, setCounter] = useState(() => createCounter(0));

	const value = useSyncExternalStore(counter.subscribe, counter.getValue);

	return (
		<div>
			<p>Value: {value}</p>
			<button onClick={counter.increment}>Increment</button>
			<button onClick={() => setCounter(createCounter(0))}>Reset</button>
		</div>
	);
};

createRoot(document.querySelector<HTMLDivElement>("#app")!).render(<App />);
