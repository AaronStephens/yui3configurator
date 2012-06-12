// Quick and dirty platform/os sniff, used only to influence non-critical
// design elements in CSS.
(function () {
    var ua       = navigator.userAgent,
        os       = '',
        platform = '';

    if (/windows/i.test(ua)) {
        platform = 'pc';
        os       = 'win';
    } else if (/macintosh/i.test(ua)) {
        platform = 'mac';
        os       = 'osx';
    } else if (/ios/i.test(ua)) {
        os = 'ios';

        if (/(?:iphone|ipod)/i.test(ua)) {
            platform = 'iphone mac';
        } else if (/ipad/i.test(ua)) {
            platform = 'ipad mac';
        }
    } else if (/linux/i.test(ua)) {
        if (/android/i.test(ua)) {
            platform = 'android pc';
        } else {
            platform = 'pc';
        }

        os = 'linux';
    }

    document.documentElement.className += ' ' + platform + ' ' + os;
}());


YUI().use('node', 'event-key', 'array-extras', function (Y) {

    var allModules,
        modulesHash = {},
        modulesListEl,
        selectedListEl,
        allRollups = {},
        selectedModules = {},
        calculatedModules,
        combo = true,
        chart
        oeach = Y.each;

    // Data callback function
    function handleModuleData() {
        allModules = [];
        oeach(Y.Env._loader.moduleInfo, function (m) {
            if (m.name && m.name.indexOf('lang/') < 0) {
                allModules.push(m);
            }
        });
        allModules.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
        createLists();
    }

    // Creates UL of all YUI modules
    function createLists() {
        var el1 = [],
            el2 = [],
            inputs;

        // Iterate over all modules
        oeach(allModules, function(v) {
            var name = v.name,
                isRollup = !!v.use;

            // Create LI, one for each UL
            el1.push('<li id="'+v.name+'"'+(isRollup?'class="rollup"':'')+'><a href="#">'+
            v.name+(isRollup?
            ' rollup (includes '+v.use.toString().replace(/,/g, ', ')+')':
            '')+'</a></li>');

            el2.push('<li id="sel-'+v.name+'"'+'class="unselected'+(isRollup?' rollup"':'"')+'><a href="#">'+
            v.name+(isRollup?
            ' (rollup includes '+v.use.toString().replace(/,/g, ', ')+')':
            '')+'</a></li>');

            // Store rollups separately
            if (isRollup) {
                allRollups[name] = v;
            }

            // Store modules in hash for easy access
            modulesHash[name] = v;
        });
        el1 = el1.join('');
        el2 = el2.join('');

        // Update DOM
        modulesListEl = Y.one('#allModules .bd').setContent('<ul id="allModulesList">'+el1+'</ul>');
        selectedListEl = Y.one('#selectedModules .bd').setContent('<ul id="selectedModulesList">'+el2+'</ul>');

        // Bind events
        modulesListEl.delegate('click', toggleModule, 'li');
        selectedListEl.delegate('click', toggleModule, 'li');
        Y.one('#filter').on('change', generateOutput);
        Y.all('#configOpts input[type=text]').on('change', generateOutput);
    };

    // Selects or unselects module based on previous state
    function toggleModule(e) {
        e.preventDefault();
        var el = e.currentTarget,
            module = el.get('id').replace(/sel-/, '');

        (Y.one('#sel-'+module).hasClass('unselected')) ? selectModule(module) : unselectModule(module);

        // Loader output
        generateOutput();
    }

    // Updates state and UI based on selection
    function selectModule(module) {
        // Select all modules in a rollup
        if (allRollups[module]) {
            oeach(allRollups[module].use, function(v) {
                //selectModule(v);
            });
        }

        selectedModules[module] = true;
        Y.one('#'+module).addClass('selected');
        Y.one('#sel-'+module).removeClass('unselected');
    }

    // Updates state and UI based on unselection
    function unselectModule(module) {
        // Unselect all modules in a rollup
        if (allRollups[module]) {
            oeach(allRollups[module].use, function(v) {
                unselectModule(v);
            });
        }

        // Unselecting one module of a rollup
        // should unselect the rollup
        oeach(allRollups, function(r) {
            oeach(r.use, function(m) {
                if (module === m) {
                    Y.one('#'+r.name).removeClass('selected');
                    Y.one('#sel-'+r.name).addClass('unselected');
                    delete selectedModules[r.name];
                }
            });
        });

        delete selectedModules[module];
        Y.one('#'+module).removeClass('selected');
        Y.one('#sel-'+module).addClass('unselected');
    }

    // Resets output to initial state
    function resetOutput() {
        Y.one('#loaderOutput').setContent('&lt;!--Copy/paste from here--&gt;');
        Y.one('#calculatedModules .bd').empty(true);
        Y.all('#get_js,#get_css').set('href', 'javascript:void(0);').replaceClass('button','disabled-button');
    }

    // Generates output based on selected modules
    function generateOutput(ev) {
        if (ev && ev.type === 'keyup' && ev.keyCode !== 13/*enter*/ && ev.keyCode !== 9/*tab*/) {
            return;
        }
        if (!Y.Object.isEmpty(selectedModules)) {
            var module,
                modules = [],
                loader,
                hrefs,
                css = '&lt;!-- CSS --&gt;\n',
                js = '\n\n&lt;!-- JS --&gt;\n',
                modList = '<ol id="calculatedModules">',
                i = 0,
                filter = Y.one('#filter').get('value'),
                skin = {},
                skin_order = Y.one('#skin_order').get('value'),
                skin_override = Y.one('#skin_override').get('value');

            skin_order = skin_order.replace(/^(|)$/, '').replace(/[^a-z0-9-_,]/ig, '').replace(/\s/g, '').split(',');
            if (skin_order.length) {
                skin.order = skin_order.join(',');
            }
            skin_override = skin_override.replace(/^(|)$/, '').replace(/[^a-z0-9-_,:;]/i, '').replace(/\s/g, '').split(';');
            if (skin_override.length) {
                skin.overrides = Y.Array.reduce(skin_override, {}, function (prev, curr, i, a) {
                    curr = curr.split(':');
                    if (curr.length === 2) {
                        prev[curr[0]] = curr[1].split(',');
                    }
                    return prev;
                });
            }

            oeach(selectedModules, function(v, k) {
                modules.push(k);
            });

            loader = new Y.Loader({
                combine: true,
                comboBase: Y.config.comboBase,
                skin: skin,
                groups: Y.config.groups,
                root: Y.config.root,
                require: modules,
                filter: Y.one('#filter').get('value'),
                ignoreRegistered: true // force loader to include modules already on the page
            });
            loader.loadOptional = false;

            hrefs = loader.resolve(true);
            calculatedModules = loader.sorted;

            if (hrefs.js.length && hrefs.js[0].replace(/^[^?]+\?/,'')) {
                js += '&lt;script type="text/javascript" src="' + hrefs.js + '"&gt;&lt;/script&gt;';
                Y.one('#get_js').set('href', hrefs.js).replaceClass('disabled-button','button');

            }
            if (hrefs.css.length && hrefs.css[0].replace(/^[^?]+\?/,'')) {
                css += '&lt;link rel="stylesheet" type="text/css" href="' + hrefs.css + '"&gt;';
                Y.one('#get_css').set('href', hrefs.css).replaceClass('disabled-button','button');
            }

            Y.one('#loaderOutput').setContent(css + js);

            // Update calculated modules list
            for (i = 0; i < calculatedModules.length; i++) {
                module = calculatedModules[i];
                modList += '<li>' + module + '</li>';
            }
            modList += '</ol>';
            Y.one('#calculatedModules .bd').setContent(modList);
        }
        else {
            resetOutput();
        }
    }

    handleModuleData();
});