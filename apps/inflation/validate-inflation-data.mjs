#!/usr/bin/env node

import process from 'process';
import {
  PROJECT_ROOT,
  loadDataContext,
  validateInflationData
} from './inflation-data-utils.mjs';

const windowData = loadDataContext(PROJECT_ROOT);
const result = validateInflationData(windowData.InflationData || {}, {
  characterData: windowData.characterData || {},
  releaseScheduleData: windowData.ReleaseScheduleData || {}
});

if (!result.ok) {
  console.error(`Inflation data validation failed (${result.errors.length} errors):`);
  result.errors.forEach((error) => {
    console.error(`- ${error.message}`);
  });
  process.exit(1);
}

console.log(`Inflation data validation passed (${result.entryCount} entries, ${result.teamCount} teams).`);
