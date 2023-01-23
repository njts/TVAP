function add_visitor_count_css() {
    wp_enqueue_style( 'visitor-count', get_template_directory_uri() . '/css/visitor-count.css' );
}
add_action( 'wp_enqueue_scripts', 'add_visitor_count_css' );
