/*
 * Magic-datatable
 *
 * 	Librairie d'appel automatisé de datatable.
 *	- Ajax 	:
 *	Déclaration automatique de datatable sur les tables .ajax-datatable
 * 	Fonctionne par appel AJAX (JSON) du contenu de la table (attribut data-url de la table)
 * 	- Template	:
 * 	Génère une table selon les <th> dont ces derniers doivent être associé à 
 *	un template de td (.template td) dont l'id correspond au data-id du th.
 * 	Le .template td remplace les placeholders *key* par la valeur de l'attribut 
 *	key correspondant dans le JSON.
 * 	- Attributs datatable 	:
 *	Les attributs datatables searchable, orderable et className sont compatible et se mettent 
 *	en tant qu'attribut des th de la table.
 *	- Conditions	:	
 * 	Les balises <condition key="my_key" value="match_value"> permettent un affichage 
 *	conditionnel du template, le contenu de la balise condition s'affiche si l'attribut my_key 
 *	du JSON possède la valeur match_value. 
 *	Il est possible de changer l'opérateur de la condition (== par défaut)
 * 	en préfixant match_value par l'opérateur souhaité. Les opérateurs compatibles 
 *	sont les suivants : !=, <, <=, >, >=
 *	- Javascripts	:
 *	Les balises <javascript> permettent l'injection dynamique de javascript pour chaque ligne.
 * 	Elles doivent se trouver dans le .template td de la ligne et interprète également 
 *	les placeholders *key* par la valeur de l'attribut key correspondant dans le JSON.
 *	(A noter une incompatiblité des opérateurs <, <=, > et >= est pour l'instant à déplorer dans les
 *	javascripts.)
 *	
 *
 *	Pour le reste je vous invite à lire le code commenté de ce petit script bien pratique...
 *
 */
 
/* Fonction utile pour datatable. */

// Fonction de récupération et remplacement du contenu d'un <td>
function getContent(dom_element, datas){
		
	// [DEBUG]
	//console.log('dom_element', dom_element);
	
	// [DEBUG]
	//console.log('datas', datas);
		
	// Récupération du contenu ciblé.
	var	content		=	$("#"+dom_element).html();
	
	// Récupération des conditions du champs.
	var conditions	=	$("#"+dom_element).find('condition');
	
	/* CONDITIONS */
	
	// Si on à des conditions.
	if(conditions.length > 0){
				
		// Pour chaque conditions
		$.each(conditions, function(key, value){
		
			// On récupère la key et value de la condition.
			var condition		=	$(value);
			var condition_key	=	condition.attr('key');
			var condition_data	=	datas[condition.attr('key')];
			var condition_value	=	condition.attr('value');
			
			// Test type d'opérateur de condition.
			if(condition_value.startsWith("!=")){
				condition_value		=	condition_value.replace("!=", '');
				condition_is_true	=	(condition_value != condition_data);
			}else if(condition_value.startsWith("<")){
				condition_value		=	condition_value.replace("<", '');
				condition_is_true	=	(condition_value < condition_data);
			}else if(condition_value.startsWith("<=")){
				condition_value		=	condition_value.replace("<=", '');
				condition_is_true	=	(condition_value <= condition_data);
			}else if(condition_value.startsWith(">")){
				condition_value		=	condition_value.replace(">", '');
				condition_is_true	=	(condition_value > condition_data);
			}else if(condition_value.startsWith(">=")){
				condition_value		=	condition_value.replace(">=", '');
				condition_is_true	=	(condition_value >= condition_data);
			}else{
				condition_is_true	=	(condition_value == condition_data);
			}
				
			// Si la condition est respecté.
			if(condition_is_true){
				
				// On remplace la condition par le contenu de la condiction.
				content 	= 	content.replace(condition.prop('outerHTML'), condition.html());
				
				// [DEBUG]
				//console.log('match condition', content);
				
			}else{
				
				// On retire la condition du content.
				content 	= 	content.replace(condition.prop('outerHTML'), '');
				
				// [DEBUG]
				//console.log('value', condition.prop('outerHTML'));
				
			}
			
		
			// [DEBUG]
			//console.log('key', condition_key);
			//console.log('datakey', condition_data);
			//console.log('value', condition_value);
		
		});
		
		// [DEBUG]
		//console.log(content);
		
	}
	
	// [DEBUG]
	//console.log('content #'+dom_element, $("#"+dom_element).html());
	
	/* REMPLACEMENTS */
	
	if(content != undefined){
		// [DEBUG]
		//console.log('content', content);
		
		/* REMPLACEMENTS VALEURS */
		
		// Pour chaque data du JSON.
		for(var key in datas){
			
			// [DEBUG]
			//console.log('data', key, datas[key]);
			
			var fieldname = '\\*'+key+'\\*';
			var regex = new RegExp(fieldname, "ig");
			
			// On remplace la data par sa valeur dans le contenu.
			content = content.replace(regex, datas[key]);
						
			// [DEBUG]
			if(dom_element == key){
				//console.log('replace', dom_element, '*'+key+'*', datas[key]);
			}
			
		}
		
		/* REMPLACEMENTS JAVASCRIPTS */
		
		// Traitement du javascript si existant.
		var javascripts = $("#"+dom_element).find('javascript');
		
		// Si on à des balises javascript.
		if(javascripts.length > 0){
			
			//console.log('javascripts');
			
			/* On remplace les balises javascripts dans le contenu. */
			
			// Balise ouvrante.
			content = content.replace('<javascript>', '<script type="text/javascript">');			
			// Balise fermante.
			content = content.replace('</javascript>', '</script>');
			
		}
		
		// [DEBUG]
		//console.log('datas', content);
		
		// Retour le contenu.
		return content;
		
	}else{
		return "";
	}
	
}

