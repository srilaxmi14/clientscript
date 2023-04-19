/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search','N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search,serverWidget) => {
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
            log.debug("testing","");
            try{
                if(scriptContext.type==scriptContext.UserEventType.CREATE){
                    var form=scriptContext.form;
                    var sublist=form.getSublist({
                        id: 'recmachcustrecord1442'
                    });
                    log.debug("sublist..",sublist);
                    var subExternal=sublist.getField({
                        id: 'custrecord_wipfli_subject_external'
                    });
                    log.debug("sublist",subExternal);

                    subExternal.updateDisplayType({
                        displayType: 'DISABLED'
                    });

                    var subtotal=sublist.getField({
                        id: 'custrecord_wipfli_subject_total'
                    });
                    log.debug("sublist",subtotal);

                    subtotal.updateDisplayType({
                        displayType: 'DISABLED'
                    });

                    var subgrade=sublist.getField({
                        id: 'custrecord_wipfli_subject_grade'
                    });
                    log.debug("sublist",subgrade);

                    subgrade.updateDisplayType({
                        displayType: 'DISABLED'
                    });
                }
                if(scriptContext.type=='view') {
                    var currentRecId = scriptContext.newRecord.id;
                    scriptContext.form.addButton({
                        id: 'custpage_button',
                        label: 'Enter Internal Marks',
                        functionName:'enterMarks('+currentRecId+')'
                    });
                    scriptContext.form.clientScriptModulePath = './College_cs.js';
                }
            }catch (e) {
                log.error({
                    title: "error in generateto function",
                    details: e.message
                });
                return e.message;
            }
        };

        return {beforeLoad};
    });
