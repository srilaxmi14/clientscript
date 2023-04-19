/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/url', 'N/search', 'N/currentRecord', 'N/format','N/https'],
    /**
     * @param{record} record
     */
    function (record, url, search, currentRecord, format,https) {
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
            });
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
            var Record = scriptContext.currentRecord;

            if (scriptContext.fieldId == 'custrecord_wipfli_vtu_student_active') {
                var active = Record.getValue({
                    fieldId: 'custrecord_wipfli_vtu_student_active'
                });
                var percent = Record.getField({
                    fieldId: 'custrecord_wipfli_vtu_score'
                });
                if (active) {
                    percent.isDisabled = false;
                } else {
                    percent.isDisabled = true;
                }
            }

            if (scriptContext.fieldId == 'custrecord_wipfli_subject_external') {
                var internalMarks = Record.getCurrentSublistValue({
                    sublistId: 'recmachcustrecord1443',
                    fieldId: 'custrecord_wipfli_subject_ie'
                });

                var externalMarks = Record.getCurrentSublistValue({
                    sublistId: 'recmachcustrecord1443',
                    fieldId: 'custrecord_wipfli_subject_external'
                });

                var total = internalMarks + externalMarks;
                console.log("total..",total);

                Record.setCurrentSublistValue({
                    sublistId: 'recmachcustrecord1443',
                    fieldId: 'custrecord_wipfli_subject_total',
                    value: total,
                    ignoreFieldChange: false
                });
            }
            gradeCalculation(scriptContext);
        }

        function gradeCalculation(scriptContext) {
            var record = currentRecord.get();
            if (scriptContext.fieldId == 'custrecord_wipfli_subject_external') {
                var grade = record.getCurrentSublistValue({
                    sublistId: 'recmachcustrecord1443',
                    fieldId: 'custrecord_wipfli_subject_total'
                });
                console.log("grade", grade);

                if (grade < 45) {
                    record.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord1443',
                        fieldId: 'custrecord_wipfli_subject_grade',
                        value: 'fail',
                    });
                } else if (grade >= 45 && grade <= 59) {
                    record.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord1443',
                        fieldId: 'custrecord_wipfli_subject_grade',
                        value: 'pass',

                    });
                } else if (grade >= 60 && grade <= 70) {
                    record.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord1443',
                        fieldId: 'custrecord_wipfli_subject_grade',
                        value: 'firstclass',

                    });
                } else if (grade > 70) {
                    record.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord1443',
                        fieldId: 'custrecord_wipfli_subject_grade',
                        value: 'distinction',

                    });
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
            console.log("name:", nameval);


            record.setValue({
                fieldId: 'custrecord_wipfli_vtu_msg',
                value: 'Hello ' + nameval + ',All the best for your academics'

            });
        }

        function autoPopulate(scriptContext) {
            var record = scriptContext.currentRecord;
            if (scriptContext.fieldId == 'custrecord_wipfli_vtu_name') {
                var nameval = record.getValue({
                    fieldId: 'custrecord_wipfli_vtu_name'
                });
                console.log(nameval);
                // eslint-disable-next-line camelcase
                var customrecord_wipfli_collegeSearchObj = search.create({
                    type: "customrecord_wipfli_college",
                    filters:
                            [
                                ["internalid", "is", nameval]
                            ],
                    columns:
                            [
                                search.createColumn({ name: "custrecord_wipfli_student_ages", label: "age" }),
                                search.createColumn({ name: "custrecord_wipfli_student_email", label: "email" }),
                                search.createColumn({ name: "custrecord_wipfli_student_phno", label: "phone number" }),
                                search.createColumn({ name: "custrecord_wipfli_student_dob", label: "date of birth" })
                            ]
                });

                var searchResult = customrecord_wipfli_collegeSearchObj.run();
                console.log("searchresult", searchResult);

                var searchObject = searchResult.getRange(0, 1000);
                console.log("search object", searchObject.length);


                for (var i = 0; i < searchObject.length; i++) {
                    var searchAge = searchObject[i].getValue({ name: "custrecord_wipfli_student_ages" });
                    record.setValue({
                        fieldId: 'custrecord_wipfli_student_age',
                        value: searchAge
                    });

                    var searchEmail = searchObject[i].getValue({ name: "custrecord_wipfli_student_email" });
                    record.setValue({
                        fieldId: 'custrecord_wipfli_vtu_email',
                        value: searchEmail
                    });

                    var searchPhone = searchObject[i].getValue({ name: "custrecord_wipfli_student_phno" });
                    record.setValue({
                        fieldId: 'custrecord_wipfli_vtu_phno',
                        value: searchPhone
                    });

                    var searchdob = searchObject[i].getValue({ name: "custrecord_wipfli_student_dob" });
                    var date = new Date(searchdob);
                    record.setValue({
                        fieldId: 'custrecord_wipfli_vtu_dob',
                        value: date
                    });
                }
                return true;
            }
        }

        function generatePdf(currentRecId) {
            log.debug("current rec id",currentRecId);
            console.log("current record id",currentRecId);

            var getUrl=url.resolveScript({
                deploymentId:'customdeploy_wipfli_university_pdf_rl',
                scriptId: 'customscript_wipfli_university_pdf_rl',
                params: {
                    'id':currentRecId
                }
            });
            log.debug("url",getUrl);
            console.log("url",getUrl);

            var dataFromRestlet = https.get({
                url: getUrl
            });
            console.log(dataFromRestlet.body);
        }
        function enterExternalMarks(currentId) {
            try{
                log.debug("current rec id in university",currentId);
                var getUrl=url.resolveScript({
                    deploymentId:'customdeploy_wipfli_university_suitelet',
                    scriptId: 'customscript_wipfli_university_suitelet',
                    params: {
                        'currentid':currentId
                    },
                    returnExternalUrl: false

                });
                log.debug("url",getUrl);
                console.log("url",getUrl);
                window.open(getUrl,'_blank','width=400','height=500');
            } catch (e) {
                log.error({
                    title: "error in enter marks function",
                    details: e.message
                });
                return e.message;
            }
        }


        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            message: message,
            generatePdf:generatePdf,
            enterExternalMarks:enterExternalMarks
        };
    });
