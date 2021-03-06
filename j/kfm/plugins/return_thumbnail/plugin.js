function plugin_return_thumbnail(){
	this.name='return_thumbnail';
	this.title="return thumbnail to opener";
	this.mode=0;//single files
	this.writable=2;//writable files
	this.category='returning';
	this.extensions='all';
	this.doFunction=function(files){
		kfm_returnThumbnail(files[0]);
	}
}
kfm_addHook(new plugin_return_thumbnail());

function kfm_returnThumbnail(id,size){
	if(!size)size='64x64';
	valid=1;
	kfm_prompt(kfm.lang.WhatMaximumSize,size,function(size){
		if(!size)return;
		if(!/^[0-9]+x[0-9]+$/.test(size)){
			alert('The size must be in the format XXxYY, where X is the width and Y is the height');
			valid=0;
		}
		if(!valid)return kfm_returnThumbnail(id,size);
		var x=size.replace(/x.*/,''),y=size.replace(/.*x/,'');
		x_kfm_getFileUrl(id,x,y,function(url){
		  if(copy_to_clipboard)copy_to_clipboard(url);
			window.opener.SetUrl(url,0,0,File_getInstance(id).caption);
			window.close();
		});
	});
}
