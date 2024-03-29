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
                    filters.push(["name", "contains", studentName]);
                } else {
                    filters.push(["internalid", "is", studentId]);
                }

                var studentSearch = search.create({
                    type: "customrecord_wipfli_college",
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
                    return studentName + " record is not found";
                }
                for (var i = 0; i < searchObject.length; i++) {
                    var studentname = searchObject[i].getValue({ name: "name" });
                    var studentAge = searchObject[i].getValue({ name: "custrecord_wipfli_student_ages" });
                    var studentEmail = searchObject[i].getValue({ name: "custrecord_wipfli_student_email" });

                    studentDetail.push({
                        name: studentname,
                        age: studentAge,
                        email: studentEmail
                    });
                }
                return studentDetail;
            } catch (e) {
                log.error({
                    title: "Error in get function",
                    details: e.message
                });
                return e.message;
            }

            // function isEmpty(value) { return value === '' || value === null || value === undefined; }
        };

        const post = (requestbody) => {
            for (var i = 0; i < requestbody.length; i++) {
                var studata = requestbody[i].student;
                var biodata = requestbody[i].biodata;

                var result = studentRecord(studata);
                if (result == true) {
                    if(biodata) {
                        var bioresult = bioData(biodata);
                        return bioresult;
                    }
                } else {
                    return result;
                }
            }
        };

        const put = (requestBody) => {
            try {
                var age = requestBody.age;
                var email = requestBody.email;
                var phone = requestBody.phone;
                var edu = requestBody.edu;
                var msg = requestBody.msg;
                var id = requestBody.id;

                var biorecord = record.load({
                    type: 'customrecord_wipfli_university',
                    id: id
                });

                if (age) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_student_age',
                        value: age
              
                    });
                }

                if (email) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_email',
                        value: email
                
                    });
                }


                if (phone) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_phno',
                        value: phone
            
                    });
                }

                if (msg) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_phno',
                        value: msg
           
                    });
                }

                if (edu) {
                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_phno',
                        value: edu
                
                    });
                }

                var subject = requestBody.subject;
                log.debug("subject",subject);

                var linecount = biorecord.getLineCount({
                    sublistId: 'recmachcustrecord_wipfli_subject_ref'
                });

                log.debug("linecount", linecount);

                for (var i = 0; i < subject.length; i++) {
                    for (var j = 0; j < linecount; j++) {
                        var subNames = biorecord.getSublistValue({
                            sublistId: 'recmachcustrecord_wipfli_subject_ref',
                            fieldId: 'name',
                            line: j
                        });
                        if (subject[i].name == subNames) {
                            var name = subject[j].name;
                            var internalMarks = subject[j].internalMarks;
                            var externalMarks = subject[j].externalMarks;
                     
                            log.debug("name",name);
                            log.debug("ie",internalMarks);

                            if(name) {
                                biorecord.setSublistValue({
                                    sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                    fieldId: 'name',
                                    line: j,
                                    value: name
                                });
                            }
                            if(internalMarks) {
                                biorecord.setSublistValue({
                                    sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                    fieldId: 'custrecord_wipfli_subject_ie',
                                    line: j,
                                    value: internalMarks
                                });
                            }

                            if(externalMarks) {
                                biorecord.setSublistValue({
                                    sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                    fieldId: 'custrecord_wipfli_subject_external',
                                    line: j,
                                    value: externalMarks
                                });
                            }

                            biorecord.setSublistValue({
                                sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                fieldId: 'custrecord_wipfli_subject_total',
                                line: j,
                                value:internalMarks+externalMarks
                            });
                        }
                    }
                }

                biorecord.save();
                return "record updated successfully";
            } catch (e) {
                log.error({
                    title: "error in put function",
                    details: e.message
                });
                return e.message;
            }
        };

        const doDelete = (requestParams) => {
            try {
                var studentId = requestParams.id;
                var Type=requestParams.Type;
                
                if(Type=='student') {
                    var deleteStudentSearch = search.create({
                        type: "customrecord_wipfli_university",
                        filters:
                        [
                            ["custrecord_wipfli_vtu_name", "anyof", studentId]
                        ],
                        columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" })
                        ]
                    });
                    var searchResult = deleteStudentSearch.run();
                    var searchObject = searchResult.getRange(0, 1000);

                    if (searchObject.length < 1) {
                        return studentId + " record is not found";
                    } else if (searchObject.length > 0) {
                        for (var i = 0; i < searchObject.length; i++) {
                            var bioDataid = searchObject[i].getValue({ name: "internalid" });

                            var bioDataRec = record.load({
                                type: 'customrecord_wipfli_university',
                                id: bioDataid,
                            });

                            var sublistCount = bioDataRec.getLineCount({
                                sublistId: 'recmachcustrecord_wipfli_subject_ref'
                            });

                            if (sublistCount > 0) {
                                for (i = 0; i < sublistCount; i++) {
                                    var subId = bioDataRec.getSublistValue({
                                        sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                        fieldId: 'id',
                                        line: i
                                    });

                                    var subDelete = record.delete({
                                        type: 'customrecord_wipfli_subjects',
                                        id: subId
                                    });

                                    log.debug("SUBJECTDELETE", subDelete);
                                }
                            }


                            var bioDelete = record.delete({
                                type: 'customrecord_wipfli_university',
                                id: bioDataid
                            });

                            log.debug("DELETEBIODATA", bioDelete);
                        }
                    }

                    var studentDelete = record.delete({
                        type: 'customrecord_wipfli_college',
                        id: studentId
                    });

                    log.debug("DELETESTUDENT", studentDelete);


                    // log.debug("customrecord_wipfli_universitySearchObj result count", searchResultCount);

                    return "student record is deleted successfully";
                } else if(Type== 'biodata') {
                    var id=requestParams.id;
                    var bioDataSearch=search.create({
                        type:'customrecord_wipfli_university',
                        filters:
                        [
                            ["internalid","is",id]
                        ],
                        columns:
                        [
                            // search.createColumn({name:"name",label:"biodat"})
                        ]


                    });
                    var searchResultCount=bioDataSearch.runPaged().count;

                    if(searchResultCount>0) {
                        // eslint-disable-next-line no-redeclare
                        var bioDataRec = record.load({
                            type: 'customrecord_wipfli_university',
                            id:id,
                        });

                        // eslint-disable-next-line no-redeclare
                        var sublistCount = bioDataRec.getLineCount({
                            sublistId: 'recmachcustrecord_wipfli_subject_ref'
                        });

                        if (sublistCount > 0) {
                            for (i = 0; i < sublistCount; i++) {
                                // eslint-disable-next-line no-redeclare
                                var subId = bioDataRec.getSublistValue({
                                    sublistId: 'recmachcustrecord_wipfli_subject_ref',
                                    fieldId: 'id',
                                    line: i
                                });

                                // eslint-disable-next-line no-redeclare
                                var subDelete = record.delete({
                                    type: 'customrecord_wipfli_subjects',
                                    id: subId
                                });

                                log.debug("SUBJECTDELETE", subDelete);
                            }
                        }


                        // eslint-disable-next-line no-redeclare
                        var bioDelete = record.delete({
                            type: 'customrecord_wipfli_university',
                            id: id
                        });

                        return "biodata record is deleted successfully";

                    // log.debug("DELETEBIODATA", bioDelete);
                    } else{
                        return "biodata record is not found with this id";
                    }
                } else if(Type=="subject") {
                    // eslint-disable-next-line no-redeclare
                    var id=requestParams.id;
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
                    // eslint-disable-next-line no-redeclare
                    var searchResultCount=subSearch.runPaged().count;

                    if(searchResultCount>0) {
                        // eslint-disable-next-line no-unused-vars
                        var subjectRec = record.load({
                            type: 'customrecord_wipfli_subjects',
                            id:id,
                        });

                        // eslint-disable-next-line no-redeclare
                        var subDelete = record.delete({
                            type: 'customrecord_wipfli_subjects',
                            id: id
                        });

                        return "subject record deleted succefully";
                    } else{
                        return "the subject record is not found with this id";
                    }
                }
            } catch (e) {
                log.error({
                    title: "error in put function",
                    details: e.message
                });
                return e.message;
            }
        };

        function studentRecord(requestbody) {
            try {
                var studentdata = requestbody;

                for (var i = 0; i < studentdata.length; i++) {
                    var fname = studentdata[i].fname;
                    var lname = studentdata[i].lname;
                    var dateOfBirth = studentdata[i].dateOfBirth;
                    var studentDateOfBirth=new Date(dateOfBirth);
                    var email = studentdata[i].email;
                    var phone = studentdata[i].phone;
                    

                    var studentDetail=studentdata[i];
                    for (var key in studentDetail) {
                        if (isEmpty(studentDetail[key])) {
                            return "please enter the "+ key ;
                        }
                    }
                    
                    var fullname = fname + " " + lname;

                    var studentSearch = search.create({
                        type: "customrecord_wipfli_college",
                        filters:
                            [
                                ["name", "is", fullname]
                            ],
                        columns: [
                            search.createColumn({ name: "name", label: "name" }),
                        ]
                    });
                    var searchResultCount = studentSearch.runPaged().count;
                    log.debug("name counts", searchResultCount);
                    if (searchResultCount > 0) {
                        return fullname + " already exists";
                    }

                    var studentrecord = record.create({
                        type: 'customrecord_wipfli_college',
                        isDynamic: true
                    });

                    studentrecord.setValue({
                        fieldId: 'name',
                        value: fname + " " + lname
                    });

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_fn',
                        value: fname
                    });

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_ln',
                        value: lname,
                        ignoreFieldChange: false
                    });

                    var today=new Date();
                    var studentAge=today.getFullYear()-studentDateOfBirth.getFullYear();

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_ages',
                        value: studentAge
                    });

                    
                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_dob',
                        value: studentDateOfBirth
                    });

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_email',
                        value: email
                    });

                    studentrecord.setValue({
                        fieldId: 'custrecord_wipfli_student_phno',
                        value: phone
                    });

                    
                    studentid = studentrecord.save({

                    });

                    log.debug("studentid",studentid);
                }
                if (studentid) {
                    return true;
                }
            } catch (e) {
                log.error("error in post", e.message);
                return e.message;
            }
        }


        function bioData(requestbody) {
            try {
                var bioDataDetail = requestbody;
                // return bioDataDetail.length;
                for (var j = 0; j < bioDataDetail.length; j++) {
                    // var name = bioDataDetail[j].name;
                    var edu = bioDataDetail[j].edu;
                    var msg = bioDataDetail[j].msg;
                    var subject = bioDataDetail[j].subject;

                    var biorecord = record.create({
                        type: 'customrecord_wipfli_university',
                        isDynamic: false
                    });

                    log.debug("studentid...", studentid);


                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_name',
                        value: studentid
                    });

                    var studentSearch = search.create({
                        type: "customrecord_wipfli_college",
                        filters:
                            [
                                ["internalid", "is", studentid]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "custrecord_wipfli_student_ages", label: "age" }),
                                search.createColumn({ name: "custrecord_wipfli_student_email", label: "email" }),
                                search.createColumn({ name: "custrecord_wipfli_student_phno", label: "phone number" }),
                                search.createColumn({name:"custrecord_wipfli_student_dob",label:"date of birth"})
                            ]
                    });
    
                    var searchResult =studentSearch.run();
                  
    
                    var searchObject = searchResult.getRange(0, 1000);
                
    
                    for (var i = 0; i < searchObject.length; i++) {
                        var searchAge = searchObject[i].getValue({ name: "custrecord_wipfli_student_ages" });
                        biorecord.setValue({
                            fieldId: 'custrecord_wipfli_student_age',
                            value: searchAge
                        });
                    
                        var searchEmail = searchObject[i].getValue({ name: "custrecord_wipfli_student_email" });
                        log.debug("email",searchEmail);
                        biorecord.setValue({
                            fieldId: 'custrecord_wipfli_vtu_email',
                            value: searchEmail
                        });
    
                        var searchPhone = searchObject[i].getValue({ name: "custrecord_wipfli_student_phno" });
                        biorecord.setValue({
                            fieldId: 'custrecord_wipfli_vtu_phno',
                            value: searchPhone
                        });
    
                        var searchdob = searchObject[i].getValue({ name: "custrecord_wipfli_student_dob" });
                        var date = new Date(searchdob);
                        biorecord.setValue({
                            fieldId: 'custrecord_wipfli_vtu_dob',
                            value: date
                        });
                    }
                    

                    biorecord.setText({
                        fieldId: 'custrecord_wipfli_vtu_edu',
                        text: edu,
                        ignoreFieldChange: true
                    });

                    biorecord.setValue({
                        fieldId: 'custrecord_wipfli_vtu_msg',
                        value: msg
                    });


                    for (var k = 0; k < subject.length; k++) {
                        // eslint-disable-next-line no-redeclare
                        var name = subject[k].name;
                        var internalMarks = subject[k].internalMarks;
                        var externalMarks = subject[k].externalMarks;
            
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
                    return "biodata record is successfully created";
                }
            } catch (e) {
                log.error("error in post", e.message);
                return e.message;
            }
        }

        function isEmpty(value) {
            return value === undefined || value === null || value === "";
        }


        return { get, post, put, delete: doDelete };
    });