/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search', 'N/runtime', 'N/file'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, runtime, file) => {
        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try {
                var downloadedFile = runtime.getCurrentScript().getParameter("custscript_wipfli_folder_id");
                if (!downloadedFile) {
                    log.debug("downloaded file is not available", "");
                    return;
                }
                //load a file
                var files = file.load({
                    id: downloadedFile
                });
                log.debug("file loaded", files);

                // get the content of the file
                var fileContents = files.getContents().split(/\n|\n\r/);
                log.debug("file contents", fileContents);
                for (var j = 1; j < fileContents.length - 1; j++) {
                    var fileColumns = fileContents[j].split(",");
                    //creating the college record
                    var collegeRecord = record.create({
                        type: 'customrecord_wipfli_college'
                    });
                    var fullName = fileColumns[0] + " " + fileColumns[1];
                    //sets the fields in college record
                    collegeRecord.setValue({
                        fieldId: 'name',
                        value: fullName
                    });
                    collegeRecord.setValue({
                        fieldId: 'custrecord_wipfli_student_fn',
                        value: fileColumns[0]
                    });
                    collegeRecord.setValue({
                        fieldId: 'custrecord_wipfli_student_ln',
                        value: fileColumns[1]
                    });
                    collegeRecord.setValue({
                        fieldId: 'custrecord_wipfli_student_ages',
                        value: fileColumns[2]
                    });
                    var date = new Date(fileColumns[3]);
                    collegeRecord.setValue({
                        fieldId: 'custrecord_wipfli_student_dob',
                        value: date
                    });
                    collegeRecord.setValue({
                        fieldId: 'custrecord_wipfli_student_email',
                        value: fileColumns[4]
                    });
                    collegeRecord.setValue({
                        fieldId: 'custrecord_wipfli_student_phno',
                        value: fileColumns[5]
                    });

                    var year = fileColumns[6].replace(/\r$/, "");
                    collegeRecord.setText({
                        fieldId: 'custrecord_wipfli_year',
                        text: year
                    });

                    collegeRecord.save({
                        ignoreMandatoryFields: true
                    });
                }
            } catch (e) {
                log.error("error in college details ", e.message);
            }
        };

        return { execute };
    });
