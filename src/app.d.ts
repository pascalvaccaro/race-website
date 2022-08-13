/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	interface Runner {
		id: number;
		firstname: string;
		lastname: string;
		email: string;
		certificate: { __component: string; valid: boolean; expiration?: Date | null; };
		authorization: { __component: string; };
		minor: boolean;
		child: boolean;
		parent: Runner | number;
		children: Runner[] | number[];
	}
	interface Run {
		id: number;
		chrono: string;
		walking: boolean;
		copyright: boolean;
		runner: Runner;
		race: number;
	}
	interface Race {
		id: number;
		startDate: Date;
		startTime: string;
		park: {
			name: string;
			gallery: unknown[];
		}
	}
}
