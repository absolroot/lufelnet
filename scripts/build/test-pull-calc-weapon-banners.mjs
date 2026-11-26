import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({
    console,
    document: { addEventListener() {} },
    window: {}
});
vm.runInContext(fs.readFileSync(new URL('../../apps/pull-calc/pull-calc.js', import.meta.url), 'utf8'), context);
const planner = vm.runInContext('Object.create(PullSimulator.prototype)', context);
planner.charPityStats = { median: 110 };
planner.weaponPityStats = { median: 70 };
planner.income = { recursive: false };
planner.pity = {
    charPity: 10,
    weaponPity: 20,
    targetedWeaponPity: 30,
    weapon5050Failed: true,
    weaponScenario: 'worst'
};

planner.targets = [
    { characterTarget: 'A0', weaponTarget: 'None', weaponBanner: 'targeted' },
    { characterTarget: 'A0', weaponTarget: 'R0' },
    { characterTarget: 'A0', weaponTarget: 'R0', weaponBanner: 'targeted' },
    { characterTarget: 'A0', weaponTarget: 'R1', weaponBanner: 'targeted' },
    { characterTarget: 'A0', weaponTarget: 'R0', weaponBanner: 'chance' },
    { characterTarget: 'A0', weaponTarget: 'R2', weaponBanner: 'targeted' }
];
const costs = Array.from(planner.calculateTargetCosts());
assert.deepEqual(costs.map(cost => cost.charCost), [15000, 16500, 16500, 16500, 16500, 16500]);
assert.deepEqual(costs.map(cost => cost.weaponCost), [0, 5000, 6500, 19000, 14000, 19000]);
assert.deepEqual(costs.map(cost => cost.weaponMaterials), [0, 0, 0, 0, 0, 1]);
assert.deepEqual(planner.targets.map(target => target.cost), [15000, 21500, 23000, 35500, 30500, 35500]);

const wallet = vm.runInContext('new Wallet(0, 110, 0, 40, 0)', context);
const spend = planner.simulateWalletSpend(wallet, costs[2]);
assert.equal(spend.weapon.result.used.weaponTicket, 40);
assert.equal(spend.weapon.result.shortage, 2500);
assert.equal(spend.remainingWallet.weaponTicket, -25);

planner.income.recursive = true;
assert.equal(planner.calculateWeaponCost('R1', true, 'targeted'), 16000);
assert.equal(planner.calculateWeaponCost('R0', true, 'chance'), 4570);
planner.pity.targetedWeaponPity = 95;
assert.equal(planner.calculateWeaponCost('R0', true, 'targeted'), 100);
delete planner.pity.targetedWeaponPity;
assert.equal(planner.calculateWeaponCost('R0', true, 'targeted'), 9500);

planner.isSeaServer = true;
assert.equal(planner.calculateTargetCosts()[2].weaponBanner, 'chance');

const pendingImages = [];
context.Image = class {
    set src(_url) { pendingImages.push(() => this.onload()); }
};
const canvas = { getContext: () => ({}) };
context.document.getElementById = id => id === 'balanceChart' ? canvas : null;
vm.runInContext(fs.readFileSync(new URL('../../apps/pull-calc/pull-calc-graph.js', import.meta.url), 'utf8'), context);
const chartBalances = [];
planner.formatDateShort = () => '2026-11-26';
planner.createChartWithImages = (_ctx, _labels, balances) => chartBalances.push(balances[0]);
planner.balanceHistory = [{ balance: 9500, charNames: ['first'] }];
planner.renderChart();
planner.balanceHistory = [{ balance: 6500, charNames: ['second'] }];
planner.renderChart();
pendingImages.reverse().forEach(load => load());
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(chartBalances, [6500]);

console.log('PASS: independent weapon pity, legacy Chance, guaranteed budgets, refinement materials, wallet spending, and latest chart render');
