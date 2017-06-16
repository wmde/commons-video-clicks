<?php
$url = (isset($_GET['url'])) ? $_GET['url'] : false;
if(!$url) exit;

if (strpos($url, 'https://tools.wmflabs.org') !== 0) {
	echo "You are not allowed to use this proxy";
	die();
}

list($header, $status,$content) = HttpGet($url);

$string = utf8_encode($content);
$json = json_encode($string);
$callback = (isset($_GET['callback'])) ? $_GET['callback'] : false;
if($callback){
	$jsonp = "$callback($json)";
	header('Content-Type: application/javascript');
	echo $jsonp;
	exit;
}
echo $json;


function HttpGet($url) {
	$res = "";
	$header = "";


	// Create a curl handle to a non-existing location
	$ch = curl_init($url);

	// Execute
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, true);
	curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');

	//curl_setopt($ch, CURLOPT_COOKIE, $_SESSION['gisauthcookie']);
	$res = curl_exec($ch);

	$status = curl_getinfo($ch,CURLINFO_HTTP_CODE);
	curl_close($ch);

	$bodyBegin = strpos($res, "\r\n\r\n");
	list($header, $res) = $bodyBegin !== false ? array(substr($res, 0, $bodyBegin), substr($res, $bodyBegin+4)) : array($res, "");
	return array($header, $status, str_replace("%0A%0D%0A%0D", "\r\n\r\n", $res));
}