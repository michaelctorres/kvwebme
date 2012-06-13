<?php
require $_SERVER['DOCUMENT_ROOT'].'/ww.incs/basics.php';
if (!Core_isAdmin()) {
	die('access denied');
}

$id=(int)@$_REQUEST['id'];

// { type
echo '<strong>View Type</strong><br/>';
$type=@$_REQUEST['widget_type'];
$types=array(
	'List Categories',
	'Tree View',
	'Products',
	'Pie-Chart'
);
echo '<select name="widget_type">';
foreach ($types as $t) {
	echo '<option';
	if ($type==$t) {
		echo ' selected="selected"';
	}
	echo '>'.$t.'</option>';
}
echo '</select><br/>';
// }
// { parent category
echo '<strong>Parent Category</strong><br />'
	.'<select name="parent_cat" id="parent_cat_'.$id.'">';
if (!isset($_REQUEST['parent_cat'])) {
	echo '<option value="0"> -- please choose -- </option>';
}
else {
	echo '<option value="'.$_REQUEST['parent_cat'].'">'
		.dbOne(
			'select name from products_categories where id='
			.$_REQUEST['parent_cat'],
			'name'
		)
		.'</option>';
}
echo '</select><br/>';
// }
// { diameter
echo '<div class="diameter"><strong>Diameter (for Pie Chart)</strong>';
$diameter=(isset($_REQUEST['diameter']) && $_REQUEST['diameter'])
	?((int)$_REQUEST['diameter'])
	:280;
echo '<input name="diameter" value="'.htmlspecialchars($diameter).'" /></div>';
// }
echo '<script>$("#parent_cat_'.$id.'").remoteselectoptions({url:'
	.'"/a/p=products/f=categoriesOptionsGet"});'
	.'Products_widgetTypeChanged();</script>';
