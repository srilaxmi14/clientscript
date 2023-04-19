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
            if(scriptContext.type=='view') {
                var currentRecId = scriptContext.newRecord.id;
                scriptContext.form.addButton({
                    id: 'custpage_button',
                    label: 'print',
                    functionName:'generatePdf('+currentRecId+')'
                });
                scriptContext.form.clientScriptModulePath = './university_cs.js';
            }

            if(scriptContext.type=='view') {
                var currentId = scriptContext.newRecord.id;
                scriptContext.form.addButton({
                    id: 'custpage_external_button',
                    label: 'Enter External Marks',
                    functionName:'enterExternalMarks('+currentId+')'
                });
                scriptContext.form.clientScriptModulePath = './university_cs.js';
            }
        };

        return {beforeLoad};
    });
