/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/currentRecord', 'N/record', 'N/redirect', 'N/search','N/render','N/file'],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{redirect} redirect
 * @param{search} search
 */
    (currentRecord, record, redirect, search,render,file) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            try{
                var currentId=requestParams.id;
                log.debug("currentId in restlet",currentId);
                generatePdf(currentId);
                return "successfully called";
            } catch (e) {
                log.error({
                    title: "error in function",
                    details: e.message
                });
                return e.message;
            }
        };

        function generateData(currentId) {
            try{
                var universitySearch = search.create({
                    type: "customrecord_wipfli_university",
                    filters:
                    [
                        ["internalid","anyof",currentId]
                    ],
                    columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "custrecord_wipfli_vtu_dob", label: "DOB"}),
                        search.createColumn({name: "custrecord_wipfli_vtu_name", label: "name"}),
                        search.createColumn({name: "custrecord_wipfli_student_age", label: "age"}),
                        search.createColumn({name: "custrecord_wipfli_vtu_email", label: "email"}),
                        search.createColumn({name: "custrecord_wipfli_vtu_phno", label: "phone number"}),
                        search.createColumn({
                            name: "name",
                            join: "CUSTRECORD1443",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "custrecord_wipfli_subject_external",
                            join: "CUSTRECORD1443",
                            label: "external marks"
                        }),
                        search.createColumn({
                            name: "custrecord_wipfli_subject_ie",
                            join: "CUSTRECORD1443",
                            label: "Internal marks"
                        }),
                        search.createColumn({
                            name: "custrecord_wipfli_subject_total",
                            join: "CUSTRECORD1443",
                            label: "total"
                        }),
                        search.createColumn({
                            name: "custrecord_wipfli_subject_grade",
                            join: "CUSTRECORD1443",
                            label: "grade"
                        })
                    ]
                });
                var searchResult = universitySearch.run();

                var searchObject = searchResult.getRange(0, 1000);

                var studentDetail = [];
                if (searchObject.length > 1) {
                    for (var i = 0; i < searchObject.length; i++) {
                        var studentname = searchObject[i].getText({ name: "custrecord_wipfli_vtu_name" });
                        log.debug("student name",studentname);
                        var studentAge = searchObject[i].getValue({name: "custrecord_wipfli_student_age", label: "age" });
                        var studentDob = searchObject[i].getValue({ name: "custrecord_wipfli_vtu_dob", label: "DOB"});
                        var studentEmail = searchObject[i].getValue({ name: "custrecord_wipfli_vtu_email", label: "email"});
                        var studentPhone = searchObject[i].getValue({name: "custrecord_wipfli_vtu_phno", label: "phone number"});
                        var subjectName = searchObject[i].getValue({ name: "name",join: "CUSTRECORD1443"});
                        var subjectExternal = searchObject[i].getValue({  name: "custrecord_wipfli_subject_external",join: "CUSTRECORD1443"});
                        var subjectInternal = searchObject[i].getValue({name: "custrecord_wipfli_subject_ie",join: "CUSTRECORD1443",});
                        var subjectTotal = searchObject[i].getValue({ name: "custrecord_wipfli_subject_total",join: "CUSTRECORD1443"});
                        var subjectGrade = searchObject[i].getValue({ name: "custrecord_wipfli_subject_grade",join: "CUSTRECORD1443"});
                        
                        studentDetail.push({
                            name: studentname,
                            age: studentAge,
                            dob:studentDob,
                            email: studentEmail,
                            phone:studentPhone,
                            subjectName:subjectName,
                            External:subjectExternal,
                            Internal:subjectInternal,
                            Total:subjectTotal,
                            Grade:subjectGrade
                        });
                    }
                    log.debug("student details",studentDetail);
                    return studentDetail;
                }
            } catch (e) {
                log.error({
                    title: "error in generateData ",
                    details: e.message
                });
                return e.message;
            }
        }
        
        function generatePdf(currentId) {
            try{
                let renderer = render.create();
                log.debug("renderer",renderer);
                let details=generateData(currentId);
                log.debug("details",details);
                renderer.setTemplateById(133);
                let dataSource = {};
                dataSource.results = details;
                log.debug("data source",dataSource);
                renderer.addCustomDataSource({
                    format: render.DataSource.OBJECT,
                    alias: 'scriptresults',
                    data: dataSource
                });
                // Render PDF in memory and return as Base64 encoded data
                let pdf= renderer.renderAsPdf();
                log.debug("pdf..",pdf.getContents());
       
                let pdfFile = file.create({
                    name: 'pdftemplate',
                    fileType: file.Type.PDF,
                    contents: pdf.getContents(),
                    folder: 7472
                });
                let id = pdfFile.save();
                log.debug("id",id);
            } catch (e) {
                log.error({
                    title: "error in generateto function",
                    details: e.message
                });
                return e.message;
            }
        }

        return {get};
    });
