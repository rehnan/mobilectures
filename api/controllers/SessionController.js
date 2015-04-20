
var application = sails.config.globals;
var ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;

var SessionController = {

   /* Action index | Method: GET -
    * Renderiza view do formulário listando todas as sessões
    */
   index: function(req, res) {
      sails.log.debug('Render sessions index view for user' + req.session.passport.user);
      application.title = req.__('session.index.title');

      //Session.find({}).paginate({page: 10, limit: 5}) {id_speaker:req.session.passport.user}
      Session.find({owner:req.session.passport.user.id}, {sort: 'createdAt DESC' }).exec(function (err, sessions){
         if(err){return err;}
         return res.view('speaker/sessions/index',{sessions:sessions});
      });
   },

   /* Action new | Method: GET - 
    * Renderiza view do formulário
    */ 
   new: function(req, res) {
      sails.log.debug('Rendering new sessions view form for user: ' + req.session.passport.user);
      application.title = req.__('session.index.title');
      return res.view('speaker/sessions/new', {errors: {}, session: Session.new });
   },

   /*
    * Action create | Method: POST -
    * Realiza a pesistência dos dados do formulário
    */
   create: function (req, res) {
      SpeakerAccount.findOne({id:req.session.passport.user.id}).exec( function (err, speaker) {
         if(err) { 
            sails.log.debug('Error ==> ' + JSON.stringify(err));
            req.flash('error', 'Sepeaker não encontrado!');
            return res.view('speaker/sessions/new');
         }else{
            params = req.params.all();
            params.owner = req.session.passport.user.id;

            Session.createIfValid(params, function (errors, record) {
               if (errors) {
                  sails.log.debug('Error ==> ' + JSON.stringify(errors));
                  req.flash('error', req.__('global.flash.form.error'));
                  return res.view('speaker/sessions/new', {errors: pretty_errors,  session: req.params.all()});
               } else {
                  req.flash('success', req.__('global.flash.create.success', {name: req.param('name')}));
                  return res.redirect('speaker/sessions');
               }
            });
            //speaker.sessions.add( req.params.all() );
            //speaker.save(function(err, resp_cb) {
            //   if(err) {
            //      sails.log.debug('Erro ao tentar salvar sessão ' + JSON.stringify(err)); 
            //      req.flash('error', 'Não foi possível criar essa sessão')
            //   }
            //   req.flash('success', req.__('global.flash.create.success', {name: req.param('name')}));
            //   return res.redirect('speaker/sessions');
            //});
         }
      });
   },

   show: function(req, res) {
      //sails.log.debug('Selecionando sessão')
      //req.session.current_session = null;
      //Session.find({}).paginate({page: 10, limit: 5})
      Session.findOne({id:req.param('id'), owner: req.session.passport.user.id}).exec(function (err, session){
         if(err){return err;}
         if(!session) {
            req.flash('error', 'Sessão inexistente!!!');
            return res.redirect('speaker/sessions');
         }
         application.title = req.__('session.show.title', {name: session.name});
         //req.session.current_session = session;
         return res.view('speaker/sessions/show', {layout: 'layouts/session', session: session});
      });
   },

   /*
    * Action edit | Method: GET - 
    * Renderiza view do formulário de edição
    */
   edit: function(req, res) {
      sails.log.debug('Rendering edit sessions view form for user: ' + req.session.passport.user);

      conditions = {id: req.param('id'), owner: req.session.passport.user.id };
      Session.findOne(conditions).exec(function findSession(err, session){
         if(!session) {
            req.flash('error', 'Sessão inexistente!!!');
            return res.redirect('speaker/sessions');
         }

         application.title = req.__('session.edit.title', {name: session.name});
         return res.view('speaker/sessions/edit', {errors: {}, session:session});
      });
   },

   /*
    * Action PUT to Form Edit
    */ 
   update: function(req, res) {

      var conditions = {id: req.param('id'), owner: req.session.passport.user.id };

      Session.findOne(conditions).exec(function (err, session) {
         if(!session) {
            req.flash('error', 'Sessão inexistente!!!');
            return res.redirect('speaker/sessions');
         }

         session.name = req.param('name');
         session.description = req.param('description');

         session.save(function (errors, record) {
            if (errors) {
               req.flash('error', req.__('global.flash.form.error'));
               pretty_errors = SailsValidador(Session, errors);
               sails.log.debug('Error ==> ' + JSON.stringify(pretty_errors));
               return res.view('speaker/sessions/edit', {errors: pretty_errors, session:session});
            }
            req.flash('success', req.__('global.flash.update.success'));
            return res.redirect('speaker/sessions');
         });
      });
   },

   /*
    * Action Get 
    */ 
   destroy: function(req, res) {

      var conditions = {id: req.param('id'), owner: req.session.passport.user.id };

      Session.destroy(conditions).exec(function (errors, deleted_records) {
         if(errors) {
            sails.log.debug('Error ==> ' + JSON.stringify(errors));
            req.flash('error', req.__('global.flash.destroy.error'));
            return res.redirect('speaker/sessions');
         }else{
            sails.log.debug('The record has been deleted');

            var session = deleted_records[0];
            req.flash('warning', req.__('global.flash.destroy.success', {name: 'Sessão' + session.name}));
            return res.redirect('speaker/sessions');
         }
      });
   },
}

module.exports = SessionController;

/*
   Examplo consulta nativa mongodb
index: function (req,res) {
Pet.native(function(err, collection) {
if (err) return res.serverError(err);

collection.find({}, {
name: true
      }).toArray(function (err, results) {
        if (err) return res.serverError(err);
        console.log('->',results);
        return res.ok(results);
      });
    });
  }

*/
