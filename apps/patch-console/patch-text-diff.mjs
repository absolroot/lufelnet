import { clone, isPlainObject } from './lib/patch-console-shared.mjs';

const DIGITS = '[0-9０-９]';
const NUMBER = String.raw`[+＋−－-]?${DIGITS}+(?:[.．]${DIGITS}+)?`;
const VALUE = String.raw`${NUMBER}(?:[ \t]*[%％])?`;
const PERCENT_SERIES = new RegExp(
  String.raw`(?<![0-9０-９.．+＋−－/%％-])(?<!${DIGITS},)${VALUE}(?:[ \t]*[/／][ \t]*${VALUE})+(?![0-9０-９%％]|[.,．]${DIGITS}|[ \t]*[/／])`,
  'gu'
);
const FLAT_UNIT = /^[ \t]*(?:(?:HP|SP|MP|turns?|stacks?|points?|pts?)\b|(?:턴|포인트|중첩|ターン|スタック|ポイント|回合|次|点)(?!\p{L}))/iu;
const PERCENT = /[%％]/u;
const END_PERCENT = /[%％]$/u;

function transformPercentageSeries(text, transform) {
  return text.replace(PERCENT_SERIES, (series, start) => {
    const values = series.split(/[/／]/u).map(value => value.trim());
    if (!END_PERCENT.test(values.at(-1))) {
      if (!END_PERCENT.test(values[0]) || FLAT_UNIT.test(text.slice(start + series.length))) return series;
    }
    return transform(series, values);
  });
}

function normalizePercentageSeries(text) {
  return transformPercentageSeries(text, (_, values) =>
    values.map(value => value.replace(/[ \t]*[%％]$/u, '') + '%').join('/')
  );
}

export function expandPercentageSeries(text) {
  if (typeof text !== 'string' || !PERCENT.test(text)) return text;
  return transformPercentageSeries(text, (series, values) => {
    if (values.every(value => END_PERCENT.test(value))) return series;
    const symbol = series.match(PERCENT)[0];
    return series.replace(new RegExp(VALUE, 'gu'), value => END_PERCENT.test(value) ? value : value + symbol);
  });
}

export function isPercentageSeriesFormattingDiff(before, after) {
  if (typeof before !== 'string' || typeof after !== 'string' || before === after) return false;
  if (!PERCENT.test(before) || !PERCENT.test(after)) return false;
  return normalizePercentageSeries(before) === normalizePercentageSeries(after);
}

export function isUnavailablePatchValue(value) {
  if (value == null) return true;
  if (typeof value !== 'string') return false;
  const text = value.trim();
  return !text || /^(?:null|undefined|AAAAAA==)$/i.test(text) || /tnxct-\[[^\]\r\n]+\]/i.test(text);
}

export function mergeExternalPatch(base, patch) {
  if (isUnavailablePatchValue(patch) || base === patch || isPercentageSeriesFormattingDiff(base, patch)) {
    return clone(base);
  }
  if (Array.isArray(patch)) {
    const out = Array.isArray(base) ? clone(base) : [];
    patch.forEach((value, index) => {
      if (!isUnavailablePatchValue(value)) out[index] = mergeExternalPatch(out[index], value);
    });
    return out;
  }
  if (isPlainObject(patch)) {
    const out = isPlainObject(base) ? clone(base) : {};
    for (const [key, value] of Object.entries(patch)) {
      if (!isUnavailablePatchValue(value)) out[key] = mergeExternalPatch(out[key], value);
    }
    return out;
  }
  return expandPercentageSeries(patch);
}
