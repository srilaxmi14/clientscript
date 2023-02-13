/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
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
        const get = (requestParams) => {
            log.debug("testing");
            var empname = requestParams.name;
            var customrecord_wipfli_passportSearchObj = search.create({
                type: "customrecord_wipfli_passport",
                filters:
                    [
                        // ["custrecord_wipfli_passsport_empname","anyof","1524"]

                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_wipfli_passsport_empname", label: "employee name" }),
                        search.createColumn({
                            name: "title",
                            join: "CUSTRECORD_WIPFLI_PASSSPORT_EMPNAME",
                            label: "Job Title"
                        }),
                        search.createColumn({
                            name: "location",
                            join: "CUSTRECORD_WIPFLI_PASSSPORT_EMPNAME",
                            label: "Location"
                        })
                    ]
            });
            var searchResult = customrecord_wipfli_passportSearchObj.run();

            var searchObject = searchResult.getRange(0, 1000);

            var empdetail = [];
            for (i = 0; i < searchObject.length; i++) {
                var name = searchObject[i].getText({ name: "custrecord_wipfli_passsport_empname" })

                var jobtitle = searchObject[i].getValue({
                    name: "title",
                    join: "CUSTRECORD_WIPFLI_PASSSPORT_EMPNAME",
                    label: "Job Title"
                })

                var location = searchObject[i].getText({
                    name: "location",
                    join: "CUSTRECORD_WIPFLI_PASSSPORT_EMPNAME",
                    label: "Location"
                })

                empdetail.push({
                    name: name,
                    jobtitle: jobtitle,
                    location: location
                });

            }
            return empdetail;

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {
            try{
                var id=requestParams.id;
                log.debug("testing");
                // return 'effefe';
    
                var studentrec=record.delete({
                    type: 'customrecord_wipfli_passport',
                    id:id,
                })
                log.debug("studentrec",studentrec);

            

                return "record is deleted successfully"

            }
            catch(e)
            {
                log.error({
                    title: "error in put function",
                    details: e.message
                })
                return e.message;
                
            }

            
        }
        return { get, put, post, delete: doDelete }

    });
