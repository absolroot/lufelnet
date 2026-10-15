import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// Run with: node --experimental-vm-modules scripts/build/test-tactic-persona-slots.mjs
const storage = new Map();
const context = vm.createContext({
    console,
    window: { personaFiles: {}, personaSkillList: {}, characterData: {} },
    localStorage: {
        getItem: key => storage.get(key) || null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: key => storage.delete(key)
    }
});
const modules = new Map();
function moduleAt(file) {
    file = path.resolve(file);
    if (!modules.has(file)) {
        modules.set(file, new vm.SourceTextModule(fs.readFileSync(file, 'utf8'), {
            context, identifier: file
        }));
    }
    return modules.get(file);
}
async function load(file) {
    const module = moduleAt(file);
    await module.link((specifier, parent) => moduleAt(path.resolve(path.dirname(parent.identifier), specifier)));
    await module.evaluate();
    return module.namespace;
}
const { TacticStore } = await load('apps/tactic-maker/js/store.js');
const { WonderUI } = await load('apps/tactic-maker/js/ui-wonder.js');
const { ImportExport } = await load('apps/tactic-maker/js/import-export.js');
const { TacticUI } = await load('apps/tactic-maker/js/ui-tactic.js');
const { getApplicableBuffItems } = await load('apps/tactic-maker/js/need-stat-data.js');
context.DataLoader = moduleAt('apps/tactic-maker/js/data-loader.js').namespace.DataLoader;
context.window.DataLoader = context.DataLoader;
const plain = value => JSON.parse(JSON.stringify(value));
const store = new TacticStore();
assert.ok(store.state.wonder.personas.every(p => p.skills.length === 5));
const oldSkills = ['innate', 'first', 'second', 'third'];
store.loadData({ wonder: { personas: [{ name: 'old', skills: oldSkills, memo: 'keep' }] }, turns: [] });
assert.deepEqual(plain(store.state.wonder.personas[0].skills), [...oldSkills, '']);
assert.equal(store.state.wonder.personas[0].memo, 'keep');
assert.deepEqual(oldSkills, ['innate', 'first', 'second', 'third']);
const config = plain(store.state.wonder);
config.personas[0].skills[4] = 'fourth';
store.setWonderConfig(config);
assert.equal(store._getWonderLastSkill(config.personas[0]), 'fourth');
store.undo();
assert.equal(store.state.wonder.personas[0].skills[4], '');
store.redo();
assert.equal(store.state.wonder.personas[0].skills[4], 'fourth');
const io = Object.assign(Object.create(ImportExport.prototype), { store });
const exported = plain(io.generateExportData());
store.loadData(exported);
assert.equal(store.state.wonder.personas[0].skills[4], 'fourth');
storage.set(store.autoSaveKey, JSON.stringify(exported));
store.loadFromLocalStorage();
assert.equal(store.state.wonder.personas[0].skills[4], 'fourth');
const legacy = plain(io.generateLegacyExportData());
assert.equal(legacy.personaSkills.length, 9);
const parsed = io.parseRawFormat(legacy);
store.loadData(parsed);
assert.deepEqual(plain(store.state.wonder.personas[0].skills), [...oldSkills, 'fourth']);
delete legacy.personaSkillSlots;
store.loadData(io.parseRawFormat(legacy));
assert.deepEqual(plain(store.state.wonder.personas[0].skills), ['innate', 'first', 'second', '', '']);
store.loadData(io.parseCompressedFormat({ w: ['old'], ps: ['innate', 'first', 'second'], p: [], t: [] }));
assert.deepEqual(plain(store.state.wonder.personas[0].skills), ['innate', 'first', 'second', '', '']);
const ui = Object.assign(Object.create(WonderUI.prototype), { baseUrl: '', store, render() {} });
const html = ui.renderPersonaCard(0, config.personas[0]);
assert.equal((html.match(/class="revelation-dropdown wp-skill-dropdown"/g) || []).length, 4);
assert.ok(html.includes('data-skill-index="4"'));
const tacticUI = Object.assign(Object.create(TacticUI.prototype), { baseUrl: '', store });
store.setWonderConfig(config);
assert.ok(tacticUI.getActionOptions({ type: 'wonder', name: '원더' }).some(option => option.value === 'fourth'));
context.window.personaFiles.old = { uniqueSkill: { name: 'innate' }, passive_skill: [{ name: 'passive' }] };
assert.equal(tacticUI.getFirstActivePersonaSkill({ name: 'old', skills: ['innate', 'passive', '', '', 'fourth'] }), 'fourth');
context.window.criticalBuffData = { '원더': [{ skillName: '리벨리온' }] };
store.state.wonder.personas[0].skills[4] = '리벨리온';
assert.ok(getApplicableBuffItems(store).some(item => item.skillName === '리벨리온'));
store.state.wonder.personas[0].skills[4] = 'fourth';
store.state.turns = [{ turn: 1, columns: { mystery: [{ character: '원더', action: 'fourth', wonderPersonaIndex: 0 }] } }];
store._smartUpdateWonderGlobal(0, config.personas[0], { name: 'new', skills: ['unique', 'a', 'b', 'c', 'd'] });
assert.equal(store.state.turns[0].columns.mystery[0].action, 'd');
store._smartUpdateWonderGlobal(0, { name: 'new', skills: ['d'] }, { name: 'older', skills: ['unique', 'a', 'b', 'c', ''] });
assert.equal(store.state.turns[0].columns.mystery[0].action, 'c');
ui.activePersonaIndex = 0;
ui.handlePersonaSelect('new');
assert.deepEqual(plain(store.state.wonder.personas[0].skills), ['', '', '', '', '']);
store.clearAll();
assert.ok(store.state.wonder.personas.every(p => p.skills.length === 5));
vm.runInContext(fs.readFileSync('data/characters/이치고·여름/skill.js', 'utf8'), context);
for (const key of ['characterSkillsData', 'enCharacterSkillsData', 'jpCharacterSkillsData', 'cnCharacterSkillsData']) {
    assert.equal(context.window[key]['이치고·여름'].skill3.element, '치료');
    assert.equal(context.window[key]['이치고·여름'].skill_highlight.element, '버프');
}
assert.equal(tacticUI.getSkillElementIcon('이치고·여름', 'skill3'), '/assets/img/skill-element/치료.png');
for (const file of ['apps/tactic-maker/js/store.js', 'apps/tactic-maker/js/ui-wonder.js', 'apps/tactic-maker/js/import-export.js', 'data/characters/이치고·여름/skill.js']) {
    const bytes = fs.readFileSync(file);
    assert.notEqual(bytes.subarray(0, 3).toString('hex'), 'efbbbf');
    assert.ok(!bytes.toString('utf8').includes('�'));
}
console.log('PASS: four configurable slots, old/new persistence, legacy formats, undo/redo, action options, persona switching, reset, and four-language healing icons');
