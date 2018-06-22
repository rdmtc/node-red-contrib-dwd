const request = require('request');

const Moment = require('moment-timezone');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
moment.locale('de');

const dwd = {
    COLORS: {
        0: '#c5e566',
        1: '#b39ddb',
        2: '#ffeb3b',
        3: '#fb8c00',
        4: '#e53935',
        5: '#880e4f',
        10: '#cc99ff',
        20: '#fe68fe',
        30: '#c5e566'
    },
    LEVEL_ORDER: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        10: 1.5,
        20: 1.4
    },
    WARN_TYPES: {
        0: 'gewitter',
        1: 'sturm',
        2: 'regen',
        3: 'schnee',
        4: 'nebel',
        5: 'frost',
        6: 'glatteis',
        7: 'tauwetter',
        8: 'hitze',
        9: 'uv',
        10: 'kueste',
        11: 'binnensee'
    },
    WARN_COLORS_CLASS: {
        0: 'green',
        1: 'violet',
        2: 'yellow',
        3: 'orange',
        4: 'red',
        5: 'darkred',
        10: 'violet_hitze',
        20: 'violet_uv'
    },
    WARN_COLORS: {
        0: 'gelb',
        1: 'gelb',
        2: 'gelb',
        3: 'orange',
        4: 'rot',
        5: 'dunkelrot',
        10: 'violet_hitze',
        20: 'violet_uv'
    }
};

module.exports = function (RED) {
    class DwdNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.regionCode = config.region.split(' ')[0]; // eslint-disable-line prefer-destructuring
            this.on('input', () => {
                const now = (new Date()).getTime();

                request('http://www.dwd.de/DWD/warnungen/warnapp/json/warnings.json', (err, res) => {
                    if (err) {
                        return;
                    }
                    try {
                        const json = res.body.replace(/^warnWetter\.loadWarnings\(/, '').replace(/\);\s*$/, '');
                        // Console.log(json);
                        const warnings = JSON.parse(json).warnings[this.regionCode] || [];
                        let maxLevel = 0;
                        const events = [];
                        const html = [];
                        warnings.forEach((warning, i) => {
                            warnings[i].pre = (warning.start && (now < warning.start));
                            warnings[i].past = (warning.end && (now > warning.end));
                            warnings[i].active = !(warnings[i].pre || warnings[i].past);
                            warnings[i].typeName = dwd.WARN_TYPES[warning.type];
                            warnings[i].color = dwd.COLORS[warning.level];
                            warnings[i].order = dwd.LEVEL_ORDER[warning.level];
                            warnings[i].icon = 'http://www.dwd.de/DWD/warnungen/warnapp/viewer/img/warndreieck/warn_icons_' + dwd.WARN_TYPES[warning.type] + '.png';
                            warnings[i].frame = 'http://www.dwd.de/DWD/warnungen/warnapp/viewer/img/warndreieck/' + dwd.WARN_COLORS[warning.level] + '.png';
                            warnings[i].time = moment.utc(warning.start).tz('Europe/Berlin').format('ddd D. MMM H:mm');
                            if (warning.end) {
                                if (moment.utc(warning.start).tz('Europe/Berlin').day() === moment.utc(warning.end).tz('Europe/Berlin').day()) {
                                    warnings[i].time += ' - ' + moment.utc(warning.end).tz('Europe/Berlin').format('H:mm');
                                } else {
                                    warnings[i].time += ' - ' + moment.utc(warning.end).tz('Europe/Berlin').format('ddd D. MMM H:mm');
                                }
                            }
                            if (!warnings[i].past) {
                                if (warnings[i].order > maxLevel) {
                                    maxLevel = warnings[i].order;
                                }
                                events.push(warning.event);
                                html.push(`
<div class="dwd-warning-container">
    <div class="dwd-icon-container">
        <img class="dwd-icon" src="${warnings[i].icon}">   
        <img class="dwd-icon-frame" src="${warnings[i].frame}">
    </div>
    <div class="dwd-event">${warning.event}</div>
    <div class="dwd-time">${warning.time}</div>
    <div class="dwd-description">${warning.description}</div>
    <div class="dwd-instruction">${warning.instruction}</div>
</div>                             
                                `);
                            }
                        });

                        this.send({
                            payload: maxLevel,
                            count: warnings.length,
                            events: events.join(', '),
                            warnings,
                            html: html.join('\n')
                        });
                    } catch (err) {

                    }
                });
            });
        }
    }
    RED.nodes.registerType('dwd', DwdNode);
};
