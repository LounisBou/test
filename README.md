# magic-datatable-script

Library to make a datatable AJAX instance on a HTML declarated table.

- Ajax 	:
The declared table have to contain the class "ajax-datatable".

The datatable AJAX call will ask for JSON content at the url specified in the 
attribute data-url of the table.

- Template	:
The table cols will be defined out of the < th > tags of your table. These <th> tags
should be related with corresponding < td > tags in a template < div > with the class "template"
(generaly put in <tfoot> tag in order datatable don't rewrite it)

The id of each <td> template should be related to the data-id attribute of the associated <th> tags.
A td template tag will replace placeholders *key* (where key is a data of your JSON)
 	
- Datatable attribut	:
Datatable attributes "searchable", "orderable" and "className" are the only compatible for now 
and should be added in the corresponding < th > attribute of your table. 

- Conditions	:	
You could write condition tags like < condition key="my_key" value="match_value" > 
that allow you to display HTML in you template only if condition is respected. 

The content of the condition tag will be display only if my_key attribut (where my_key is a data of field of you JSON)
is equal to match_value. 

It's possible to use different operator for the condition (== is the default operator)
Others operators allow are : !=, <, <=, >, >= and should be use by prefixing match_value 
the desired operator. 

   Exemple : < condition key="statut" value=">=3" >
   Condition will be display if statut field of your JSON is superior or equal to 3 on this line.

- Javascripts	:
< javascript > tags allow you to inject javascripts for each lines.
< javascript > tags should be in the template td of the line and also replace place placeholders *key*
by the value of the key field of you JSON.
	
(Important note : For the moment the operators  <, <=, > and >= are not compatible in the javascript tags, 
they create an error because the are interpreted as HTML start or end of tag.)

For other information, just read this very little script... 
(And sorry comment are in French for know but I will work on their translation)
