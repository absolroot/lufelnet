;(function () {
  if (typeof window === 'undefined') return;

  var CHARACTER_NAME = '코토네';
  window.KotoneTheme = window.KotoneTheme || {};
  window.KotoneTheme[CHARACTER_NAME] = true;

  if (!document.getElementById('kotone-character-css')) {
    var baseUrl = window.BASE_URL || '';
    var cssHash = window.__CHARACTER_STYLE_HASHES && window.__CHARACTER_STYLE_HASHES.kotone;
    var cssLink = document.createElement('link');
    cssLink.id = 'kotone-character-css';
    cssLink.rel = 'stylesheet';
    cssLink.href = baseUrl + '/data/characters/' + encodeURIComponent(CHARACTER_NAME) + '/kotone.css?h=' + encodeURIComponent(cssHash || '');
    document.head.appendChild(cssLink);
  }

  var seed = 709;
  var nextRandom = function () {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  var tileSize = 20;
  var tileCount = 34;
  var palette = [
    ['#ffd8d8', '0.14'],
    ['#ffc4d3', '0.16'],
    ['#ff9eae', '0.16'],
    ['#ffe2e9', '0.18']
  ];
  var tiles = Array.from({ length: tileCount * tileCount }, function (_, index) {
    var roll = nextRandom();
    var paletteIndex = roll < 0.60 ? 0 : roll < 0.78 ? 1 : roll < 0.88 ? 2 : 3;
    var color = palette[paletteIndex];
    var x = (index % tileCount) * tileSize;
    var y = Math.floor(index / tileCount) * tileSize;
    return '<rect x="' + x + '" y="' + y + '" width="' + tileSize + '" height="' + tileSize + '" fill="' + color[0] + '" fill-opacity="' + color[1] + '" stroke="#ffffff" stroke-opacity="0.62"/>';
  }).join('');
  var patternSize = tileSize * tileCount;
  // A single larger plane keeps the checker visible on ultrawide displays too.
  var svgSize = 4096;
  var patternPlaneInset = -2500;
  var patternPlaneSize = svgSize + 5000;
  // Test panel: it is painted in the same background SVG, above the checker and behind all page content.
  var rightPanel = '<polygon points="2400,0 ' + svgSize + ',0 ' + svgSize + ',' + svgSize + ' 35,' + svgSize + '" fill="#ffd9ea"/>';
  var overlay = '<rect width="100%" height="100%" fill="#000000" fill-opacity="0.1"/>';
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + svgSize + '" height="' + svgSize + '" viewBox="0 0 ' + svgSize + ' ' + svgSize + '"><defs><pattern id="kotone-checker" width="' + patternSize + '" height="' + patternSize + '" patternUnits="userSpaceOnUse">' + tiles + '</pattern></defs><rect width="100%" height="100%" fill="#fff9fb"/><g transform="rotate(-30 ' + (svgSize / 2) + ' ' + (svgSize / 2) + ')"><rect x="' + patternPlaneInset + '" y="' + patternPlaneInset + '" width="' + patternPlaneSize + '" height="' + patternPlaneSize + '" fill="url(#kotone-checker)"/></g>' + rightPanel + overlay + '</svg>';
  var patternStyle = document.createElement('style');
  patternStyle.id = 'kotone-checker-pattern';
  patternStyle.textContent = 'body{background-image:url("data:image/svg+xml,' + encodeURIComponent(svg) + '")!important;background-size:' + svgSize + 'px ' + svgSize + 'px!important;background-repeat:no-repeat!important;background-position:center top!important;background-attachment:fixed!important;}';
  document.head.appendChild(patternStyle);
})();
