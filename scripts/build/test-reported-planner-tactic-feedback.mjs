import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// Run with node --experimental-vm-modules.
const context = vm.createContext({
    console,
    window: {},
    document: { addEventListener() {} }
});
vm.runInContext(fs.readFileSync('data/character_info.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('apps/pull-calc/pull-calc.js', 'utf8'), context);
const simulator = vm.runInContext('Object.create(PullSimulator.prototype)', context);
let saved;
simulator.saveData = () => { saved = JSON.parse(JSON.stringify(simulator.targets)); };
simulator.getLang = () => 'jp';
simulator.targets = [{ name: '렌·스타 나이트', date: '2027-01-01', characterTarget: 'A3', extraEmber: 123 }];
simulator.reconcileRenamedTargets();
assert.equal(saved[0].name, '렌·댄싱 스타');
assert.equal(saved[0].characterTarget, 'A3');
assert.equal(saved[0].extraEmber, 123);
assert.equal(simulator.getCharacterName(saved[0].name), '雨宮 蓮・スターナイト');
simulator.targets.push({ name: '렌·스타 나이트', date: '2027-01-01', characterTarget: 'A0' });
simulator.targets.push({ name: '모르가나·스타 나이트', date: '2027-02-01', characterTarget: 'A1' });
simulator.reconcileRenamedTargets();
assert.equal(simulator.targets.length, 2);
assert.equal(simulator.targets[0].characterTarget, 'A3');
assert.equal(simulator.targets[1].name, '모르가나·댄싱 스타');
simulator.updateTimelineSelection = () => {};
simulator.recalculate = () => {};
simulator.toggleTarget('렌·댄싱 스타', '5.1.1', '2027-01-01');
assert.equal(simulator.targets.length, 1, 'Clicking the migrated selection removes it instead of duplicating it');
simulator.reconcileRenamedTargets();
assert.equal(simulator.targets.length, 1, 'Migration is idempotent');

const modules = new Map();
function moduleAt(file) {
    file = path.resolve(file);
    if (!modules.has(file)) modules.set(file, new vm.SourceTextModule(fs.readFileSync(file, 'utf8'), { context, identifier: file }));
    return modules.get(file);
}
async function load(file) {
    const module = moduleAt(file);
    await module.link((specifier, parent) => moduleAt(path.resolve(path.dirname(parent.identifier), specifier)));
    await module.evaluate();
    return module.namespace;
}
const { DataLoader } = await load('apps/tactic-maker/js/data-loader.js');
context.DataLoader = DataLoader;
context.window.DataLoader = DataLoader;
const { TacticUI } = await load('apps/tactic-maker/js/ui-tactic.js');
const ui = Object.assign(Object.create(TacticUI.prototype), { baseUrl: '', store: { state: { party: [], wonder: { personas: [] } } } });
for (const actor of ['후카', '리코', '마나카', '미유']) {
    assert.equal(ui.getPreferredCrossTurnAction(actor), '스킬1', actor);
}
assert.ok(ui.getActionOptions({ type: 'party', name: '후카' }).some(option => option.value === 'Theurgia'), 'Fuuka Theurgia remains selectable');
assert.equal(ui.getPreferredCrossTurnAction('렌'), 'HIGHLIGHT');
assert.equal(ui.getPreferredCrossTurnAction('미츠루'), 'Theurgia');
for (const file of ['apps/pull-calc/pull-calc.js', 'apps/tactic-maker/js/ui-tactic.js']) {
    assert.notEqual(fs.readFileSync(file).subarray(0, 3).toString('hex'), 'efbbbf');
}
console.log('PASS: saved-name migration, Japanese display, deduplication, selection toggle, and cross-column action defaults');
