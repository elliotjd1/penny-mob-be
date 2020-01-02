const _ = require('lodash');
const Location = require('../src/model/location');
const Action = require('../src/model/action');
const ResourceModifier = require('../src/model/resourceModifier');
const InfluenceModifier = require('../src/model/influenceModifier');


class DataLoader {
    constructor () {
        this.locations = {
            merchantDistrict: new Location('merchantDistrict', 'Merchant District', 'Guid gear comes in sma\' bulk', 30, [539,628,885,751]),
            retailDistrict: new Location('retailDistrict', 'Retail District', 'Guid gear comes in sma\' bulk', 30, [893,528,1119,695]),
            financialDistrict: new Location('financialDistrict', 'Financial District', 'Guid gear comes in sma\' bulk', 30, [745,759,744,952,915,955,916,704,893,704,890,756]),
            cotstoun: new Location('cotstoun', 'Cotstoun', 'Haud yer wheesht!', 30, [81,118,81,361,441,361,441,301,298,297,298,116]),
            broomhill: new Location('broomhill', 'Broomhill', 'Haud yer wheesht!', 30, [77,369,77,608,323,603,322,420,443,419,443,367]),
            dovanhill: new Location('dovanhill', 'Dovanhill', 'Haud yer wheesht!', 30, [338,429,332,606,250,608,247,691,521,695,524,608,499,608,496,430]),
            anniesland: new Location('anniesland', 'Anniesland', 'Haud yer wheesht!', 30, [120,756,119,952,524,955,523,836,233,834,235,758]),
            kelvingrovePark: new Location('kelvingrovePark', 'Kelvingrove Park', 'Ah dinnae ken', 30, [248,701,524,824]),
            dumbreck: new Location('dumbreck', 'Dumbreck', 'Ah dinnae ken', 30, [120,967,438,1366]),
            govan: new Location('govan', 'Govan', 'Ah dinnae ken', 30, [538,763,734,960]),
            pollokshields: new Location('pollokshields', 'Pollokshields', 'Ah dinnae ken', 30, [632,974,950,1095]),
            clarkston: new Location('clarkston', 'Clarkston', 'A nod\'s as guid as a wink tae a blind horse!', 30, [451,972,448,1196,734,1201,732,1103,619,1100,619,970]),
            shawlands: new Location('shawlands', 'Shawlands', 'You\'re a wee scunner!', 30, [745,1102,742,1451,1051,1447,1053,1173,965,1173,963,1103]),
            tollcross: new Location('tollcross', 'Tollcross', 'I\'m going ta skelp yer wee behind!', 30, [925,703,1114,950]),
            dennistoun: new Location('dennistoun', 'Dennistoun', 'Whit\'s fur ye\'ll no go past ye', 30, [1126,640,1498,779]),
            barrowland: new Location('barrowland', 'Barrowland', 'You\'re a long time deid', 30, [1327,454,1792,630]),
            parkhead: new Location('parkhead', 'Parkhead', 'She\'s up to high doh', 30, [1121,788,1121,950,1161,952,1166,1052,1496,1052,1493,786]),
            dalmarnock: new Location('dalmarnock', 'Dalmarnock', 'A pritty face suits the dish-cloot', 30, [1505,640,1505,1009,1646,1009,1651,871,1770,869,1767,643]),
            possilpark: new Location('possilpark', 'Possilpark', 'Awa\' an bile yer heid', 30, [891,351,890,515,1124,513,1126,626,1310,631,1312,356]),
            marryhill: new Location('marryhill', 'Marryhill', 'Don\'t be a wee clipe!', 30, [511,475,509,593,538,595,538,613,880,618,880,477]),
            clydebank: new Location('clydebank', 'Clydebank', 'Yer bum\'s oot the windae!', 30, [458,244,458,414,511,415,508,462,685,464,684,179,564,179,561,248]),
            bishopbriggs: new Location('bishopbriggs', 'Bishopbriggs', 'Lang may yer lum reek!', 30, [697,184,694,462,882,462,885,341,930,341,930,261,845,263,842,183]),
            dumbartonshire: new Location('dumbartonshire', 'Dumbartonshire', 'Yer aff yer heid!', 30, [567,33,566,164,692,168,694,179,792,178,798,32]),
        }
        this.mobNames = [
            `Mobbo`,
            `Gregor's Gits`,
            `The Lads`,
            `Pollokshields Pillocks`,
            `Briggy Bishops`,
            `Barrow Wights`,
        ]
        this.loadLocationActions();
    }

    loadLocationActions () {
        const spreadInfluence = new Action('spreadInfluence', 'Grease Some Palms', 'Spend a little loot to gain some influence.');
        spreadInfluence.sourceMods.push(new InfluenceModifier(5));
        spreadInfluence.sourceMods.push(new ResourceModifier({lootMod: -1}));
    
        const pettyTheft = new Action('pettyTheft', 'Petty Theft', 'Nick a few odds and ends while no one\'s looking.');
        pettyTheft.sourceMods.push(new ResourceModifier({lootMod: 5}));
    
        _.each(this.locations, loc => {
            loc.addAction(spreadInfluence);
            loc.addAction(pettyTheft);
        });
    }

    getRandomMobName (currentNames) {
        const remainingNames = this.mobNames.filter(name => !currentNames.includes(name));
        if (remainingNames.length == 0) {
            console.log('WARNING: Implement more mob names!');
            return 'ShiteName';
        }
        return _.sample(remainingNames);
    }
}


module.exports =  DataLoader;
