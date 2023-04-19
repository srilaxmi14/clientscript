/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search','N/ui/serverWidget','N/redirect'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search,serverWidget,redirect) => {
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                try{
                    var currentRecId = scriptContext.request.parameters.currentid; 
                    log.debug("currentRecId in univeristy suitelet", currentRecId);

                    //form to add external marks 
                    var Univeristyform = serverWidget.createForm({
                        title: 'Markslist'
                    });
                    var universityRecord=record.load({
                        type:'customrecord_wipfli_university',
                        id:currentRecId 
                    });
                    var name=universityRecord.getValue({
                        fieldId: 'custrecord_wipfli_vtu_name'
                    });

                    var collegeDetail= getCollegeDetails(name);

                    var sublist = Univeristyform.addSublist({
                        id: 'subjects',
                        label: 'Subjects',
                        type: serverWidget.SublistType.INLINEEDITOR
                    });
                    //add fields in the form

                    Univeristyform.addField({
                        id: 'university_currentid',
                        label:'current id',
                        type:serverWidget.FieldType.TEXT,
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN 
                    }).defaultValue=currentRecId;

                    var subject=sublist.addField({
                        id: 'subjectname',
                        label: 'Subject Name',
                        type: serverWidget.FieldType.TEXT
                    });
                    var internal=sublist.addField({
                        id: 'internalmarks',
                        type: serverWidget.FieldType.INTEGER,
                        label: 'Internal Marks'
                    });
                    subject.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });

                    internal.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });

                    sublist.addField({
                        id: 'externalmarks',
                        type: serverWidget.FieldType.INTEGER,
                        label: 'External Marks'
                    });
                    Univeristyform.addSubmitButton({
                        label: 'save'
                    });
                    for (var j = 0; j < collegeDetail.length; j++) {
                        //set the subject names,internal marks in the form
                        var setSubject=sublist.setSublistValue({
                            id: 'subjectname',
                            line: j,
                            value: collegeDetail[j].name
                        });
                        var setInternalMarks=sublist.setSublistValue({
                            id: 'internalmarks',
                            line: j,
                            value: collegeDetail[j].internalmarks
                        });
                    }

                    scriptContext.response.writePage(Univeristyform);
                } catch (e) {
                    log.error("error in post", e.message);
                    return e.message;
                }
            }
            //---------------------------------------------------------------------------------------------------------------

            if(scriptContext.request.method === 'POST') {
                try{
                    var currentId=scriptContext.request.parameters.university_currentid;
                    log.debug("current record id in POST ",currentId);
                
                    var universityRec=record.load({
                        type:'customrecord_wipfli_university',
                        id:currentId 
                    });
                    var studentName=universityRec.getValue({
                        fieldId: 'custrecord_wipfli_vtu_name'
                    });
                    var subjectIds=getSubjectID(studentName);

                    log.debug("University record in POST ",universityRec);

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
                        var subInternalMarks=scriptContext.request.getSublistValue({
                            group: 'subjects',
                            line: k,
                            name: 'internalmarks'
                        });
                        var subExternalMarks=scriptContext.request.getSublistValue({
                            group: 'subjects',
                            line: k,
                            name: 'externalmarks'
                        });

                        var total=parseInt(subInternalMarks)+parseInt(subExternalMarks);

                        var loadSubIDs = record.load({
                            type: 'customrecord_wipfli_subjects',
                            id: subjectIds[k].subjectId,
                        });

                        log.debug("sub record load in posty",loadSubIDs);

                        //set marks,total and grade in the subject record.
                        loadSubIDs.setValue({
                            fieldId: 'custrecord_wipfli_subject_external',
                            value: subExternalMarks
                        });

                        loadSubIDs.setValue({
                            fieldId: 'custrecord1446',
                            value: currentId
                        });

                        loadSubIDs.setValue({
                            fieldId: 'custrecord_wipfli_subject_total',
                            value: total
                        });

                        loadSubIDs.setValue({
                            fieldId: 'custrecord1446',
                            value: currentId
                        });

                        if (total < 45 ){
                            loadSubIDs.setValue({
                                fieldId: 'custrecord_wipfli_subject_grade',
                                value: 'FAIL' 
                            });
                        }else if (total >= 45 && total <= 59){
                            loadSubIDs.setValue({
                                fieldId: 'custrecord_wipfli_subject_grade',
                                value: 'PASS' 
                            });
                        } else if (total >= 60 && total <= 70){
                            loadSubIDs.setValue({
                                fieldId: 'custrecord_wipfli_subject_grade',
                                value: 'FIRST CLASS' 
                            });
                        }else if (total > 70){
                            loadSubIDs.setValue({
                                fieldId: 'custrecord_wipfli_subject_grade',
                                value: 'DISTINCTION' 
                            });
                        }
                        loadSubIDs.save();
                    }
                    redirect.toRecord({
                        type: 'customrecord_wipfli_university', 
                        id: currentId,
                    });
                } catch (e) {
                    log.error("error in post", e.message);
                    return e.message;
                }
            }
        };
        

        function getCollegeDetails(name) {
            try{
                var collegeSearch = search.create({
                    type: "customrecord_wipfli_college",
                    filters:
            [
                ["internalidnumber","equalto",name]
            ],
                    columns:
            [
                search.createColumn({
                    name: "name",
                    sort: search.Sort.ASC,
                    label: "Name"
                }),
                search.createColumn({name: "internalid", label: "Internal ID"}),
                search.createColumn({
                    name: "custrecord_wipfli_subject_ie",
                    join: "CUSTRECORD1445",
                    label: "Internal marks"
                }),
                search.createColumn({
                    name: "name",
                    join: "CUSTRECORD1445",
                    label: "Name"
                }),
                search.createColumn({
                    name: "internalid",
                    join: "CUSTRECORD1445",
                    label: "Internal ID"
                })
            ]
                });
                var searchResult = collegeSearch.run();

                var searchObject = searchResult.getRange(0, 1000);

                var collegeDetail = [];
                for (var i = 0; i < searchObject.length; i++) {
                    var subjectName = searchObject[i].getValue({   name: "name",join: "CUSTRECORD1445" });
                    log.debug("subject name",subjectName);
                    var internalMarks = searchObject[i].getValue({ name: "custrecord_wipfli_subject_ie",join: "CUSTRECORD1445"});
                    log.debug("subject marks",internalMarks);
                    collegeDetail.push({
                        name: subjectName,
                        internalmarks:internalMarks,
                    });
                }
                log.debug("subjectDetail",collegeDetail);
                return collegeDetail;
            } catch (e) {
                log.error("error in get college details function", e.message);
                return e.message;
            }
        }


        function getSubjectID(studentName) {
            try{
                var subIdSearch = search.create({
                    type: "customrecord_wipfli_college",
                    filters:
            [
                ["internalidnumber","equalto",studentName]
            ],
                    columns:
            [
                search.createColumn({
                    name: "internalid",
                    join: "CUSTRECORD1445",
                    label: "Internal ID"
                })
            ]
                });
                var subSearchResult = subIdSearch.run();
                var subSearchObject = subSearchResult.getRange(0, 1000);
                log.debug("search object in post",subSearchObject);
                var subjectIds = [];
                for (var l = 0; l < subSearchObject.length; l++) {
                    var subjectId = subSearchObject[l].getValue({ name: "internalid",join: "CUSTRECORD1445"});
                    log.debug("subject ids",subjectId);
                    subjectIds.push({
                        subjectId: subjectId
                    });
                }
                log.debug("sub ids in post",subjectIds);
                return subjectIds;
            }catch (e) {
                log.error("error in get subject id function", e.message);
                return e.message;
            }
        }
        return {onRequest};
    });
