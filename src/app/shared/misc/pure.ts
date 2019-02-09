// predictes & combinators & fun stuff
import {compose} from 'fp-ts/lib/function';
import {fromNullable, none, Option, some} from 'fp-ts/lib/Option';
import {Rel, UrlToRel} from '../model/model';

export const isNull = (x: any) => x === undefined || x === null;
export const not = (x: boolean) => !x;
export const notNull = compose(not, isNull);
export const isEmptyString = (x: string) => notNull(x) && x.length === 0;
const getElement: <T>(idx: number) => (arr: T[]) => T = idx => arr => arr[idx];

const extractRel: (entry: string) => Option<Rel> = entry =>
  fromNullable(entry)
    .map(val => val.split('='))
    .filter(([_, value]) => notNull(value))
    .map(([_, rel]) => rel.replace(/"/g, '') as Rel);

const extractUrl: (url: string) => Option<string> = url =>
  fromNullable(url)
    .map((param) => param.match(/\<([^)]+)\>/))
    .filter(arrLike => arrLike && arrLike.length >= 2)
    .map(getElement(1));

const parseUrlAndRel: (str: string) => Option<UrlToRel> = str =>
  fromNullable(str)
    .map(val => val.split(';'))
    .chain(([URL, REL]) => notNull(URL) && notNull(REL) ? some({
      url: extractUrl(URL).getOrElse(''),
      rel: extractRel(REL).getOrElse(null)
    }) : none);

export const parseLinks: (links: string) => UrlToRel[] = links =>
  fromNullable(links)
    .map(linksStr => linksStr.split(','))
    .getOrElse([])
    .map(parseUrlAndRel)
    .reduce((rels, current) => [...rels, current.getOrElse(null)], []).filter(notNull);
