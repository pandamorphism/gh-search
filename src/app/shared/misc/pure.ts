// predictes & combinators
import {compose} from 'fp-ts/lib/function';

export const isNull = (x: any) => x === undefined || x === null;
export const not = (x: boolean) => !x;
export const notNull = compose(not, isNull);
export const isEmptyString = (x: string) => notNull(x) && x.length === 0;
