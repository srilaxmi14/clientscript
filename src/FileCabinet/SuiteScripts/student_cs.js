/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/currentRecord'],
    /**
     * @param{record} record
     */
    function (record, search, currentRecord) {

        var pageMode;

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
            pageMode=scriptContext.mode;



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
            if (scriptContext.fieldId == 'custrecord_wipfli_student_ln') {
                console.log("field change ");
                var firstName = record.getValue({
                    fieldId: 'custrecord_wipfli_student_fn'
                })

                var lastName = record.getValue({
                    fieldId: 'custrecord_wipfli_student_ln'
                })

                var fullname = firstName + " " + lastName;

                record.setValue({
                    fieldId: 'name',
                    value: fullname,
                    // ignoreFieldChange: boolean
                })

            } 

            //to get the age field when dob is clicked
            if (scriptContext.fieldId == 'custrecord_wipfli_student_dob'){
                var getDate=record.getValue({
                    fieldId:'custrecord_wipfli_student_dob'
                })
                var dob = new Date(getDate);
                var dobyear = dob.getFullYear();
                var currentDate= new Date();
                var year = currentDate.getFullYear();
                console.log("Dates",year);
                console.log("Date of the birth",dobyear);

                var currentAge=year-dobyear;
                record.setValue({
                    fieldId:'custrecord_wipfli_student_ages',
                    value:currentAge
                })
     
            }



        }

       
        function validateField(scriptContext) {
            try {
                var recordvalue = scriptContext.currentRecord;
                if (scriptContext.fieldId == 'custrecord_wipfli_student_ages') {
                    var ageValue = recordvalue.getValue({
                        fieldId: 'custrecord_wipfli_student_ages'
                    });
                    if (ageValue) {
                        if (ageValue < 18) {
                            alert("You are not eligible ");
                            recordvalue.setValue({
                                fieldId: 'custrecord_wipfli_student_ages',
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

        function saveRecord(scriptContext) {
            if(pageMode=='create')
            {
            var result=searchForDuplicates(scriptContext);
            console.log("result...",result);
            return result;
            }
            else{
                return true;
            }

            
        }

        function searchForDuplicates(scriptContext) {
            var record=scriptContext.currentRecord;
            var fullname = record.getValue({
                fieldId: 'name'
            })
            console.log("fullname...",fullname);
                console.log("testing");
                var customrecord_wipfli_studentSearchObj = search.create({
                    type: "customrecord_wipfli_student",
                    filters:
                        [
                            ["name", "is", fullname]
                        ],
                    columns: [
                        search.createColumn({ name: "name", label: "name" }),
                    ]
                });
                var searchResultCount = customrecord_wipfli_studentSearchObj.runPaged().count;
                console.log("count:",searchResultCount);
                log.debug("name counts", searchResultCount);
                if (searchResultCount > 0) {
                    alert(fullname + " already exists");
                    return false;
                }
                return true;
        }


        return {
            pageInit:pageInit,
            fieldChanged: fieldChanged,
            validateField: validateField,
            saveRecord: saveRecord

        };

    });
