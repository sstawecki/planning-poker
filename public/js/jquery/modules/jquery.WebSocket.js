(function($){

    // attach to jQuery
    $.extend({
        // export WebSocket = $.WebSocket
        WebSocket: function(socketOptions, elements) {
			var socket;

			this.socketOptions = socketOptions;
			this.elements = elements;

			this.open = function() {
				var me;

				window.managedSocket = new WebSocket('ws://' + this.socketOptions.address + ':' + this.socketOptions.port);
				socket = window.managedSocket;
				me = this;

				socket.onopen = function(event) {
					var socketData = {
						type: 'get-initial-data'
					};
					socket.send(JSON.stringify(socketData));
				}

				socket.onmessage = function(event) {
					var data;
					data = JSON.parse(event.data);

					switch(data.type) {
						case 'userlist':
							me.handleUserList(data.data)
							break;

						case 'carddisplay':
							me.handleCardDisplay(data.data);
							break;
					}
				}
			};

			this.handleUserList = function(users)  {
				window.currentUsers = users;
				var userArray;

				userArray = [];
				for (userId in users) {
					var span,
						user;

					user = users[userId];
					userArray.push('<span class="poker-role-' + user.role + '">' + user.name + '</span>');
				}
				$(this.elements.userlist).html(userArray.join(', '));
			};

			/**
				<div class="poker-card-display poker-card-display-hidden">
					<a class="poker-card">8</a>
					<a class="poker-card poker-card-back">
						<img src="img/inovex-logo.png" alt="" />
					</a>
					<span class="poker-card-player">Khalid</a>
				</div>
			*/
			this.handleCardDisplay = function(cards) {
				for (var userId in cards) {
					var card,
						pokerCardId;

					pokerCardId = 'poker-card-' + userId;
					card = $('#' + pokerCardId);

					if (!card.is('div')) {
						card = $('<div id="' + pokerCardId + '" class="poker-card-display poker-card-display-hidden">' +
							'<a class="poker-card poker-card-value">#</a>' +
							'<a class="poker-card poker-card-back">' +
								'<img src="img/inovex-logo.png" alt="" />' +
							'</a>' +
							'<span class="poker-card-player">#</a>' +
						'</div>');
						$(this.elements.pokerFelt).append(card);
					}
					card.find('.poker-card-value').html(cards[userId]);
					card.find('.poker-card-player').html(window.currentUsers[userId].name);
				}
			}

			return this;
		}
	});
})(jQuery);