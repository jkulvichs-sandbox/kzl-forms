<?php

/**
 * Plugin Name: Forms
 * Description: Plugin to Create and Manage Quiz/Test Forms
 * Version: 0.1
 * Author: Kulagin Yuri (@jkulvich)
 * Author URI: https://over.red
 */

// Main Plugin Methods
class WPForms
{

}

// =========================== //
// ===== PLUGIN CONTROLS ===== //
// =========================== //

register_activation_hook(__FILE__, 'wp_forms_activate');
function wp_forms_activate()
{

}

register_deactivation_hook(__FILE__, 'wp_forms_deactivate');
function wp_forms_deactivate()
{

}

// =================== //
// ===== ACTIONS ===== //
// =================== //

add_action('the_content', 'my_thank_you_text');
function my_thank_you_text($content)
{
    return $content .= '<p>Thank you for reading!</p>';
}


?>
