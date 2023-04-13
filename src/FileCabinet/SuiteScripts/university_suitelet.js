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
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            log.debug("testing in university..","");
            var currentRecId = scriptContext.request.parameters.currentid; 
 
            if (scriptContext.request.method === 'GET') {
                log.debug("currentRecId in univeristy suitelet", currentRecId);
                var Univeristyform = serverWidget.createForm({
                    title: 'Markslist'
                });
                var universityRecord=record.load({
                    type:'customrecord_wipfli_university',
                    id:currentRecId 
                });
                log.debug("University record",universityRecord);

                var name=universityRecord.getValue({
                    fieldId: 'custrecord_wipfli_vtu_name'
                });

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
                var sublist = Univeristyform.addSublist({
                    id: 'subjects',
                    label: 'Subjects',
                    type: serverWidget.SublistType.INLINEEDITOR
                });

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

                var external=sublist.addField({
                    id: 'externalmarks',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'External Marks'
                });
                Univeristyform.addSubmitButton({
                    label: 'save'
                });
                for (var j = 0; j < collegeDetail.length; j++) {
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
            }
            //---------------------------------------------------------------------------------------------------------------

            if(scriptContext.request.method === 'POST') {
                var currentId=scriptContext.request.parameters.university_currentid;
                log.debug("current record id in POST ",currentId);
                
                var universityRec=record.load({
                    type:'customrecord_wipfli_university',
                    id:currentId 
                });
                var studentName=universityRec.getValue({
                    fieldId: 'custrecord_wipfli_vtu_name'
                });
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
                    var internalmarks=scriptContext.request.getSublistValue({
                        group: 'subjects',
                        line: k,
                        name: 'internalmarks'
                    });
                    log.debug("subject marks in university  post",internalmarks);
                    var externalmarks=scriptContext.request.getSublistValue({
                        group: 'subjects',
                        line: k,
                        name: 'externalmarks'
                    });
                    log.debug("externalmarks in university",externalmarks);

                    var total=parseInt(internalmarks)+parseInt(externalmarks);

                    var loadSubIDs = record.load({
                        type: 'customrecord_wipfli_subjects',
                        id: subjectIds[k].subjectId,
                    });

                    log.debug("sub record load in posty",loadSubIDs);

                    loadSubIDs.setValue({
                        fieldId: 'custrecord_wipfli_subject_external',
                        value: externalmarks
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
                    var recordId= loadSubIDs.save();
                    log.debug("recordId",recordId);
                }
                redirect.toRecord({
                    type: 'customrecord_wipfli_university', 
                    id: currentId,
                });
            }
        };
        return {onRequest};
    });
