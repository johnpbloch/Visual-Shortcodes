<?php

/*
 * Plugin Name: Visual Shortcodes
 * Plugin URI: http://wordpress.org/extend/plugins/visual-shortcodes
 * Description: Allows shortcode developers to register images to represent their shortcodes.
 * Author: John P. Bloch
 * Version: 0.1
 * License: GPLv2
 */

/* Copyright 2011 John P. Bloch

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as
  published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * Wrapper class for hook functions, ensuring safe namespacing.
 *
 * @since 0.1
 */
class JPB_Visual_Shortcodes {

	/**
	 * Class constructor
	 * 
	 * This function adds all the necessary hooks and actions to make our
	 * plugin function
	 * 
	 * @since 0.1
	 */
	function __construct() {
		add_filter('mce_external_plugins', array($this, 'plugins'));
		add_filter('mce_external_languages', array($this, 'lang'));
		add_action('admin_print_styles', array($this, 'styles'));
	}

	/**
	 * Enqueues the global stylesheet responsible for styling the control
	 * buttons that pop up on focus. Do not remove or everything will work
	 * quite poorly indeed!
	 * 
	 * @since 0.1
	 */
	function styles() {
		wp_enqueue_style('jpb_visualshortcodes', plugins_url('buttons.css', __FILE__));
	}

	/**
	 * Registers the shortcode images script as a tinyMCE plugin.
	 * 
	 * @since 0.1
	 * @param array $plugins An associative array of plugins
	 * @return array 
	 */
	function plugins($plugins) {
		$plugins['visualshortcodes'] = plugins_url('visualshortcodes/editor_plugin.js', __FILE__);
		return $plugins;
	}

	/**
	 * Registers this plugin's language pack.
	 * 
	 * We're going to hijack the localization tool that tinymce uses so that
	 * we can send namespaced data to TinyMCE in the localization array. This
	 * data will be telling the plugin which shortcodes to replace and which
	 * images to use to replace them. If a shortcode also has a tinymce command
	 * that should be executable when clicked, that can also be registered
	 * through this method.
	 * 
	 * More information is in the documentation in visualshortcodes/langs.php
	 *
	 * @since 0.1
	 * @see ./visualshortcodes/langs.php
	 * @param array $langs An associative array of language files
	 * @return array
	 */
	function lang($langs) {
		$langs['visualshortcodes'] = dirname(__FILE__) . '/visualshortcodes/langs.php';
		return $langs;
	}

}

/**
 * Initialize plugin. We don't even want a global object.
 */
new JPB_Visual_Shortcodes();
