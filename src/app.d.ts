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
		certificates: Array<{ __component: string; expiration?: Date; }>;
		minor: boolean;
		child: boolean;
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
