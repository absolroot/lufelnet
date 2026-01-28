// Astrolabe Data Loader
const AstrolabeDataLoader = (function() {
  let cachedData = null;
  let currentRegion = null;

  async function loadData(region) {
    if (cachedData && currentRegion === region) {
      return cachedData;
    }

    const url = AstrolabeConfig.getDataUrl(region);
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
      const json = await res.json();
      cachedData = json;
      currentRegion = region;
      return json;
    } catch (e) {
      console.error('Failed to load astrolabe data:', e);
      throw e;
    }
  }

  function parseRegionLocalToUTC(tsStr, region) {
    const base = AstrolabeConfig.REGION_BASE_UTC[region] ?? 9;
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})\s+([0-9]{2}):([0-9]{2}):([0-9]{2})$/.exec(tsStr.trim());
    if (!m) return null;
    const y = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, d = parseInt(m[3], 10);
    const hh = parseInt(m[4], 10), mm = parseInt(m[5], 10), ss = parseInt(m[6], 10);
    const millis = Date.UTC(y, mo, d, hh - base, mm, ss);
    return new Date(millis);
  }

  function getNodes(data) {
    return data?.data?.nodes || {};
  }

  function getEndTime(data, region) {
    const endStr = data?.data?.endTime;
    return endStr ? parseRegionLocalToUTC(endStr, region) : null;
  }

  function getStartTime(data, region) {
    const startStr = data?.data?.startTime;
    return startStr ? parseRegionLocalToUTC(startStr, region) : null;
  }

  // Preload all node images
  async function preloadImages(nodes) {
    const imageNames = new Set();

    // Collect unique image names
    Object.values(nodes).forEach(node => {
      if (node.img) imageNames.add(node.img);
    });

    // Add pin image
    imageNames.add('tianerong-xingpan-now.png');

    const promises = Array.from(imageNames).map(name => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ name, img, success: true });
        img.onerror = () => resolve({ name, img: null, success: false });
        img.src = AstrolabeConfig.getImgUrl(name);
      });
    });

    const results = await Promise.all(promises);
    const imageCache = {};
    results.forEach(r => {
      if (r.success) {
        imageCache[r.name] = r.img;
      }
    });
    return imageCache;
  }

  return {
    loadData,
    getNodes,
    getEndTime,
    getStartTime,
    preloadImages,
    parseRegionLocalToUTC
  };
})();
