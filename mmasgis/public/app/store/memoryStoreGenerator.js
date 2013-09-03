/** genera uno store di tipo memory che usa il vettore passato come origine dei dati
 * @param [] vettore dati
 * @param string root del reader
 * @return Ext.data.Store*/
function makeStore(dataSource,root){
	var store = Ext.create('Ext.data.Store',{
		model:'attribute',
		data: dataSource,
		proxy: {
			type: 'memory',
			reader: {
				type: 'json',
				root: root
			}
		}
	})
	return store
}
