/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record','N/search'],
    /**
 * @param{record} record
 */
    (record,search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
                // var name=requestParams.name;
                // return name;
               
            try{
                var studentName=requestParams.name;
                var customrecord_wipfli_studentSearchObj = search.create({
                    type: "customrecord_wipfli_student",
                    filters:
                        [
                            ["name", "contains", studentName]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "custrecord_wipfli_student_ages", label: "age" }),
                            search.createColumn({ name: "custrecord_wipfli_student_email", label: "email" })
                        ]

                        
                });
                var searchResult = customrecord_wipfli_studentSearchObj.run();
                var searchObject = searchResult.getRange(0, 1000);
               
                var studentdetail=[];
                for (i = 0; i < searchObject.length; i++) {
                    var studentAge = searchObject[i].getValue({ name: "custrecord_wipfli_student_ages" })

                    var studentEmail = searchObject[i].getValue({ name: "custrecord_wipfli_student_email" })
                
                studentdetail.push({
                    name:studentName,
                    age:studentAge,
                    email:studentEmail
                });
            }
            return studentdetail;

            }

            catch(e){
                log.error({
                    title: "Error in get function",
                    details: e.message
                })
                return e.message;
            
            }
        }

        const post= (requestbody) =>{
            try{
                var studentdata=requestbody;
                for(i=0;i<studentdata.length;i++)
                {
                
                   var fname=studentdata[i].fname;
                   var lname=studentdata[i].lname;
                   var age=studentdata[i].age;
                   var email=studentdata[i].email;
                   var phone=studentdata[i].phone;

                   if(fname=="")
                   {
                    return "please enter the firstnname";
                   }

                   else if(lname=="")
                   {
                    return "please enter the lastname";
                   }

                   else if(age=="")
                   {
                    return "please enter the age";
                   }

                   var studentrecord=record.create({
                    type: 'customrecord_wipfli_student',
                    isDynamic: true
                   })

                   studentrecord.setValue({
                    fieldId:'name',
                    value: fname+""+lname
                   })

                   studentrecord.setValue({
                    fieldId:'custrecord_wipfli_student_fn',
                    value: fname
                   })

                   studentrecord.setValue({
                    fieldId:'custrecord_wipfli_student_ln',
                    value: lname,
                    ignoreFieldChange: false
                   })

                   studentrecord.setValue({
                    fieldId:'custrecord_wipfli_student_ages',
                    value: age
                   })

                   studentrecord.setValue({
                    fieldId:'custrecord_wipfli_student_email',
                    value: email
                   })

                   studentrecord.setValue({
                    fieldId:'custrecord_wipfli_student_phno',
                    value: phone
                   })


                   studentrecord.save({
            
                   })

                }
                
                return "record is successfully created";

            }
            catch(e){
                log.error("error in post",e.message);
                return e.message;
                
            }
         }

        return {get,post}

    });