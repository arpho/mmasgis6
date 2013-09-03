/**normalizza gli attributi grezzi ottenuti da mongodb perchè siano conformi con il  modello di extjs
 * @param [attribut]
 * @param family:<'par','pot','mar'>*/
function normalizeAttribut(data,family){
	for (var i= 0;i<data.data.length;i++){
			data.data[i].tc_cl_id = data.data[i]['tc_cl'+family+'_id']
			data.data[i]['class'] = family
	}
	return data
}

/**genera il digest del tab, ritorna la definizione
			 * @method getDigest
			 *  del filtro relativa al tab,analizzando la lista
			 *  dei parametri selezionati, selected
			 * @param Object: {data:{attribut_id:int,tc_cl_id:int}}
			 * @return {tc_cl_id: int, attributs_id: [int]
			 * @note  nell'esecuzione del filtro i valori di
			 *  attributs_id andranno messi in OR mentre
			 *  i tc_cl_id in AND*/
			function getDigest(values){
				var digest = {}
				console.log(values)
				for (var i=0;i<values.data.length;i++){
					if (values.data[i].tc_cl_id in digest){
						digest[values.data[i].tc_cl_id].push(values.data[i].attribut_id)
					}
					else{
						digest[values.data[i].tc_cl_id] = [values.data[i].attribut_id]
					}
				}
				return digest
				}
function showFilter(censimento){
	var tab
	var potentials,
	parameters,
	brands
	var filterWindow
	var storeParameters = null
	Ext.Ajax.request({
					url : 'classes4Filter/',
					method : 'POST',
					params : {
							//pv__id : Id,
							censimento : metmi.censimento.census},
					success: function(response, opts) {
						var obj = Ext.decode(response.responseText);
						//console.dir(obj);
						potentials = obj.potentials
						parameters = obj.parameters
						brands = obj.brands
						parameters = normalizeAttribut(parameters,'par')
						potentials = normalizeAttribut(potentials,'pot')
						brands = normalizeAttribut(brands,'mar')
						storeParameters = makeStore(parameters,'data')
						storeParameters.load()
						storePotentials = makeStore(potentials,'data')
						storePotentials.load()
						storeBrands = makeStore(brands,'data')
						storeBrands.load()
						
						tab = Ext.create('Ext.tab.Panel', {
							width: 600,
							height: 200,
							activeTab: 0,
							items: [{
								title : texts.txt64,
									items: Ext.create("mmasgisRaid.app.view.filterPanel",{
										censimento: metmi.censimento.census,
										title: 'Parametri',
										family: 'par',
										width: 600,
										height : 260,
										store : storeParameters
									}).getPanel(),
								},{
									title: texts.txt65a,
									items: Ext.create("mmasgisRaid.app.view.filterPanel",{
									censimento: metmi.censimento.census,
									title: 'Potenziali',
									family: 'pot',
									width: 600,
									height : 250,
									store : storePotentials
								}).getPanel()
									
								},{
									title: texts.txt65,
									items: Ext.create("mmasgisRaid.app.view.filterPanel",{
										censimento: metmi.censimento.census,
										title: 'Marche',
										family: 'mar',
										width: 600,
										height : 250,
										store : storeBrands
									}).getPanel()
								}
							
							]
						})
var myTopToolbar = new Ext.Toolbar({items : [
				{
						xtype: 'button',
						icon : 'images/lightning_go.png',
						tooltip : texts.txt69,
						handler : function(){
							console.log('do filter')
							console.log(Ext.create("mmasgisRaid.app.view.filterPanel",{
										censimento: metmi.censimento.census,
										title: 'Marche',
										family: 'mar',
										width: 600,
										height : 250,
										store : storeBrands
									}).getPanel())
							var selectedParameters = tab.items.items[0].items.items[0].items.items[2].store.data.items
							console.log(selectedParameters)
							//normalizzo la lista dei parametri per getDigest
							var valuesParameters = {}
							valuesParameters.data = []
							for (var i=0;i< selectedParameters.length;i++){
								valuesParameters.data.push(selectedParameters[i].data)}
								console.log(valuesParameters)
							console.log(getDigest(valuesParameters))// selectedGrid parametri
						},
					}
			]})
filterWindow = Ext.create('Ext.window.Window',
	{
		title: texts.txt56,
		tbar : myTopToolbar,
		height: 239,
		width:600,
	layout: 'border',
	items:[ 
						{
							region:'center',
							items:tab
						}
						]
	}
	);
	filterWindow.show();
					}
			})

 

}
