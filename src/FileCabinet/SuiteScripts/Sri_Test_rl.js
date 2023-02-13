/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */

        var studentid;

        const get = (requestParams) => {
            //get the detail of student record.
            try {
                var studentName = requestParams.name;
                var studentId = requestParams.id;
                var filters = [];
                
                if (!isEmpty(studentName)) {
                    filters.push(["name", "contains", studentName])
                }

                else {
                    filters.push(["internalid", "is", studentId])
                }

                var studentSearch = search.create({
                    type: "customrecord_wipfli_student",
                    filters: filters,
                    columns:
                        [
                            search.createColumn({ name: "name", label: "name" }),
                            search.createColumn({ name: "custrecord_wipfli_student_ages", label: "age" }),
                            search.createColumn({ name: "custrecord_wipfli_student_email", label: "email" })
                        ]

                });
                var searchResult = studentSearch.run();

                var searchObject = searchResult.getRange(0, 1000);

                var studentDetail = [];
                if (searchObject.length < 1) {
                    return studentName + " record is not found"
                }
                for (i = 0; i < searchObject.length; i++) {
                    var studentname = searchObject[i].getValue({ name: "name" })
                    var studentAge = searchObject[i].getValue({ name: "custrecord_wipfli_student_ages" })
                    var studentEmail = searchObject[i].getValue({ name: "custrecord_wipfli_student_email" })

                    studentDetail.push({
                        name: studentname,
                        age: studentAge,
                        email: studentEmail
                    });


                }
                return studentDetail;

            }

            catch (e) {
                log.error({
                    title: "Error in get function",
                    details: e.message
                })
                return e.message;

            }

            // function isEmpty(value) { return value === '' || value === null || value === undefined; }
        }

        const post = (requestbody) => {

            for (i = 0; i < requestbody.length; i++) {
                var studata = requestbody[i].student;
                var biodata = requestbody[i].biodata;

                var result = studentRecord(studata);
                if (result == true) {
                    var bioresult = bioData(biodata);
                    return bioresult;
                }
                else {
                    return result;
                }
            }


        }

        const put = (requestBody) => {
            try {
                var age = requestBody.age;
                var email = requestBody.email;
                var phone = requestBody.phone;
                var edu = requestBody.edu;
                var msg = requestBody.msg;
                var id = requestBody.id;

                var biorecord = record.load({
                    type: 'customrecord_wipfli_vtu_student',
                    id: id
                })

                if (age) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_student_age',
                        value: age
                        // value:678954321
                    })
                }

                if (email) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_email',
                        value: email
                        // value:678954321
                    })
                }


                if (phone) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_phno',
                        value: phone
                        // value:678954321
                    })
                }

                if (msg) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_phno',
                        value: phone
                        // value:678954321
                    })
                }

                if (edu) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_phno',
                        value: phone
                        // value:678954321
                    })
                }

                var subject = requestBody.subject;
                log.debug("subject",subject);

                var linecount = biorecord.getLineCount({
                    sublistId: 'recmachcustrecord_wipfli_subject_ref'
                })

                log.debug("linecount", linecount);

                for (i = 0; i < subject.length; i++) {
                    for (j = 0; j < linecount; j++) {
                        subNames = biorecord.getSublistValue({
                            sublistId: 'recmachcustrecord_wipfli_subject_ref',
                            fieldId: 'name',
                            line: j
                        })
                        if (subject[i].name == subNames) {
                            var name = subject[j].name;
                            var internalMarks = subject[j].internalMarks;
                            var externalMarks = subject[j].externalMarks;
                            var total = subject[j].total;

                            log.debug("name",name);
                            log.debug("ie",internalMarks);

                            if(name)
                            {
                            biorecord.setSublistValue({
                                sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                fieldId: 'name',
                                line: j,
                                value: name
                            });
                        }
                        if(internalMarks)
                        {

                            biorecord.setSublistValue({
                                sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                fieldId: 'custrecord_wipfli_subject_ie',
                                line: j,
                                value: internalMarks
                            });
                        }

                        if(externalMarks)
                        {
                            biorecord.setSublistValue({
                                sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                fieldId: 'custrecord_wipfli_subject_external',
                                line: j,
                                value: externalMarks
                            });
                        }
                        if(total)
                        {

                            biorecord.setSublistValue({
                                sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                fieldId: 'custrecord_wipfli_subject_total',
                                line: j,
                                value: total
                            });
                        }
                        }
                    }
                }

                biorecord.save();
                return "record updated successfully"



            }
            catch (e) {
                log.error({
                    title: "error in put function",
                    details: e.message
                })
                return e.message;
            }

        }

        const doDelete = (requestParams) => {
            try {
                var studentId = requestParams.id;
                var Type=requestParams.Type;
                
                if(Type=='student')
                {
                var customrecord_wipfli_vtu_studentSearchObj = search.create({
                    type: "customrecord_wipfli_vtu_student",
                    filters:
                        [
                            ["custrecord_wipfli_vtu_name", "anyof", studentId]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" })
                        ]
                });
                var searchResult = customrecord_wipfli_vtu_studentSearchObj.run();
                var searchObject = searchResult.getRange(0, 1000);

                if (searchObject.length < 1) {
                    return studentId + " record is not found"
                }

                else if (searchObject.length > 0) {

                    for (i = 0; i < searchObject.length; i++) {
                        var bioDataid = searchObject[i].getValue({ name: "internalid" });

                        var bioDataRec = record.load({
                            type: 'customrecord_wipfli_vtu_student',
                            id: bioDataid,
                        })

                        var sublistCount = bioDataRec.getLineCount({
                            sublistId: 'recmachcustrecord_wipfli_subject_ref'
                        })

                        if (sublistCount > 0) {
                            for (i = 0; i < sublistCount; i++) {
                                var subId = bioDataRec.getSublistValue({
                                    sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                    fieldId: 'id',
                                    line: i
                                })

                                var subDelete = record.delete({
                                    type: 'customrecord_wipfli_subjects',
                                    id: subId
                                })

                                log.debug("SUBJECTDELETE", subDelete);
                            }
                        }


                        var bioDelete = record.delete({
                            type: 'customrecord_wipfli_vtu_student',
                            id: bioDataid
                        });

                        log.debug("DELETEBIODATA", bioDelete);


                    }
                }

                var studentDelete = record.delete({
                    type: 'customrecord_wipfli_student',
                    id: studentId
                })

                log.debug("DELETESTUDENT", studentDelete);


                // log.debug("customrecord_wipfli_vtu_studentSearchObj result count", searchResultCount);

                return "student record is deleted successfully"

            }

            else if(Type== 'biodata')
            {
                var id=requestParams.id
                    var subSearch=search.create({
                        type:'customrecord_wipfli_vtu_student',
                        filters:
                        [
                            ["internalid","is",id]
                        ],
                        columns:
                        [
                            // search.createColumn({name:"name",label:"biodat"})
                        ]


                    });
                    var searchResultCount=subSearch.runPaged().count;

                    if(searchResultCount>0)
                    {

                    var bioDataRec = record.load({
                        type: 'customrecord_wipfli_vtu_student',
                        id:id,
                    })

                    var sublistCount = bioDataRec.getLineCount({
                        sublistId: 'recmachcustrecord_wipfli_subject_ref'
                    })

                    if (sublistCount > 0) {
                        for (i = 0; i < sublistCount; i++) {
                            var subId = bioDataRec.getSublistValue({
                                sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                fieldId: 'id',
                                line: i
                            })

                            var subDelete = record.delete({
                                type: 'customrecord_wipfli_subjects',
                                id: subId
                            })

                            log.debug("SUBJECTDELETE", subDelete);
                        }
                    }


                    var bioDelete = record.delete({
                        type: 'customrecord_wipfli_vtu_student',
                        id: id
                    });

                    return "biodata record is deleted successfully"

                    // log.debug("DELETEBIODATA", bioDelete);
                }
                else{
                    return "biodata record is not found with this id"
                }
            }

                else if(Type=="subject")
                {

                    var id=requestParams.id
                    var subSearch=search.create({
                        type:'customrecord_wipfli_subjects',
                        filters:
                        [
                            ["internalid","is",id]
                        ],
                        columns:
                        [
                            search.createColumn({name:"name",label:"biodata"})
                        ]


                    });
                    var searchResultCount=subSearch.runPaged().count;

                    if(searchResultCount>0)
                    {

                    var subjectRec = record.load({
                        type: 'customrecord_wipfli_subjects',
                        id:id,
                    })

                    var subDelete = record.delete({
                        type: 'customrecord_wipfli_subjects',
                        id: id
                    })

                    return "subject record deleted succefully"
                    }
                    else{
                        return "the subject record is not found with this id"
                    }

                    

                }
            
    }
            catch (e) {
                log.error({
                    title: "error in put function",
                    details: e.message
                })
                return e.message;

            }

        }

        function studentRecord(requestbody) {
            try {
                var studentdata = requestbody;

                for (i = 0; i < studentdata.length; i++) {

                    var fname = studentdata[i].fname;
                    var lname = studentdata[i].lname;
                    var age = studentdata[i].age;
                    var email = studentdata[i].email;
                    var phone = studentdata[i].phone;
                    

                    var studentDetail=studentdata[i];
                    for (var key in studentDetail) {
                        if (isEmpty(studentDetail[key])) {
                          return "please enter the "+ key ;
                        }
                      }
                    
                    fullname = fname + " " + lname

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
                    log.debug("name counts", searchResultCount);
                    if (searchResultCount > 0) {
                        return fullname + " already exists";

                    }

                    var studentrecord = record.create({
                        type: 'customrecord_wipfli_student',
                        isDynamic: true
                    })

                    studentrecord.setValue({
                        fieldId: 'name',
                        value: fname + " " + lname
                    })

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_fn',
                        value: fname
                    })

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_ln',
                        value: lname,
                        ignoreFieldChange: false
                    })

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_ages',
                        value: age
                    })

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_email',
                        value: email
                    })

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_phno',
                        value: phone
                    })

                    
                    studentid = studentrecord.save({

                    })

                }
                if (studentid) {
                    return true;
                }
            }
            catch (e) {
                log.error("error in post", e.message);
                return e.message;

            }
        }


        function bioData(requestbody) {
            try {
                var bioDatadetail = requestbody;
                // return bioDatadetail.length;
                for (j = 0; j < bioDatadetail.length; j++) {
                    var name = bioDatadetail[j].name;
                    var age = bioDatadetail[j].age;
                    var email = bioDatadetail[j].email;
                    var phone = bioDatadetail[j].phone;
                    var edu = bioDatadetail[j].edu;
                    var msg = bioDatadetail[j].msg;
                    var subject = bioDatadetail[j].subject;

                    var biorecord = record.create({
                        type: 'customrecord_wipfli_vtu_student',
                        isDynamic: false
                    })
                    log.debug("studentid", studentid);
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_name',
                        value: studentid
                    })


                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_student_age',
                        value: age
                    })


                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_email',
                        value: email
                    })

                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_phno',
                        value: phone
                    })
                    log.debug("edu", edu);

                    biorecord.setText({
                        fieldId: 'custrecord_wipfli_vtu_edu',
                        text: edu,
                        ignoreFieldChange: true
                    })

                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_msg',
                        value: msg
                    })


                    for (k = 0; k < subject.length; k++) {
                        var name = subject[k].name;
                        var internalMarks = subject[k].internalMarks;
                        var externalMarks = subject[k].externalMarks;
                        // var total = subject[k].total;

                        biorecord.setSublistValue({
                            sublistId: 'recmachcustrecord_wipfli_subject_ref',
                            fieldId: 'name',
                            line: k,
                            value: name
                        });

                        biorecord.setSublistValue({
                            sublistId: 'recmachcustrecord_wipfli_subject_ref',
                            fieldId: 'custrecord_wipfli_subject_ie',
                            line: k,
                            value: internalMarks
                        });

                       biorecord.setSublistValue({
                            sublistId: 'recmachcustrecord_wipfli_subject_ref',
                            fieldId: 'custrecord_wipfli_subject_external',
                            line: k,
                            value: externalMarks
                        });

                        biorecord.setSublistValue({
                            sublistId: 'recmachcustrecord_wipfli_subject_ref',
                            fieldId: 'custrecord_wipfli_subject_total',
                            line: k,
                            value: internalMarks+externalMarks
                        });

                    }


                    var recordId = biorecord.save({

                    });



                }
                if (recordId) {
                    return "biodata record is successfully created"
                }



            }
            catch (e) {
                log.error("error in post", e.message);
                return e.message;
            }
        }

        function isEmpty(value) {
            return value === undefined || value === null || value === "";
          }



        return { get, post, put, delete: doDelete }

    });