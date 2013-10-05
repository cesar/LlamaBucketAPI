//User logic.

var user = {
	first_name : 'César',
	last_name : 'Cruz',
	email : 'cesarcruz91@gmail.com',
	password : 'fuckit',
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
	image : 'https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash4/1009521_322256844573732_661186218_o.jpg'
};

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

exports.sign_in = sign_in;