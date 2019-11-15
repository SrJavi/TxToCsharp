$(document).ready(function() {




    $("#loadHtmlTX").on("click", function() {
        
        let nombreApp = $("#nombreApp").val();

        var combinedData = {"csharp":{},"tx":{} };
        fetch('Template/controller.html').then(function(response){ 
                return response.text()
        }).then(function(htmlTemplate){
            let data = {};
            data.csharp = htmlTemplate;
            data.tx = $("#txHtml").val();

            let nombreTX = $(data.tx).find("#TextBoxTransaccion").val();

            let nombreTXUpper = nombreTX.charAt(0).toUpperCase() + nombreTX.slice(1);
            let nombreTXLower = nombreTX.charAt(0).toLowerCase() + nombreTX.slice(1);

            let nombreAppUpper = nombreApp.charAt(0).toUpperCase() + nombreApp.slice(1);

            let html = "";
            let htmlModel = "";
            
            data.csharp = data.csharp.replace(/#GUIDTX/g, nombreTXLower);
            data.csharp = data.csharp.replace(/#TX/g, nombreTXUpper);
            data.csharp = data.csharp.replace(/#APP/g, nombreAppUpper);

            $(data.tx).find("#ListTables option" ).each(function( index, element ) {

                    let table = $(element).text();
                    if(table != "WsMessage") {
                        let tableUpper = table.charAt(0).toUpperCase() + table.slice(1);
                    
                        html += 'result.' + tableUpper + ' = ds.GetList&#60;'+ (nombreTXUpper + '' + tableUpper) + 'Item&#62;("' + table + '");\n\t    ';
                        htmlModel += 'public IList&#60;' + (nombreTXUpper + '' + tableUpper) + 'Item&#62; ' + tableUpper + ' { get; set; }\n\t    ';
                    }
            });

            data.csharp = data.csharp.replace(/#RETURNS/g, html);
            data.csharp = data.csharp.replace(/#MODELPROPS/g, htmlModel);
            
            let nombreTabla = $(data.tx).find("#ListTables option:selected").val().charAt(0).toUpperCase() + $(data.tx).find("#ListTables option:selected").val().slice(1);

            data.csharp = data.csharp.replace(/#Tabla/g, nombreTabla);
            
            data.csharp = data.csharp.replace(/#ID/g, $(data.tx).find("#_transaction_guid").val());

            let htmlProps = "";

            $(data.tx).find("#DataGridTableColumns tr" ).each(function( index, element ) {

                if(index != 0 ){
                    let nombreProp  = $(element).find("td").eq(4).html(); 

                    htmlProps += '\n\t    public string ' + nombreProp + ' { get; set; }';
                }

            });
            
            data.csharp = data.csharp.replace(/#PROPS/g, htmlProps);


            let htmlPropsImport = "";
            let htmlDataAccess = "";
            $(data.tx).find("#DataGridParameters tr" ).each(function( index, element ) {

                if(index != 0 ){
                    let nombreProp  = $(element).find("td").eq(5).html();
                    htmlPropsImport += '\n\t      public string ' + nombreProp + ' { get; set; }';
                    htmlDataAccess += '\n\t      .AddParameter("' + nombreProp + '", import.' + nombreProp + ')';
                }

            });

            data.csharp = data.csharp.replace(/#IPROPS/g, htmlPropsImport);
            data.csharp = data.csharp.replace(/#DATAACCESS/g, htmlDataAccess);

            return data.csharp;
        }).then(function(csHtml) {
            $(".preview").html(csHtml);
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });;
    });
        
});