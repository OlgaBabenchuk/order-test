$(document).ready(function() {

	// $(".title-info__title").each(function(){
	// 	var review_full = $(this).html();
	// 	var review = review_full;
	// 	if( review.length > 42 )
	// 	{
	// 		review = review.substring(0, 42);
	// 		$(this).html( review + '...' );
	// 	}
	// });


	$(function () {
	  app.init();
	});

	var app = {
	  orders: [],
	  fields: ['title', 'category', 'deadline', 'status'],
	  templateId: '#order-template',
	  url: './js/data.json',
	  init: getOrders,
	}

	function getOrders() {
	  $.getJSON(this.url, function (data) {
	    app.orders = data.slice();
	    parseOrders();
	  });
	}

	console.log(app);

	function parseOrders() {
	  app.orders.forEach(function(element){
	    buildOrder(element);
	  });
	}

	function buildOrder(element) {
	  var order = $(app.templateId)
	      .clone()
	      .removeAttr('id')
	      .css('display', 'flex')
	      .addClass('order--status_' + element.status);
	  
	  // app.fields.forEach(function(field){
	  //   order.find('.order__' + field).html(element[field]);      
	  // });

	  if (element.title.length > 41) order.find('.order__title').html(element.title.slice(0, 41) + '...');
	  else order.find('.order__title').html(element.title);

	  if (element.category.length > 41) order.find('.order__category').html(element.category.slice(0, 41) + '...');
	  else order.find('.order__category').html(element.category);

	  order.find('.order__deadline').html(element.deadline);
	  order.find('.order__timeleft').html(getTimeLeft(element.deadline));

	  if (element.statusMessage) order.find('.order__status').html(element.statusMessage);
	  else if (element.status === "progress") {
	    order.find('.order__status').html(element.status + " (pages " + element.currentStep + 
	                                      " of " + element.steps + ")");
	  } else order.find('.order__status').html(element.status);

	  // build status-bar
	  var statusBarWidth = element.currentStep / element.steps * 100 + '%';
	  order.find('.status-bar__inner').css({'width': statusBarWidth});

	  if (element.status === "bidding") order.find('.order__assigned')
	                                         .html(element.bids + " bids")
	                                         .css({"text-align" : "center", 
	                                               "line-height": "50px",
	                                              "display": "block"});
	  else {
	    order.find('.order__img').css({"background-image" : "url('" + element.assigned.icon + "')"});
	    if (element.assigned.status === "online") order.find('.order__user-status').css("display", "block");

	    order.find('.order__username').html(element.assigned.name);

	    var rate = order.find('.order__rate').html();
	    order.find('.order__rate').html(rate + element.assigned.rate);

	  }

	  order.find('.order__price').html("$" + element.price);
	  order.find('.order__paid').html("$" + element.paid);

	  order.find('.order__id').html("#" + element.id);

	  order.appendTo('.options__body');
	}

	function getTimeLeft(deadline) {
	  var currentDate = new Date();
	  var deadlineDate = new Date(deadline + ' ' + currentDate.getFullYear());
	  var diffDate = (deadlineDate - currentDate) / (24 * 3600 * 1000);
	  var diffResult = '';

	  if (diffDate > 1) {
	    diffResult = Math.floor(diffDate) + ' days';
	  } else {
	    diffResult = Math.floor(diffDate* 24)  + ' hours'
	  }

	  return diffResult + ' left';
	}

	function getStatusOrders(status) {
	  $('.options__body').children().remove();

	  app.orders.forEach(function(element){
	    if (element.status === status) buildOrder(element);
	  });
	}

	function getRecentOrders() {
	  $('.options__body').children().remove();

	  var recent = app.orders.sort(function(a, b) {
	    var aDate = new Date(a.createDate);
	    var bDate = new Date(b.createDate);
	    return bDate - aDate;
	  });

	  recent.forEach(function(element) {
	    buildOrder(element);
	  }, this);
	}

	$('#finished').on('click', function(e) {
	  e.preventDefault();
	  getStatusOrders("finished");
	});

	$('#canceled').on('click', function(e) {
	  e.preventDefault();
	  getStatusOrders("canceled");
	});

	$('#recent').on('click', function(e) {
	  e.preventDefault();
	  getRecentOrders();
	});
});


