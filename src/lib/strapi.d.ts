export type Scalar = string | number | boolean | null | undefined | Date;
export type StrapiPopulate<B, T = Omit<B, 'id'>> = {
	[K in keyof T]: T[K] extends Scalar ? T[K] : { data: StrapiObject<T[K]> };
};

export type StrapiObject<T> = T extends Array<unknown>
	? T
	: {
			id: number;
			attributes: StrapiPopulate<T>;
	  };
export type StrapiArray<T> = Array<StrapiObject<T>>;
