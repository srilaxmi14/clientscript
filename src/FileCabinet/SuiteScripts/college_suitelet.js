/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            log.debug("suitelet called","");
            var currentRecId = scriptContext.request.parameters.currentid; 
            if (scriptContext.request.method === 'GET') {
                log.debug("currentRecId in suitelet", currentRecId);
                var form = serverWidget.createForm({
                    title: 'Markslist'
                });

                form.addField({
                    id: 'current_rec_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Current id'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                }).defaultValue=currentRecId;

                var collegeRecord=record.load({
                    type: 'customrecord_wipfli_college',
                    id: currentRecId
                });
                log.debug("collegeRecord",collegeRecord);

                var getYear=collegeRecord.getValue({
                    fieldId: 'custrecord_wipfli_year'
                });
                log.debug("getYear",getYear);

                
                var subjectSearch = search.create({
                    type: "customrecord_wipfli_subjects",
                    filters:
                    [
                        ["custrecord_wipfli_years","anyof",getYear]
                    ],
                    columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({name: "custrecord_wipfli_years", label: "year"})
                    ]
                });
                var searchResult = subjectSearch.run();

                var searchObject = searchResult.getRange(0, 1000);

                var subjectDetail = [];
                for (var i = 0; i < searchObject.length; i++) {
                    var subjectName = searchObject[i].getValue({ name: "name" });
                    log.debug("subject name",subjectName);
                    var year = searchObject[i].getValue({name: "custrecord_wipfli_years", label: "year" });
                    log.debug("year",year);
                    subjectDetail.push({
                        name: subjectName,
                        year: year
                    });
                }
                log.debug("subjectDetail",subjectDetail);
                var sublist = form.addSublist({
                    id: 'subjects',
                    label: 'Subjects',
                    type: serverWidget.SublistType.INLINEEDITOR
                });
                var subject=sublist.addField({
                    id: 'subjectname',
                    label: 'Subject Name',
                    type: serverWidget.FieldType.TEXT
                });
                sublist.addField({
                    id: 'internalmarks',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Internal Marks'
                });

                subject.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
    
                for (var j = 0; j < subjectDetail.length; j++) {
                    var setSubject=sublist.setSublistValue({
                        id: 'subjectname',
                        line: j,
                        value: subjectDetail[j].name
                    });
                }
                log.debug("setSubject",setSubject);
                var fieldGroup = form.addFieldGroup({
                    id: 'subjects',
                    label: 'Subjects'
                });
                log.debug("fieldgroup",fieldGroup);
                form.addSubmitButton({
                    label: 'Save'
                });
                scriptContext.response.writePage(form);
            }
            if (scriptContext.request.method === 'POST') {
                log.debug("Suitelet is posting.","");
                var currentRec = scriptContext.request.parameters.current_rec_id;
                log.debug("currentRecId in post",currentRec);

                var collegeDetails = record.load({
                    type: 'customrecord_wipfli_college',
                    id: currentRec
                });
                log.debug("collegeDetails in post",collegeDetails);

                var lineCount = scriptContext.request.getLineCount({
                    group: 'subjects'
                });
                log.debug("lineCount",lineCount);

                for(var k=0;k<lineCount;k++) {
                    var subName=scriptContext.request.getSublistValue({
                        group: 'subjects',
                        line: k,
                        name: 'subjectname'
                    });
                    log.debug("subject names in post",subName);
                    var marks=scriptContext.request.getSublistValue({
                        group: 'subjects',
                        line: k,
                        name: 'internalmarks'
                    });
                    log.debug("subject marks in post",marks);
                    var setName=collegeDetails.setSublistValue({
                        sublistId:'recmachcustrecord1442',
                        fieldId: 'name',
                        line:k,
                        value:subName
                    });
                    log.debug("setName",setName);

                    var setMarks=collegeDetails.setSublistValue({
                        sublistId:'recmachcustrecord1442',
                        fieldId: 'custrecord_wipfli_subject_ie',
                        line:k,
                        value:marks
                    });
                    log.debug("setMarks",setMarks);
                }
                var recordId = collegeDetails.save({
                });
            }
        };
        return {onRequest};
    });
