'use strict';
console.log('Loading Lambda function');
 
exports.handler = async (event) => {
    let keyword = "hello";
    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));
    
    if (event.queryStringParameters && event.queryStringParameters.keyword) {
        console.log("Received keyword: " + event.queryStringParameters.keyword);
        keyword = event.queryStringParameters.keyword;
    }
    

    if (event.body) {
        let body = JSON.parse(event.body)
        
    }
 
    let greeting = `Surabhi Suresh Gurav says ${keyword}.`;
    

    let responseBody = {
        message: greeting,
        input: event
    };
    
    let response = {
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};
