//User logic.

var user = {
	first_name : 'César',
	last_name : 'Cruz',
	email : 'cesarcruz91@gmail.com',
	password : 'fuckit', //This will be hashed.
	phone : '7874526702',
	mail_address1 : '#311 Calle Ext. Los Robles',
	mail_address2 : '',
	mail_city : 'Rincon',
	mail_state : 'Puerto Rico',
	mail_zip : '00677',
	bill_address1 : '#311 Calle Ext. Los Robles',
	bill_address2 : '',
	bill_city : 'Rincon',
	bill_state : 'Puerto Rico',
	bill_zip : '00677',
	image : 'https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash4/1009521_322256844573732_661186218_o.jpg',
	cc_number : '2938 8493 1739 0394',
};

var addresses = { user_email : 'cesarcruz91@gmail.com',
content :[
{
	mail_address1 : '#311 Calle Ext. Los Robles',
	mail_address2 : '',
	mail_city : 'Rincon',
	mail_state : 'Puerto Rico',
	mail_zip : '00677'
},
{
	mail_address1 : '#455 Calle Ext. Los Giraldas',
	mail_address2 : '',
	mail_city : 'Comerio',
	mail_state : 'Puerto Rico',
	mail_zip : '00787'
},
{
	mail_address1 : '#666 Calle Sodoma Ext. Gomorra',
	mail_address2 : '',
	mail_city : 'Juncos',
	mail_state : 'Puerto Rico',
	mail_zip : '00666'
}]
};

/*
*	Sign in the user.
*/
var sign_in = function(req, res, next)
{
	if(req.body.username == user.email && req.body.password == user.password)
	{
		res.send(user);
	}
	else
	{
		res.send({error : 'dumbass'});
	}
}

/**
*	Modify the user and send the new user to the client.
*/
var update_user = function(req, res, next)
{
	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.email = req.body.email;

	res.send(user);
}

var user_addresses = function(req, res, next)
{
	res.send(addresses);
}

var add_mail_address = function(req, res, next)
{
	console.log(req.body);
	var new_address = {
		mail_address1 : req.body.address1,
		mail_address2 : req.body.address2,
		mail_city : req.body.city,
		mail_state : req.body.country,
		mail_zip : req.body.zipcode
	};

	addresses.content.push(new_address);

	//Confirm that all is well
	res.send(200);
}

var delete_address = function(req, res, next)
{
	for(var i = 0; i < addresses.content.length; i++)
	{
		if(addresses.content[i].mail_address1 == req.body.address1)
		{
			addresses.content.splice(i, 1);
		}
	}
	res.send(200);
}

exports.sign_in = sign_in;
exports.update_user = update_user;
exports.user_addresses = user_addresses;
exports.add_mail_address = add_mail_address;
exports.delete_address = delete_address;





