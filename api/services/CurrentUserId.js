module.exports = {
	//Retorna usuário corrente
	get: function(req){
		return req.session.passport.user.id;
	}

}