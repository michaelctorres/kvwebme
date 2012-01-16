<?php
/**
	* API for Privacy plugin
	*
	* PHP version 5.2
	*
	* @category None
	* @package  None
	* @author   Kae Verens <kae@kvsites.ie>
	* @license  GPL 2.0
	* @link     http://kvsites.ie/
	*/

/**
	* login
	*
	* @return null
	*/
function Privacy_login() {
	$no_redirect=1;
	$_REQUEST['action']='login';
	require $_SERVER['DOCUMENT_ROOT'].'/ww.incs/user-authentication.php';
	if (isset($_SESSION['userdata']) && $_SESSION['userdata']['id']) {
		return array(
			'redirect'=>isset($redirect_url)?$redirect_url:''
		);
	}
	return array(
		'error'=>'incorrect email or password'
	);
}
