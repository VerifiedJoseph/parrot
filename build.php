<?php

/**
 * Script for building the single file version
 */
$files = [
	'css' => 'public/style.css',
	'jszip' => 'public/js/jszip.min.js',
	'papaparse' => 'public/js/papaparse.min.js',
	'script' => 'public/js/script.js' 
];

function loadfile($path): string
{
	$page = file_get_contents($path);

	if ($page === false) {
		throw new Exception('Failed to load file:' . $path);
	}

	return $page;
}

function addParts($page, $files): string
{
	foreach ($files as $id => $file) {
		$data = loadfile($file);

		if ($id === 'css') {
			$data = '<style>' . $data . '</style>';

		} else {
			$data = '<script>' . $data . '</script>';
		}

		$page = str_replace('{'. $id .'}', $data, $page);
	}

	return $page;
}

function save($page)
{
	$status = file_put_contents('public/twMediaViewer.html', $page);

	if ($status === false) {
		throw new Exception('Failed to save file: public/twMediaViewer.html');
	}
}

try {
	$page = loadfile('templates/twMediaViewer.html');
	$page = addParts($page, $files);

	save($page);

} catch(Exception $e) {
	echo $e->getMessage();
	exit(1);
}
