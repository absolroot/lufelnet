/**
 * 영어 공통 번역
 * 
 * English translations for common UI elements, navigation, buttons, messages, etc.
 */

export default {
    // Navigation
    nav: {
        home: 'Home',
        character: 'Characters',
        persona: 'Persona',
        revelations: 'Revelations',
        tactic: 'Tactic',
        tier: 'Tier',
        about: 'About'
    },

    // Common buttons and actions
    common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'OK',
        close: 'Close',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        remove: 'Remove',
        reset: 'Reset',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        showMore: 'Show More',
        showLess: 'Show Less',
        copy: 'Copy',
        share: 'Share',
        download: 'Download',
        upload: 'Upload',
        submit: 'Submit',
        apply: 'Apply',
        clear: 'Clear'
    },

    // Date and time
    time: {
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        daysLeft: 'days left',
        daysAgo: 'days ago',
        hours: 'hours',
        minutes: 'minutes',
        seconds: 'seconds'
    },

    // Game terms (from i18n-utils.js)
    gameTerms: {
        // Basic stats
        hp: 'HP',
        maxHp: 'Max HP',
        attack: 'Attack',
        defense: 'Defense',
        speed: 'Speed',

        // Damage related
        dmgBonus: 'DMG Bonus(ATK Mult)',
        critRate: 'Crit Rate',
        critMult: 'Crit Mult',
        pierce: 'Pierce Rate',
        defReduction: 'Defense Reduction',

        // Effect related
        ailmentAccuracy: 'Ailment Accuracy',
        effectResi: 'Effect Resi',
        healing: 'Healing',
        healingEffect: 'Healing Effect',
        shieldEffect: 'Shield Effect',
        dmgReduction: 'Damage Reduction',

        // Other
        spRecovery: 'SP Recovery',
        resonance: 'Resonance',
        naviPower: 'Navi Power',
        labor: 'Labor',
        myPalace: 'Thieves Den',

        // Weapon and awareness
        awareness: 'Awareness',
        exclusiveWeapon: 'Exclusive Weapon',
        weapon: 'Weapon',
        passive: 'Passive',

        // Persona and skill
        persona: 'Persona',
        skill: 'Skill',
        level: 'Level',
        stack: 'Stack',

        // Combat
        allOutAttack: 'All-Out Attack',
        counterAttack: 'CounterAttack',
        taunt: 'Taunt',
        down: 'Down',
        theurgy: 'Theurgy',

        // Elements
        fire: 'Fire',
        ice: 'Ice',
        electric: 'Electric',

        // Status ailments
        burn: 'Burn',
        freeze: 'Freeze',
        shock: 'Shock',
        sleep: 'Sleep',
        forget: 'Forget',
        curse: 'Curse',
        windswept: 'Windswept',

        // Buffs/Debuffs
        buff: 'Buff',
        debuff: 'Debuff',
        blessing: 'Blessing',
        shield: 'Shield',

        // Other effects
        dot: 'DOT',
        dotRecovery: 'DOT Recovery',
        revive: 'Revive',
        transform: 'Transform',
        charge: 'Charge',
        additionalTurn: 'Additional Turn',

        // Mindscape
        mindscape: 'Mindscape',
        minds5: 'Minds 5',

        // Revelation
        revelation: 'Revelation',
        wonder: 'Wonder',

        // Turns
        '1turn': '1 Turn',
        '2turns': '2 Turns',
        '3turns': '3 Turns',
        '4turns': '4 Turns',
        '5turns': '5 Turns',
        '6turns': '6 Turns',

        // Range
        aoe: 'AOE',
        single: 'Single',
        self: 'Self'
    },

    // Awareness levels
    awarenessLevel: {
        a0: 'A0',
        a1: 'A1',
        a2: 'A2',
        a3: 'A3',
        a4: 'A4',
        a5: 'A5',
        a6: 'A6'
    },

    // Weapon refinement
    refinement: {
        r0: 'R0',
        r1: 'R1',
        r2: 'R2',
        r3: 'R3',
        r4: 'R4',
        r5: 'R5',
        r6: 'R6',
        enhanced: '(Enhanced)'
    },

    // Revelation
    revelation: {
        sun: 'Sun',
        moon: 'Moon',
        star: 'Star',
        sky: 'Sky',
        space: 'Space',
        sunMoonStarSky: 'S/M/S/P',

        // Revelation types
        common: 'Common',
        control: 'Control',
        departure: 'Departure',
        labor: 'Labor',
        resolve: 'Resolve',
        freedom: 'Freedom',
        triumph: 'Triumph',
        hope: 'Hope',
        desperado: 'Desperado'
    },

    // Error messages
    errors: {
        loadFailed: 'Failed to load data.',
        saveFailed: 'Failed to save.',
        networkError: 'Network error occurred.',
        invalidInput: 'Invalid input.',
        notFound: 'Data not found.',
        accessDenied: 'Access denied.',
        unknownError: 'An unknown error occurred.'
    },

    // Success messages
    success: {
        saved: 'Saved successfully.',
        deleted: 'Deleted successfully.',
        copied: 'Copied to clipboard.',
        updated: 'Updated successfully.'
    },

    // Confirmation messages
    confirm: {
        delete: 'Are you sure you want to delete?',
        reset: 'Are you sure you want to reset?',
        unsavedChanges: 'You have unsaved changes. Do you want to continue?'
    },

    // Labels
    labels: {
        total: 'Total',
        count: '',
        unitPerson: 'person(s)',
        unitTime: 'time(s)',
        unitDay: 'day(s)',
        required: 'Required',
        optional: 'Optional',
        recommended: 'Recommended',
        new: 'New',
        hot: 'Hot',
        updated: 'Updated'
    }
};
