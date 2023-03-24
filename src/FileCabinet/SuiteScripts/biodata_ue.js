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

            var mode=scriptContext.type;

            if(mode=='edit') {
                scriptContext.form.addButton({
                    id: 'custpage_button',
                    label: 'message',
                    functionName:'message()'
                });
                scriptContext.form.clientScriptModulePath = './biodata_cs.js';
            }
        };

        const beforeSubmit = (scriptContext) => {
            var record=scriptContext.newRecord;
            var subjectone=record.getValue({
                fieldId: 'custrecord1438'
            });

            var subjecttwo=record.getValue({
                fieldId: 'custrecord1439'
            });

            var total=subjectone+subjecttwo;

            record.setValue({
                fieldId: 'custrecord1440',
                value:total
            
            });
            gradeCalculation(scriptContext);
        };

        function gradeCalculation(scriptContext) {
            var record = scriptContext.newRecord;

            var lineCount=record.getLineCount({
                sublistId: 'recmachcustrecord_wipfli_subject_ref'
            });

            for(let i=0;i<lineCount.length;i++) {
                let total=record.getSublistValue({
                    sublistId: 'recmachcustrecord_wipfli_subject_ref',
                    fieldId: 'custrecord_wipfli_subject_total',
                    line:i
                });
                let grade;

                if (total < 45) {
                    grade="fail";
                } else if (total >= 45 && total <= 59) {
                    grade="pass";
                } else if (total >= 60 && total <= 70) {
                    grade="firstclass";
                } else if (total > 70) {
                    grade="distinction";
                }
                record.setSublistValue({
                    sublistId: 'recmachcustrecord_wipfli_subject_ref',
                    fieldId: 'custrecord_wipfli_subject_grade',
                    value: grade,
    
                });
            }
        }
            

        // const afterSubmit = (scriptContext) => {
        //     var currecord=scriptContext.newRecord;
        //     var recid=scriptContext.newRecord.id;
        //     var name=currecord.getValue({
        //         fieldId:'custrecord_wipfli_vtu_name'
        //     })

        //     record.submitFields({
        //         type: 'customrecord_wipfli_college',
        //         id: name,
        //         values: {
        //             'custrecord_wipfli_student_vtu': recid
        //         } 
        //     })
        // }

        
        return {
            beforeLoad,
            beforeSubmit,
            // afterSubmit
        };
    });
