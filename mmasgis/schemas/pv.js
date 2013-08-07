var mongoose = require('mongoose');
var PvSchema = new mongoose.Schema({
	"cap": String,
"certificato": Boolean,
"cf_pi": String,
"cliente": Boolean,
"cod_cliente": String,
"cod_mmas": Number,
"codice": String,
"comune": String,
"data_aggiornamento": { type: Date, default: Date.now },
"email": String,
"fax": String,
"indirizzo": String,
"ins_data": { type: Date, default: Date.now },
"ins_utente": Number,
//marche: [],
"mod_data": { type: Date, default: Date.now },
"mod_utente": Number,
"nome1": String,
"nome2": String,
"note":String,
"pref_mmas": String,
"provincia": String,
"pv_id": Number,
"pv_mt": Boolean,
"sito": String,
"tc_istat_id": Number,
"tc_stato_id": Boolean,
"tel1": String,
"tel2": String,
"tel3": String,
"owner": String,
"potenziale" : [{ type: mongoose.Schema.Types.Number, ref: 'rel_pv_pot' }]
},{collection:'pv'})
PvSchema.virtual('certificazione').get( function (){
	var out
	if (this.certificato && this.pv_mt){out = 'certificato'}
	if ( ! this.certificato && this.pv_mt){out = 'non verificato'}
	if (! this.certificato && ! this.pv_mt){out = 'inserita'}
	return out
	})
module.exports = PvSchema;
