function includes(data,obj,key){
	/* ritorna la posizione nella lista dell'oggetto che presenta il parametro key =  a quello dell'oggetto pasato
	 * @param data:[obj]
	 * @param ogetto test: obj
	 * @param key parametro di confronto
	 * @return int*/
	for  (var i=0;i<data.length;i++){
		if (data[i][key]==obj[key])
		return i
	}
	return -1
}


function pvListMerger(A,B,page,start){
	/* Combina gli elementi delle due liste sostituendo a quelli della prima i secondi con lo stesso pv_id
	* @method PvListMerger
	* @param {[Pv]} è la lista dei pv originali in cui il campo owner è vuoto
	* @param {[Pv]} è la lista dei appartenenti al cliente, puo' essere vuota
	* @param {int} dimensione della pagina, opzionale
	* @param {int} item di partenza, opzionale
	* @return {data:[Pv],count:int}*/
	console.log('includes')
	var results  = {}
	var C = []
	if (B.length==0){C = A
	}
	else{
		C = B
		
		for (var i=0;i<A.length;i++){
			if (includes(C,A[i],'pv_id')==-1){C.push(A[i])}
			
		}
	
	}
		results.fullData = C
		results.data = C
		results.count = C.length
		var end = start+page
		if (page){results.data = C.slice(start,end)}
	return results
}
exports.includes = includes
exports.pvListMerger = pvListMerger
