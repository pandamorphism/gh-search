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

const currentPageFromLinks: (urls: UrlToRel[]) => { links: UrlToRel[], currentPage: number } = links => {
  const nextPage = fromNullable(links.find(link => link.rel === 'next'))
    .map(link => link.url.match(/page+=\s*(.*)/))
    .filter(matched => matched && matched.length >= 2)
    .map(matched => parseInt(matched[1], 0));
  const prevPage = () => fromNullable(links.find(link => link.rel === 'prev'))
    .map(link => link.url.match(/page+=\s*(.*)/))
    .filter(matched => matched && matched.length >= 2)
    .map(matched => parseInt(matched[1], 0));
  const currentPage = Math.max(0, nextPage.isSome() ? nextPage.getOrElse(0) - 1 :
    prevPage().getOrElse(0) + 1);
  return ({links, currentPage});
};


const parseLinks: (links: string) => UrlToRel[] = links =>
  fromNullable(links)
    .map(linksStr => linksStr.split(','))
    .getOrElse([])
    .map(parseUrlAndRel)
    .reduce((rels, current) => [...rels, current.getOrElse(null)], []).filter(notNull);


export const linksNPage: (links: string) => { links: UrlToRel[], currentPage: number } = compose(currentPageFromLinks, parseLinks);

