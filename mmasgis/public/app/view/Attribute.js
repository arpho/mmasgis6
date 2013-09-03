Ext.define("mmasgisRaid.app.view.AnagraphicGrid",{
	/*definisco la grid che viene usata nelle tabelle di anagrafica
	 * @param attributeText: string: header della colonna parametri
	 * @param store: store: store da associare alla grid
	 * @param title String: titolo della grid*/
attributeText	: "parametro",
store	: "",
functionClick: function(){console.log('itemdblclick di default')},
title : "titolo grid",
classText : texts.txt50,

constructor	: function(options){
	Ext.apply(this,options || {});
},

seeParameters : function(){
	console.log(this)
},
/*genera la grid che va inserita nei tab di Anagrafica*/
getGrid: function(){
		var grid = Ext.create('Ext.grid.Panel',{
			title: this.title,
			viewConfig : {
												style : { overflow: 'auto' }
											},
			store: this.store,
			listeners : {
			//	itemdblclick : this.functionClick() 
			},
			columns : [
			{
				header : this.classText,
				dataIndex : 'class',
			},
			{
				header : this.attributeText,
				dataIndex : 'value'
			}
				]
		})
		return grid
	}
})
