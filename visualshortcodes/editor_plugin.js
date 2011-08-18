(function(){
    tinymce.create( 'tinymce.plugins.visualShortcodes', {
        init : function( ed, url ){
            this.counter = 0;
            var t = this,
                i,
                shortcode,
                names = [];
            t.url = url;

            t._shortcodes = tinymce.i18n['visualShortcode.shortcodes'];
            if( !t._shortcodes || undefined === t._shortcodes.length || 0 == t._shortcodes.length ){
                return;
            }
            t.shortcodes = {};
            for( i = 0, shortcode = t._shortcodes[i]; i < t._shortcodes.length; shortcode = t._shortcodes[++i]){
                if(undefined === shortcode.shortcode || '' == shortcode.shortcode || undefined === shortcode.image || '' == shortcode.image){
                    continue;
                }
                t.shortcodes[shortcode.shortcode] = shortcode;
                names.push(shortcode.shortcode);
            }
            if( names.length < 1 ){
                return;
            }

            t._buildRegex( names );

            t._createButtons();

            ed.onMouseDown.add(function( ed, e ){
                if( e.target.nodeName == 'IMG' && ed.dom.hasClass(e.target, 'jpbVisualShortcode')){
                    var imgID = e.target.id.replace( /^vscImage\d+-(.+)$/, '$1' );
                    if( undefined !== t.shortcodes[imgID] && undefined !== t.shortcodes[imgID].command ){
                        ed.plugins.wordpress._showButtons(e.target, 'jpb_vscbuttons');
                    } else {
                        ed.plugins.wordpress._showButtons(e.target, 'jpb_vscbutton');
                    }
                } else {
                    t._hideButtons();
                }
            });

			ed.onChange.add(function(ed, o){
				if( !t.regex.test(o.content)){
					return;
				}
				o.content = t._doScImage( o.content );
				ed.setContent(o.content);
				ed.execCommand('mceRepaint');
			});

            ed.onBeforeSetContent.add(function(ed, o){
                o.content = t._doScImage( o.content );
            });

            ed.onPostProcess.add(function(ed, o) {
                if( o.get )
                    o.content = t._getScImage( o.content );
            });

            ed.onInit.add(function(ed) {
                tinymce.dom.Event.add(ed.getWin(), 'scroll', function(e) {
                    t._hideButtons();
                });
                tinymce.dom.Event.add(ed.getBody(), 'dragstart', function(e) {
                    t._hideButtons();
                });
            });

        },

        _doScImage: function( co ){
            var t = this;
            return co.replace( t.regex, function(a,b,c){
                return '<img src="'+t.shortcodes[b].image+'" id="vscImage'+(t.counter++)+'-'+b+'" class="mceItem jpbVisualShortcode" title="' + b + tinymce.DOM.encode(c) + '" />';
            });
        },

        _getScImage: function( co ){

            function getAttr(s, n) {
                n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);
                return n ? tinymce.DOM.decode(n[1]) : '';
            };

            return co.replace(/(?:<p[^>]*>)*(<img[^>]+>)(?:<\/p>)*/g, function(a,im) {
                var cls = getAttr(im, 'class');

                if ( cls.indexOf('jpbVisualShortcode') != -1 )
                    return '<p>['+tinymce.trim(getAttr(im, 'title'))+']</p>';

                return a;
            });
        },

        _buildRegex: function( names ){
            var t = this,
                reString = '';
            reString = '\\\[(' + names.join('|') + ')(( [^\\\]]+)*)\\\]';
            t.regex = new RegExp( reString, 'gi' );
        },

        _hideButtons: function(){
            tinymce.DOM.hide('jpb_vscbuttons');
            tinymce.DOM.hide('jpb_vscbutton');
        },

        _createButtons: function(){
            var t = this,
                ed = tinyMCE.activeEditor,
                DOM = tinyMCE.DOM,
                edbutton,
                delbutton,
                delbutton2;
            DOM.remove( 'jpb_vscbuttons' );
            DOM.remove( 'jpb_vscbutton' );

            DOM.add( document.body, 'div', {
                id: 'jpb_vscbuttons',
                style: 'display:none;'
            });

            DOM.add( document.body, 'div', {
                id: 'jpb_vscbutton',
                style: 'display:none;'
            });

            edbutton = DOM.add( 'jpb_vscbuttons', 'img', {
                src: t.url + '/img/edit.png',
                id: 'jpb_editshortcode',
                width: '24',
                height: '24',
                style: 'margin:2px;'
            });

            tinymce.dom.Event.add( edbutton, 'mousedown', function(e){
                var ed = tinyMCE.activeEditor, el = ed.selection.getNode(), imgID = el.id.replace( /^vscImage\d+-(.+)$/, '$1' );
				if( !imgID || undefined === t.shortcodes[imgID] || undefined === t.shortcodes[imgID].command ){
	            	return;
				}
				ed.execCommand( t.shortcodes[imgID].command );
				t._hideButtons();
            });

            delbutton = DOM.add( 'jpb_vscbuttons', 'img', {
                src: t.url + '/img/delete.png',
                id: 'jpb_delshortcode',
                width: '24',
                height: '24',
                style: 'margin:2px;'
            });

            delbutton2 = DOM.add( 'jpb_vscbutton', 'img', {
                src: t.url + '/img/delete.png',
                id: 'jpb_delshortcode2',
                width: '24',
                height: '24',
                style: 'margin:2px;'
            });

			tinymce.dom.Event.add( [ delbutton, delbutton2 ], 'mousedown', function(e){
				var ed = tinyMCE.activeEditor, el = ed.selection.getNode(), el2;
				if( el.nodeName == 'IMG' && ed.dom.hasClass( el, 'jpbVisualShortcode' ) ){
					el2 = el.parentNode;
					ed.dom.remove( el );
					ed.execCommand( 'mceRepaint' );
					t._hideButtons();
					ed.selection.select(el2);
					return false;
				}
			});
            
        }
    });

    tinymce.PluginManager.add( 'visualshortcodes', tinymce.plugins.visualShortcodes );
})();

