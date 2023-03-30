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
            if (scriptContext.request.method === 'GET') {
                var form = serverWidget.createForm({
                    title: 'Markslist'
                });
                var subjectSearch = search.create({
                    type: "customrecord_wipfli_subjects",
                    filters:
                    [
                        ["custrecord_wipfli_years","anyof","1"]
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
                    log.debug("student name",subjectName);
                    var year = searchObject[i].getValue({name: "custrecord_wipfli_years", label: "year" });
                        
                    subjectDetail.push({
                        name: subjectName,
                        year: year,
                        internal:null
                    });
                }
                log.debug("subjectDetail",subjectDetail);
                var sublist = form.addSublist({
                    id: 'subjects',
                    label: 'Subjects',
                    type: serverWidget.SublistType.LIST
                });
                sublist.addField({
                    id: 'subjectname',
                    label: 'Subject Name',
                    type: serverWidget.FieldType.TEXT
                });
                // sublist.addField({
                //     id: 'internalfieldid',
                //     type: serverWidget.FieldType.INTEGER,
                //     label: 'Internal Marks'
                // });
                 sublist.addSublist({
                    id : 'internalfieldid',
                    type : serverWidget.SublistType.INLINEEDITOR,
                    label : 'Internal Marks'
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
        };

        return {onRequest};
    });
