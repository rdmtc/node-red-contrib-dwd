# node-red-contrib-dwd

[![NPM version](https://badge.fury.io/js/node-red-contrib-dwd.svg)](http://badge.fury.io/js/node-red-contrib-dwd)
[![dependencies Status](https://david-dm.org/hobbyquaker/node-red-contrib-dwd/status.svg)](https://david-dm.org/hobbyquaker/node-red-contrib-dwd)
[![Build Status](https://travis-ci.org/hobbyquaker/node-red-contrib-dwd.svg?branch=master)](https://travis-ci.org/hobbyquaker/node-red-contrib-dwd)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Node-RED Nodes zum abfragen von Wetterwarnungen des Deutschen Wetterdienstes (DWD)

__These Nodes are only useful if you're interested in weather warnings for Germany, can't be used in other countries.__


#### `msg` Attribute

* `payload` - Maximale Warnstufe aktueller Warnungen
* `count` -  Anzahl der Warnungen
* `events` - Kommagetrennte Aufzählungen der Warnungs-Kategorien
* `warnings` - Array mit den detaillierten Daten der Warnungen
* `html` - HTML zur Anzeige im Dashboard


#### Dashboard Template

```html
<style>
    .dwd-icon-container {
        display: inline-block;    
    }
    .dwd-event {
        display: inline-block;
        vertical-align: 60px;
        font-weight: bold;
        padding-left: 20px;
    }
    .dwd-icon, .dwd-icon-frame {
        position: absolute;
    }
    .dwd-icon-container, .dwd-icon, .dwd-icon-frame {
        width: 100px;
        height: 100px;
    }
    .dwd-time {
        color: grey;
    }
    
</style>
<div ng-bind-html="msg.html"></div>
```


## License

MIT (c) Sebastian Raff

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE
