<?php
/**
  * send a verification code to an email address to verify it exists
  *
  * PHP Version 5
  *
  * @category   None
  * @package    None
  * @subpackage Form
  * @author     Kae Verens <kae@kvsites.ie>
  * @license    GPL Version 2
  * @link       www.kvweb.me
 */

session_start();

if (!isset($_REQUEST['email'])) {
	echo '{"error":"no \'email\' parameter"}';
	exit;
}
if (!filter_var($_REQUEST['email'], FILTER_VALIDATE_EMAIL)) {
	echo '{"error":"invalid email address"}';
	exit;
}
if (!isset($_REQUEST['name'])) {
	echo '{"error":"no \'name\' parameter"}';
	exit;
}
if (!isset($_SESSION['form_input_email_verify_'.$_REQUEST['name']])) {
	echo '{"error":"session has expired - please reload and try again"}';
	exit;
}
mail(
	$_REQUEST['email'],
	'['.$_SERVER['HTTP_HOST'].'] email verification code',
	'The verification code for this email address is: '
	.$_SESSION['form_input_email_verify_'.$_REQUEST['name']]
);
