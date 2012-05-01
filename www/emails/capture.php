<!doctype html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title>Autodesk Reality Capture : Consent Form</title>
  <meta name="description" content="Autodesk Reality Capture">
  <meta name="author" content="Autodesk, Inc">
</head>

<body>
<?php
$capture_dir = "/home/bootjack/public_html/bootjackdesign.com/public/client/autodesk/emails/participants/";
$capture_file = $capture_dir . strftime("%H%M%S_%b%d") . ".txt";
$redirect_url = "http://autodesk.3drealitycapture.com/realitysuccess.html?email=jason_atsymbol_jrhdesign.com";
$email = $_POST['email'];
// str replace email _atsymbol_
$email_escaped = str_replace ( '@' , '_atsymbol_' , $email );
$name = str_replace ( ' ', '_', $_POST['name'] );
$participant_data =  $email_escaped  . "   " . $name . "   " . $email;
// write to new file named from timestamp in participants/
// int file_put_contents ( string $filename , mixed $data [, int $flags = 0 [, resource $context ]] )
$file = fopen ($capture_file, "w"); 
fwrite($file, $participant_data); 
fclose ($file);

//file_put_contents ( $capture_file , $participant_data , 'FILE_APPEND' );
/* php redirect to 
http://autodesk.3drealitycapture.com/realitysuccess.html
// with 
 http://autodesk.3drealitycapture.com/realitysuccess.html?email=jason_atsymbol_jrhdesign.com */
?>
<p>This is what was written to the file <?php echo $capture_file; ?></p>
<p><?php echo $participant_data ?></p>
<?php
// Redirect browser 
$redirect_url .= "?email=" . $email_escaped;
header("Location: $redirect_url");
// stop executing this script 
exit(); ?>
</body>
</html>