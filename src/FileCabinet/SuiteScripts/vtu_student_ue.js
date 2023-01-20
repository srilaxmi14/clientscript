/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord.id - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            log.debug("testing");
            var record=scriptContext.newRecord;

            var mode=scriptContext.type;

            if(mode=='edit')
            {
                
                scriptContext.form.addButton({
                    id: 'custpage_button',
                    label: 'message',
                    functionName:'message()'
                })
                scriptContext.form.clientScriptModulePath = './vtu_student_cs.js';
            }


        }

        const beforeSubmit = (scriptContext) => {
            var record=scriptContext.newRecord;
            var subjectone=record.getValue({
                fieldId: 'custrecord1438'
            });

            var subjecttwo=record.getValue({
                fieldId: 'custrecord1439'
            })

            var total=subjectone+subjecttwo;

            record.setValue({
                fieldId: 'custrecord1440',
                value:total
            
            })

            

             var customrecord_wipfli_studentSearchObj = search.create({
                type: "customrecord_wipfli_student",
                filters:
                [
                   ["custrecord_wipfli_student_fn","is","rajesh"], 
                   "AND", 
                   ["custrecord_wipfli_student_ln","is","shetty"]
                ],
                columns:
                [
                   search.createColumn({name: "custrecord_wipfli_student_fn", label: "First name"}),
                   search.createColumn({name: "custrecord_wipfli_student_ln", label: "last name"})
                ]
             });
             var searchResultCount = customrecord_wipfli_studentSearchObj.runPaged().count;
             log.debug("customrecord_wipfli_studentSearchObj result count",searchResultCount);
            }

        const afterSubmit = (scriptContext) => {
            var currecord=scriptContext.newRecord;
            var recid=scriptContext.newRecord.id;
            var name=currecord.getValue({
                fieldId:'custrecord_wipfli_vtu_name'
            })

            record.submitFields({
                type: 'customrecord_wipfli_student',
                id: name,
                values: {
                    'custrecord_wipfli_student_vtu': recid
                } 
            })
        }

        
        return {
            beforeLoad,
            beforeSubmit,
            afterSubmit
        }

    });
