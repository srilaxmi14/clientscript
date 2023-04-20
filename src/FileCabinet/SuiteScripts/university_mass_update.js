/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            const studentRecord = record.load({
                type: 'customrecord_wipfli_university',
                id: params.id
            });
    
            studentRecord.setValue({
                fieldId: 'custrecord_wipfli_university_year',
                value: '2023' 
            });

            studentRecord.save();
        };

        return {each};
    });
