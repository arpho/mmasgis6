function classCollector(selection){
	var out = {}
	out.regione = []
	out.provincia = []
	out.comune = []
	out.cap = []
	out.pv = []
	for (var i=0;i<selection.length;i++)
	{
		out[selection[i].utb.classe].push({id:selection[i].utb.id})
	}
	return out
}
exports.classCollector = classCollector
