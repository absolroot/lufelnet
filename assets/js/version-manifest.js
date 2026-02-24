(function initVersionManifest(global) {
    'use strict';

    // Single source of truth for app version.
    if (typeof global.APP_VERSION !== 'string' || !global.APP_VERSION.trim()) {
        global.APP_VERSION = '4.5.4';
    }

    // Single source of truth for updates history location.
    if (typeof global.APP_UPDATES_CSV_PATH !== 'string' || !global.APP_UPDATES_CSV_PATH.trim()) {
        global.APP_UPDATES_CSV_PATH = '/assets/version/updates.csv';
    }
})(window);
