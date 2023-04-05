/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
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
            log.debug("testing uni..",'');
            // if(scriptContext.type==scriptContext.UserEventType.CREATE){
            //     var form=scriptContext.form;
            //     var Unisublist=form.getSublist({
            //         id: 'recmachcustrecord1443'
            //     });
            //     log.debug("sublist..",Unisublist);
            //     var subInternal=Unisublist.getField({
            //         id: 'custrecord_wipfli_subject_ie'
            //     });
            //     log.debug("sublistInter..",subInternal);

            //     subInternal.updateDisplayType({
            //         displayType: 'DISABLED'
            //     });

            //     var subName=Unisublist.getField({
            //         id: 'name'
            //     });
            //     log.debug("sublistInter..",subName);

            //     subName.updateDisplayType({
            //         displayType: 'DISABLED'
            //     });
            // }
            
            if(scriptContext.type=='view') {
                var currentRecId = scriptContext.newRecord.id;
                scriptContext.form.addButton({
                    id: 'custpage_button',
                    label: 'print',
                    functionName:'generatePdf('+currentRecId+')'
                });
                scriptContext.form.clientScriptModulePath = './university_cs.js';
            }
        };

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        };

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        };

        return {beforeLoad, beforeSubmit, afterSubmit};
    });