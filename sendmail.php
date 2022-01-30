<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('eng', 'phpmailer/language/');
	$mail->IsHTML(true);

	//От кого письмо
	$mail->setFrom('$name');
	//Кому отправить
	$mail->addAddress('maksym.yanchenko93@gmail.com');
	//Тема письма
	$mail->Subject = 'Informmation';

	//Как с Вами связаться?:
	$choice = "Texting";
	if($_POST['choice'] == "Calling"){
		$choice = "Calling";
	}

	//Тело письма
	$body = '<h1>You selected this project!</h1>';
	
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Name:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['phone']))){
		$body.='<p><strong>Phone:</strong> '.$_POST['phone'].'</p>';
	}
	if(trim(!empty($_POST['choice']))){
		$body.='<p><strong>How to contact to you?:</strong> '.$_POST['message'].'</p>';
	}
	if(trim(!empty($_POST['your project']))){
		$body.='<p><strong>Select your project:</strong> '.$_POST['message'].'</p>';
	}
	
	if(trim(!empty($_POST['message']))){
		$body.='<p><strong>Message:</strong> '.$_POST['message'].'</p>';
	}
	


	$mail->Body = $body;

	//Отправляем
	if (!$mail->send()) {
		$message = 'error';
	} else {
		$message = 'Data has sent!';
	}

	$response = ['message' => $message];

	header('Content-type: application/json');
	echo json_encode($response);
?>