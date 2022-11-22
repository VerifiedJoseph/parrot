<?php

/**
 * Script for building the single file version
 */

$texts = [
    'name' => 'Parrot',
    'description' => 'A viewer for tweet archives created with the Twitter Media Downloader'
];

$jsFiles = [
    'libraries/jszip.min.js',
    'libraries/papaparse.min.js',
    'dom.js',
    'helper.js',
    'links.js',
    'build.js',
    'script.js'
];

$cssFiles = [
    'style.css'
];

function output(string $text): void
{
    echo $text . " \n";
}

function loadfile($path): string
{
    $page = file_get_contents($path);

    if ($page === false) {
        throw new Exception('Failed to load file:' . $path);
    }

    return $page;
}

function addCssFiles($page, array $files, bool $embed = false): string
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

function addText($page, $texts): string
{
    foreach ($texts as $id => $text) {
        $page = str_replace('{'. $id .'}', $text, $page);
    }

    return $page;
}

function addBuildDetails(string $page): string
{
    exec('git rev-parse --verify HEAD', $output);
    $hash = $output[0];

    $page = str_replace(['{date}', '{commit}'], [date('c'), $hash], $page);
    return $page;
}

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
