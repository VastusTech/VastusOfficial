import { API, graphqlOperation} from 'aws-amplify';
import _ from 'lodash';

class GraphQL {
    static getClient(id, variableList, successHandler, failureHandler) {
        const parameters = {id: id};
        this.execute(this.constructQuery("GetClient", "getClient", parameters, variableList),
            parameters, successHandler, failureHandler);
    }
    static getClientByUsername(username, variableList, successHandler, failureHandler) {
        const parameters = {username: username};
        this.execute(this.constructQuery("GetClientByUsername", "getClientByUsername", parameters, variableList),
            parameters, successHandler, failureHandler);
    }
    static getParty(id, variableList, successHandler, failureHandler) {
        const parameters = {id: id};
        this.execute(this.constructQuery("GetParty", "getParty", parameters, variableList),
            parameters, successHandler, failureHandler);
    }
    static getChallenge(id, variableList, successHandler, failureHandler) {
        const parameters = {id: id};
        this.execute(this.constructQuery("GetChallenge", "getChallenge", parameters, variableList),
            parameters, successHandler, failureHandler);
    }
    // TODO Make it work for nested objects
    // static queryChallenges(variableList, successHandler, failureHandler) {
    //     this.execute(this.constructQuery("QueryChallenges", "queryChallenges", {}, variableList),
    //         {}, successHandler, failureHandler);
    // }
    // TODO This only supports input String! types. Reason to change?
    static constructQuery(queryName, queryFunction, inputVariables, outputVariables) {
        let query = '';
        var ifFirst = true;
        query += 'query ' + queryName;
        if (!_.isEmpty(inputVariables)) {
            query += '(';
            for (let variable in inputVariables) {
                if (!ifFirst) {
                    query += ", ";
                }
                query += '$' + variable + ': String!';
                ifFirst = false;
            }
            query += ')';
        }
        query += ' {\n    ' + queryFunction;
        ifFirst = true;
        if (!_.isEmpty(inputVariables)) {
            query += '(';
            for (let variable in inputVariables) {
                if (!ifFirst) {
                    query += ', ';
                }
                query += variable + ": $" + variable;
            }
            query += ')';
        }
        query += ' {\n';
        for (let i in outputVariables) {
            query += '        ' + outputVariables[i] + '\n';
        }
        query += '    }\n}';
        return query;
    }
    static async execute(query, variables, successHandler, failureHandler) {
        alert("About to send to GraphQL: " + query);
        API.graphql(graphqlOperation(query, variables)).then((data) => {
            console.log("GraphQL operation succeeded!");
            successHandler(data);
        }).catch((error) => {
            console.log("GraphQL operation failed...");
            failureHandler(error);
        });
    }
}

export default GraphQL;