/**
 * Shared mutually exclusive rules for defense-related calculators.
 *
 * category:
 * - defense: defense reduce items
 * - pierce: penetrate items
 */
const defenseMutuallyExclusiveRules = [
    { ids: ['14', '14-2'], priority: '14', category: 'defense' }, // 후타바
    { ids: ['katayama1', 'katayama2'], priority: 'katayama1', category: 'defense' }, // 카타야마
    { ids: ['16', '17'], priority: '16', category: 'defense' }, // 루우나
    { ids: ['19-1', '19-2', '20'], priority: '20', category: 'defense' }, // 루우나
    { ids: ['mio2', 'mio3'], priority: 'mio3', category: 'defense' }, // 미오
    { ids: ['masaki1', 'masaki2'], priority: 'masaki1', category: 'pierce' }, // 마사키
];
