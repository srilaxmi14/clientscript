/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search','N/currentRecord', 'N/url'],
/**
 * @param{record} record
 * @param{search} search
 */
    function(record, search, currentRecord,url) {
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
                });

                var lastName = record.getValue({
                    fieldId: 'custrecord_wipfli_student_ln'
                });

                var fullname = firstName + " " + lastName;

                record.setValue({
                    fieldId: 'name',
                    value: fullname,
                });
            } 

            //to get the age field when dob is clicked
            if (scriptContext.fieldId == 'custrecord_wipfli_student_dob'){
                var getDate=record.getValue({
                    fieldId:'custrecord_wipfli_student_dob'
                });
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
                });
            }
        }

    
        /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
        function sublistChanged(scriptContext) {

        }

        /**

     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
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

        /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    
        /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
        function saveRecord(scriptContext) {
        }

        function searchForDuplicates(scriptContext) {
            var record=scriptContext.currentRecord;
            var fullname = record.getValue({
                fieldId: 'name'
            });
            console.log("fullname...",fullname);
            var customrecord_wipfli_collegeSearchObj = search.create({
                type: "customrecord_wipfli_college",
                filters:
                    [
                        ["name", "is", fullname]
                    ],
                columns: [
                    search.createColumn({ name: "name", label: "name" }),
                ]
            });
            var searchResultCount = customrecord_wipfli_collegeSearchObj.runPaged().count;
            console.log("count:",searchResultCount);
            log.debug("name counts", searchResultCount);
            if (searchResultCount > 0) {
                alert(fullname + " already exists");
                return false;
            }
            return true;
        }

        function enterMarks(currentRecId) {
            try{
                log.debug("current rec id in cs",currentRecId);
              

                var getUrl=url.resolveScript({
                    deploymentId:'customdeploy_wipfli_college_suitlet',
                    scriptId: 'customscript_wipfli_college_suitlet',
                    params: {
                        'currentid':currentRecId
                    },
                    returnExternalUrl: false

                });
                log.debug("url",getUrl);
                console.log("url",getUrl);
                window.open(getUrl,'_blank','width=400','height=500');
            } catch (e) {
                log.error({
                    title: "error in generateto function",
                    details: e.message
                });
                return e.message;
            }
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateField: validateField,
            enterMarks:enterMarks
        };
    });
