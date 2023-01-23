<div id="visitor-count">Loading visitor count...</div>

<?php
$response = wp_remote_get( 'https://<your-proxy-api-endpoint>/visitors' );

if( is_wp_error( $response ) ) {
    echo "Error: Unable to fetch visitor count";
} else {
    $data = json_decode( $response['body'], true );
    $visitor_count = $data['data']['results']['visitors']['value'];
    echo "<script>
        document.getElementById('visitor-count').innerHTML = 'So far, this place  has been visited by <span class=\\'lcd-number\\'>" . $visitor_count . "</span> virtual strangers.';
    </script>";
}
?>