/* Récupération des infos pour datatable. */

// Récupération de l'URL du script datatable.
var script_url		=	$(".ajax-datatable").attr('data-url');

// [DEBUG]
//console.log('url', script_url);

// Récupération de la liste des champs.
var table_fields	=	$(".ajax-datatable").find('th');

// [DEBUG]
//console.log('table_fields', table_fields);

// Création d'une liste des champs de la table pour datatable.
var fields		=	[];
$.each(table_fields, function(key, value){
	
	// [DEBUG]
	//console.log('th', $(value).attr('data-id'));
	
	// Création de l'objet field.
	field 				=	{};
	
	// Selection de toutes les datas du json.
	field.data			=	null;
	
	// Définition de l'identifiant DOM du td correspondant.
	field.name			=	$(value).attr('data-id');
	
	// Searchable
	if($(value).attr('searchable')	==	undefined){
		field.searchable	=	false;
	}else if($(value).attr('searchable')	==	"true"){
		field.searchable	=	true;
	}else if($(value).attr('searchable')	==	"false"){
		field.searchable	=	false;
	}
	
	// Orderable
	if($(value).attr('orderable')	==	undefined){
		field.orderable		=	false;
	}else if($(value).attr('orderable')	==	"true"){
		field.orderable		=	true;	
	}else if($(value).attr('orderable')	==	"false"){
		field.orderable		=	false;
	}
	
	// ClassName
	if($(value).attr('className')	!=	undefined){
		field.className		=	$(value).attr('className');
	}
	
	// Contenu.
	field.render			=	function(data, type, row, meta) {
					            	return getContent($(value).attr('data-id'), data);
					        	}
	
	// Ajout de l'objet field à la liste des fields.
	fields.push(field);
	
});

// [DEBUG]
//console.log('fields', fields);

/* Appel datatable */

// Appel datatable sur l'objet ajax-datatale.
$(".ajax-datatable").DataTable({
	language: {
        url: "/assets/libs/datatables-1.10.15/lang/French.json"
    },
	serverSide: true,
    ajax: {
        url: script_url,
        type: 'POST'
    },
	"columns": fields
});
