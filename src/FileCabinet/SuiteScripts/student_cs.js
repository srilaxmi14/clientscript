/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/search'],
/**
 * @param{record} record
 */
function(record,search) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
        

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

        var record=scriptContext.currentRecord;
        if(scriptContext.fieldId=='custrecord_wipfli_student_ln')
        {
            console.log("field change ");
        var firstName=record.getValue({
            fieldId: 'custrecord_wipfli_student_fn'
        })

        var lastName=record.getValue({
            fieldId: 'custrecord_wipfli_student_ln'
        })

        var fullname=firstName+" "+lastName;

        record.setValue({
            fieldId:'name',
            value:fullname,
            // ignoreFieldChange: boolean
        })
    }
    

    }

    function saveRecord(scriptContext) {
        var record=scriptContext.currentRecord;
        var fullname=record.getValue({
            fieldId: 'name'
        })
        // console.log(fullname);

        var customrecord_wipfli_studentSearchObj = search.create({
            type: "customrecord_wipfli_student",
            filters:
            [
               ["name","is",fullname]
            ],
            columns:[
                search.createColumn({name: "name", label: "name"}),
            ]
         });
         var searchResultCount = customrecord_wipfli_studentSearchObj.runPaged().count;
         log.debug("name counts",searchResultCount);
         if(searchResultCount>0)
         {
            alert(fullname+" already exists");
         }

    }


    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
      
    };
    
});
