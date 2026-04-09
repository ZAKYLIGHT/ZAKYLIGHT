<?php
/**
 * Plugin Name: Fix Elementor Overlay Z-Index
 * Description: Lowers the z-index that the Astra theme assigns to
 *              .elementor-element-overlay (originally 9999) so that the
 *              Elementor element overlay no longer stacks above modals,
 *              popovers and other editor chrome inside the Elementor editor.
 * Author:      monoffices.com
 * Version:     1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Append an override to the Astra theme stylesheet so the lower z-index
 * always wins the cascade against the inline #ast-elementor-overlay-css
 * block that Astra prints in the page <head>.
 */
add_action( 'wp_enqueue_scripts', static function () {
	$override = '.elementor-editor-active .elementor-element > .elementor-element-overlay{z-index:1;}';
	wp_add_inline_style( 'astra-theme-css', $override );
}, 20 );
