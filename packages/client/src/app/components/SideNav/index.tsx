import { action, computed, makeAutoObservable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import React, { useEffect } from 'react';

class Todo {
	title = 'Test';
	done = true;
	time = 0;

	constructor() {
		makeAutoObservable(this, {
			toggle: action.bound,
			message: computed,
		});
	}

	toggle() {
		this.done = !this.done;
	}

	get message() {
		return this.time > 1 ? 'seconds' : 'second';
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SideNav(props: any) {
	const todo = useLocalObservable(() => new Todo());
	useEffect(() => {
		const i = setInterval(
			action(() => todo.time++),
			1000
		);

		return () => clearInterval(i);
	}, [todo.time]);
	return (
		<h1>
			{todo.time} {todo.message} has passed
		</h1>
	);
}

export default observer(SideNav);
