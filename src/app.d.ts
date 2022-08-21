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
		fullname?: string;
		email: string;
		attachments: App.File[];
		minor: boolean;
		child: boolean;
		parent: Runner | number;
		children: Runner[] | number[];
		runs?: App.Run[];
	}
	interface Run {
		id: number;
		chrono: string;
		numberSign: number;
		walking: boolean;
		copyright: boolean;
		runner: Runner;
		race: Race;
	}
	interface Race {
		id: number;
		startDate: Date;
		startTime: string;
		park: {
			name: string;
			gallery: unknown[];
		};
		runs: App.Run[];
	}

	interface File {
		id: number;
		name: string;
		caption: string;
		valid: boolean | null;
		expiry: Date | null;
		createdAt: Date;
	}

	interface AdminRole {
		code: string;
		description: string;
		id: number;
		name: string;
	}

	interface AdminUser {
		blocked: boolean;
		createdAt: Date;
		email: string;
		firstname: string;
		id: number;
		isActive: boolean;
		lastname: string;
		preferedLanguage: string | null;
		roles: AdminRole[];
		updatedAt: string;
		username: string | null;
	}
}

declare module 'svelte-fusioncharts';
