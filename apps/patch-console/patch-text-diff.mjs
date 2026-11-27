const DIGITS = '[0-9０-９]';
const NUMBER = String.raw`[+＋−－-]?${DIGITS}+(?:[.．]${DIGITS}+)?`;
const VALUE = String.raw`${NUMBER}(?:[ \t]*[%％])?`;
const PERCENT_SERIES = new RegExp(
  String.raw`(?<![0-9０-９.．+＋−－/%％-])(?<!${DIGITS},)${VALUE}(?:[ \t]*[/／][ \t]*${VALUE})+(?![0-9０-９%％]|[.,．]${DIGITS}|[ \t]*[/／])`,
  'gu'
);
const FLAT_UNIT = /^[ \t]*(?:(?:HP|SP|MP|turns?|stacks?|points?|pts?)\b|(?:턴|포인트|중첩|ターン|スタック|ポイント|回合|次|点)(?!\p{L}))/iu;

function normalizePercentageSeries(text) {
  return text.replace(PERCENT_SERIES, (series, start) => {
    const values = series.split(/[/／]/u).map(value => value.trim());
    const percent = /[%％]$/u;
    if (!percent.test(values.at(-1))) {
      if (!percent.test(values[0]) || FLAT_UNIT.test(text.slice(start + series.length))) return series;
    }
    return values.map(value => value.replace(/[ \t]*[%％]$/u, '') + '%').join('/');
  });
}

export function isPercentageSeriesFormattingDiff(before, after) {
  if (typeof before !== 'string' || typeof after !== 'string' || before === after) return false;
  if (!/[%％]/u.test(before) || !/[%％]/u.test(after)) return false;
  return normalizePercentageSeries(before) === normalizePercentageSeries(after);
}
