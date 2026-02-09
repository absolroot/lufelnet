/**
 * 영어 공통 번역
 * 
 * English translations for common UI elements, navigation, buttons, messages, etc.
 * English key → English value structure (same keys as kr.js and jp.js)
 */

window.I18N_COMMON_EN = {
    // Site metadata
    site: {
        title: 'Persona 5: The Phantom X - LufelNet',
        description: 'Comprehensive guide for Persona 5: The Phantom X. Characters, Personas, skills, and strategy guides all in one place.',
        keywords: 'Persona 5 The Phantom X, P5X, LufelNet, Phantom Thieves, Persona, Revelations, Tactics, Game Guide',
        author: 'LufelNet'
    },

    // Footer
    footer: {
        disclaimer: '※ LufelNet is an unofficial Persona 5X information site created by individuals. The trademarks and copyrights of game content and materials belong to SEGA·ATLUS·Perfect World Games.',
        contactName: 'Root',
        reportLink: 'Report & Request'
    },

    // Homepage
    home: {
        languageNotice: '🌍 English translation is in progress. Some content may still be in Korean.',
        siteTitle: 'P5X Lufelnet',
        menuCharacter: 'Characters',
        menuPersona: 'Personas',
        menuRevelations: 'Revelations',
        menuTactic: 'Tactics',
        menuArticle: 'Guides',
        menuTier: 'Tiers',
        menuCharacterDescDesktop: 'Meet character development strategies<br>for higher scores and easier clears',
        menuCharacterDescMobile: 'Meet character development strategies',
        menuPersonaDescDesktop: 'Core persona recommendations<br>and skill settings for each persona',
        menuPersonaDescMobile: 'Core persona recommendations and skill settings',
        menuRevelationsDescDesktop: 'All revelation information at a glance!<br>Match by element and sun/moon/star as desired',
        menuRevelationsDescMobile: 'All revelation information at a glance!',
        menuTacticDescDesktop: 'Create and share your own tactics,<br>achieve high scores in sea and nightmare',
        menuTacticDescMobile: 'Create and share your own tactics',
        menuGoto: 'Go to',
        popularCharacters: 'Popular Characters',
        recentUpdates: 'Recent Updates',
        guides: 'Guides',
        guideCity: 'City Life',
        guideGrowth: 'Growth & Resources',
        guideBattle: 'Battle & Palace',
        tacticWorkshop: 'Tactic Library',
        showMore: 'Show More'
    },

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

    // Game terms (English key → English value) - for dynamic translation
    gameTerms: {
        // Basic stats
        hp: 'HP',
        maxHp: 'Max HP',
        maxHpUp: 'Max HP Up',
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

        // Other stats
        spRecovery: 'SP Recovery',
        resonance: 'Resonance',
        downdamage: 'Downed damage',
        naviPower: 'Eludi. Stat Buff',
        labor: 'Labor',
        myPalace: 'Thieves Den',
        gunShot: 'Gun Shot',

        // Weapon and awareness
        awareness: 'Awareness',
        exclusiveWeapon: 'Exclusive Weapon',
        weapon4star: '4 Star Weapon',
        weapon: 'Weapon',
        passive: 'Passive',

        // Persona and skill
        persona: 'Persona',
        skill: 'Skill',
        level: 'Level',
        stack: 'Stack',

        // Combat related
        allOutAttack: 'All-Out Attack',
        counterAttack: 'CounterAttack',
        taunt: 'Taunt',
        down: 'Down',
        theurgy: 'Theurgy',
        theurgyCharge: 'Theurgy Charge',
        dmgTaken: 'Damage Taken',
        hpCost: 'HP Cost',

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
        weaknessChange: 'Weakness Change',
        formChange: 'Form Change',
        skillMaster: 'Skill Master',
        damageAccumulation: 'Damage Accumulation',
        item: 'Item',
        tbd: 'TBD',

        // Mindscape
        mindscape: 'Mindscape',
        minds5: 'Mindscape5',

        // Revelation/Wonder
        revelation: 'Revelation',
        wonder: 'Wonder',
        common: 'Common',

        // Range
        aoe: 'AOE',
        single: 'Single',
        self: 'Self',

        // Resources
        ember: 'Meta Jewel',
        ticket: 'Platinum Ticket',
        paidEmber: 'Cognition Crystals',
        weaponTicket: 'Platinum Milicoin',
        cognigem: 'Cognigem',
        totalEmber: 'Total Jewel:',

        // ========================================
        // Aliases (for whitespace variations in Korean source)
        // ========================================
        hpAlt: 'HP',
        dmgBonusAlt: 'DMG Bonus(ATK Mult)',
        critRateAlt: 'Crit Rate',
        critMultAlt: 'Crit Mult',
        ailmentAccuracyAlt: 'Ailment Accuracy',
        effectResiAlt: 'Effect Resi',
        healingEffectAlt: 'Healing Effect',
        shieldEffectAlt: 'Shield Effect',
        spRecoveryAlt: 'SP Recovery',
        naviPowerAlt: 'Eludi. Stat Buff',
        resonanceAlt: 'Resonance',
        myPalaceRating: 'Thieves Den Rating',
        desperado: 'Desperado'
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

    // Turns
    turns: {
        '1turn': '1 Turn',
        '2turns': '2 Turns',
        '3turns': '3 Turns',
        '4turns': '4 Turns',
        '5turns': '5 Turns',
        '6turns': '6 Turns'
    },

    // Elements (English key → English value)
    elements: {
        almighty: 'Almighty',
        physical: 'Physical',
        gun: 'Gun',
        fire: 'Fire',
        ice: 'Ice',
        electric: 'Electric',
        wind: 'Wind',
        windIce: 'Wind/Ice',
        psy: 'Psychokinesis',
        nuclear: 'Nuclear',
        bless: 'Bless',
        curse: 'Curse',
        buff: 'Buff',
        debuff: 'Debuff',
        debuffAoe: 'AOE Debuff'
    },

    // Ailments (English key → English value)
    ailments: {
        burn: 'Burn',
        freeze: 'Freeze',
        shock: 'Shock',
        sleep: 'Sleep',
        forget: 'Forget',
        curse: 'Curse',
        windswept: 'Windswept',
        elementAilment: 'Element Ailment'
    },

    // Positions (English key → English value)
    positions: {
        medic: 'Medic',
        breaker: 'Saboteur',
        assassin: 'Assassin',
        guardian: 'Guardian',
        striker: 'Strategist',
        controller: 'Sweeper',
        navigator: 'Elucidator',
        autonomous: 'Virtuoso'
    },

    // Revelation
    revelation: {
        sun: 'Sun',
        moon: 'Moon',
        star: 'Star',
        sky: 'Sky',
        space: 'Space',
        sunMoonStarSky: 'Sun/Moon/Star/Sky',
        sms: 'S/M/S/P',

        // Revelation types
        common: 'Common',
        control: 'Control',
        departure: 'Departure',
        labor: 'Labor',
        resolve: 'Resolve',
        freedom: 'Freedom',
        triumph: 'Triumph',
        hope: 'Hope'
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
