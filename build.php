<?php
/*
 * Script for building the main and single file versions
 */

/**
 * @var array<string, string> $texts Text strings
 */
$texts = [
    'name' => 'Parrot',
    'description' => 'Viewer for tweet archives created with the Twitter Media Downloader'
];

/**
 * @var array<int, string> $jsFiles JavaScript file paths
 */
$jsFiles = [
    'libraries/jszip.min.js',
    'libraries/papaparse.min.js',
    'libraries/autolinker.min.js',
    'dom.js',
    'helper.js',
    'build.js',
    'filter.js',
    'script.js'
];

/**
 * @var array<int, string> $cssFiles CSS file paths
 */
$cssFiles = [
    'style.css'
];

/**
 * Output to terminal
 * 
 * @param string $text Text
 */
function output(string $text): void
{
    echo $text . " \n";
}

/**
 * Load file
 * 
 * @param string $path File path
 * @return string File data
 * 
 * @throws Exception if file could not be loaded
 */
function loadfile($path): string
{
    $page = file_get_contents($path);

    if ($page === false) {
        throw new Exception('Failed to load file:' . $path);
    }

    return $page;
}

/**
 * Add CSS files
 * 
 * @param string $page Page data
 * @param array<int, string> $files CSS file paths
 * @param bool $embed Embed file data into page
 * @return string
 */
function addCssFiles(string $page, array $files, bool $embed = false): string
{
    $data = '';

    foreach ($files as $file) {
        if ($embed === true) {
            $data .= '<style>' . loadfile('public/' . $file) . '</style>';

        } else {
            $data .= '<link rel="stylesheet" type="text/css" href="'. $file .'" />';
        }
    }

    $page = str_replace('{css}', $data, $page);

    return $page;
}

/**
 * Add JavaScript files
 * 
 * @param string $page Page data
 * @param array<int, string> $files JavaScript file paths
 * @param bool $embed Embed file data into page
 * @return string
 */
function addJsFiles($page, array $files, bool $embed = false): string
{
    $data = '';

    foreach ($files as $file) {
        if ($embed === true) {
            $data .= '<script>' . loadfile('public/js/' . $file) . '</script>';

        } else {
            $data .= '<script src="js/'. $file .'" type="text/javascript"></script>';
        }
    }

    $page = str_replace('{js}', $data, $page);

    return $page;
}

/**
 * Add text
 * 
 * @param string $page Page data
 * @param array<string, string> $texts Array of text strings
 * @return string
 */
function addText($page, $texts): string
{
    foreach ($texts as $id => $text) {
        $page = str_replace('{'. $id .'}', $text, $page);
    }

    return $page;
}

/**
 * Add build details (commit id and current date)
 * 
 * @param string $page Page data
 * @return string
 */
function addBuildDetails(string $page): string
{
    exec('git rev-parse --verify HEAD', $output);
    $hash = $output[0];

    $page = str_replace(['{date}', '{commit}'], [date('c'), $hash], $page);
    return $page;
}

/**
 * Save page to disk
 *
 * @param string $page Page data
 * @param string $path File path
 * 
 * @throws Exception if file could not be written
 */
function save(string $page, string $path): void
{
    $status = file_put_contents($path, $page);

    if ($status === false) {
        throw new Exception('Failed to save file: ' . $path);
    }

    output('Create file: ' . $path);
}

try {
    $base = loadfile('templates/parrot-tweet-viewer.html');
    $base = addText($base, $texts);
    $base = addBuildDetails($base);

    // Single page version
    $page = addCssFiles($base, $cssFiles, true);
    $page = addJsFiles($page, $jsFiles, true);
    save($page, 'public/parrot-tweet-viewer.html');

    // Main website version
    $page = addCssFiles($base, $cssFiles, false);
    $page = addJsFiles($page, $jsFiles, false);
    save($page, 'public/index.html');

    output('Done.');
} catch(Exception $e) {
    output($e->getMessage());
    exit(1);
}
