/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record','N/search'],
    /**
 * @param{record} record
 */
    (record,search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            // var mode=scriptContext.type;
            // if(mode=='view')
            // {
            //     scriptContext.form.addButton({
            //         id: 'custpage_button',
            //         label: 'Print',
            //         functionName: ''
            //     })

            // }

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

            var record=scriptContext.newRecord;
            // var firstname=record.getValue({
            //     fieldId: 'custrecord_wipfli_student_fn'
            // })
            // console.log(firstname);

            // var lastname=record.getValue({
            //     fieldId: 'custrecord_wipfli_student_ln'
            // })

            // var fullname=record.getValue({
            //     fieldId: 'name'
            // })
            // // console.log(fullname);

            // var customrecord_wipfli_studentSearchObj = search.create({
            //     type: "customrecord_wipfli_student",
            //     filters:
            //     [
            //        ["name","is",fullname]
            //     ],
            
            //     columns:[
            //         search.createColumn({name: "name", label: "name"}),
            //     ]
            //  });
            //  var searchResultCount = customrecord_wipfli_studentSearchObj.runPaged().count;
            //  log.debug("name count",searchResultCount);
            //  if(searchResultCount>0)
            //  {
            //     alert("Person already exists");
            //  }


            // var customrecord_wipfli_studentSearchObj = search.create({
            //     type: "customrecord_wipfli_student",
            //     filters:
            //     [
            //        ["custrecord_wipfli_student_fn","is","rajesh"], 
            //        "AND", 
            //        ["custrecord_wipfli_student_ln","is","shetty"]
            //     ],
            //     columns:
            //     [
            //        search.createColumn({name: "custrecord_wipfli_student_fn", label: "First name"}),
            //        search.createColumn({name: "custrecord_wipfli_student_ln", label: "last name"})
            //     ]
            //  });
            //  var searchResultCount = customrecord_wipfli_studentSearchObj.runPaged().count;
            //  log.debug("customrecord_wipfli_studentSearchObj result count",searchResultCount);

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        // const afterSubmit = (scriptContext) => {

        // }

        return {beforeLoad, beforeSubmit}

    });
