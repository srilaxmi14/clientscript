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
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            log.debug("testing");
            var record=scriptContext.newRecord;
            var mode=scriptContext.type;
            if(mode=='view')
            {
                scriptContext.form.addButton({
                    id: 'custpage_button',
                    label: 'Print',
                    functionName: ''
                })

            }

            
        }

    
        return {
            beforeLoad
        }

    });
