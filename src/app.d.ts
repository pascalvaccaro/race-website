/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	interface Runner {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		certificates: Array<{ __component: string; expiration?: Date; }>;
		attestations: Array<{ __component: string; valid?: boolean; }>;
		minor: boolean;
		child: boolean;
	}
	interface Run {
		walking: boolean;
		copyright: boolean;
		runner: Runner;
		race: number;
	}
	interface Race {
		id: number;
		startDate: Date;
		startTime: string;
		parcours: {
			name: string;
			gallery: unknown[];
		}
	}
}
