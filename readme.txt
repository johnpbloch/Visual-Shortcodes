=== Visual Shortcodes ===
Contributors: JohnPBloch
Tags: editor, visual editor, shortcodes,
Requires at least: 3.2.1
Tested up to: 3.5
Stable tag: 0.1

This is a utility plugin that will allow other plugins and themes to swap out shortcodes with custom images, in the same way that WordPress' native gallery shortcode does this.

== Description ==

This is a utility plugin that will allow other plugins and themes to swap out shortcodes with custom images, in the same way that WordPress' native gallery shortcode does this. Replacement images can be clicked to reveal a 'delete' button.

This works extremely well when your shortcode already has a tinymce button, but does work for manual shortcodes too.

This plugin does not support multi-line shortcodes or non-self-closing shortcodes (e.g. it supports `[foo bar="baz"]` but not `[foo]bar baz[/foo]`). Honestly, I don't even know what would happen if you tried to use one. It may work, but it's entirely unsupported.

To add your shortcode, hook onto the filter `'jpb_visual_shortcodes'`. That filter will pass one array as an argument. Each element of that array is an associative array which must contain values for the following keys:

 * `shortcode` The name of the shortcode to replace
 * `image` The url of the image to replace the shortcode with.

Additionally, the array may contain the optional parameter `command`, which must be a valid tinymce command. If present, this value will trigger a second UI button ('Edit') when the user clicks the replacement image which, when clicked, will execute the tinymce command passed as the value.

== Installation ==

Really? I think we all know how this works at this point.

== Frequently Asked Questions ==

= Does this plugin support `<XYZ>` shortcode? =

Yes and no. It can, theoretically; but only if the developer of that plugin/theme adds that support to the plugin.

== Changelog ==

= 0.1 =
Initial release
