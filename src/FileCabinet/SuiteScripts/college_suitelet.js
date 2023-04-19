/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget','N/redirect'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget,redirect) => {
        const onRequest = (scriptContext) => {
            try{
                if (scriptContext.request.method === 'GET') {
                    var currentRecId = scriptContext.request.parameters.currentid; 
                    log.debug("currentRecId in suitelet", currentRecId);
                    //form to enter the internal marks
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

                    var AcademicYear=collegeRecord.getValue({
                        fieldId: 'custrecord_wipfli_year'
                    });
                    log.debug("getYear",AcademicYear);

                    var subjectDetail=getSubjects(AcademicYear);

                    //add fields on the form
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
                        //set the subject name 
                        var setSubject=sublist.setSublistValue({
                            id: 'subjectname',
                            line: j,
                            value: subjectDetail[j].name
                        });
                    }
                    log.debug("setSubject",setSubject);
                    form.addSubmitButton({
                        label: 'Save'
                    });
                    scriptContext.response.writePage(form);
                }

                if (scriptContext.request.method === 'POST') {
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
                        var internalMarks=scriptContext.request.getSublistValue({
                            group: 'subjects',
                            line: k,
                            name: 'internalmarks'
                        });
                        if (internalMarks === ''  || internalMarks === undefined || internalMarks === null) {
                            scriptContext.response.write('Please enter internal marks for all subjects.');
                            return;
                        }
                        log.debug("subject marks in post",internalMarks);
                        //set the subject nmes,internal marks in the college record
                        var setName=collegeDetails.setSublistValue({
                            sublistId:'recmachcustrecord1445',
                            fieldId: 'name',
                            line:k,
                            value:subName
                        });
                        log.debug("setName",setName);

                        var setMarks=collegeDetails.setSublistValue({
                            sublistId:'recmachcustrecord1445',
                            fieldId: 'custrecord_wipfli_subject_ie',
                            line:k,
                            value:internalMarks
                        });
                        log.debug("setMarks",setMarks);
                    }
                    var recordId = collegeDetails.save({
                    });
                    redirect.toRecord({
                        type: 'customrecord_wipfli_college', 
                        id: recordId,
                    });
                }
            }catch (e) {
                log.error("error in suitelet", e.message);
                return e.message;
            }
        };

        function getSubjects(currentAcademicYear) {
            try{
                var subjectSearch = search.create({
                    type: "customrecord_wipfli_subjects",
                    filters:
            [
                ["custrecord_wipfli_years","anyof",currentAcademicYear]
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

                return subjectDetail;
            } catch (e) {
                log.error("error in get subject function", e.message);
                return e.message;
            }
        }
        return {onRequest};
    });
