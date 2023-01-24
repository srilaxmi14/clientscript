/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccountz
 */
define(['N/record', 'N/url', 'N/search', 'N/currentRecord','N/format'],
    /**
     * @param{record} record
     */
    function (record, url, search, currentRecord,format) {

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
            console.log(scriptContext);
            autoPopulate(scriptContext);
            var record = scriptContext.currentRecord;

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


        function message() {
            var record = currentRecord.get();
            var nameval = record.getText({
                fieldId: 'custrecord_wipfli_vtu_name'
            });
            console.log("name:",nameval);


            record.setValue({
                fieldId: 'custrecord_wipfli_vtu_msg',
                value: 'Hello '+nameval+',All the best for your academics'

            })
        }

        function autoPopulate(scriptContext)
        {  var record = currentRecord.get();
            if (scriptContext.fieldId == 'custrecord_wipfli_vtu_name') {
            var nameval = record.getValue({
                fieldId: 'custrecord_wipfli_vtu_name'
            });

            var searchval = search.lookupFields({
                type: 'customrecord_wipfli_student',
                id: nameval,
                columns: ['custrecord_wipfli_student_ages', 'custrecord_wipfli_student_email', 'custrecord_wipfli_student_phno', 'custrecord_wipfli_student_dob']

            })
            log.debug(searchval);

            var searchField = searchval['custrecord_wipfli_student_ages']
            var searchemail = searchval['custrecord_wipfli_student_email']
            var searchphno = searchval['custrecord_wipfli_student_phno']
            var searchdob = searchval['custrecord_wipfli_student_dob']
           console.log("date format:",searchdob);
           log.debug("date:",searchdob)
            var date = new Date(searchdob)

          
            log.debug(searchField);

            record.setValue({
                fieldId: 'custrecord_wipfli_student_age',
                value: searchField

            })


            record.setValue({
                fieldId: 'custrecord_wipfli_vtu_email',
                value: searchemail

            })
            record.setValue({
                fieldId: 'custrecord_wipfli_vtu_phno',
                value: searchphno

            })
            record.setValue({
                fieldId: 'custrecord_wipfli_vtu_dob',
                value: date

            })


        }}

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            message:message,
           
        };

    });
