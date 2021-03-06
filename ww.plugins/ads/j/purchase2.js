$(function() {
	var $wrapper=$('#ads-purchase-wrapper');
	var opts={}, ads=[];
	function stage1Email() {
		if (userdata.id) {
			opts.email=userdata.email;
			return stage2AdType();
		}
		var html='<div>'
			+'<h2>Step 1 of 7</h2>'
			+'<p>Please enter your email address. This is so that we can create a'
			+' user account for you so you can track clicks and views.</p>'
			+'<input id="ad-email" type="email"/>'
			+'<button class="next">Next</button>'
			+'</div>';
		$wrapper.empty().append(html);
		$wrapper.find('.next').button().click(function() {
			var email=$('#ad-email').val();
			$.post('/a/f=userGetUid', {
				'email':email
			}, function(ret) {
				if (ret.error) {
					return alert(ret.error);
				}
				if (ret.uid && !(/tmp-/.test(ret.uid))) {
					var html='<p>This email address is already registered in the'
						+' database. Please <a href="/_r?type=loginpage">Log In</a>'
						+' before creating an ad.</p>';
					return $(html).dialog({
						'modal': true,
						'buttons':{
							'Login': function() {
								document.location='/_r?type=loginpage';
							}
						}
					});
				}
				opts.email=email;
				stage2AdType();
			});
		});
		$('#ad-email').val(opts.email||'');
	}
	function stage2AdType() {
		var html='<div>'
			+'<h2>Step 2 of 7</h2>'
			+'<p>Choose the type of ad you want to purchase.</p>'
			+'</div>';
		$(html)
			.appendTo($wrapper.empty());
		$.post('/a/p=ads/f=typesGet/not_for_sale=0', function(ret) {
			var buttons=[];
			ads=[];
			for (var i=0;i<ret.length;++i) {
				ads[ret[i].id]=ret[i];
				var type=ret[i].type=='0'
					?'('+ret[i].width+'px x  '+ret[i].height+'px)'
					:'(Full Page)';
				$('<button id="ad-button-'+ret[i].id+'" class="full-width" data-id="'+ret[i].id+'">'+ret[i].name
					+' <small>'+type+'</small>'
					+'</button>')
					.appendTo($wrapper.find('>div'))
					.button()
					.click(function() {
						var id=$(this).data('id');
						opts.ad_id=id;
						opts.ad_type=+ads[id].type;
						opts.ad_width=ads[id].width;
						opts.ad_height=ads[id].height;
						var next=opts.ad_type==0?stage3TargetType:stage3PageDetails;
						next();
					});
			}
			if (opts.ad_id) {
				$('#ad-button-'+opts.ad_id)
					.addClass('selected');
				var next=opts.ad_type==0?stage3TargetType:stage3PageDetails;
				$('<button class="next">Next</button>')
					.button()
					.appendTo($wrapper.find('>div'))
					.click(next);
			}
		});
	}
	function stage3PageDetails() {
		var html='<div>'
			+'<h2>Step 3 of 7</h2>'
			+'<p>What is the name of the company the page is for?</p>'
			+'<input id="ad-name" style="width:100%" />'
			+'<p>Contact Details:</p>'
			+'<table style="width:100%">'
			+'<tr><th>Address</th><td><input style="width:100%" id="ad-address" placeholder="street, town, city, country"/></td></tr>'
			+'<tr><th>Landline</th><td><input style="width:100%" id="ad-phone" placeholder="123456789"/></td></tr>'
			+'<tr><th>Mobile</th><td><input style="width:100%" id="ad-mobile" placeholder="123456789"/></td></tr>'
			+'<tr><th>Email</th><td><input style="width:100%" type="email" id="ad-email" placeholder="your@email.address"/></td></tr>'
			+'<tr><th>Website</th><td><input style="width:100%" id="ad-url" placeholder="http://yourdomain/"/></td></tr>'
			+'<tr><th>Twitter</th><td><input style="width:100%" id="ad-twitter" placeholder="@your_handle"/></td></tr>'
			+'<tr><th>Facebook</th><td><input style="width:100%" id="ad-facebook" placeholder="http://facebook.com/your_address"/></td></tr>'
			+'</table>'
			+'<button class="prev">Prev</button>'
			+'<button class="full-width">Next</button>'
			+'</div>';
		$(html).appendTo($wrapper.empty());
		$wrapper.find('.prev').button().click(stage2AdType);
		if (opts.meta) {
			$.each (opts.meta, function(k, v) {
				$('#ad-'+k).val(v);
			});
		}
		$wrapper.find('.full-width').button()
			.click(function() {
				if (!opts.meta) {
					opts.meta={};
				}
				opts.meta.name=$('#ad-name').val();
				opts.meta.address=$('#ad-address').val();
				opts.meta.phone=$('#ad-phone').val();
				opts.meta.email=$('#ad-email').val();
				opts.meta.url=$('#ad-url').val();
				opts.meta.twitter=$('#ad-twitter').val();
				opts.meta.facebook=$('#ad-facebook').val();
				stage4PageDetails();
			});
	}
	function stage3TargetType() {
		var html='<div>'
			+'<h2>Step 3 of 7</h2>'
			+'<p>What will happen when the ad is clicked?</p>'
			+'<button data-action="website" class="website full-width">Go to a website</button>'
			+'<button data-action="poster" class="poster full-width">Pop up an image</button>'
			+'<button class="prev">Prev</button>'
			+'</div>';
		$(html)
			.appendTo($wrapper.empty());
		$wrapper.find('.prev')
			.button()
			.click(stage2AdType);
		$wrapper.find('.full-width')
			.button()
			.click(function() {
				opts.action=$(this).data('action');
				stage4ActionDetails();
			});
		if (opts.action) {
			if (opts.action=='website') {
				$('.website').addClass('selected');
			}
			if (opts.action=='poster') {
				$('.poster').addClass('selected');
			}
			$('<button class="next">Next</button>')
				.appendTo($wrapper.find('>div'))
				.button()
				.click(stage4ActionDetails);
		}
	}
	function stage4ActionDetails() {
		function updatePoster() {
			if (!opts.poster_uploaded) {
				return;
			}
			$('#ads-purchase-poster-preview')
				.removeClass()
				.html('Poster uploaded');
		}
		var html='<div>'
			+'<h2>Step 4 of 7</h2>';
		if (opts.action=='website') {
			html+='<p>What website address should the reader be directed to?</p>'
				+'<input id="ads-website" placeholder="http://www.yoursite.com/"'
				+' class="full-width"/>';
		}
		else {
			html+='<p>Please upload the image that should appear when the ad is clicked.</p>'
				+'<div id="ads-purchase-poster-wrapper"><span id="ads-purchase-poster"/>'
				+'<span id="ads-purchase-poster-preview"/></div>'
		}
		html+='<button class="prev">Prev</button>'
			+'<button class="next">Next</button>'
			+'</div>';
		$(html)
			.appendTo($wrapper.empty());
		$wrapper.find('.prev')
			.button()
			.click(stage3TargetType);
		$wrapper.find('.next')
			.button()
			.click(function() {
				if (opts.action=='website') {
					opts.target_url=$('#ads-website').val();
					if (!opts.target_url) {
						return alert('Please fill in the target website address.');
					}
					stage5AdUpload();
				}
				else{
					if (!opts.poster_uploaded) {
						return alert(
							'You must upload a poster, or go back and choose to'
							+' bring the clicker to a website.'
						);
					}
					stage5AdUpload();
				}
			});
		if (opts.action=='poster') {
			Core_uploader('#ads-purchase-poster', {
				'serverScript': '/a/p=ads/f=posterUpload',
				'successHandler':function(file, data, response){
					opts.poster_uploaded=1;
					updatePoster();
				}
			});
		}
		updatePoster();
	}
	function stage4PageDetails() {
		var html='<div>'
			+'<h2>Step 4 of 7</h2>'
			+'<p>Please fill in the content of the page. You can amend it after purchase with formatting, links, etc.</p>'
			+'<textarea style="width:100%;height:200px" id="ad-content"></textarea>'
			+'<button class="prev">Prev</button>'
			+'<button class="full-width">Next</button>'
			+'</div>';
		$(html).appendTo($wrapper.empty());
		$wrapper.find('.prev').button().click(stage3PageDetails);
		if (opts.meta) {
			$.each (opts.meta, function(k, v) {
				$('#ad-'+k).val(v);
			});
		}
		$wrapper.find('.full-width').button()
			.click(function() {
				if (!opts.meta) {
					opts.meta={};
				}
				opts.meta.content=$('#ad-content').val();
				stage5AdUpload();
			});
	}
	function stage5AdUpload() {
		function updatePreview() {
			$.post('/a/p=ads/f=getTmpImage', function(ret) {
				if (!ret) {
					return $('#ads-purchase-preview').addClass('disabled').html('please upload an image');
				}
				opts.image_uploaded=true;
				var imgHtml=/swf$/.test(ret)
					?'<object type="application/x-shockwave-flash" style="width:'+opts.ad_width+'px; height:'+opts.ad_height+'px;" data="/f/'+ret+'"><param name="movie" value="/f/'+ret+'" /></object>'
					:'<img src="/a/f=getImg/w='+opts.ad_width+'/h='+opts.ad_height+'/'+ret+'"/>';
				$('#ads-purchase-preview')
					.removeClass()
					.html('<div style="border:1px solid red;width:'+opts.ad_width+'px;height:'+opts.ad_height+'px;">'+imgHtml+'</div><em>the red border is only to illustrate the size of the ad</em>');
			});
		}
		var html='<div>'
			+'<h2>Step 5 of 7</h2>';
		html+='<p>Please upload your ad. It must be <strong>'+opts.ad_width+'px x '
			+opts.ad_height+'px</strong> in size. If you don\'t know what this means'
			+' or don\'t have'
			+' an ad ready, please contact your graphic designer and pass the size'
			+' to them.</p><div id="ads-purchase-image"/><div id="ads-purchase-preview"/>';
		html+='<button class="prev">Prev</button>'
			+'<button class="next">Next</button>'
			+'</div>';
		$(html)
			.appendTo($wrapper.empty());
		$wrapper.find('.prev')
			.button()
			.click(opts.ad_type?stage4PageDetails:stage4ActionDetails);
		$wrapper.find('.next')
			.button()
			.click(function() {
				if (!opts.image_uploaded) {
					return alert('Please upload your ad before going forward.');
				}
				stage6ChooseLength();
			});
		Core_uploader('#ads-purchase-image', {
			'serverScript': '/a/p=ads/f=fileUpload',
			'successHandler':function(file, data, response){
				updatePreview();
			}
		});
		updatePreview();
	}
	function stage6ChooseLength() {
		var html='<div>'
			+'<h2>Step 6 of 7</h2>';
			console.log(opts);
		var e=ads[opts.ad_id].price_per_day;
		html+='<p>How long do you want your ad to run for?</p>'
			+'<select>'
			+'<option value="183">6 Months (€'+(e*183).toFixed(2)+')</option>'
			+'<option value="365">1 Year (€'+(e*365*.8595).toFixed(2)+')</option>'
			+'</select>';
		html+='<button class="prev">Prev</button>'
			+'<button class="next">Next</button>'
			+'</div>';
		$(html)
			.appendTo($wrapper.empty());
		$wrapper.find('.prev')
			.button()
			.click(stage5AdUpload);
		$wrapper.find('.next')
			.button()
			.click(function() {
				opts.days=$wrapper.find('select').val();
				stage7Payment();
			});
	}
	function stage7Payment() {
		var html='<div>'
			+'<h2>Step 7 of 7</h2>'
			+'<p>You\'re done! Please pay using the PayPal button below, and your ad will be immediately available on the website.</p><p>Note that PayPal offers a credit-card payment service as well, so everyone is catered for.</p>'
			+'<div id="ads-purchase-purchase"/>'
			+'<button class="prev">Prev</button>'
			+'</div>';
		$(html)
			.appendTo($wrapper.empty());
		var subtotal=opts.days*ads[opts.ad_id].price_per_day;
		if (opts.days>183) {
			subtotal*=.8595;
		}
		subtotal=subtotal.toFixed(2);
		$wrapper.find('.prev')
			.button()
			.click(stage6ChooseLength);
			site_url=document.location.toString()
				.replace(/(https?:\/\/[^\/]*).*/, '$1');
			// { paypal form
			var paypal='<form method="post" action="https://www.pay'
				+'pal.com/cgi-bin/webscr" style="text-align:center"><input type="hidden" value="_xclick" name="cmd"'
				+'/><input type="hidden" value="'+ads_paypal+'" name="business"/>'
				+'<input type="hidden" value="Ads Purchase" name="item_name"/>'
				+'<input type="hidden" id="paypal-order-id" value="" name="item_number"/>'
				+'<input type="hidden" value="'+subtotal+'" name="amount"/>'
				+'<input type="hidden" value="EUR" name="currency_code"/>'
				+'<input type="hidden" value="1" name="no_shipping"/>'
				+'<input type="hidden" value="1" name="no_note"/>'
				+'<input type="hidden" name="return" value="'+site_url+'" />'
				+'<input type="hidden" value="'+site_url
				+'/ww.plugins/ads/verify/paypal.php" name="notify_url"/>'
				+'<input type="hidden" value="IC_Sample" name="bn"/><input type="image" a'
				+'lt="Make payments with payPal - it\'s fast, free and secure!" name="sub'
				+'mit" src="https://www.paypalobjects.com/en_US/i/btn/btn_paynowCC_LG.gif" style="'
				+'width:144px;height:47px;"/><img w'
				+'idth="1" height="1" src="https://www.paypal.com/en_US/i/scr/pixel.gif" '
				+'alt=""/></form>';
			// }
			var $paypal=$(paypal).appendTo($('#ads-purchase-purchase').empty().removeClass());
			$paypal.find('input').click(function() {
				$.post('/a/p=ads/f=makePurchaseOrder', {
					'type_id':opts.ad_id,
					'days':opts.days,
					'target_url':opts.target_url,
					'target_type':+(opts.action=='poster'),
					'email':opts.email,
					'meta':opts.meta
				}, function(ret) {
					$('#paypal-order-id').val(ret.id).closest('form').submit();
				});
				return false;
			});
	}
	$wrapper.addClass('ad-wizard');
	stage1Email();
});
