<?php

  $user   = 'id8931968_root';
  $pass   = 'L#NTOemz)yMZqNn5)w!F';
  $dbname = 'id8931968_system';

  $user   = 'root';
  $pass   = '';
  $dbname = 'system';

	#CONNECTION
	$con = new mysqli('localhost', $user, $pass, $dbname);
	if ($con->connect_error){
		die("Failed to connect to Database:" . mysqli_connect_error());
	}

	#SANITIZE INPUT
	function check($data){
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		$data = addslashes($data);
		return 	$data;
	}

  date_default_timezone_set("Asia/Manila");

	#GET PRIEST INFO
	function getPriestInfo($con, $id = null){
		$rs  = [];
		$whr = $id == null ? "" : "WHERE id = $id";

		$sql = "SELECT * FROM priest_info $whr";
		$res = $con->query($sql);
		if($res->num_rows > 0){
			while ($row = $res->fetch_assoc()){
				$rs[] = $row;
			}
		}

		return $rs;
	}

  #GET PRIEST INFO
  function getPriestInfo2($con, $id = null){
    $rs  = null;
    $whr = $id == null ? "" : "WHERE id = $id";

    $sql = "SELECT * FROM priest_info $whr";
    $res = $con->query($sql);
    if($res->num_rows > 0){
      if($id != null){
        #FETCH ONLY ONE
        $rs = $res->fetch_assoc();
      }else{
        #FETCH ALL
        while ($row = $res->fetch_assoc()){
          $rs[] = $row;
        }
      }
    }

    return $rs;
  }

	#GET PACKAGES INFO
	function getPackages($con, $id = null){
		$rs  = [];
		$whr = $id == null ? "" : "WHERE id = $id";

		$sql = "SELECT * FROM packages $whr";
		$res = $con->query($sql);
		if($res->num_rows > 0){
			while ($row = $res->fetch_assoc()){
				$rs[] = $row;
			}
		}

		return $rs;

	}

  function getUserInfo($con, $id){
    $rs  = null;
    $sql = "SELECT * FROM tbl_users WHERE id = " . $id;
    $res = $con->query($sql);
    if($res->num_rows > 0){
      $rs = $res->fetch_assoc();
    }
    return $rs;
  }

#DATE TO STRING
function dateToString($time = ""){
  $year      = date('Y');
  $time      = $time != "" ? strtotime($time) : strtotime(date('Y-m-d H:i:s'));
  $temptime  = $time;
  $time      = time() - $time;
  $time      = ($time < 1)? 1 : $time;

  $tokens = array (
      31536000 => 'year',
      2592000 => 'month',
      172800 => 'else',
      82800 => 'Yesterday',
      3600 => 'hr',
      60 => 'min',
      1 => 'sec'
  );

  foreach ($tokens as $unit => $text) {
    if ($time < $unit) continue;
    $numberOfUnits = floor($time / $unit);

    if($text == 'sec'){
      return 'Just now';
    } else{
      if($text == "min" || $text == 'hr'){
        return $numberOfUnits.' '.$text.(($numberOfUnits>1)?'s':'');
      } else if ($text == 'Yesterday'){
         return $text;
      } else{
        $date = new DateTime(date("Y-m-d H:i:s", $temptime));
        $y    = $year > $date->format('Y') ? ', '.$date->format('Y') : '';

        return $date->format('F j' . $y)
               .'&nbsp • &nbsp <i class="fa fa-clock-o" data-toggle="tooltip" title="' .
               $date->format('l'). ', ' .$date->format('F j, Y' ) .' at ' . $date->format('g:i A') . '"></i>';
      }
    }
  }
}

#MIME TYPES (FILE UPLOAD)
function getFileType(){
  $pdf  = ['application/pdf'];
  $xls  = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
  $doc  = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  $ppt  = ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'];
  $txt  = ['text/plain'];
  $file = [];
  #IMAGE TYPES

  #MIME TYPES (FILE UPLOAD)

  $rs['image'] = [
    'image/jpeg', 'image/pjpeg',
    'image/png',  'image/x-png',
    'image/gif',
  ];

  #PDF
  $rs['pdf']  = $pdf;

  #EXCEL
  $rs['xls']  = $xls;

  #WORD
  $rs['doc']  = $doc;

  #POWERPOINT
  $rs['ppt']  = $ppt;

  #TEXT FILE
  $rs['txt']  = $txt;

  #ALL FILE TYPES
  $file = array_merge($file, $pdf, $xls, $doc, $ppt, $txt);
  $rs['file'] = $file;

  return $rs;
}

#REMOVE PHOTO
function removePhoto($file_name){
  unlink('../../assets/images/file_uploaded/'.$file_name);
  unlink('../../assets/images/file_thumbnail/thumb-'.$file_name);
}

#UPLOAD PHOTO
function uploadPhoto($path, $tmp, $type, $name){
	$file_name   = $name.'.'.$type;
	$target_file = $path . $file_name;
	$status      = 0;
	if(move_uploaded_file($tmp, $target_file)){
    $source_image      = $target_file;
    $image_destination = "../../assets/images/file_thumbnail/thumb-".$file_name;
    $compress_images   = compressImage($source_image, $image_destination);
    $status = 1;
  }
  return $status;
}

function compressImage($source_image, $compress_image) {
  $image_info   = getimagesize($source_image);
  if ($image_info['mime'] == 'image/jpeg') {
    resize_image($source_image, $compress_image, 1);
  } elseif ($image_info['mime'] == 'image/gif'){
    resize_image($source_image, $compress_image, 2);
  }elseif ($image_info['mime'] == 'image/png'){
    resize_image($source_image, $compress_image, 3);
  }
  return $compress_image;
}

function resize_image($filename, $compress, $type) {
  list($width, $height) = getimagesize($filename);

  #SET IMAGE SIZE INTO 30% OF ITS ORIGNAL SIZE
  $w   = $width * 0.30;
  $h   = $height * 0.30;

  #CREATE NEW GD (GRAPHIC DESIGN) IMAGE WITH NEW WIDTH AND HEIGHT
  $dst = imagecreatetruecolor($w, $h);

  if($type == 1){
    $src = imagecreatefromjpeg($filename);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $width, $height);
    imagejpeg($dst, $compress, 30);
  }else if($type == 2){
    $src = imagecreatefromgif($filename);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $width, $height);
    imagegif($dst, $compress, 30);
  }else if($type == 3){
    $src = imagecreatefrompng($filename);
    imageAlphaBlending($dst, false);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $width, $height);
    imageSaveAlpha($dst,true);
    imagepng($dst, $compress, 9);
  }

  # imagecreatefrom jpeg/gif/png function - used to copy image from the image src and create a new source
  # imagecopyresampled function - used to resample or reassemble image with new width and height
  # image jpeg/gif/png - used to move the created new source file to and reduce its quality

}

?>