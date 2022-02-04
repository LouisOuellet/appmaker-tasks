Engine.Plugins.tasks = {
	init:function(){
		var checkExist = setInterval(function() {
			if((Engine.initiated)&&(typeof Engine.GUI.Navbar.element.left !== "undefined")&&(typeof Engine.GUI.Navbar.element.right !== "undefined")){
				clearInterval(checkExist);
				var html = '';
				html += '<li class="nav-item dropdown">';
					html += '<a class="nav-link" data-toggle="dropdown" data-display="static">';
						html += '<i class="fas fa-tasks"></i>';
						html += '<span class="badge badge-primary navbar-badge">'+Engine.Plugins.tasks.GUI.count+'</span>';
					html += '</a>';
					html += '<div class="dropdown-menu dropdown-menu-mobile dropdown-menu-task scrollable-menu">';
						html += '<span class="dropdown-item dropdown-header">'+Engine.Plugins.tasks.GUI.count+' '+Engine.Contents.Language['Tasks']+'</span>';
					html += '</div>';
				html += '</li>';
				Engine.GUI.Navbar.element.right.prepend(html);
				Engine.Plugins.tasks.GUI.element.list = Engine.GUI.Navbar.element.right.find('.dropdown-menu').first();
				Engine.Plugins.tasks.GUI.element.badge = Engine.GUI.Navbar.element.right.find('.badge').first();
			}
		}, 100);
	},
	GUI:{
		count:0,
		element:{
			list:{},
			badge:{},
		},
		add:function(options = {}, callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var url = new URL(window.location.href);
			var checkExist = setInterval(function() {
				if((Engine.initiated)&&(typeof Engine.Plugins.tasks.GUI.element.list !== "undefined")&&(typeof Engine.Plugins.tasks.GUI.element.badge !== "undefined")){
					clearInterval(checkExist);
					var html = '';
					++Engine.Plugins.tasks.GUI.count;
					options.id = Engine.Plugins.tasks.GUI.count;
					if(typeof options.title === 'undefined'){ options.title = 'Task '+options.id; }
					if(typeof options.created === 'undefined'){ options.created = Engine.Helper.now('ISO_8601'); }
					if(typeof options.plugin === 'undefined'){
						if(typeof url.searchParams.get("p") !== 'undefined'){ options.plugin = url.searchParams.get("p"); } else { options.plugin = options.title; }
					}
					if(typeof options.icon === 'undefined'){ options.icon = 'icon icon-'+options.plugin; } else {
						if(options.icon.substring(0, 2) == 'fa'){ options.icon = options.icon+' mr-2'; } else {
							options.icon = 'icon icon-'+options.icon;
						}
					}
					if(typeof options.extra === 'undefined'){ options.extra = Engine.Helper.ucfirst(options.plugin); }
					if(typeof options.value === 'undefined'){ options.value = 0; }
					if(typeof options.max === 'undefined'){ options.max = 1; }
					var value = ((options.value / options.max) * 100);
					if(0 <= value &&  value < 25){ var bg = 'warning'; }
					else if (25 <= value &&  value < 50){ var bg = 'info'; }
					else if (50 <= value &&  value < 75){ var bg = 'info'; }
					else if (75 <= value &&  value < 100){ var bg = 'primary'; }
					else if (100 == value){ var bg = 'success'; }
					Engine.Plugins.tasks.GUI.element.badge.html(options.id);
					Engine.Plugins.tasks.GUI.element.list.find('.dropdown-header').first().remove();
					html += '<div data-task="'+options.id+'" class="dropdown-divider"></div>';
					html += '<a data-task="'+options.id+'" class="dropdown-item">';
						html += '<div class="row"><div class="col-md-12">'+options.title+'</div></div>';
						html += '<div class="row">';
							html += '<div class="col-md-1"><i class="'+options.icon+'"></i></div>';
							html += '<div class="col-md-11 p-2"><div class="progress progress-sm"><div class="progress-bar bg-'+bg+' progress-bar-striped" role="progressbar" aria-valuenow="'+options.value+'" aria-valuemin="0" aria-valuemax="'+options.max+'" style="width: '+((options.value / options.max) * 100)+'%">'+Math.trunc((options.value / options.max) * 100)+'%</div></div></div>';
						html += '</div>';
						html += '<div class="row">';
							html += '<div class="col-md-12">';
								html += '<span class="float-left text-muted text-sm">'+options.extra+'</span>';
								html += '<span class="float-right text-muted text-sm"><time class="timeago" datetime="'+options.created+'"></time></span>';
							html += '</div>';
						html += '</div>';
					html += '</a>';
					Engine.Plugins.tasks.GUI.element.list.prepend(html);
					Engine.Plugins.tasks.GUI.element.list.prepend('<span class="dropdown-item dropdown-header">'+options.id+' '+Engine.Contents.Language['Tasks']+'</span>');
					$('[data-task="'+options.id+'"]').last().find('time').timeago();
					if(callback != undefined){ callback(options, $('[data-task="'+options.id+'"]').last(), $('[data-task="'+options.id+'"]').first()); }
				}
			}, 100);
		},
		update:function(id, value, options = null){
			var task = Engine.Plugins.tasks.GUI.element.list.find('[data-task="'+id+'"]').last();
			var progress = task.find('.progress-bar');
			var width = (value / progress.attr('aria-valuemax') * 100)
			progress.attr('aria-valuenow', value);
			progress.width(width+'%');
			progress.html(Math.trunc(width)+'%');
			progress.removeClass('bg-info');
			progress.removeClass('bg-warning');
			progress.removeClass('bg-primary');
			progress.removeClass('bg-success');
			if(0 <= width &&  width < 25){ var bg = 'warning'; }
			else if (25 <= width &&  width < 50){ var bg = 'info'; }
			else if (50 <= width &&  width < 75){ var bg = 'info'; }
			else if (75 <= width &&  width < 100){ var bg = 'primary'; }
			else if (100 == width){ var bg = 'success'; }
			progress.addClass('bg-'+bg);
			if(value == progress.attr('aria-valuemax')){
				setTimeout(function() { Engine.Plugins.tasks.GUI.remove(id); }, 5000);
			}
		},
		remove:function(id){
			--Engine.Plugins.tasks.GUI.count;
			Engine.Plugins.tasks.GUI.element.list.find('[data-task="'+id+'"]').remove();
			Engine.Plugins.tasks.GUI.element.list.find('.dropdown-header').first().remove();
			Engine.Plugins.tasks.GUI.element.list.prepend('<span class="dropdown-item dropdown-header">'+Engine.Plugins.tasks.GUI.count+' '+Engine.Contents.Language['Tasks']+'</span>');
			Engine.Plugins.tasks.GUI.element.badge.html(Engine.Plugins.tasks.GUI.count);
		},
	},
}

Engine.Plugins.tasks.init();
