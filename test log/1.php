<?php
$text	= "Symfony Components are a set of decoupled and reusable PHP libraries. Battle-tested in thousands of
projects and downloaded billions of times, they've become the standard foundation on which the best
PHP applications are built on.";



function delText(string $text, int $size = 74) : string {
	$res = [];
	preg_match("/^(.{1,$size})\s/", $text, $res);
	if(!$res) return "";
	return $res[1];
}

echo delText($text);