/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/url'],
    /**
     * @param{record} record
     */
    function (record,url) {

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
            // alert("fill the fields");
            log.debug("hello testing");
            var record = scriptContext.currentRecord;
            var percent = record.getField({
                fieldId: 'custrecord_wipfli_vtu_score'
            })
            percent.isDisabled = true;
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
            var record = scriptContext.currentRecord;
            if (scriptContext.fieldId == 'custrecord_wipfli_vtu_name') {
                log.debug("field change on name");
                record.setValue({
                    fieldId: 'custrecord_wipfli_vtu_email',
                    value: ''
                });

                var nameVal=record.getValue({
                    fieldId: 'custrecord_wipfli_vtu_name'
                });

                

               

            }
            if (scriptContext.fieldId == 'custrecord_wipfli_vtu_student_active') {
                var active = record.getValue({
                    fieldId: 'custrecord_wipfli_vtu_student_active'
                });
                var percent = record.getField({
                    fieldId: 'custrecord_wipfli_vtu_score'
                });
                if (active) {
                    percent.isDisabled = false;
                }
                else {
                    percent.isDisabled = true;
                }
            }
        }


        function saveRecord(scriptContext) {
            var Record = scriptContext.currentRecord;
            var phoneValue = Record.getValue({
                fieldId: 'custrecord_wipfli_vtu_phno'
            });

            if (!phoneValue) {
                alert("please enter the phone number");
                return false;
            }
                return true;

        }

        function validateField(scriptContext) {
            try {
                var recordvalue = scriptContext.currentRecord;
                if (scriptContext.fieldId == 'custrecord_wipfli_student_age') {
                    var ageValue = recordvalue.getValue({
                        fieldId: 'custrecord_wipfli_student_age'
                    });
                    if (ageValue) {
                        if (ageValue < 18) {
                            alert("You are not eligible ");
                            recordvalue.setValue({
                                fieldId: 'custrecord_wipfli_student_age',
                                value: ""
                            });

                            return false;
                        }

                    }
                }
            } catch (e) {
                log.error("error in validate field", e.message);
                return false;
            }
            return true;

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            validateField: validateField

        };

    });
