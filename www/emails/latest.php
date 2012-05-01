<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title>Autodesk Reality Capture : Consent Form</title>
  <meta name="description" content="Autodesk Reality Capture">
  <meta name="author" content="Autodesk, Inc">
</head>

<body>
<?php
$path = "/home/bootjack/public_html/bootjackdesign.com/public/client/autodesk/emails/participants";

$latest_ctime = 0;
$latest_filename = '';    

$d = dir($path);
while (false !== ($entry = $d->read())) {
  $filepath = "{$path}/{$entry}";
  // could do also other checks than just checking whether the entry is a file
  if (is_file($filepath) && filectime($filepath) > $latest_ctime) {
      $latest_ctime = filectime($filepath);
      $latest_filename = $entry;
  }
}
?>
<div style=" margin:1em 2em;">
<p>File: <?php echo $latest_filename; ?></p>
<p style="font-size:20px; font-weight:bold; padding: 2em 3em; background-color:#FfF8b8;">
<?php
	$parts = explode( " ", file_get_contents ( $path . "/" . $latest_filename ) );
	echo $parts[0];
?>
</p>
</div>
</body>
</html>