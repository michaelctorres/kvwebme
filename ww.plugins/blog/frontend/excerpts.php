<?php
/**
  * Blog plugin excerpts
  *
  * PHP Version 5
  *
  * @category   None
  * @package    None
  * @subpackage None
  * @author     Kae Verens <kae@kvsites.ie>
  * @license    GPL Version 2
  * @link       www.kvweb.me
 */

$c=''; // html to return

// { set up constraints

$constraints=array(1);
if (!Core_isAdmin()) {
	if (isset($_SESSION['userdata']) && $_SESSION['userdata']['id']) {
		$constraints[]='(status>0 or user_id='.$_SESSION['userdata']['id'].')';
	}
	else {
		$constraints[]='status';
	}
}
if ($blog_author) {
	$constraints[]='user_id='.$blog_author;
}
if (isset($entry_ids) && $entry_ids) {
	$constraints[]='id in ('.join(',', $entry_ids).')';
}
$constraints=' where '.join(' and ', $constraints);

// }
// { set up Featured Posts slider if there is one
if (isset($PAGEDATA->vars['blog_featured_posts'])
	&& (int)$PAGEDATA->vars['blog_featured_posts']
) {
	require dirname(__FILE__).'/featured-posts.php';
}
// }

$sql='select count(id) ids from blog_entry'.$constraints;
$num_of_entries=dbOne($sql, 'ids', 'blog_entry');
$sql='select * from blog_entry'.$constraints.' order by cdate desc'
	.' limit '.$excerpts_offset.','.$excerpts_per_page;
$rs=dbAll($sql, '', 'blog_entry');
$c.='<div class="blog-main-wrapper">';
if (!isset($excerpt_length)) {
	$excerpt_length=200;
}
if (isset($PAGEDATA->vars['blog_excerpt_length'])) {
	$excerpt_length=(int)$PAGEDATA->vars['blog_excerpt_length'];
	if ($excerpt_length<10) {
		$excerpt_length=200;
	}
}
foreach ($rs as $r) {
	$sclass=$r['status']=='1'?'blog-published':'blog-unpublished';
	$c.='<div class="blog-excerpt-wrapper '.$sclass.'" id="blog-entry-'.$r['id'].'">';
	$c.='<h2 class="blog-header">'.htmlspecialchars($r['title']).'</h2>';
	$user=User::getInstance($r['user_id']);
	$name=$user?$user->name:'unknown';
	$c.='<div class="blog-meta">'
		.'<span class="blog-author" data-uid="'.$r['user_id'].'">'.$name.'</span>'
		.'<span class="blog-separator"> ~ </span>'
		.'<span class="blog-date-published">'.Core_dateM2H($r['pdate']).'</span>'
		.'</div>';
	// }
	$excerpt=$r['excerpt']
		?$r['excerpt']
		:substr(preg_replace('/\s+/', ' ', str_replace('&nbsp;', ' ', preg_replace('/<[^>]*>/', ' ', $r['body']))), 0, $excerpt_length).'...';
	// { image
	if (!$r['excerpt_image']) {
		$img=preg_replace('/.*<img.*?src="([^"]*)".*/m', '\1', str_replace(array("\n", "\r"), ' ', $r['body']));
		if (strpos($img, '/f')===0) {
			$r['excerpt_image']=preg_replace('#^/f/#', '', $img);
		}
	}
	$img='';
	if ($r['excerpt_image']) {
		if (!isset($excerptImageSizeX)) {
			$excerptImageSizeX=100;
		}
		if (!isset($excerptImageSizeY)) {
			$excerptImageSizeY=100;
		}
		$img='<img class="blog-excerpt-image" src="/a/f=getImg/w='.$excerptImageSizeX.'/h='.$excerptImageSizeY.'/'.$r['excerpt_image'].'"/>';
	}
	// }
	$date=preg_replace('/ .*/', '', $r['cdate']);
	$c.='<div class="blog-excerpt">'.$img.$excerpt
		.' <a class="blog-link-to-article" href="'
		.preg_replace('#/tags/[^/]*#', '', $links_prefix)
		.'/'.$r['user_id'].'/'.$date.'/'
		.preg_replace('/[^a-zA-Z0-9]/', '-', transcribe($r['title']))
		.'">more</a>'
		.'</div>';
	$c.='</div>';
}
$this_page=(int)($excerpts_offset/$excerpts_per_page);
$bottom_links=array();
if ($num_of_entries>$excerpts_offset+$excerpts_per_page) {
	$bottom_links[]='<a class="blog-link-to-older-entries" href="'
		.$links_prefix.'/page'.($this_page+1).'">'
		.'older entries</a>';
}
if ($this_page) {
	$bottom_links[]='<a class="blog-link-to-newers-entries" href="'
		.$links_prefix.'/page'.($this_page-1).'">'
		.'newer entries</a>';
}
if (!isset($nobottomlinks)) {
	$bottom_links[]='<a style="display:none" class="blog-link-to-all-authors" href="'
		.$links_prefix.'/authors">'
		.'list of authors</a>';
	$c.='<div class="blog-bottom-links">'.join(' | ', $bottom_links).'</div>';
}
$c.='</div>';
